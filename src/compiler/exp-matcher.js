import { walk } from 'zimmerframe'

export function matchExpression(expression, program) {
    let customElement = program.metadata?.customElement

    walk(expression, undefined, {
        Identifier(node, ctx) {
            const parentNode = ctx.path.at(-1)

            switch (parentNode?.type) {
                case 'CallExpression':
                    if (parentNode.callee === node) {
                        setMethodMetadata(node, customElement)
                        setMethodMetadata(node, customElement.private, true)
                    }
                    break
                case 'MemberExpression':
                    if (parentNode.object === node) {
                        setMetadata(node, customElement)
                        setMetadata(node, customElement.private, true)
                    }
                    break
                default:
                    setMetadata(node, customElement)
                    setMetadata(node, customElement.private, true)
            }
        }
    })

    function setMethodMetadata(node, customElement, isPrivate = false) {
        node.metadata ??= {}

        if (customElement.methods.includes(node.name)) {
            node.metadata.isPrivate = isPrivate
            node.metadata.isMethod = true
        }
    }

    function setMetadata(node, customElement, isPrivate = false) {
        node.metadata ??= {}

        if (customElement.signals.includes(node.name)) {
            node.metadata.isPrivate = isPrivate
            node.metadata.isSignal = true
        } else if (customElement.properties.includes(node.name)) {
            node.metadata.isPrivate = isPrivate
            node.metadata.isProperty = true
        }
    }
}
