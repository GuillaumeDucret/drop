import { track, PropertyTracker, Tracker } from './effect.js'

export class Signal extends EventTarget {
    constructor(parent, target) {
        super()
        this.#parent = parent ?? null
        this.#target = target ?? this
    }

    #parent
    #target

    dispatchEvent(event) {
        event.signal ??= this.#target
        event.currentSignal = this.#target

        super.dispatchEvent(event)
        this.#parent?.dispatchEvent(event)
        return true
    }

    attach(parent) {
        if (this.#parent) {
            throw new Error('an object cannot be inserted multipletimes in the signal tree')
        }
        this.#parent = parent
    }

    detatch() {
        this.#parent = null
    }
}

export class SignalEvent extends Event {
    constructor(type, dict) {
        super(type)
        Object.assign(this, dict)
    }
}

export function signal(target) {
    return proxy(target)
}

function proxy(object, parent) {
    if (typeof object !== 'object' || object === null) return object
    if (object.$proxy) return object.$proxy

    const handler = new (ProxyHandler(object))()
    const proxy = new Proxy(object, handler)
    handler.signal = new Signal(parent, proxy)
    handler.proxy = proxy

    Object.defineProperty(object, '$proxy', {
        value: proxy,
        enumerable: false
    })

    return proxy
}

function unproxy(object) {
    if (typeof object !== 'object' || object === null) return object
    return object.$target ?? object
}

function attach(object, parent) {
    if (typeof object !== 'object' || object === null) return
    object.$proxy?.attach(parent)
}

function detatch(object, parent) {
    if (typeof object !== 'object' || object === null) return
    object.$proxy?.detatch(parent)
}

function ProxyHandler(object) {
    if (object.constructor === Object) return ObjectHandler
    if (object.constructor === Array) return ArrayHandler
    throw new Error(`signal do not support instance of ${object.constructor}`)
}

class ObjectHandler {
    signal
    proxy

    get(target, prop, receiver) {
        if (prop === 'addEventListener') return this.signal.addEventListener.bind(this.signal)
        if (prop === 'removeEventListener') return this.signal.removeEventListener.bind(this.signal)
        if (prop === 'attach') return this.signal.attach.bind(this.signal)
        if (prop === 'detatch') return this.signal.detatch.bind(this.signal)
        if (prop === 'snapshot') return () => structuredClone(target)
        if (prop === '$proxy') return this.proxy
        if (prop === '$target') return target

        track?.(new PropertyTracker(this.signal, prop))
        return proxy(Reflect.get(target, prop, receiver), this.signal)
    }
    set(target, property, nextValue, receiver) {
        nextValue = unproxy(proxy(nextValue))
        const value = target[property]
        const hasChange = value !== nextValue
        const result = Reflect.set(target, property, nextValue, receiver)

        if (result && value !== nextValue) {
            detatch(value, this.signal)
            attach(nextValue, this.signal)
        }
        if (hasChange) {
            this.signal.dispatchEvent(new SignalEvent('set', { property }))
            this.signal.dispatchEvent(new SignalEvent('change'))
        }
        return result
    }
    deleteProperty(target, property) {
        const value = Object.hasOwn(target, property) ? target[property] : undefined
        const hasChange = Object.hasOwn(target, property)
        const result = Reflect.deleteProperty(target, property)

        if (result) {
            detatch(value)
        }
        if (hasChange) {
            this.signal.dispatchEvent(new SignalEvent('delete', { property }))
            this.signal.dispatchEvent(new SignalEvent('change'))
        }
        return result
    }
}

const SignalMethods = ['addEventListener', 'removeEventListener', 'attach', 'detatch']

class ArrayHandler {
    signal
    proxy
    instrumentation

