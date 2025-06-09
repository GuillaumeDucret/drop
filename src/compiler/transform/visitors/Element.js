export function Element(node, ctx) {
    ctx.state.template.push(`<${node.name}`)
    for (const attribute of node.attributes) {
        ctx.visit(attribute)
    }
    ctx.state.template.push('>')
    ctx.visit(node.fragment)
    ctx.state.template.push(`</${node.name}>`)
}
