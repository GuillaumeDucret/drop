import * as b from '../../builders.js'

export function Template(_, ctx) {
    const modules = new Set()
    const css = []
    const template = []
    const init = { elem: [], text: [] }
    const effects = []
    const handlers = []
    const blocks = []

    ctx.next({ ...ctx.state, modules, css, template, init, effects, handlers, blocks })

    const stmts1 = [
        b.declaration('template', b.createElement('template')),
        b.assignment(b.innerHTML('template'), b.binary('+', b.id('TEMPLATE'), b.id('STYLE')))
    ]
    const stmts2 = [...init.elem, ...init.text, ...effects, ...handlers, ...blocks]
    const stmt3 = b.appendChild(b.shadow(), b.member('template', 'content'))

    const bodyStmt = [...stmts1, ...stmts2, stmt3]
    const block = b.block(bodyStmt)

    return { type: 'TemplateMod', modules, css, template, block }
}
