import path from 'path'

export function ImportDeclaration(node, ctx) {
    if (ctx.state.options.importShift && node.source.value[0] === '.') {

console.log('shift import')
console.log(ctx.state.options.importShift)


        const value = path.join(ctx.state.options.importShift, node.source.value)

console.log(value)        
        const raw = undefined

        return { ...node, source: { ...node.source, value, raw } }
    }
}
