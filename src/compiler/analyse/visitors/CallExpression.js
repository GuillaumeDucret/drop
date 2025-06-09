import * as is from '../../checkers.js'

export function CallExpression(node, ctx) {
    ctx.next()

    if (is.member(node.callee, is.customElements, is.define)) {
        ctx.state.hasDefineCustomElement = true
    }
}
