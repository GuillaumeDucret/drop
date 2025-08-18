export function Program(node, ctx) {
    const customElement = {
        className: [],
        signals: [],
        properties: [],
        methods: [],
        setters: [],
        private: {
            signals: [],
            properties: [],
            methods: [],
            setters: []
        }
    }

    ctx.next({ ...ctx.state, customElement })

    node.metadata ??= {}
    node.metadata.customElement = {
        ...customElement,
        className: customElement.className[0] ?? false
    }
}
