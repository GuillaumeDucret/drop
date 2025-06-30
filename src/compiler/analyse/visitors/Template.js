export function Template(node, ctx) {
    ctx.next()

    if (node.attributes.find((a) => a.name === 'static' && a.value)) {
        ctx.state.isStatic = true
    }
}
