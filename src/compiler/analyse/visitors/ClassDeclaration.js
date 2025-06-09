export function ClassDeclaration(node, ctx) {
    ctx.next()

    ctx.state.customElementClassName = node.id.name
}
