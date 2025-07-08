import * as b from '../../builders.js'

export function Element(node, ctx) {
    let attributes = node.attributes
    if (node.metadata.scoped && !node.metadata.hasClass) {
        attributes = [...attributes, b.attribute('class', '')]
    }

    ctx.state.template.push(`<${node.name}`)
    for (const attribute of attributes) {
        ctx.visit(attribute)
    }
    ctx.state.template.push('>')
    ctx.visit(node.fragment)
    ctx.state.template.push(`</${node.name}>`)
}
