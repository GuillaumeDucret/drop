import * as css from '../../css.js'
import { getStyleSheet } from '../context.js'

export function Element(node, ctx) {
    ctx.next()

    const stylesheet = getStyleSheet(ctx)
    const scoped = css.match(node, stylesheet)
    const hasClass = !!node.attributes.find((a) => a.name === 'class')

    node.metadata = { hasClass, scoped }
}
