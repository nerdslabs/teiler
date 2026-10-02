# @teiler/unplugin

## 0.1.0

### Minor Changes

- [#59](https://github.com/nerdslabs/teiler/pull/59) [`a025b28`](https://github.com/nerdslabs/teiler/commit/a025b2889a592a3f171febd627760a5a104986d7) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Give components stable ids. Component ids are hashed from the tag and the template strings, so components with the same strings and different interpolations, or an empty extension and its base, shared an id, and a `${A}` selector matched `B` too.

  - `withConfig({ componentId })` (or `withConfig(componentId)`) on `component`, `component.<tag>`, extensions (`component(Button)`), `global` and `pattern` hashes the id from the given `componentId` instead.
  - `@teiler/unplugin` adds a `componentId` to every component, global and pattern, from the package name, the file path in the package and the variable name, in every mode (`componentId` option). Templates with a `componentId` set by hand are left as they are.
  - Without the plugin, a component used as a selector while another component shares its id logs a warning.

- [#60](https://github.com/nerdslabs/teiler/pull/60) [`c8c79ca`](https://github.com/nerdslabs/teiler/commit/c8c79ca936cd932e973383cab39a4508de524e34) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Name components. `withConfig({ displayName })` (or `withConfig(componentId, displayName)`) prefixes the component id, so the element of `Button` has the class `Button-t1x2y3z` instead of `t1x2y3z`, and sets the Vue component name shown in devtools. Components with different names no longer share an id. `@teiler/unplugin` adds the variable name in development (`displayName` option, same detection as `minify` and `pure`), names set by hand are kept.

- [#49](https://github.com/nerdslabs/teiler/pull/49) [`1d6a1bc`](https://github.com/nerdslabs/teiler/commit/1d6a1bcf4e2b5e8df30eda6866d84dd76e8a332d) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Report ignored CSS and component selectors interpolated into plain template strings as build warnings.

- [#48](https://github.com/nerdslabs/teiler/pull/48) [`862e0f7`](https://github.com/nerdslabs/teiler/commit/862e0f768984c06bebc9fffeeb2d3281f8a9a5d6) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Turn Teiler tagged templates into `/*#__PURE__*/` calls, so bundlers remove unused styled definitions.

- [#45](https://github.com/nerdslabs/teiler/pull/45) [`67335ba`](https://github.com/nerdslabs/teiler/commit/67335ba0890bed695016e77de566ef336a329636) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Add `@teiler/unplugin`, a build plugin for Vite, Rollup, Rolldown, webpack, Rspack and esbuild. In production builds it minifies the CSS in tagged templates and turns them into `/*#__PURE__*/` calls (`minify` and `pure` options). Requires `@teiler/core`, `@teiler/vue` or `@teiler/svelte` 0.2 or later.
