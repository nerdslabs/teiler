# @teiler/unplugin

Build plugin for [Teiler](https://github.com/nerdslabs/teiler) that makes the bundle smaller. Teiler works without it.

For `component`, `global`, `keyframes`, `css` and `pattern` tagged templates it:

- minifies the CSS (`minify`): whitespace and comments are removed from the template strings, so they no longer ship to the browser. Interpolations are left untouched.
- makes unused definitions removable (`pure`): bundlers cannot drop tagged templates, so they are turned into calls marked `/*#__PURE__*/`, and definitions that are never imported are removed from the bundle.
- gives components, globals and patterns stable ids (`componentId`): ids are hashed from the template strings, so two components with the same strings and different interpolations share an id, and `${A}` selects `B` too. The plugin adds `.withConfig("<id>")`: 6 characters hashed from the package name and the file path in the package, shared by the file and compressed well, plus 3 characters hashed from the variable name, so adding a component does not change the ids of the others. Templates with a `componentId` set by hand are left as they are.
- reports [mistakes](#warnings) as build warnings.

```js
// source
export const Button = component.button`
  color: ${({ color }) => color};
`
// output
export const Button = /*#__PURE__*/ component.button.withConfig("Xw3f9kq7Z")(["color:", ";"], ({ color }) => color)
```

Works with Vite, Rollup, Rolldown, webpack, Rspack and esbuild through [unplugin](https://github.com/unjs/unplugin).

## Installation

```bash
pnpm add -D @teiler/unplugin
```

Requires Node.js 22.12 or later and `@teiler/core` 0.2 or later (`@teiler/vue` / `@teiler/svelte` 0.2), which added `withConfig`.

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
| `minify` | production only | Minify the CSS in the templates |
| `pure` | production only | Turn the templates into `/*#__PURE__*/` calls |
| `componentId` | `true` | Add stable ids to components, globals and patterns |

## Development

Like the bundlers do with JavaScript, the plugin minifies and adds `/*#__PURE__*/` only in production builds: `vite build`, webpack and Rspack with `mode: 'production'` (or no `mode`). The Vite dev server and other webpack modes keep the CSS as written. Component ids are added and warnings are reported in every mode. Rollup, Rolldown and esbuild have no mode, so both options default to `true` there. Set `minify` and `pure` to override the default.

## Warnings

The plugin reports two mistakes as build warnings, with the file and position:

- CSS that is not a declaration or a rule in a `component`, `global`, `keyframes` or `pattern` template, e.g. a missing `:`, an unclosed `{` or an extra `}`. Stylis ignores that part at runtime, so the style silently goes missing.
- A Teiler definition (declared in the same file) or an imported PascalCase name interpolated into a plain template string inside a function. It becomes `"[object Object]"` at runtime:

  ```js
  ${({ _active }) => _active && `${Button} { color: red; }`}    // warning
  ${({ _active }) => _active && css`${Button} { color: red; }`} // ok
  ```

## Server-side rendering

Minification changes the template strings, and component ids and class names are hashed from them. Use the plugin with the same `minify` setting in both the client and the server build, otherwise hydrated styles will not match. The default depends on the command or mode, not on the bundler's `minify` option (Vite does not minify SSR builds), so the client and the server built together match. Component ids do not depend on the code layout or the build root, only on the package name, the file path in the package and the variable name, so they are the same in both builds.

## Libraries

Libraries built with Teiler (e.g. with `pattern`) should run the plugin in their own build. `node_modules` are skipped by default.
