import * as is from '../../checkers.js'

export function ClassBody(node, ctx) {
    ctx.next()

    const hasConnectedCallbackMethod = node.body.some(is.connectedCallback)
    const hasDisconnectedCallbackMethod = node.body.some(is.disconnectedCallback)

    node.metadata ??= {}
    node.metadata.hasConnectedCallbackMethod = hasConnectedCallbackMethod
    node.metadata.hasDisconnectedCallbackMethod = hasDisconnectedCallbackMethod
}
