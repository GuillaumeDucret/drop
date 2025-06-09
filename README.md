

# Drop

Write web components the easy way !

Drop is a compiler which turns html modules into JS.

- :sparkles: No API ! Write plain JS without having to learn yet an other framework.
- :zap: Reactive with [signals](https://github.com/tc39/proposal-signals)
- :heart: Inspired by the [html module proposal](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/html-modules-proposal.md)


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

## Getting started

```
git clone https://github.com/
cd ./drop
npm i
npm run examples

```

Development in progress, and not published to npm yet.

## Acknowledgement

Drop is heavily inspired by Svelte and reuses some libraries from the svelte echosystem. The motivation is to retain the ease of development offered by Svelte while relying only on standard APIs. 