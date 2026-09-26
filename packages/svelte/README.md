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

To add typing for Typescript applications you need to add `extend` inside declaration file (`d.ts`)

```typescript
import type { CustomTheme } from './theme'

declare module '@teiler/core' {
  export interface DefaultTheme extends CustomTheme {}
}
```

## Server-Side Rendering

Styles are collected into a style sheet provided through the `STYLE_SHEET` context. Create one sheet per request, render, then put the extracted CSS into the document head.

```typescript
import { createStyleSheet } from '@teiler/core'
import { render } from 'svelte/server'
import App from './App.svelte'

const sheet = createStyleSheet({})
const { body } = render(App, { context: new Map([['STYLE_SHEET', sheet]]) })
const { css, ids } = sheet.extract()
```

Read `body` before calling `extract()`: styles are inserted while the component tree renders.

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
import { sew } from '@teiler/core'
import { createComponent } from '@teiler/svelte'

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
