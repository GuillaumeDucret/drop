import { parseExpressionAt } from 'acorn'
import { Parser } from './parser.js'
import { TokenTypes } from './tokentype.js'

/**
 *
 * @param {Parser} p
 * @returns
 */
export function parseExpressionTag(p) {
    p.expectToken([TokenTypes.braceL])

    const start = p.pos
    skipCode(p)
    const expression = parseExpressionAt(p.input.slice(start, p.pos), 0, { ecmaVersion: 2020 })
    p.expectToken([TokenTypes.braceR])

    return { type: 'ExpressionTag', expression }
}

/**
 *
 * @param {Parser} p
 * @returns
 */
export function parseAttributeExpressionTag(p) {
    p.expectToken([TokenTypes.quoteBraceL, TokenTypes.doubleQuoteBraceL])

    const start = p.pos
    skipAttributeCode(p)
    const expression = parseExpressionAt(p.input.slice(start, p.pos), 0, { ecmaVersion: 2020 })
    p.expectToken([TokenTypes.braceRQuote, TokenTypes.braceRDoubleQuote])

    return { type: 'ExpressionTag', expression }
}

/**
 *
 * @param {Parser} p
 */
function skipCode(p) {
    while (p.pos < p.input.length) {
        if (p.isCharToken(TokenTypes.braceR)) break
        p.pos++
    }
}

/**
 *
 * @param {Parser} p
 */
function skipAttributeCode(p) {
    while (p.pos < p.input.length) {
        if (p.isCharToken(TokenTypes.braceRQuote) || p.isCharToken(TokenTypes.braceRDoubleQuote))
            break
        p.pos++
    }
}
