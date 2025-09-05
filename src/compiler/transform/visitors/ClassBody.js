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

    if (!node.metadata?.hasAttributeChangedCallback && node.metadata?.hasObservedAttributes) {
        const stmt = ctx.visit(b.attributeChangedCallback())
        stmts.push(stmt)
    }

    if (!node.metadata?.hasGetAttribute && node.metadata?.hasObservedAttributes) {
        const stmt = ctx.visit(b.getAttribute())
        stmts.push(stmt)
    }

    if (stmts.length >= 0) {
        return { ...node, body: [...node.body, ...stmts] }
    }
}
