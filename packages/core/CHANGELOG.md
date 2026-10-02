# @teiler/core

## 0.2.0

### Minor Changes

- [#59](https://github.com/nerdslabs/teiler/pull/59) [`a025b28`](https://github.com/nerdslabs/teiler/commit/a025b2889a592a3f171febd627760a5a104986d7) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Give components stable ids. Component ids are hashed from the tag and the template strings, so components with the same strings and different interpolations, or an empty extension and its base, shared an id, and a `${A}` selector matched `B` too.

  - `withConfig({ componentId })` (or `withConfig(componentId)`) on `component`, `component.<tag>`, extensions (`component(Button)`), `global` and `pattern` hashes the id from the given `componentId` instead.
  - `@teiler/unplugin` adds a `componentId` to every component, global and pattern, from the package name, the file path in the package and the variable name, in every mode (`componentId` option). Templates with a `componentId` set by hand are left as they are.
  - Without the plugin, a component used as a selector while another component shares its id logs a warning.

- [#60](https://github.com/nerdslabs/teiler/pull/60) [`c8c79ca`](https://github.com/nerdslabs/teiler/commit/c8c79ca936cd932e973383cab39a4508de524e34) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Name components. `withConfig({ displayName })` (or `withConfig(componentId, displayName)`) prefixes the component id, so the element of `Button` has the class `Button-t1x2y3z` instead of `t1x2y3z`, and sets the Vue component name shown in devtools. Components with different names no longer share an id. `@teiler/unplugin` adds the variable name in development (`displayName` option, same detection as `minify` and `pure`), names set by hand are kept.

- [#44](https://github.com/nerdslabs/teiler/pull/44) [`2354bc8`](https://github.com/nerdslabs/teiler/commit/2354bc84590a0cb23ae677ad2242fe26027d4e82) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Add `withComponent` to styled components: `Button.withComponent(RouterLink)` creates a component with the same styles that renders `RouterLink` (or another element with `Button.withComponent('a')`), with props typed from the target

### Patch Changes

- [#60](https://github.com/nerdslabs/teiler/pull/60) [`c8c79ca`](https://github.com/nerdslabs/teiler/commit/c8c79ca936cd932e973383cab39a4508de524e34) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Include the README in the npm package.

- [#57](https://github.com/nerdslabs/teiler/pull/57) [`eb23afc`](https://github.com/nerdslabs/teiler/commit/eb23afce3dbf7b057ad3be3ab26f82c661a80979) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Support `css` templates interpolated directly, without a function (`${shared}`). They were inserted into the style sheet as a separate rule without a selector, and the component got the `css` id instead of the styles. Functions inside the `css` template get the props of the component.

- [#45](https://github.com/nerdslabs/teiler/pull/45) [`67335ba`](https://github.com/nerdslabs/teiler/commit/67335ba0890bed695016e77de566ef336a329636) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Join compiled CSS rules without a separator, so `dump()` and `extract()` return smaller CSS.

- [#58](https://github.com/nerdslabs/teiler/pull/58) [`fa351ee`](https://github.com/nerdslabs/teiler/commit/fa351ee0b1b4392d0dd0ab5bfa1e364d59bc02e5) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Publish ES modules only. The CommonJS build never worked: `exports.require` pointed to a missing `.cjs.ts` file, and with `"type": "module"` the `.cjs.js` file loaded as an empty ES module. `require('@teiler/core')` and `require('@teiler/vue')` now load the ES module build on Node.js 22.12 and later. The `types` condition comes first, `main` points to the ES module build, and the packages contain only `dist`.

- [#46](https://github.com/nerdslabs/teiler/pull/46) [`5f6d8ce`](https://github.com/nerdslabs/teiler/commit/5f6d8ced7865b9cfc8c295f8bd5cfb82611b5ebb) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Fix style sheet key collisions between components, globals and keyframes with the same body. A `global` or `keyframes` rule was silently skipped when a rule of another type with an identical body was already in the sheet (or hydrated). Sheet keys of globals and keyframes change, so the server and the client must use the same version of `@teiler/core` for `extract()` and `hydrate()` to match.

## 0.1.1

### Patch Changes

- [#39](https://github.com/nerdslabs/teiler/pull/39) [`ac1f245`](https://github.com/nerdslabs/teiler/commit/ac1f245622fd90ba347005f08fcd2b3c24b9da38) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Interpolating a component or pattern whose props differ from the props of the styled component typechecks, also inside `css`

- [#39](https://github.com/nerdslabs/teiler/pull/39) [`ac1f245`](https://github.com/nerdslabs/teiler/commit/ac1f245622fd90ba347005f08fcd2b3c24b9da38) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Interpolation functions may return numbers and `null`, and functions can be interpolated inside `css`, typed with the props of the component

## 0.1.0

### Minor Changes

- [#23](https://github.com/nerdslabs/teiler/pull/23) [`dac537f`](https://github.com/nerdslabs/teiler/commit/dac537f2689330d69f91f7be237f52d7dd27d033) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Add `as` prop to Vue components to render them as a different element or component, and allow overriding the element when extending a component or pattern (`component.a(Button)`, `pattern.a(ButtonPattern)`)

### Patch Changes

- [#26](https://github.com/nerdslabs/teiler/pull/26) [`28e0f15`](https://github.com/nerdslabs/teiler/commit/28e0f1561b7fcd68e13961ccbedbba631b3e67fa) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Keep `0` interpolations in styles, don't crash on functions returning `null`, and include interpolated values in keyframes id so keyframes with the same template but different values no longer share an animation name

- [#22](https://github.com/nerdslabs/teiler/pull/22) [`6c6bb2c`](https://github.com/nerdslabs/teiler/commit/6c6bb2c79a6ee207af6e577a98f5c4cb95e8d5e5) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Migrate to pnpm + rolldown, update all deps

- [#24](https://github.com/nerdslabs/teiler/pull/24) [`b80ec31`](https://github.com/nerdslabs/teiler/commit/b80ec31ae54cc6e4d9ad96b312503f3a9802bc05) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Minify published bundles again and keep `@teiler/core` types external in adapter typings, so `DefaultTheme` augmentation works

- [#27](https://github.com/nerdslabs/teiler/pull/27) [`6ee928d`](https://github.com/nerdslabs/teiler/commit/6ee928d0926f56c4b860da37254ef7dc5fc61e48) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Skip stylis when a rule is already in the sheet, and add `nonce` option to `createStyleSheet` for strict CSP: set on the browser `<style>` tag and returned from `extract()` for server rendering

- [#23](https://github.com/nerdslabs/teiler/pull/23) [`dac537f`](https://github.com/nerdslabs/teiler/commit/dac537f2689330d69f91f7be237f52d7dd27d033) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Include element tag in style definition id, so components with the same styles but different elements no longer share a selector. Definition ids (`t…` class names) change for all components

## 0.0.28

### Patch Changes

- [#17](https://github.com/nerdslabs/teiler/pull/17) [`ee02204`](https://github.com/nerdslabs/teiler/commit/ee02204db86c00c50128593e0cddd3caefc0feb7) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Update dependencies

## 0.0.27

### Patch Changes

- [`7e1b1e2`](https://github.com/nerdslabs/teiler/commit/7e1b1e22f262dfd7b81c7e97637f7cd374874ed9) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Fix `css` helper function types

## 0.0.26

### Patch Changes

- [#13](https://github.com/nerdslabs/teiler/pull/13) [`f492af9`](https://github.com/nerdslabs/teiler/commit/f492af9abb94f9e96844c1dacaaa23032cf926f4) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Change `strict` to `true` in `tsconfig.json`

- [`38f8858`](https://github.com/nerdslabs/teiler/commit/38f8858426d63b283ae20131e82a9ad7dab3c8a9) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Fix `DefaultTheme` interface

- [#15](https://github.com/nerdslabs/teiler/pull/15) [`679c940`](https://github.com/nerdslabs/teiler/commit/679c940a139c5db962324fa953a51fce4c5d1ab4) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Update dependencies

## 0.0.25

### Patch Changes

- [#9](https://github.com/nerdslabs/teiler/pull/9) [`bd16828`](https://github.com/nerdslabs/teiler/commit/bd168288b500a340ae922fa0e6d97ade3be0bdc0) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Update dependencies

## 0.0.24

### Patch Changes

- [`46272a7`](https://github.com/nerdslabs/teiler/commit/46272a7fe16ed077053ba75c2a2a299a77d55751) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Drop deprecated HTML elements

## 0.0.23

### Patch Changes

- [`2416abd`](https://github.com/nerdslabs/teiler/commit/2416abd6e7c91ca77c4d27f3541588eadd795dd4) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Add `hydrate` method to style sheet

## 0.0.22

### Patch Changes

- Make `theme` in `Arguments` optional

- Fix `compile` function when property is object

- Fix typings

## 0.0.21

### Patch Changes

- Remove debug `console.log`

## 0.0.20

### Patch Changes

- Fix missing definitions from `css` function compile

## 0.0.19

### Patch Changes

- Support for `class` attribute

## 0.0.18

### Patch Changes

- Add typing to package.json exports

## 0.0.17

### Patch Changes

- Fix typing of `ThemeProvider.svelte`

## 0.0.16

### Patch Changes

- Update YARN version

## 0.0.15

### Patch Changes

- Delegate all events

## 0.0.14

### Patch Changes

- Add missing tests
- Enforce correct nested component/pattern selector usage
- Update dependencies

## 0.0.13

### Patch Changes

- Adjust typing for `css` function

## 0.0.12

### Patch Changes

- Add `css` function and integrate with compiler

## 0.0.11

### Patch Changes

- Handle Pattern as nested selector

## 0.0.10

### Patch Changes

- Add missing generated `d.ts` files

## 0.0.9

### Patch Changes

- Add missing `Pattern` type export

## 0.0.8

### Patch Changes

- feat: component as nested selector

## 0.0.7

### Patch Changes

- feat: rewrite HTML tags, modify `svelte` exports

## 0.0.6

### Patch Changes

- feat: add a Themes support

## 0.0.5

### Patch Changes

- Changed method of compilation to return a single class name

## 0.0.4

### Patch Changes

- feat: add a `keyframes` support
