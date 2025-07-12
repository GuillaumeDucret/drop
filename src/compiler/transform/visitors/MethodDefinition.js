import * as b from '../../builders.js'

export function MethodDefinition(node, ctx) {
    ctx.next()

    if (node.key.name === 'connectedCallback') {
        const stmts1 = [
            b.assignment(b.shadow(), b.attachShadow()),
            b.assignment(b.innerHTML(b.shadow()), b.binary('+', b.id('TEMPLATE'), b.id('STYLE')))
        ]

        const stmts2 = [
            ...ctx.state.template.init.elem,
            ...ctx.state.template.init.text,
            ...ctx.state.template.effects,
            ...ctx.state.template.handlers
        ]

        return {
            ...node,
            value: {
                ...node.value,
                body: {
                    ...node.value.body,
                    body: [...node.value.body.body, ...stmts1, ...stmts2]
                }
            }
        }
    }
}
