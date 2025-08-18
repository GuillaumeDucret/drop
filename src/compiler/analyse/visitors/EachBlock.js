import { matchExpression } from '../../exp-matcher.js'
import { getProgram } from '../context.js'

export function EachBlock(node, ctx) {
    ctx.next()

    const program = getProgram(ctx)
    matchExpression(node.expression, program)
}
