export function declaration(id, init, kind = 'const') {
    if (typeof id === 'string') {
        id = { type: 'Identifier', name: id }
    }

    return {
        type: 'VariableDeclaration',
        declarations: [
            {
                type: 'VariableDeclarator',
                id,
                init
            }
        ],
        kind
    }
}

export function literal(value) {
    return { type: 'Literal', value }
}

export function binary(operator, left, right) {
    return {
        type: 'BinaryExpression',
        operator,
        left,
        right
    }
}

export function template(text, expressions) {
    if (text.length === expressions.length) {
        // template literals must start and end with a text
        text.push('')
    }

    const quasis = text.map((raw) => ({
        type: 'TemplateElement',
        value: { raw }
    }))

    return {
        type: 'TemplateLiteral',
        quasis,
        expressions
    }
}

export function assignment(left, right, operator = '=') {
    return {
        type: 'ExpressionStatement',
        expression: {
            type: 'AssignmentExpression',
            operator,
            left,
            right
        }
    }
}

export function member(object, property) {
    if (typeof object === 'string') {
        object = { type: 'Identifier', name: object }
    }

    if (typeof property === 'string') {
        property = { type: 'Identifier', name: property }
    }

    return {
        type: 'MemberExpression',
        object,
        property,
        computed: false,
        optional: false
    }
}

export function arrowFunc(body) {
    return {
        type: 'ArrowFunctionExpression',
        id: null,
        expression: false,
        generator: false,
        async: false,
        params: [],
        body: {
            type: 'BlockStatement',
            body: [body]
        }
    }
}

export function importNamespace(local, source) {
    return {
        type: 'ImportDeclaration',
        specifiers: [
            {
                type: 'ImportNamespaceSpecifier',
                local
            }
        ],
        source: {
            type: 'Literal',
            value: source
        },
        attributes: []
    }
}

export function importSpecifier(name, source) {
    return {
        type: 'ImportDeclaration',
        specifiers: [
            {
                type: 'ImportSpecifier',
                imported: {
                    type: 'Identifier',
                    name
                },
                local: {
                    type: 'Identifier',
                    name
                }
            }
        ],
        source: {
            type: 'Literal',
            value: source
        },
        attributes: []
    }
}

export function property(key, value) {
    if (typeof key === 'string') {
        key = { type: 'Identifier', name: key }
    }

    return { type: 'Property', key, value }
}

export function object() {
    return { type: 'ObjectExpression', properties: [] }
}

export function id(name) {
    return { type: 'Identifier', name }
}

export function thisExp() {
    return { type: 'ThisExpression' }
}

export function exportDec(declaration) {
    return { type: 'ExportNamedDeclaration', declaration }
}

export function returnStmt(argument) {
    return { type: 'ReturnStatement', argument }
}

export function program(body = []) {
    return { type: 'Program', body }
}

export function func(id, body = []) {
    return {
        type: 'FunctionDeclaration',
        id,
        expression: false,
        generator: false,
        async: false,
        params: [],
        body: {
            type: 'BlockStatement',
            body
        }
    }
}

export function call(callee) {
    return { type: 'CallExpression', callee, arguments: [], optional: false }
}

export function ifStmt(test, consequent, alternate) {
    return { type: 'IfStatement', test, consequent, alternate }
}

export function forStmt(id, right, body) {
    return {
        type: 'ForOfStatement',
        await: false,
        left: {
            type: 'VariableDeclaration',
            declarations: [
                {
                    type: 'VariableDeclarator',
                    id,
                    init: null
                }
            ],
            kind: 'const'
        },
        right,
        body: {
            type: 'BlockStatement',
            body
        }
    }
}

//
// advanced builders
//

export function textContent(object) {
    if (typeof object === 'string') {
        object = { type: 'Identifier', name: object }
    }

    return {
        type: 'MemberExpression',
        object,
        property: {
            type: 'Identifier',
            name: 'textContent'
        },
        computed: false,
        optional: false
    }
}

export function innerHTML(object) {
    if (typeof object === 'string') {
        object = { type: 'Identifier', name: object }
    }

    return {
        type: 'MemberExpression',
        object,
        property: {
            type: 'Identifier',
            name: 'innerHTML'
        },
        computed: false,
        optional: false
    }
}

export function child(object) {
    if (typeof object === 'string') {
        object = { type: 'Identifier', name: object }
    }

    return {
        type: 'MemberExpression',
        object,
        property: {
            type: 'Identifier',
            name: 'firstChild'
        },
        computed: false,
        optional: false
    }
}

export function sibling(object, count) {
    let stmt = object
    while (count-- > 0) {
        stmt = {
            type: 'MemberExpression',
            object: stmt,
            property: {
                type: 'Identifier',
                name: 'nextSibling'
            },
            computed: false,
            optional: false
        }
    }
    return stmt
}

export function setAttribute(object, name, value) {
    return {
        type: 'CallExpression',
        callee: {
            type: 'MemberExpression',
            object,
            property: {
                type: 'Identifier',
                name: 'setAttribute'
            },
            computed: false,
            optional: false
        },
        arguments: [
            {
                type: 'Literal',
                value: name
            },
            value
        ],
        optional: false
    }
}

