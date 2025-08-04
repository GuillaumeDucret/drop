import { walk } from 'zimmerframe'
import { AssignmentExpression } from './visitors/AssignmentExpression.js'
import { MethodDefinition } from './visitors/MethodDefinition.js'
import { CallExpression } from './visitors/CallExpression.js'
import { ClassDeclaration } from './visitors/ClassDeclaration.js'
import { Template } from './visitors/Template.js'
import { Element } from './visitors/Element.js'
import { CssTree, Selector } from './visitors/Selector.js'
import { Attribute } from './visitors/Attribute.js'
import { IfBlock } from './visitors/IfBlock.js'

const visitors = {
    AssignmentExpression,
    MethodDefinition,
    CallExpression,
    ClassDeclaration,
    Template,
    Element,
    Attribute,
    IfBlock,
    Selector,
    ...CssTree
}

export function analyse(ast) {
    const state = {
        signals: [],
        methods: [],
        isStatic: false
    }

    walk(ast, state, visitors)

    return state
}
