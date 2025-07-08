import { append } from '../../../../utils/misc.js'
import { getElement } from '../../context.js'

export function Attribute(node, ctx) {
    append(ctx.state.text, ` ${node.name}="`)
    ctx.visit(node.value)

    if (node.name === 'class' && getElement(ctx).metadata.scoped) {
        append(ctx.state.text, `drop-${ctx.state.context.hash}`, { spaceWord: true })
    }

    append(ctx.state.text, `"`)
}
