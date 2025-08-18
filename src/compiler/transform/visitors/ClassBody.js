import * as b from '../../builders.js'

export function ClassBody(node, ctx) {
    node = ctx.next() ?? node

    const stmts = []
    if (!node.metadata?.hasConnectedCallbackMethod) {
        const stmt = ctx.visit(b.connectedCallback())
        stmts.push(stmt)
    }

    if (!node.metadata?.hasDisconnectedCallbackMethod) {
        const stmt = ctx.visit(b.disconnectedCallback())
        stmts.push(stmt)
    }

    if (stmts.length >= 0) {
        return { ...node, body: [...node.body, ...stmts] }
    }
}
