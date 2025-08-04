import { Boundary, Effect } from '../signals/index.js'

export class Client extends Set {
    effect(fn) {
        const effect = new Effect(fn, true).run()
        this.add(effect)
        return effect
    }

    boundary(fn) {
        const boundary = new Boundary(fn).init()
        this.add(boundary)
        return boundary
    }

    block(fn) {
        const block = new Client()
        fn(block)
        this.add(block)
        return block
    }

    //ifBlock() {}
    //eachBlock() {}

    dispose() {
        for (const entry of cleared(this)) {
            entry.dispose?.()
        }
    }
}

const cleared = (self) => {
    const entries = [...self]
    self.clear()
    return entries
}
