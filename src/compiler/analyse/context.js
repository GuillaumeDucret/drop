export function getStyleSheet(ctx) {
    const root = ctx.path[0]
    return root.template.fragment.nodes.find((n) => n.type === 'Style')?.content
}

export function getTemplate(ctx) {
    const root = ctx.path[0]
    return root.template
}

export function getScript(ctx) {
    return ctx.path.toReversed().find((n) => n.type === 'Script')
}