export function defineCustomElement(elementName, className) {
    return {
        type: 'ExpressionStatement',
        expression: {
            type: 'CallExpression',
            callee: {
                type: 'MemberExpression',
                object: {
                    type: 'Identifier',
                    name: 'customElements'
                },
                property: {
                    type: 'Identifier',
                    name: 'define'
                },
                computed: false,
                optional: false
            },
            arguments: [
                {
                    type: 'Literal',
                    value: elementName
                },
                {
                    type: 'Identifier',
                    name: className
                }
            ],
            optional: false
        }
    }
}

export function createElement(value) {
    return {
        type: 'CallExpression',
        callee: {
            type: 'MemberExpression',
            object: { type: 'Identifier', name: 'document' },
            property: { type: 'Identifier', name: 'createElement' },
            computed: false,
            optional: false
        },
        arguments: [{ type: 'Literal', value }],
        optional: false
    }
}

export function $() {
    return {
        type: 'MemberExpression',
        object: {
            type: 'ThisExpression'
        },
        property: {
            type: 'Identifier',
            name: '$'
        },
        computed: false,
        optional: false
    }
}

export function $$() {
    return {
        type: 'CallExpression',
        callee: {
            type: 'Identifier',
            name: '$$'
        },
        arguments: [],
        optional: false
    }
}

export function shadow() {
    return {
        type: 'MemberExpression',
        object: {
            type: 'ThisExpression'
        },
        property: {
            type: 'Identifier',
            name: 'shadow'
        },
        computed: false,
        optional: false
    }
}

export function attachShadow() {
    return {
        type: 'CallExpression',
        callee: {
            type: 'MemberExpression',
            object: { type: 'ThisExpression' },
            property: {
                type: 'Identifier',
                name: 'attachShadow'
            },
            computed: false,
            optional: false
        },
        arguments: [
            {
                type: 'ObjectExpression',
                properties: [
                    {
                        type: 'Property',
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                            type: 'Identifier',
                            name: 'mode'
                        },
                        value: {
                            type: 'Literal',
                            value: 'open',
                            raw: '"open"'
                        },
                        kind: 'init'
                    }
                ]
            }
        ],
        optional: false
    }
}

export function insertAdjacentHTML(object, value) {
    if (typeof object === 'string') {
        object = { type: 'Identifier', name: object }
    }

    return {
        type: 'CallExpression',
        callee: {
            type: 'MemberExpression',
            object,
            property: {
                type: 'Identifier',
                name: 'insertAdjacentHTML'
            },
            computed: false,
            optional: false
        },
        arguments: [
            {
                type: 'Literal',
                value: 'beforeend'
            },
            value
        ],
        optional: false
    }
}

export function insertBefore(node, insertNode) {
    if (typeof node === 'string') {
        node = { type: 'Identifier', name: node }
    }

    return {
        type: 'ExpressionStatement',
        expression: {
            type: 'CallExpression',
            callee: {
                type: 'MemberExpression',
                object: {
                    type: 'MemberExpression',
                    object: node,
                    property: {
                        type: 'Identifier',
                        name: 'parentNode'
                    },
                    computed: false,
                    optional: false
                },
                property: {
                    type: 'Identifier',
                    name: 'insertBefore'
                },
                computed: false,
                optional: false
            },
            arguments: [insertNode, node],
            optional: false
        }
    }
}

export function appendChild(object, node) {
    if (typeof node === 'string') {
        node = { type: 'Identifier', name: node }
    }

    return {
        type: 'ExpressionStatement',
        expression: {
            type: 'CallExpression',
            callee: {
                type: 'MemberExpression',
                object,
                property: {
                    type: 'Identifier',
                    name: 'appendChild'
                },
                computed: false,
                optional: false
            },
            arguments: [node],
            optional: false
        }
    }
}

export function dispose(object) {
    return {
        type: 'ExpressionStatement',
        expression: {
            type: 'CallExpression',
            callee: {
                type: 'MemberExpression',
                object,
                property: {
                    type: 'Identifier',
                    name: 'dispose'
                },
                computed: false,
                optional: false
            },
            arguments: [],
            optional: false
        }
    }
}

export function effect(body) {
    return {
        type: 'ExpressionStatement',
        expression: {
            type: 'CallExpression',
            callee: {
                type: 'MemberExpression',
                object: {
                    type: 'Identifier',
                    name: '$'
                },
                property: {
                    type: 'Identifier',
                    name: 'effect'
                },
                computed: false,
                optional: false
            },
            arguments: [
                {
                    type: 'ArrowFunctionExpression',
                    id: null,
                    expression: false,
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                        type: 'BlockStatement',
                        body
                    }
                }
            ],
            optional: false
        }
    }
}

export function connectedCallback(body = []) {
    return {
        type: 'MethodDefinition',
        static: false,
        computed: false,
        key: {
            type: 'Identifier',
            name: 'connectedCallback'
        },
        kind: 'method',
        value: {
            type: 'FunctionExpression',
            id: null,
            expression: false,
            generator: false,
            async: false,
            params: [],
            body: {
                type: 'BlockStatement',
                body
            }
        }
    }
}

