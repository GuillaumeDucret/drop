import { Client } from './index.js'

export function rootBlock(body) {
    const block = new Client()
    body(block)

    return {
        dispose() {
            block.dispose()
        }
    }
}
