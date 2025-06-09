export function Template(_, ctx) {
    const state = {
        css: '',
        template: [],
        effects: [],
        handlers: [],
        init: {
            elem: [],
            text: []
        },
        analysis: ctx.state.analysis
    }

    ctx.next(state)
    return { type: 'TemplateMod', ...state }
}
