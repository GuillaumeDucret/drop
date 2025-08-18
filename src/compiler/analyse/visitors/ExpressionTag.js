import { matchExpression } from "../../exp-matcher.js";
import { getProgram } from "../context.js";

export function ExpressionTag(node, ctx) {
    const program = getProgram(ctx)

    matchExpression(node.expression, program)
}
