import path from 'path'

export function ImportDeclaration(node, ctx) {
    if (ctx.state.context.importShift && node.source.value[0] === '.') {

console.log('shift import')
console.log(ctx.state.context.importShift)


        const value = path.join(ctx.state.context.importShift, node.source.value)

console.log(value)        
        const raw = undefined

        return { ...node, source: { ...node.source, value, raw } }
    }
}
