import { parseFragment } from './element.js'
import { Parser } from './parser.js'
import { TokenTypes } from './tokentype.js'

/**
 *
 * @param {Parser} p
 * @returns
 */
export function parseIfBlock(p) {
    const node = { type: 'IfBlock', start: p.pos }

    p.expectToken([TokenTypes.braceLHash])
    p.expectToken([TokenTypes.name])
    node.name = p.value
    p.skipWhitespaces()
    p.expectToken([TokenTypes.braceR])
    node.consequent = parseFragment(p)

    const token = p.peakToken([TokenTypes.braceLSlash, TokenTypes.braceLColumn])

    if (token.type === TokenTypes.braceLColumn) {
        p.expectToken([TokenTypes.braceLColumn])
        p.expectToken([TokenTypes.name])
        p.skipWhitespaces()
        p.expectToken([TokenTypes.braceR])

        node.alternate = parseFragment(p)
    }

    p.expectToken([TokenTypes.braceLSlash])
    p.expectToken([TokenTypes.name])
    const blockNameClose = p.value
    p.skipWhitespaces()
    p.expectToken([TokenTypes.braceR])

    if (node.name !== blockNameClose) throw new Error('wrong closing tag')

    node.end = p.pos
    return node
}
