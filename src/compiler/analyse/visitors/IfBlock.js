export function IfBlock(node, ctx) {
    ctx.next()

    const hasElseif = !!node.alternate?.nodes.find((n) => n.type === 'IfBlock')

    node.metadata ??= {}
    node.metadata.hasElseif = hasElseif
}
