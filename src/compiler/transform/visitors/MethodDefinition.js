import * as b from '../../builders.js'

export function MethodDefinition(node, ctx) {
    ctx.next()

    if (node.key.name === 'constructor') {
        const stmt = b.assignment(b.$(), b.$$())

        return {
            ...node,
            value: {
                ...node.value,
                body: {
                    ...node.value.body,
                    body: [...node.value.body.body, stmt]
                }
            }
        }
    }

    if (node.key.name === 'connectedCallback') {
        const stmt1 = b.assignment(b.shadow(), b.attachShadow())
        const stmt2 = ctx.state.template.block

        return {
            ...node,
            value: {
                ...node.value,
                body: {
                    ...node.value.body,
                    body: [stmt1, stmt2, ...node.value.body.body]
                }
            }
        }
    }

    if (node.key.name === 'disconnectedCallback') {
        const stmt1 = b.dispose(b.$())

        return {
            ...node,
            value: {
                ...node.value,
                body: {
                    ...node.value.body,
                    body: [stmt1, ...node.value.body.body]
                }
            }
        }
    }
}
