# Teiler 🪡 (ˈteɪlər - tailor)

![Discord](https://img.shields.io/discord/1125416414069661698?logo=discord&link=https%3A%2F%2Fdiscord.gg%2FJ6Sv9sQ64t)

**Teiler** is an open source library that simplifies the creation of stylish components for various frameworks.

Currently in the **alpha phase**, the library is actively being developed and improved.

Join our community on our [Discord Server](https://discord.gg/J6Sv9sQ64t) to stay informed about the latest developments, exchange ideas, and connect with fellow developers. We are continuously working on expanding our support to include more frameworks, allowing developers to effortlessly create components across various environments. 

### Example

```typescript
import { component } from '@teiler/vue'

const Button = component.button<{
  _primary: boolean
}>`
  display: inline-block;
  border-radius: 4px;
  font-size: 0.8rem;
  line-height: 1.5rem;
  background: transparent;
  box-shadow: 0 0 0 3px #CBCBCB inset;

  ${({ _primary }) =>
    _primary && `
      color: #fff;
      box-shadow: none;
      background: #CBCBCB;
    `
  }
`
```

## Keyframes

```typescript
import { component, keyframes } from '@teiler/vue'

const bouncing = keyframes`
  from, 20%, 53%, 80%, to {
    transform: translate3d(0,0,0);
  }

  40%, 43% {
    transform: translate3d(0, -40px, 0);
  }

  70% {
    transform: translate3d(0, -15px, 0);
  }

  90% {
    transform: translate3d(0,-4px,0);
  }
`

const Button = component.button<{}>`
  animation: ${bouncing} 1s ease infinite;
  display: inline-block;
  border-radius: 4px;
  font-size: 0.8rem;
  line-height: 1.5rem;
  background: transparent;
  box-shadow: 0 0 0 3px #CBCBCB inset;
`
```

## Global styles

`global` creates a component that renders nothing and adds its styles to the document. Props and the theme are interpolated the same way as in components:

```typescript
import { global } from '@teiler/vue'

const GlobalStyles = global<{ _background: string }>`
  body {
    margin: 0;
    background: ${({ _background }) => _background};
  }
`
```

```vue
<template>
  <GlobalStyles _background="#fafafa" />
</template>
```

Styles are added when the component renders and stay in the document after it unmounts.

## `css`

Interpolated functions can return a plain string, as in the examples above. Return `css` instead when the styles interpolate a component, keyframes or another function: a plain template string turns `${Icon}` into `[object Object]` (`@teiler/unplugin` reports it as a warning).

```typescript
import { component, css } from '@teiler/vue'

const Icon = component.span`
  color: gray;
`

const Button = component.button<{ _active: boolean; _color: string }>`
  color: black;

  ${({ _active, _color }) =>
    _active &&
    css`
      color: ${_color};

      ${Icon} {
        color: ${_color};
      }
    `}
`
```

A `css` template can also be interpolated directly, e.g. styles shared by several components: `${shared}`. Functions inside it get the props of the component.

## Extending

Pass an existing component to `component` to add styles to it. The new component keeps the element of the extended one, unless you pick another element with `component.<tag>`:

```typescript
import { component } from '@teiler/vue'

const Button = component.button`
  display: inline-block;
  border-radius: 4px;
`

// renders <button>
const PrimaryButton = component(Button)`
  background: #CBCBCB;
`

// renders <a> with Button styles
const ButtonLink = component.a(Button)`
  text-decoration: none;
`
```

## `as` prop

Use `as` to render a component as a different element or another component without creating a new styled component. Styles stay the same, `as` is not passed to the rendered element:

```vue
<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import { Button } from './components'
</script>

<template>
  <Button as="a" href="/docs">Docs</Button>
  <Button :as="RouterLink" to="/home">Home</Button>
</template>
```

When `as` is a component, slots are passed to it and style classes are applied through attribute fallthrough, so the component has to render a single root element and must not set `inheritAttrs: false`.

Props are typed from `as`: `as="a"` accepts anchor attributes, `:as="RouterLink"` accepts the props of `RouterLink` and requires its required props. Without `as`, the component accepts the attributes of its own element. `vue-tsc` reports an unknown tag in `as` and missing required props; with `strictTemplates` it also reports attributes the target does not accept:

```vue
<template>
  <Button as="a" href="/docs">Docs</Button> <!-- ok -->
  <Button href="/docs">Docs</Button>        <!-- error with strictTemplates: href is not a button attribute -->
  <Button :as="RouterLink">Home</Button>    <!-- error: to is required -->
</template>
```

The rendered DOM element is exposed as `element`, use a template ref to access it:

```vue
<script setup lang="ts">
  import { useTemplateRef } from 'vue'
  import { Button } from './components'

  const button = useTemplateRef('button')
  const element = button.value?.element // HTMLElement | null
</script>

<template>
  <Button ref="button">Submit</Button>
</template>
```

## `withComponent`

Use `withComponent` to create a new styled component with the same styles that always renders another element or component. The original component stays unchanged:

```typescript
import { RouterLink } from 'vue-router'
import { component } from '@teiler/vue'

const Button = component.button`
  background: #f18805;

  &.router-link-active {
    text-decoration: underline;
  }
`

const FooterLink = Button.withComponent(RouterLink)
const ButtonAnchor = Button.withComponent('a')
```

```vue
<template>
  <FooterLink to="/home">Home</FooterLink>
  <ButtonAnchor href="/docs">Docs</ButtonAnchor>
</template>
```

Props are typed from the target, so `FooterLink` requires `to`. The target component has the same requirements as a component passed to `as`. `as` still works and takes precedence over the target. Extending with `component(FooterLink)` keeps rendering `RouterLink`, `component.a(FooterLink)` renders `<a>`.

## Theme

```typescript
// theme.ts
export type CustomTheme = {
  fontColor: string
}
```

```vue
<!-- App.vue -->
<script setup lang="ts">
  import type { CustomTheme } from './theme'

  import { ref } from 'vue'
  import { ThemeProvider } from '@teiler/vue'
  import { Component } from './components'

  const theme = ref<CustomTheme>({ fontColor: 'red' })
</script>

<template>
  <ThemeProvider :theme="theme">
    <Component>Some test text</Component>
  </ThemeProvider>
</template>
```

```typescript
// components.ts
import { component } from '@teiler/vue'

const Component = component.div`
  color: ${({ theme }) => theme.fontColor};
`

export { Component }
```

To type the theme in TypeScript, extend `DefaultTheme` from `@teiler/vue` in a declaration file (`d.ts`). Do not extend `@teiler/core`: it is a dependency of `@teiler/vue`, not of your app, so with pnpm TypeScript cannot resolve it and ignores the extension without an error.

```typescript
import type { CustomTheme } from './theme'

declare module '@teiler/vue' {
  export interface DefaultTheme extends CustomTheme {}
}
```

## SSR

To generate all styles at Server Side Rendering, you need to provide the style sheet before the app renders and dump all styles at the end. The `dump` method generates only the CSS used during rendering.

```ts
// provide:
import { createStyleSheet } from "@teiler/vue"
const styleSheet = createStyleSheet({})

provide('STYLE_SHEET', styleSheet)

// dump:
styleSheet.dump()
```

### NuxtJS

To use it in NuxtJS you need to create a plugin:

```ts
import { createStyleSheet } from "@teiler/vue"

export default defineNuxtPlugin({
  name: "teiler",
  enforce: "pre",
  async setup(nuxtApp) {
    const styleSheet = createStyleSheet({})
    nuxtApp.vueApp.provide('STYLE_SHEET', styleSheet)

    if (process.server) {
      useHead(() => {
        return ({
          style: [{ children: styleSheet.dump(), type: 'text/css', 'data-teiler': true }],
        })
      })
    }
  },
  env: {
    islands: true,
  },
});
```

## Hydration

This method allows you to pre-fill the cache with specific style IDs, optimizing performance by avoiding redundant insertions. Here's how you can use it with **NuxtJS**:

```ts
import { createStyleSheet } from "@teiler/vue"

export default defineNuxtPlugin({
  name: "teiler",
  enforce: "pre",
  async setup(nuxtApp) {
    const styleSheet = createStyleSheet({})
    nuxtApp.vueApp.provide('STYLE_SHEET', styleSheet)

    if (process.server) {
      useHead(() => {
        const { css, ids } = styleSheet.extract()

        return ({
          style: [{ children: css, type: 'text/css', 'data-teiler': ids.join(' ')}],
        })
      })
    } else {
      const element = document.querySelector('style[data-teiler]')
      if (element) {
        const ids = element.getAttribute('data-teiler')?.split(' ') || []
        styleSheet.hydrate(ids)
      }
    }
  },
  env: {
    islands: true,
  },
});

```

## Content Security Policy

With a strict `style-src` policy, pass a `nonce` to the style sheet and provide it to the app. Without an explicit `nonce` no attribute is set, and the default style sheet never has one.

On the server, `extract` returns the nonce, so it can be set on the rendered `<style>` tag:

```ts
import { createStyleSheet } from "@teiler/vue"

const styleSheet = createStyleSheet({ nonce })
app.provide('STYLE_SHEET', styleSheet)

// after render:
const { css, ids, nonce } = styleSheet.extract()
const styleTag = `<style data-teiler="${ids.join(' ')}" nonce="${nonce}">${css}</style>`
```

On the client, read the nonce from the server rendered tag before creating the style sheet:

```ts
import { createStyleSheet } from "@teiler/vue"

const element = document.querySelector<HTMLStyleElement>('style[data-teiler]')
const styleSheet = createStyleSheet({ nonce: element?.nonce })
app.provide('STYLE_SHEET', styleSheet)
```

> [!NOTE]
> Use the `nonce` property, not `getAttribute('nonce')`. Browsers hide the attribute when the policy is sent in a header, so `getAttribute` returns an empty string.

## Build plugin

Teiler works without a build step. For smaller bundles, add [`@teiler/unplugin`](https://github.com/nerdslabs/teiler/tree/master/packages/unplugin#readme) to Vite, Rollup, Rolldown, webpack, Rspack or esbuild. In production builds it minifies the CSS in templates and lets the bundler remove unused styled components. In every mode it gives components stable ids, so a `${Button}` selector never matches another component with the same template strings, in development names their classes after their variables (`Button-t1x2y3z`), and warns about mistakes, such as CSS that is ignored at runtime. Without the plugin, set an id by hand with `component.button.withConfig({ componentId: 'button' })`.

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import teiler from '@teiler/unplugin/vite'

export default defineConfig({
  plugins: [vue(), teiler()],
})
```

With SSR, use it in both the server and the client build. See the [plugin README](https://github.com/nerdslabs/teiler/tree/master/packages/unplugin#readme) for other bundlers, options and [development mode](https://github.com/nerdslabs/teiler/tree/master/packages/unplugin#development).

## Sew a Pattern

This tool simplifies the creation of consistent and reusable visual styles for components across various web frameworks. It provides a pattern-based approach, where patterns serve as blueprints for defining the visual style of components.

### Example

```typescript
// Pattern file in ui kit library
import { pattern } from '@teiler/core'

const ButtonPattern = pattern.button`
  display: inline-block;
  border-radius: 4px;
  font-size: 0.8rem;
  line-height: 1.5rem;
  background: transparent;
  box-shadow: 0 0 0 3px #CBCBCB inset;
`

export default ButtonPattern

// Usage of Pattern
import { ButtonPattern } from 'some-uikit-library'
import { createComponent, sew } from '@teiler/vue'

const Button = sew(ButtonPattern, createComponent)

export default Button
```

Patterns can be extended the same way as components. `pattern(ButtonPattern)` keeps the element of the extended pattern, `pattern.<tag>(ButtonPattern)` changes it:

```typescript
import { pattern } from '@teiler/core'

const PrimaryButtonPattern = pattern(ButtonPattern)`
  background: #CBCBCB;
`

const ButtonLinkPattern = pattern.a(ButtonPattern)`
  text-decoration: none;
`
```
