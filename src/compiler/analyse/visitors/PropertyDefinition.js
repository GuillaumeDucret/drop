import * as is from '../../checkers.js'

export function PropertyDefinition(node, ctx) {
    const isPrivate = is.privateId(node.key)
    const customElement = isPrivate ? ctx.state.customElement.private : ctx.state.customElement

    node.metadata ??= {}
    node.metadata.isPrivate = isPrivate

    if (is.signal(node.value)) {
        node.metadata.isSignal = true
        customElement.signals.push(node.key.name)
    } else {
        node.metadata.isProperty = true
        customElement.properties.push(node.key.name)
    }
}
