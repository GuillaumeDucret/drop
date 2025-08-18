import * as is from '../../checkers.js'

export function Template(node, ctx) {
    ctx.next()

    const isStatic = node.attributes.some(is.staticAttribute)

    ctx.state.isStatic = isStatic
}
