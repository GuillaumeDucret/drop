

# Drop

Meet DROP : a simpler, more efficient way to develop for the web !

DROP is a compiler that transforms HTML modules into JavaScript.
Its goal is to provide a modern, framework-free web development experience by relying solely on standard APIs.

- :sparkles: No API ! Write plain HTML, CSS and JS without having to learn yet an other framework.
- :zap: Reactive with [signals](https://github.com/tc39/proposal-signals)
- :heart: Inspired by the [html module proposal](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/html-modules-proposal.md)

## Web components

By default, HTML modules are compiled into web components. Boilerplate code—such as shadow DOM creation and custom element definition—is automatically generated during compilation.

Additionally, templating tags enable declarative binding between HTML nodes and the custom element methods and properties. When you define a property as a signal, you get reactivity for free! :)

```html
<script type="module">
    import { signal, effect } from '@webreflection/signal'

    class Counter extends HTMLElement {
        constructor() {
            super()
            this.count = signal(0)
        }

        increment(inc = 1) {
            this.count.value += inc
        }
    }
</script>

<template>
    <div>
        <button onclick="{increment()}">counter is {count}</button>
    </div>
    <style>
        button {
            font-size: 1.5rem;
        }
    </style>
</template>
```

See the [counter](examples/counter) example

## server rendering

HTML modules are compiled as simple render functions when the static attribute is added to the template. Additionally, you can define an asynchronous load function to fetch any data needed by the HTML template.

```html
<script type="module">
    export function load() {
        return { firstName: 'Boby', lastName: 'Nash' }
    }
</script>

<template static>
    <p>Hello {data.firstName} {data.lastName}</p>
    <style>
        p {
            text-transform: uppercase;
        }
    </style>
</template>
```

Static modules will most likely be used by the router. But they also can be invoked manually :

```js
const html = module.render(await module.load({}))
```

## routing

A server-side filesystem-based router is generated during compilation. Requested URLs are matched against the `routes` directory structure. Each routing directory can contain route files :

- `page.html` files are matched against the last URL segment
- `layout.html` files are matched against each URL segment and must include a `<slot>` element.

Routes with parameters—such as `/pages/[id]`—are also supported.

```
routes
|-- layout.html
|-- page.html
|-- pages
    |-- [id]
        |--  page.html

```

Since this is a server-side router, only static HTML modules are allowed in the `routes` directory.

See [site example](examples/site)

## What about SSR ?

DROP’s philosophy is to provide a simple and minimalistic solution for working with web standards.
While SSR can be convenient in some situations, it introduces added complexity and overhead, and therefore is not considered for this project.

Instead, DROP encourages combining traditional server rendering with web components for the most dynamic parts of a website.

## Getting started

```
git clone git@github.com:GuillaumeDucret/drop.git
cd ./drop
npm i
npm run examples

```

Development in progress.
DROP is not published to npm yet. Contribution is welcome !

## Acknowledgement

Drop is heavily inspired by Svelte and reuses some libraries from the svelte echosystem. The motivation is to retain the ease of development offered by Svelte while relying only on standard APIs. 