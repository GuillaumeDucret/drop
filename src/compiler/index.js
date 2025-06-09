import { print } from 'esrap'
import { parse } from './parser/index.js'
import { analyse } from './analyse/index.js'
import { transform } from './transform/index.js'

export function compile(source, options) {
    const ast = parse(source)
    //console.log(JSON.stringify(ast, undefined, 2))
    const analysis = analyse(ast)
    //console.log(analysis)
    const result = transform(ast, analysis, options)
    //console.log(JSON.stringify(result, undefined, 2))
    return print(result) 
}
