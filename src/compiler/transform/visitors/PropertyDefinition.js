import * as b from '../../builders.js'

export function PropertyDefinition(node) {
    if (node.metadata?.isProperty && !node.metadata?.isPrivate) {
        return { ...node, value: b.$$init(node.key.name, node.value ?? b.undefined()) }
    }
}
