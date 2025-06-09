import * as b from '../../builders.js'

export function ClassBody(node, ctx) {
    node = ctx.next() ?? node

    if (!ctx.state.analysis.hasConnectedCallbackMethod) {
        const stmt = ctx.visit(b.connectedCallback())
        return { ...node, body: [...node.body, stmt] }
    }
}
