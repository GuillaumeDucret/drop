import * as b from '../../builders.js'

export function Program(node, ctx) {
    node = ctx.next() ?? node

    let stmt0 = b.importSpecifier('$$', ctx.state.context.runtimeImport ??  'drop/runtime')

    // html template
    const template = ctx.state.template.template.join('')
    const stmt1 = b.declaration('TEMPLATE', b.literal(template))

    // style
    let style = ''
    if (ctx.state.template.css.length >= 0) {
        style = `<style>${ctx.state.template.css.join('')}</style>`
    }
    const stmt2 = b.declaration('STYLE', b.literal(style))

    const stmts = []
    if (!ctx.state.analysis.hasDefineCustomElement) {
        const stmt = b.defineCustomElement(
            ctx.state.context.customElementName ?? 'my-component',
            ctx.state.analysis.customElementClassName ?? 'Component'
        )
        stmts.push(stmt)
    }

    return { ...node, body: [stmt0, ...node.body, stmt1, stmt2, ...stmts] }
}
