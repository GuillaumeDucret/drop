import * as is from '../../checkers.js'

export function AssignmentExpression(node, ctx) {
    ctx.next()

    if (is.member(node.left, is.thisExp, is.id) && is.call(node.right, is.signal)) {
        ctx.state.signals.push(node.left.property.name)
    }
}
