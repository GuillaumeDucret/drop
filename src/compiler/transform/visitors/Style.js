import { generate } from 'css-tree'

export function Style(node, ctx) {
    node = ctx.next() ?? node

    const css = generate(node.content)

    ctx.state.css = css
    ctx.state.template.push(`<!>`)
}
