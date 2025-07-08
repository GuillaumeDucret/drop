import { getElement, nextElementId, pathStmt } from '../context.js'
import * as b from '../../builders.js'
import { clx } from '../../css.js'

export function Attribute(node, ctx) {
    const text = []
    const expressions = []

    ctx.visit(node.value, { ...ctx.state, text, expressions })

    if (expressions.length > 0) {
        // expression attribute
        const rootId = nextElementId(ctx)
        const rootStmt = b.declaration(rootId, pathStmt(ctx))
        ctx.state.init.elem.push(rootStmt)

        if (node.name.startsWith('on')) {
            const stmt = b.assignment(b.member(rootId, node.name), b.arrowFunc(expressions[0]))
            ctx.state.handlers.push(stmt)
            return
        }

        if (node.name === 'class') {
            const val = b.binary('+', expressions[0], b.literal(` drop-${ctx.state.context.hash}`))
            const stmt = b.effect([b.setAttribute(rootId, node.name, val)])
            ctx.state.effects.push(stmt)
            return
        }

        const stmt = b.effect([b.setAttribute(rootId, node.name, expressions[0])])
        ctx.state.effects.push(stmt)
        return
    }

    // text attribute

    if (node.name === 'class' && getElement(ctx).metadata.scoped) {
        ctx.state.template.push(` ${node.name}="${clx(text[0], `drop-${ctx.state.context.hash}`)}"`)
        return
    }

    ctx.state.template.push(` ${node.name}="${text[0] ?? 'true'}"`)
}
