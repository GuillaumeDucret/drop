import { print } from 'esrap'
import { append } from '../../../../utils/misc.js'

export function Script(node, ctx) {
    const { code } = print(node.content)
    append(ctx.state.text, `<script type="module">${code}</script>`)
}
