import * as b from '../../builders.js'
import { getProgram } from '../context.js'

export function MethodDefinition(node, ctx) {
    node = ctx.next() ?? node

    if (node.key.name === 'constructor') {
        const program = getProgram(ctx)
        const setters = program.metadata?.customElement.setters

        const stmt1 = b.assignment(b.$(), b.$$())
        const stmts2 = []
        for (const setter of setters) {
            stmts2.push(b.$$init(setter))
        }

        return {
            ...node,
            value: {
                ...node.value,
                body: {
                    ...node.value.body,
                    body: [...node.value.body.body, stmt1, ...stmts2]
                }
            }
        }
    }

    if (node.key.name === 'connectedCallback') {
        const shadowRootMode = ctx.state.template.metadata?.shadowRootMode

        const stmts1 = []
        if (shadowRootMode) {
            stmts1.push(b.assignment(b.shadow(), b.attachShadow(shadowRootMode)))
        } else {
            stmts1.push(b.replaceChildren())
        }
        const stmt2 = ctx.state.template.block

        return {
            ...node,
            value: {
                ...node.value,
                body: {
                    ...node.value.body,
                    body: [...stmts1, stmt2, ...node.value.body.body]
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
