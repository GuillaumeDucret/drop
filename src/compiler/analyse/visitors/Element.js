export function Element(node, ctx) {
    ctx.next()

    const hasClass = !!node.attributes.find((a) => a.name === 'class')

    node.metadata ??= {}
    node.metadata.hasClass = hasClass
}
