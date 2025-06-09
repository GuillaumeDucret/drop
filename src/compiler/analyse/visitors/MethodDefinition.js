export function MethodDefinition(node, ctx) {
    ctx.next()

    switch (node.key.name) {
        case 'constructor':
            break
        case 'connectedCallback':
            ctx.state.hasConnectedCallbackMethod = true
            break
        default:
            ctx.state.methods.push(node.key.name)
            break
    }
}
