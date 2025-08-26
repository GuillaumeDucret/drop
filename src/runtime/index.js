import { Boundary, Effect } from '../signals/index.js'
import { Client } from './client.js'
import { EachBlock } from './eachBlock.js'
import { IfBlock } from './ifBlock.js'

export { EachBlock, IfBlock }

export function $$() {
    Client.prototype.effect ??= function (fn) {
        const effect = new Effect(fn, true).run()
        this.add(effect)
        return effect
    }

    Client.prototype.ifBlock ??= function (anchor, getCondition, concequent, alternate) {
        const block = new IfBlock(anchor, getCondition, concequent, alternate).init()
        this.add(block)
        return block
    }

    Client.prototype.eachBlock ??= function (anchor, getIterable, getKey, body) {
        const block = new EachBlock(anchor, getIterable, getKey, body).init()
        this.add(block)
        return block
    }

    const client = new Client()

    client.boundary = function (fn) {
        const boundary = new Boundary(fn).init()
        this.add(boundary)
        return boundary
    }

    client.block = function (fn) {
        const block = new Client()
        fn(block)
        this.add(block)
        return block
    }

    client.lifecycle = function (event) {
        const set = (state, result) => {
            this.state = state
            return result
        }

        switch (this.state) {
            case 'connected':
                if (event === 'disconnected') return set('disconnected', false)
                if (event === 'microtask') return set('connected', false)
                break
            case 'disconnected':
                if (event === 'connected') return set('connected', false)
                if (event === 'microtask') return set('disconnected', true)
                break
            default:
                if (event === 'connected') return set('connected', true)
                break
        }
    }

    return client
}

$$.init = function (object, name, value) {
    const set = arguments.length === 2

    if (object.hasOwnProperty(name)) {
        value = object[name]
        delete object[name]

        if (set) {
            object[name] = value
        }
    }
    return value
}
