export let track
let add

export class Effect extends Set {
    constructor(fn, orphaned = false) {
        super()
        this.fn = fn
        this.microtask = false

        if (!orphaned) {
            add?.(this)
        }
    }

    run() {
        if (this.fn) {
            // dispose both trackers and nested effects / boundaries
            for (const entry of cleared(this)) {
                entry.dispose()
            }

            const outerTrack = track
            const outerAdd = add
            try {
                track = null
                add = null
                this.teardown?.()

                track = this.track.bind(this)
                add = this.add.bind(this)
                this.teardown = this.fn()
            } finally {
                track = outerTrack
                add = outerAdd
            }
        }

        return this
    }

    schedule() {
        if (!this.microtask) {
            this.microtask = true
            queueMicrotask(() => {
                this.microtask = false
                this.run()
            })
        }
    }

    track(tracker) {
        tracker.effect = this
        this.add(tracker)
    }

    dispose() {
        this.fn = null

        // dispose both trackers and nested effects / boundaries
        for (const entry of cleared(this)) {
            entry.dispose()
        }

        const outerTrack = track
        const outerAdd = add
        try {
            track = null
            add = null
            this.teardown?.()
        } finally {
            track = outerTrack
            add = outerAdd
        }
    }
}

export function effect(fn) {
    return new Effect(fn).run()
}

export class Boundary extends Set {
    constructor(fn, orphaned = false) {
        super()
        this.fn = fn

        if (!orphaned) {
            add?.(this)
        }
    }

    init() {
        if (this.fn) {
            const outerTrack = track
            const outerAdd = add
            try {
                track = null
                add = this.add.bind(this)
                this.fn()
                this.fn = null
            } finally {
                track = outerTrack
                add = outerAdd
            }
        }
        return this
    }

    dispose() {
        // dispose both trackers and nested effects / boundaries
        for (const entry of cleared(this)) {
            entry.dispose()
        }
    }
}

export function boundary(fn) {
    return new Boundary(fn).init()
}

export function untracked(fn) {
    const outerTrack = track
    const outerAdd = add
    try {
        track = null
        add = null
        fn()
    } finally {
        track = outerTrack
        add = outerAdd
    }
}

const cleared = (self) => {
    const entries = [...self]
    self.clear()
    return entries
}

export class PropertyTracker {
    constructor(signal, property) {
        this.signal = signal
        this.property = property
        this.effect = null

        this.signal.addEventListener('set', this.callback)
        this.signal.addEventListener('delete', this.callback)
    }

    callback = (event) => {
        if (event.signal !== event.currentSignal) return
        if (event.property !== this.property) return
        this.effect.schedule()
    }

    dispose() {
        this.signal.removeEventListener('set', this.callback)
        this.signal.removeEventListener('delete', this.callback)
    }
}

export class AttributeTracker {
    constructor(signal, name) {
        this.signal = signal
        this.name = name
        this.effect = null

        this.signal.addEventListener('attributeChanged', this.callback)
    }

    callback = (event) => {
        if (event.signal !== event.currentSignal) return
        if (event.name !== this.name) return
        this.effect.schedule()
    }

    dispose() {
        this.signal.removeEventListener('attributeChanged', this.callback)
    }
}

export class Tracker {
    constructor(signal) {
        this.signal = signal
        this.effect = null

        this.signal.addEventListener('change', this.callback)
    }

    callback = (event) => {
        if (event.signal !== event.currentSignal) return
        this.effect.schedule()
    }

    dispose() {
        this.signal.removeEventListener('change', this.callback)
    }
}
