import * as b from '../../../builders.js'

export function Template(node, ctx) {
    const text = ['']
    const expressions = []

    ctx.visit(node.fragment, { ...ctx.state, text, expressions })

    const template = b.template(text, expressions)
    return { type: 'TemplateMod', template }
}
