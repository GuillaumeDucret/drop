import * as is from '../../checkers.js'
import { isInConstructor } from '../context.js'

export function AssignmentExpression(node, ctx) {
    if (is.thisMember(node.left) && isInConstructor(ctx)) {
        const isPrivate = is.privateId(node.left.property)
        const customElement = isPrivate ? ctx.state.customElement.private : ctx.state.customElement

        node.metadata ??= {}
        node.metadata.isPrivate = isPrivate

        if (is.signal(node.right)) {
            node.metadata.isSignal = true
            customElement.signals.push(node.left.property.name)
        } else {
            node.metadata.isProperty = true
            customElement.properties.push(node.left.property.name)
        }
    }
}
