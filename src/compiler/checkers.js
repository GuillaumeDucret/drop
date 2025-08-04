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

export function getElementById(node) {
    return (
        node.type === 'CallExpression' &&
        node.callee.type === 'MemberExpression' &&
        node.callee.object.type === 'Identifier' &&
        node.callee.object.name === 'document' &&
        node.callee.property.type === 'Identifier' &&
        node.callee.property.name === 'getElementById'
    )
}

export function querySelector(node) {
    return (
        node.type === 'CallExpression' &&
        node.callee.type === 'MemberExpression' &&
        node.callee.property.type === 'Identifier' &&
        node.callee.property.name === 'querySelector'
    )
}
