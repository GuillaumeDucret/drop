import * as b from '../../builders.js'

export function MethodDefinition(node, ctx) {
    if (node.key.name === 'connectedCallback') {
        const stmts1 = [
            b.declaration('root', b.attachShadow()),
            b.assignment(b.innerHTML('root'), b.binary('+', b.id('TEMPLATE'), b.id('STYLE')))
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
