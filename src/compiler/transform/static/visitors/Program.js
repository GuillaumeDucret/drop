import * as b from '../../../builders.js'

export function Program(node, ctx) {
    node = ctx.next() ?? node

    const stmt = b.exportDec(b.render([b.returnStmt(ctx.state.template.template)]))
    return { ...node, body: [...node.body, stmt] }
}
