import * as b from '../../../builders.js'
import { append } from '../../../../utils/misc.js'

export function Element(node, ctx) {
    let attributes = node.attributes
    if (node.metadata.scoped && !node.metadata.hasClass) {
        attributes = [...attributes, b.attribute('class', '')]
    }

    append(ctx.state.text, `<${node.name}`)
    for (const attribute of attributes) {
        ctx.visit(attribute)
    }
    append(ctx.state.text, '>')
    ctx.visit(node.fragment)
    append(ctx.state.text, `</${node.name}>`)
}
