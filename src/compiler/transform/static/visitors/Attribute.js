import { append } from '../../../../utils/misc.js'

export function Attribute(node, ctx) {
    append(ctx.state.text, ` ${node.name}="`)
    ctx.visit(node.value)
    append(ctx.state.text, `"`)
}
