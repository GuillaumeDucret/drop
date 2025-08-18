import * as b from '../../builders.js'

export function Identifier(node) {
    if (node.metadata?.isSignal) {
        return b.member(b.thisMember(b.id(node, node.metadata?.isPrivate)), 'value')
    }

    if (node.metadata?.isProperty || node.metadata?.isMethod) {
        return b.thisMember(b.id(node, node.metadata?.isPrivate))
    }
}
