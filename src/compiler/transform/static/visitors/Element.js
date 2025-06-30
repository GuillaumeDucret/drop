import { append } from '../../../../utils/misc.js'

export function Element(node, ctx) {
    append(ctx.state.text, `<${node.name}`)
    for (const attribute of node.attributes) {
        ctx.visit(attribute)
    }
    append(ctx.state.text, '>')
    ctx.visit(node.fragment)
    append(ctx.state.text, `</${node.name}>`)
}
