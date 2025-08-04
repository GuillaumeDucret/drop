import * as b from '../../builders.js'

export function ClassBody(node, ctx) {
    node = ctx.next() ?? node

    const stmts = []

    if (!ctx.state.analysis.hasConnectedCallbackMethod) {
        const stmt = ctx.visit(b.connectedCallback())
        stmts.push(stmt)
    }

    if (!ctx.state.analysis.hasDisconnectedCallbackMethod) {
        const stmt = ctx.visit(b.disconnectedCallback())
        stmts.push(stmt)
    }

    if (stmts.length >= 0) {
        return { ...node, body: [...node.body, ...stmts] }
    }
}
