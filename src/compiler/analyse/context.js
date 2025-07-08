export function getStyleSheet(ctx) {
    const root = ctx.path[0]
    return root.template.fragment.nodes.find((n) => n.type === 'Style')?.content
}
