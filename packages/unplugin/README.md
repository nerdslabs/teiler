# @teiler/unplugin

Build plugin for [Teiler](https://github.com/nerdslabs/teiler) that makes the bundle smaller. Teiler works without it.

For `component`, `global`, `keyframes`, `css` and `pattern` tagged templates it:

- minifies the CSS: whitespace and comments are removed from the template strings, so they no longer ship to the browser. Interpolations are left untouched.
- makes unused definitions removable: bundlers cannot drop tagged templates, so they are turned into calls marked `/*#__PURE__*/`, and definitions that are never imported are removed from the bundle.

```js
// source
export const Button = component.button`
  color: ${({ color }) => color};
`
// output
export const Button = /*#__PURE__*/ component.button(["color:", ";"], ({ color }) => color)
```

Works with Vite, Rollup, Rolldown, webpack, Rspack and esbuild through [unplugin](https://github.com/unjs/unplugin).

## Installation

```bash
pnpm add -D @teiler/unplugin
```

## Usage

### Vite

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import teiler from '@teiler/unplugin/vite'

export default defineConfig({
  plugins: [vue(), teiler()],
})
```

### Rollup / Rolldown

```js
import teiler from '@teiler/unplugin/rollup'
// or
import teiler from '@teiler/unplugin/rolldown'

export default {
  plugins: [teiler()],
}
```

### webpack / Rspack

```js
import teiler from '@teiler/unplugin/webpack'
// or
import teiler from '@teiler/unplugin/rspack'

export default {
  plugins: [teiler()],
}
```

### esbuild

```js
import { build } from 'esbuild'
import teiler from '@teiler/unplugin/esbuild'

build({
  plugins: [teiler()],
})
```

## Options

| Option | Default | Description |
| --- | --- | --- |
| `include` | all files | Files to transform (string, RegExp or an array of them) |
| `exclude` | `[/node_modules/]` | Files to skip |
| `modules` | `[]` | Additional modules re-exporting Teiler helpers, e.g. `['@acme/ui']` |

## Warnings

The plugin reports two mistakes as build warnings, with the file and position:

- CSS that is not a declaration or a rule in a `component`, `global`, `keyframes` or `pattern` template, e.g. a missing `:`, an unclosed `{` or an extra `}`. Stylis ignores that part at runtime, so the style silently goes missing.
- A Teiler definition (declared in the same file) or an imported PascalCase name interpolated into a plain template string inside a function. It becomes `"[object Object]"` at runtime:

  ```js
  ${({ _active }) => _active && `${Button} { color: red; }`}    // warning
  ${({ _active }) => _active && css`${Button} { color: red; }`} // ok
  ```

## Server-side rendering

Minification changes the template strings, and component ids and class names are hashed from them. Use the plugin in both the client and the server build, otherwise hydrated styles will not match.

## Libraries

Libraries built with Teiler (e.g. with `pattern`) should run the plugin in their own build. `node_modules` are skipped by default.
