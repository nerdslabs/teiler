# Teiler 🪡 (ˈteɪlər - tailor)

![Discord](https://img.shields.io/discord/1125416414069661698?logo=discord&link=https%3A%2F%2Fdiscord.gg%2FJ6Sv9sQ64t)

**Teiler** is an open source library that simplifies the creation of stylish components for various frameworks.

Currently in the **alpha phase**, the library is actively being developed and improved. This package is the **Svelte 5** adapter and supports both CSR (Client-Side Rendering) and SSR (Server-Side Rendering).

Join our community on our [Discord Server](https://discord.gg/J6Sv9sQ64t) to stay informed about the latest developments, exchange ideas, and connect with fellow developers. We are continuously working on expanding our support to include more frameworks, allowing developers to effortlessly create components across various environments.

## Requirements

- `svelte` `^5.16.0`
- A Svelte-aware bundler (Vite with `@sveltejs/vite-plugin-svelte`, SvelteKit, `rollup-plugin-svelte`, …)

The package ships uncompiled `.svelte` files through the `svelte` export condition, so your bundler compiles them for the right target (client or server) with the same Svelte version as your application.

### Example

```typescript
import { component } from '@teiler/svelte'

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

```svelte
<Button _primary={primary} onclick={() => count++}>Clicked {count} times</Button>
```

Props prefixed with `_` are used only for styles and are not forwarded to the DOM. Every other prop, including event handlers (`onclick`, `oninput`, …) and `class`, is forwarded to the rendered element.

## Migrating from Svelte 4 (`@teiler/svelte` 0.0.x)

- Svelte 5 is required (`svelte` `^5.16.0`); Svelte 4 is no longer supported.
- Event handlers are props: `<Button onclick={handler}>` instead of `<Button on:click={handler}>`.
- If you provide the theme through context yourself, the `THEME` context holds a getter (`() => theme`) instead of a writable store. `ThemeProvider` usage is unchanged.
- UMD/CJS bundles are gone; the package is consumed as Svelte source by your bundler.

## Keyframes

```typescript
import { component, keyframes } from '@teiler/svelte'

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

## Extending

Pass an existing component to `component` to add styles to it. The new component keeps the element of the extended one, unless you pick another element with `component.<tag>`:

```typescript
import { component } from '@teiler/svelte'

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

```svelte
<script lang="ts">
  import { Button } from './components'
  import Link from './Link.svelte'
</script>

<Button as="a" href="/docs">Docs</Button>
<Button as={Link} to="/home">Home</Button>
```

When `as` is a component, it receives `class`, `children` and every other forwarded prop. Svelte has no attribute fallthrough, so the component has to apply `class` to its root element:

```svelte
<!-- Link.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { ClassValue } from 'svelte/elements'

  const { to, class: className, children }: { to: string; class?: ClassValue; children?: Snippet } = $props()
</script>

<a href={to} class={className}>{@render children?.()}</a>
```

Props are typed from `as`: `as="a"` accepts anchor attributes, `as={Link}` accepts the props of `Link` and requires its required props. Without `as`, the component accepts the attributes of its own element. `svelte-check` reports an unknown tag in `as` and attributes the target does not accept:

```svelte
<Button as="a" href="/docs">Docs</Button> <!-- ok -->
<Button href="/docs">Docs</Button>        <!-- error: href is not a button attribute -->
<Button as={Link}>Home</Button>           <!-- error: to is required -->
```

> [!NOTE]
> `mount()` and `render()` called from TypeScript cannot infer `as`, so there props are typed from the element of the styled component.

## `withComponent`

Use `withComponent` to create a new styled component with the same styles that always renders another element or component. The original component stays unchanged:

```typescript
import { component } from '@teiler/svelte'
import Link from './Link.svelte'

const Button = component.button`
  background: #f18805;
`

const FooterLink = Button.withComponent(Link)
const ButtonAnchor = Button.withComponent('a')
```

```svelte
<FooterLink to="/home">Home</FooterLink>
<ButtonAnchor href="/docs">Docs</ButtonAnchor>
```

Props are typed from the target, so `FooterLink` requires `to`. The target component has the same requirements as a component passed to `as`: it has to apply `class` to its root element. `as` still works and takes precedence over the target. Extending with `component(FooterLink)` keeps rendering `Link`, `component.a(FooterLink)` renders `<a>`.

## Theme

```svelte
<!-- App.svelte -->
<script lang="ts">
  import type { CustomTheme } from './theme'

  import { ThemeProvider } from '@teiler/svelte'
  import { Component } from './components'

  let theme: CustomTheme = $state({ fontColor: 'red' })
</script>

<ThemeProvider {theme}>
  <Component>Some test text</Component>
</ThemeProvider>
```

```typescript
// components.ts
import { component } from '@teiler/svelte'

const Component = component.div`
  color: ${({ theme }) => theme.fontColor};
`

export { Component }
```

To type the theme in TypeScript, extend `DefaultTheme` from `@teiler/svelte` in a declaration file (`d.ts`). Do not extend `@teiler/core`: it is a dependency of `@teiler/svelte`, not of your app, so with pnpm TypeScript cannot resolve it and ignores the extension without an error.

```typescript
import type { CustomTheme } from './theme'

declare module '@teiler/svelte' {
  export interface DefaultTheme extends CustomTheme {}
}
```

## Server-Side Rendering

Styles are collected into a style sheet provided through the `STYLE_SHEET` context. Create one sheet per request, render, then put the extracted CSS into the document head.

```typescript
import { createStyleSheet } from '@teiler/svelte'
import { render } from 'svelte/server'
import App from './App.svelte'

const sheet = createStyleSheet({})
const { body } = render(App, { context: new Map([['STYLE_SHEET', sheet]]) })
const { css, ids } = sheet.extract()

const styleTag = `<style data-teiler="${ids.join(' ')}">${css}</style>`
```

Read `body` before calling `extract()`: styles are inserted while the component tree renders.

> [!WARNING]
> Always provide a style sheet through the `STYLE_SHEET` context on the server. Without it, every request shares one module-level style sheet, so styles accumulate across requests.

## Hydration

On the client, pass the ids rendered by the server to `hydrate`, so styles that are already in the document are not inserted again. Provide the same style sheet to the app through context:

```typescript
import { createStyleSheet } from '@teiler/svelte'
import { hydrate } from 'svelte'
import App from './App.svelte'

const sheet = createStyleSheet({})
const element = document.querySelector<HTMLStyleElement>('style[data-teiler]')

sheet.hydrate(element?.dataset.teiler?.split(' ') ?? [])

hydrate(App, { target: document.body, context: new Map([['STYLE_SHEET', sheet]]) })
```

## Content Security Policy

With a strict `style-src` policy, pass a `nonce` to the style sheet and provide it through the `STYLE_SHEET` context. Without an explicit `nonce` no attribute is set, and the default style sheet never has one.

On the server, `extract` returns the nonce, so it can be set on the rendered `<style>` tag:

```typescript
const sheet = createStyleSheet({ nonce })
const { body } = render(App, { context: new Map([['STYLE_SHEET', sheet]]) })
const { css, ids } = sheet.extract()

const styleTag = `<style data-teiler="${ids.join(' ')}" nonce="${nonce}">${css}</style>`
```

On the client, read the nonce from the server rendered tag before creating the style sheet:

```typescript
const element = document.querySelector<HTMLStyleElement>('style[data-teiler]')
const sheet = createStyleSheet({ nonce: element?.nonce })
```

> [!NOTE]
> Use the `nonce` property, not `getAttribute('nonce')`. Browsers hide the attribute when the policy is sent in a header, so `getAttribute` returns an empty string.

## Build plugin

Teiler works without a build step. For smaller bundles, add [`@teiler/unplugin`](https://github.com/nerdslabs/teiler/tree/master/packages/unplugin#readme) to Vite, Rollup, Rolldown, webpack, Rspack or esbuild. It minifies the CSS in templates, lets the bundler remove unused styled components and warns about CSS that is ignored at runtime.

```js
// vite.config.js
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import teiler from '@teiler/unplugin/vite'

export default defineConfig({
  plugins: [svelte(), teiler()],
})
```

With SSR, use it in both the server and the client build. See the [plugin README](https://github.com/nerdslabs/teiler/tree/master/packages/unplugin#readme) for other bundlers and options.

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
import { createComponent, sew } from '@teiler/svelte'

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
