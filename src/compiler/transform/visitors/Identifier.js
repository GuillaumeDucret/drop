import * as b from '../../builders.js'

export function Identifier(node, ctx) {
    if (ctx.state.analysis.signals.indexOf(node.name) >= 0) {
        return b.symbol(node)
    }

    if (ctx.state.analysis.methods.indexOf(node.name) >= 0) {
        return b.member(b.thisExp(), node)
    }
}
