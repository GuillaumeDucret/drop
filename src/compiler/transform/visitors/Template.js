export function Template(_, ctx) {
    const state = {
        ...ctx.state,
        css: '',
        template: [],
        effects: [],
        handlers: [],
        init: {
            elem: [],
            text: []
        }
    }

    ctx.next(state)
    return { type: 'TemplateMod', ...state }
}