    get(target, prop, receiver) {
        if (prop === '$proxy') return this.proxy
        if (prop === '$target') return target
        if (prop === 'snapshot') return () => structuredClone(target)

        if (SignalMethods.includes(prop)) {
            return this.signal[prop].bind(this.signal)
        }

        this.instrumentation ??= new Instrumentation(this.signal, target)
        if (Object.hasOwn(this.instrumentation, prop)) {
            return this.instrumentation[prop]
        }

        track?.(new PropertyTracker(this.signal, prop))
        return proxy(Reflect.get(target, prop, receiver), this.signal)
    }
    set(target, property, nextValue, receiver) {
        nextValue = unproxy(proxy(nextValue))
        const value = target[property]
        const hasChange = value !== nextValue
        const result = Reflect.set(target, property, nextValue, receiver)

        if (result && value !== nextValue) {
            detatch(value, this.signal)
            attach(nextValue, this.signal)
        }
        if (hasChange) {
            this.signal.dispatchEvent(new SignalEvent('set', { property }))
            this.signal.dispatchEvent(new SignalEvent('change'))
        }
        return result
    }
    deleteProperty(target, property) {
        const value = Object.hasOwn(target, property) ? target[property] : undefined
        const hasChange = Object.hasOwn(target, property)
        const result = Reflect.deleteProperty(target, property)

        if (result) {
            detatch(value)
        }
        if (hasChange) {
            this.signal.dispatchEvent(new SignalEvent('delete', { property }))
            this.signal.dispatchEvent(new SignalEvent('change'))
        }
        return result
    }
    push(item) {}
}

class Instrumentation {
    constructor(signal, target) {
        this.signal = signal
        this.target = target
    }

    signal
    target;

    [Symbol.iterator] = () => this.iterator(this.target[Symbol.iterator]())
    values = () => this.iterator(this.target.values())
    entries = () => this.iterator(this.target.entries(), true)

    at = (i) => {
        track?.(new PropertyTracker(this.signal, i))
        return this.target.at(i)
    }

    forEach = (fn) => {
        track?.(new Tracker(this.signal))
        this.target.forEach((v, i, a) => fn(proxy(v, this.signal), i, a))
    }

    map = (fn) => {
        track?.(new Tracker(this.signal))
        return this.target.map((v, i, a) => fn(proxy(v, this.signal), i, a))
    }

    reduce = (fn, i) => {
        track?.(new Tracker(this.signal))
        return this.target.reduce((p, v, i, a) => fn(p, proxy(v, this.signal), i, a), i)
    }

    reduceRight = (fn, i) => {
        track?.(new Tracker(this.signal))
        return this.target.reduceRight((p, v, i, a) => fn(p, proxy(v, this.signal), i, a), i)
    }

    push = (...items) => {
        const result = this.target.push(...items)
        if (result > 0) {
            this.signal.dispatchEvent(new SignalEvent('push', { items }))
            this.signal.dispatchEvent(new SignalEvent('change'))
        }
        return result
    }

    pop = () => {
        const result = this.target.pop()
        if (result !== undefined) {
            this.signal.dispatchEvent(new SignalEvent('pop'))
            this.signal.dispatchEvent(new SignalEvent('change'))
        }
        return result
    }

    shift = () => {
        const a = []
        a.reverse
        const result = this.target.shift()
        if (result !== undefined) {
            this.signal.dispatchEvent(new SignalEvent('shift'))
            this.signal.dispatchEvent(new SignalEvent('change'))
        }
        return result
    }

    unshift = (...items) => {
        const result = this.target.unshift(...items)
        if (items.length > 0) {
            this.signal.dispatchEvent(new SignalEvent('unshift', { items }))
            this.signal.dispatchEvent(new SignalEvent('change'))
        }
        return result
    }

    splice = (start, deleteCount) => {
        const result = this.target.splice(start, deleteCount)
        this.signal.dispatchEvent(new SignalEvent('splice', { start, deleteCount }))
        this.signal.dispatchEvent(new SignalEvent('change'))
        return result
    }

    reverse = () => {
        const result = this.target.reverse()
        if (this.target.size > 1) {
            this.signal.dispatchEvent(new SignalEvent('reverse'))
            this.signal.dispatchEvent(new SignalEvent('change'))
        }
        return result
    };

    *iterator(iter, isEntries = false) {
        track?.(new Tracker(this.signal))
        for (let item of iter) {
            if (isEntries) {
                item[1] = proxy(item[1], this.signal)
            } else {
                item = proxy(item, this.signal)
            }
            yield item
        }
    }
}
