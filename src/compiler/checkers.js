export function id(node) {
    return node.type === 'Identifier'
}

export function thisExp(node) {
    return node.type === 'ThisExpression'
}

export function member(node, objectCheck, propertyCheck) {
    return (
        node.type === 'MemberExpression' && objectCheck(node.object) && propertyCheck(node.property)
    )
}

export function call(node, calleeCheck) {
    return node.type === 'CallExpression' && calleeCheck(node.callee)
}

//
// advanced checkers
//

export function signal(node) {
    return node.type === 'Identifier' && node.name === 'signal'
}

export function customElements(node) {
    return node.type === 'Identifier' && node.name === 'customElements'
}

export function define(node) {
    return node.type === 'Identifier' && node.name === 'define'
}