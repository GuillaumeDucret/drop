import { walk } from 'zimmerframe'
import { Element } from './visitors/Element.js'
import { Text } from './visitors/Text.js'
import { Program } from './visitors/Program.js'
import { Template } from './visitors/Template.js'
import { ExpressionTag } from './visitors/ExpressionTag.js'
import { SlotElement } from './visitors/SlotElement.js'
import { Attribute } from './visitors/Attribute.js'
import { Style } from './visitors/Style.js'
import { Script } from './visitors/Script.js'

const templateVisitors = {
    Attribute,
    Element,
    SlotElement,
    Text,
    ExpressionTag,
    Template,
    Style,
    Script
}

const scriptVisitors = {
    Program
}

export function transform(ast, analysis, context) {
    const template = walk(ast.template, { analysis, context }, templateVisitors)
    return walk(ast.script.content, { analysis, template, context }, scriptVisitors)
}
