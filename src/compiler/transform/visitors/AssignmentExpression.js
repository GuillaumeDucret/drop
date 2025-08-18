import * as b from '../../builders.js'

export function AssignmentExpression(node) {
    if (node.metadata?.isProperty) {
        return { ...node, right: b.$$init(node.left.property.name, node.right) }
    }
}
