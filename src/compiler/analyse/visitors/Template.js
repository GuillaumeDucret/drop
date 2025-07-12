export function Template(node, ctx) {
    node.metadata = {elementIds: []}
    ctx.next()

    const isStatic = node.attributes.find((a) => a.name === 'static' && a.value) ?? false

    ctx.state.isStatic = isStatic
}