export function disconnectedCallback(body = []) {
    return {
        type: 'MethodDefinition',
        static: false,
        computed: false,
        key: {
            type: 'Identifier',
            name: 'disconnectedCallback'
        },
        kind: 'method',
        value: {
            type: 'FunctionExpression',
            id: null,
            expression: false,
            generator: false,
            async: false,
            params: [],
            body: {
                type: 'BlockStatement',
                body
            }
        }
    }
}

export function render(body = []) {
    return {
        type: 'FunctionDeclaration',
        id: {
            type: 'Identifier',
            name: 'render'
        },
        expression: false,
        generator: false,
        async: false,
        params: [
            {
                type: 'Identifier',
                name: 'data'
            },
            {
                type: 'Identifier',
                name: 'slot'
            }
        ],
        body: {
            type: 'BlockStatement',
            body
        }
    }
}

export function symbol(id) {
    return {
        type: 'MemberExpression',
        object: {
            type: 'MemberExpression',
            object: {
                type: 'ThisExpression'
            },
            property: id,
            computed: false,
            optional: false
        },
        property: {
            type: 'Identifier',
            name: 'value'
        },
        computed: false,
        optional: false
    }
}

export function ifBlock(anchor, test, consequent, alternate) {
    const argumentsStmts = [
        anchor,
        {
            type: 'ArrowFunctionExpression',
            id: null,
            expression: true,
            generator: false,
            async: false,
            params: [],
            body: test
        },
        {
            type: 'ArrowFunctionExpression',
            id: null,
            expression: true,
            generator: false,
            async: false,
            params: [
                { type: 'Identifier', name: '$' },
                { type: 'Identifier', name: 'anchor' }
            ],
            body: { type: 'BlockStatement', body: consequent }
        }
    ]

    if (alternate) {
        argumentsStmts.push({
            type: 'ArrowFunctionExpression',
            id: null,
            expression: true,
            generator: false,
            async: false,
            params: [
                { type: 'Identifier', name: '$' },
                { type: 'Identifier', name: 'anchor' }
            ],
            body: { type: 'BlockStatement', body: alternate }
        })
    }

    return {
        type: 'ExpressionStatement',
        expression: {
            type: 'CallExpression',
            callee: {
                type: 'MemberExpression',
                object: {
                    type: 'Identifier',
                    name: '$'
                },
                property: {
                    type: 'Identifier',
                    name: 'ifBlock'
                },
                computed: false,
                optional: false
            },
            arguments: argumentsStmts,
            optional: false
        }
    }
}

export function eachBlock(anchor, expression, context, key, body) {
    const keyStmt = {
        type: 'ArrowFunctionExpression',
        id: null,
        expression: true,
        generator: false,
        async: false,
        params: [
            {
                type: 'Identifier',
                name: 'v'
            },
            {
                type: 'Identifier',
                name: 'i'
            }
        ],
        body: {
            type: 'Identifier',
            name: 'i'
        }
    }

    return {
        type: 'ExpressionStatement',
        expression: {
            type: 'CallExpression',
            callee: {
                type: 'MemberExpression',
                object: {
                    type: 'Identifier',
                    name: '$'
                },
                property: {
                    type: 'Identifier',
                    name: 'eachBlock'
                },
                computed: false,
                optional: false
            },
            arguments: [
                anchor,
                {
                    type: 'ArrowFunctionExpression',
                    id: null,
                    expression: true,
                    generator: false,
                    async: false,
                    params: [],
                    body: expression
                },
                keyStmt,
                {
                    type: 'ArrowFunctionExpression',
                    id: null,
                    expression: true,
                    generator: false,
                    async: false,
                    params: [
                        { type: 'Identifier', name: '$' },
                        { type: 'Identifier', name: 'anchor' },
                        context
                    ],
                    body: { type: 'BlockStatement', body }
                }
            ],
            optional: false
        }
    }
}

export function block(body) {
    return {
        type: 'ExpressionStatement',
        expression: {
            type: 'CallExpression',
            callee: {
                type: 'MemberExpression',
                object: {
                    type: 'MemberExpression',
                    object: {
                        type: 'ThisExpression',
                    },
                    property: {
                        type: 'Identifier',
                        name: '$'
                    },
                    computed: false,
                    optional: false
                },
                property: {
                    type: 'Identifier',
                    name: 'block'
                },
                computed: false,
                optional: false
            },
            arguments: [
                {
                    type: 'ArrowFunctionExpression',
                    id: null,
                    expression: true,
                    generator: false,
                    async: false,
                    params: [{ type: 'Identifier', name: '$' }],
                    body: { type: 'BlockStatement', body }
                }
            ],
            optional: false
        }
    }
}

// html

export function attribute(name, value, metadata) {
    if (typeof value === 'string') {
        value = [{ type: 'Text', data: value }]
    }

    return { type: 'Attribute', name, value, metadata }
}

export function text(data) {
    return { type: 'Text', data }
}

// css

export function classSelector(name) {
    return { type: 'ClassSelector', name }
}
