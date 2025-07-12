export function Attribute(node, ctx) {
    ctx.next()

    if (node.name === 'class' && node.value[0]?.type === 'ExpressionTag') {
        node.metadata ??= {}
        node.metadata.isScoped = true
    }

    if (node.name === 'id' && node.value[0]?.type === 'ExpressionTag') {
        node.metadata ??= {}
        node.metadata.isScoped = true
    }
}
