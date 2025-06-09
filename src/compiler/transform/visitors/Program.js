import * as b from '../../builders.js'

export function Program(node, ctx) {
    node = ctx.next() ?? node

    const stmts = []
    if (ctx.state.template.template.length > 0) {
        const stmt = b.declaration('TEMPLATE', b.literal(ctx.state.template.template.join('')))
        stmts.push(stmt)
    }

    if (ctx.state.template.css) {
        const style = `<style>${ctx.state.template.css}</style>`
        const stmt = b.declaration('STYLE', b.literal(style))
        stmts.push(stmt)
    }

    if (!ctx.state.analysis.hasDefineCustomElement) {
        const stmt = b.defineCustomElement(
            ctx.state.options.customElementName ?? 'my-component',
            ctx.state.analysis.customElementClassName ?? 'Component'
        )
        stmts.push(stmt)
    }

    if (stmts.length > 0) {
        return { ...node, body: [...node.body, ...stmts] }
    }
}
