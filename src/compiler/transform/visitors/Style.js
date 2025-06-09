import { generate } from 'css-tree'

export function Style(node, ctx) {
    const css = generate(node.content)
    
    ctx.state.css = css
    ctx.state.template.push(`<!>`)
}