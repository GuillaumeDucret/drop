import { Client } from './client.js'
import { EachBlock } from './eachBlock.js'
import { IfBlock } from './ifBlock.js'

export { EachBlock, IfBlock }

export function $$() {
    Client.prototype.ifBlock ??= function (anchor, getCondition, concequent, alternate) {
        const block = new IfBlock(anchor, getCondition, concequent, alternate).init()
        this.add(block)
        return block
    }

    Client.prototype.eachBlock ??= function (anchor, getIterable, getKey, body) {
        const block = new EachBlock(anchor, getIterable, getKey, body).init()
        this.add(block)
        return block
    }

    return new Client()
}
