import * as b from '../../builders.js'

export function Program(node, ctx) {
    node = ctx.next() ?? node

    // html template
    const template = ctx.state.template.template.join('')
    const stmt1 = b.declaration('TEMPLATE', b.literal(template))

    // style
    const style = ctx.state.template.css ? `<style>${ctx.state.template.css}</style>` : ''
    const stmt2 = b.declaration('STYLE', b.literal(style))

    const stmts = []
    if (!ctx.state.analysis.hasDefineCustomElement) {
        const stmt = b.defineCustomElement(
            ctx.state.context.customElementName ?? 'my-component',
            ctx.state.analysis.customElementClassName ?? 'Component'
        )
        stmts.push(stmt)
    }

    return { ...node, body: [...node.body, stmt1, stmt2, ...stmts] }
}
