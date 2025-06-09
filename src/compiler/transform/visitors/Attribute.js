import { nextElementId, pathStmt } from '../context.js'
import * as b from '../../builders.js'

export function Attribute(node, ctx) {
    const text = []
    const expressions = []

    ctx.visit(node.value, { text, expressions, analysis: ctx.state.analysis })

    if (expressions.length > 0) {
        const rootId = nextElementId(ctx)
        const rootStmt = b.declaration(rootId, pathStmt(ctx))
        ctx.state.init.elem.push(rootStmt)

        if (node.name.startsWith('on')) {
            const stmt = b.assignment(b.member(rootId, node.name), b.arrowFunc(expressions[0]))
            ctx.state.handlers.push(stmt)
        } else {
            const stmt = b.effect([b.setAttribute(rootId, node.name, expressions[0])])
            ctx.state.effects.push(stmt)
        }

        return
    }

    ctx.state.template.push(` ${node.name}="${text[0] ?? 'true'}"`)
}
