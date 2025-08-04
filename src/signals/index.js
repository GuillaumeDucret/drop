/*! (c) Andrea Giammarchi */

let current = null
let batches = null

/**
 * Invoke a callback that updates many signals and runs effects only after.
 * @type {(fn:() => void) => void}
 */
export const batch = (fn) => {
    const prev = batches
    batches = new Set()

    try {
        fn()

        const effects = batches
        batches = null
        for (const entry of effects) {
            entry.run()
        }
    } finally {
        batches = prev
    }
}

const cleared = (self) => {
    const entries = [...self]
    self.clear()
    return entries
}

export class Boundary extends Set {
    constructor(fn) {
        super()
        this.fn = fn
    }

    init() {
        if (this.fn) {
            const prev = current
            current = this
            try {
                this.fn()
                this.fn = null
            } finally {
                current = prev
            }
        }
        return this
    }

    dispose() {
        for (const entry of cleared(this)) {
            entry.delete(this)
            entry.dispose?.()
        }
    }
}

export function boundary(fn) {
    return new Boundary(fn).init()
}

export class Effect extends Set {
    constructor(fn, orphaned = false) {
        super()
        this.fn = fn

        if (current && !orphaned) {
            current.add(this)
        }
    }

    run() {
        if (this.fn) {
            const prev = current
            current = this
            try {
                this.teardown?.()
                this.teardown = this.fn()
            } finally {
                current = prev
            }
        }
        return this
    }

    dispose() {
        this.fn = null
        this.teardown?.()
        for (const entry of cleared(this)) {
            entry.delete(this)
            entry.dispose?.()
        }
    }
}

/**
 * Invokes a function when any of its internal signals or computed values change.
 * @template T
 * @type {<T>(fn: (v?: T) => T | undefined, value?: T) => () => void}
 */
export function effect(fn) {
    return new Effect(fn).run()
}

/**
 * Executes a given function without tracking its dependencies.
 * This is useful for actions that should not subscribe to updates in the reactive system.
 * @param {Function} fn - The function to execute without dependency tracking.
 */
export function untracked(fn) {
    const prev = current
    current = null
    try {
        return fn()
    } finally {
        current = prev
    }
}

/**
 * A signal with a value property also exposed via toJSON, toString and valueOf.
 * @template T
 */
export class Signal extends Set {
    #value

    /** @param {T} value the value carried through the signal */
    constructor(value) {
        super()
        this.#value = value
    }

    /** @returns {T} */
    get value() {
        if (current?.run) {
            current.add(this.add(current))
        }
        return this.#value
    }

    /** @param {T} value the new value carried through the signal */
    set value(value) {
        if (this.#value !== value) {
            this.#value = value

            for (const effect of cleared(this)) {
                if (batches) {
                    batches.add(effect)
                } else {
                    effect.run()
                }
            }
        }
    }

    toJSON() {
        return this.value
    }
    valueOf() {
        return this.value
    }
    toString() {
        return String(this.value)
    }
}

/**
 * Returns a writable Signal that side-effects whenever its value gets updated.
 * @template T
 * @type {<T>(value: T) => Signal<T>}
 */
export function signal(value) {
    return new Signal(value)
}

/**
 * A read-only Signal extend that is invoked only when any of the internally
 * used signals, as in within the callback, is unknown or updated.
 * @template T
 * @extends {Signal<T>}
 */
export class Computed extends Signal {
    constructor(fn) {
        super()
        this.fn = fn
    }

    /** @readonly @returns {T} */
    get value() {
        if (this.effect || current?.run) {
            if (!this.effect) {
                this.effect = new Effect(() => {
                    super.value = this.fn()
                }, true)
                this.effect.run()
            }
            return super.value
        }
        return this.fn()
    }

    /** @throws {Error} */
    set value(_) {
        throw new Error('computed is read-only')
    }

    dispose() {
        if (this.size === 0) {
            this.effect.dispose()
            this.effect = null
            super.value = null
        }
    }
}

/**
 * Returns a Computed signal that is invoked only when any of the internally
 * used signals, as in within the callback, is unknown or updated.
 * @template T
 * @type {<T>(fn: (v?: T) => T, value?: T) => Computed<T>}
 */
export function computed(fn) {
    return new Computed(fn)
}
