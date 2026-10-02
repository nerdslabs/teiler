# @teiler/vue

## 0.2.0

### Minor Changes

- [#59](https://github.com/nerdslabs/teiler/pull/59) [`a025b28`](https://github.com/nerdslabs/teiler/commit/a025b2889a592a3f171febd627760a5a104986d7) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Give components stable ids. Component ids are hashed from the tag and the template strings, so components with the same strings and different interpolations, or an empty extension and its base, shared an id, and a `${A}` selector matched `B` too.

  - `withConfig({ componentId })` (or `withConfig(componentId)`) on `component`, `component.<tag>`, extensions (`component(Button)`), `global` and `pattern` hashes the id from the given `componentId` instead.
  - `@teiler/unplugin` adds a `componentId` to every component, global and pattern, from the package name, the file path in the package and the variable name, in every mode (`componentId` option). Templates with a `componentId` set by hand are left as they are.
  - Without the plugin, a component used as a selector while another component shares its id logs a warning.

- [#60](https://github.com/nerdslabs/teiler/pull/60) [`c8c79ca`](https://github.com/nerdslabs/teiler/commit/c8c79ca936cd932e973383cab39a4508de524e34) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Name components. `withConfig({ displayName })` (or `withConfig(componentId, displayName)`) prefixes the component id, so the element of `Button` has the class `Button-t1x2y3z` instead of `t1x2y3z`, and sets the Vue component name shown in devtools. Components with different names no longer share an id. `@teiler/unplugin` adds the variable name in development (`displayName` option, same detection as `minify` and `pure`), names set by hand are kept.

- [#44](https://github.com/nerdslabs/teiler/pull/44) [`2354bc8`](https://github.com/nerdslabs/teiler/commit/2354bc84590a0cb23ae677ad2242fe26027d4e82) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Add `withComponent` to styled components: `Button.withComponent(RouterLink)` creates a component with the same styles that renders `RouterLink` (or another element with `Button.withComponent('a')`), with props typed from the target

### Patch Changes

- [#58](https://github.com/nerdslabs/teiler/pull/58) [`fa351ee`](https://github.com/nerdslabs/teiler/commit/fa351ee0b1b4392d0dd0ab5bfa1e364d59bc02e5) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Publish ES modules only. The CommonJS build never worked: `exports.require` pointed to a missing `.cjs.ts` file, and with `"type": "module"` the `.cjs.js` file loaded as an empty ES module. `require('@teiler/core')` and `require('@teiler/vue')` now load the ES module build on Node.js 22.12 and later. The `types` condition comes first, `main` points to the ES module build, and the packages contain only `dist`.
- Updated dependencies [[`a025b28`](https://github.com/nerdslabs/teiler/commit/a025b2889a592a3f171febd627760a5a104986d7), [`c8c79ca`](https://github.com/nerdslabs/teiler/commit/c8c79ca936cd932e973383cab39a4508de524e34), [`eb23afc`](https://github.com/nerdslabs/teiler/commit/eb23afce3dbf7b057ad3be3ab26f82c661a80979), [`67335ba`](https://github.com/nerdslabs/teiler/commit/67335ba0890bed695016e77de566ef336a329636), [`c8c79ca`](https://github.com/nerdslabs/teiler/commit/c8c79ca936cd932e973383cab39a4508de524e34), [`fa351ee`](https://github.com/nerdslabs/teiler/commit/fa351ee0b1b4392d0dd0ab5bfa1e364d59bc02e5), [`5f6d8ce`](https://github.com/nerdslabs/teiler/commit/5f6d8ced7865b9cfc8c295f8bd5cfb82611b5ebb), [`2354bc8`](https://github.com/nerdslabs/teiler/commit/2354bc84590a0cb23ae677ad2242fe26027d4e82)]:
  - @teiler/core@0.2.0

## 0.1.3

### Patch Changes

- [#40](https://github.com/nerdslabs/teiler/pull/40) [`4967ae7`](https://github.com/nerdslabs/teiler/commit/4967ae737a588d3b2db053955e8aede9f91bd39d) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Export `css`, `createStyleSheet`, `sew` and the `DefaultTheme` type, so the theme can be typed with `declare module '@teiler/vue'` (or `'@teiler/svelte'`) without installing `@teiler/core`

- [#38](https://github.com/nerdslabs/teiler/pull/38) [`214e254`](https://github.com/nerdslabs/teiler/commit/214e2544dacc989f18a2b98cae4e75c1025fa302) Thanks [@drozdzynski](https://github.com/drozdzynski)! - The `as` prop is inferred in TSX: `<Button as="a" href="/docs" />` and `<Button as={RouterLink} to="/home" />` typecheck without an explicit type argument
- Updated dependencies [[`ac1f245`](https://github.com/nerdslabs/teiler/commit/ac1f245622fd90ba347005f08fcd2b3c24b9da38), [`ac1f245`](https://github.com/nerdslabs/teiler/commit/ac1f245622fd90ba347005f08fcd2b3c24b9da38)]:
  - @teiler/core@0.1.1

## 0.1.2

### Patch Changes

- [#36](https://github.com/nerdslabs/teiler/pull/36) [`a80e665`](https://github.com/nerdslabs/teiler/commit/a80e6659d34aa577812a53967a75bc3ceb702ad4) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Styled components can be assigned to `Meta.component` in Storybook again

## 0.1.1

### Patch Changes

- [#32](https://github.com/nerdslabs/teiler/pull/32) [`69220b2`](https://github.com/nerdslabs/teiler/commit/69220b29411f6718916c87ce30edf7c990c7b454) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Type props from the `as` prop: `<Button as="a" href="/docs">` and `<Button :as="RouterLink" to="/home">` type-check, required props of the `as` component are enforced, and an unknown tag in `as` is reported. Without `as`, props are typed from the element of the styled component as before. `global` components no longer accept element attributes.

  Styled components are now typed as a generic component constructor instead of `DefineComponent`. `InstanceType<typeof Button>` and template refs keep the exposed `element: HTMLElement | null`.

- [#32](https://github.com/nerdslabs/teiler/pull/32) [`69220b2`](https://github.com/nerdslabs/teiler/commit/69220b29411f6718916c87ce30edf7c990c7b454) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Styled components get a component name from their tag (`StyledButton`, `StyledGlobal` for `global`), so Vue Devtools and warnings show it instead of `Anonymous`.

## 0.1.0

### Minor Changes

- [#23](https://github.com/nerdslabs/teiler/pull/23) [`dac537f`](https://github.com/nerdslabs/teiler/commit/dac537f2689330d69f91f7be237f52d7dd27d033) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Add `as` prop to Vue components to render them as a different element or component, and allow overriding the element when extending a component or pattern (`component.a(Button)`, `pattern.a(ButtonPattern)`)

### Patch Changes

- [#26](https://github.com/nerdslabs/teiler/pull/26) [`28e0f15`](https://github.com/nerdslabs/teiler/commit/28e0f1561b7fcd68e13961ccbedbba631b3e67fa) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Keep `0` interpolations in styles, don't crash on functions returning `null`, and include interpolated values in keyframes id so keyframes with the same template but different values no longer share an animation name

- [#22](https://github.com/nerdslabs/teiler/pull/22) [`6c6bb2c`](https://github.com/nerdslabs/teiler/commit/6c6bb2c79a6ee207af6e577a98f5c4cb95e8d5e5) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Migrate to pnpm + rolldown, update all deps

- [#24](https://github.com/nerdslabs/teiler/pull/24) [`b80ec31`](https://github.com/nerdslabs/teiler/commit/b80ec31ae54cc6e4d9ad96b312503f3a9802bc05) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Minify published bundles again and keep `@teiler/core` types external in adapter typings, so `DefaultTheme` augmentation works

- [#27](https://github.com/nerdslabs/teiler/pull/27) [`6ee928d`](https://github.com/nerdslabs/teiler/commit/6ee928d0926f56c4b860da37254ef7dc5fc61e48) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Skip stylis when a rule is already in the sheet, and add `nonce` option to `createStyleSheet` for strict CSP: set on the browser `<style>` tag and returned from `extract()` for server rendering

- [#23](https://github.com/nerdslabs/teiler/pull/23) [`dac537f`](https://github.com/nerdslabs/teiler/commit/dac537f2689330d69f91f7be237f52d7dd27d033) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Include element tag in style definition id, so components with the same styles but different elements no longer share a selector. Definition ids (`t…` class names) change for all components

- [#22](https://github.com/nerdslabs/teiler/pull/22) [`6c6bb2c`](https://github.com/nerdslabs/teiler/commit/6c6bb2c79a6ee207af6e577a98f5c4cb95e8d5e5) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Declare `vue` as a peer dependency
- Updated dependencies [[`28e0f15`](https://github.com/nerdslabs/teiler/commit/28e0f1561b7fcd68e13961ccbedbba631b3e67fa), [`6c6bb2c`](https://github.com/nerdslabs/teiler/commit/6c6bb2c79a6ee207af6e577a98f5c4cb95e8d5e5), [`dac537f`](https://github.com/nerdslabs/teiler/commit/dac537f2689330d69f91f7be237f52d7dd27d033), [`b80ec31`](https://github.com/nerdslabs/teiler/commit/b80ec31ae54cc6e4d9ad96b312503f3a9802bc05), [`6ee928d`](https://github.com/nerdslabs/teiler/commit/6ee928d0926f56c4b860da37254ef7dc5fc61e48), [`dac537f`](https://github.com/nerdslabs/teiler/commit/dac537f2689330d69f91f7be237f52d7dd27d033)]:
  - @teiler/core@0.1.0

## 0.0.10

### Patch Changes

- [#20](https://github.com/nerdslabs/teiler/pull/20) [`175a715`](https://github.com/nerdslabs/teiler/commit/175a715f332db053585e2a7813627541ea3f8ed8) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Expose `element` ref from styled component

## 0.0.9

### Patch Changes

- [#19](https://github.com/nerdslabs/teiler/pull/19) [`339d5ef`](https://github.com/nerdslabs/teiler/commit/339d5ef6312ec24858edd011fdd77dacf24355ca) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Fix issue with className

- [#17](https://github.com/nerdslabs/teiler/pull/17) [`ee02204`](https://github.com/nerdslabs/teiler/commit/ee02204db86c00c50128593e0cddd3caefc0feb7) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Update dependencies

- Updated dependencies [[`ee02204`](https://github.com/nerdslabs/teiler/commit/ee02204db86c00c50128593e0cddd3caefc0feb7)]:
  - @teiler/core@0.0.28

## 0.0.8

### Patch Changes

- Updated dependencies [[`7e1b1e2`](https://github.com/nerdslabs/teiler/commit/7e1b1e22f262dfd7b81c7e97637f7cd374874ed9)]:
  - @teiler/core@0.0.27

## 0.0.7

### Patch Changes

- [#13](https://github.com/nerdslabs/teiler/pull/13) [`f492af9`](https://github.com/nerdslabs/teiler/commit/f492af9abb94f9e96844c1dacaaa23032cf926f4) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Change `strict` to `true` in `tsconfig.json`

- [#15](https://github.com/nerdslabs/teiler/pull/15) [`679c940`](https://github.com/nerdslabs/teiler/commit/679c940a139c5db962324fa953a51fce4c5d1ab4) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Update dependencies

- Updated dependencies [[`f492af9`](https://github.com/nerdslabs/teiler/commit/f492af9abb94f9e96844c1dacaaa23032cf926f4), [`38f8858`](https://github.com/nerdslabs/teiler/commit/38f8858426d63b283ae20131e82a9ad7dab3c8a9), [`679c940`](https://github.com/nerdslabs/teiler/commit/679c940a139c5db962324fa953a51fce4c5d1ab4)]:
  - @teiler/core@0.0.26

## 0.0.6

### Patch Changes

- [#9](https://github.com/nerdslabs/teiler/pull/9) [`bd16828`](https://github.com/nerdslabs/teiler/commit/bd168288b500a340ae922fa0e6d97ade3be0bdc0) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Update dependencies

- [`3caecbe`](https://github.com/nerdslabs/teiler/commit/3caecbefaa4c0fa214be0d551bd16a6ded2bc128) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Fix typescript error `TS2590`

- Updated dependencies [[`bd16828`](https://github.com/nerdslabs/teiler/commit/bd168288b500a340ae922fa0e6d97ade3be0bdc0)]:
  - @teiler/core@0.0.25

## 0.0.5

### Patch Changes

- [`8b9f3f7`](https://github.com/nerdslabs/teiler/commit/8b9f3f7958262b9bfa10aee5fc4fc846682a60e1) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Fix elements attributes per type

- Updated dependencies [[`46272a7`](https://github.com/nerdslabs/teiler/commit/46272a7fe16ed077053ba75c2a2a299a77d55751)]:
  - @teiler/core@0.0.24

## 0.0.4

### Patch Changes

- [`585e821`](https://github.com/nerdslabs/teiler/commit/585e8212fb961bf20919de90bea9653155c2ebd8) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Fix `inject` issue in styled component

- [`83c608c`](https://github.com/nerdslabs/teiler/commit/83c608c5dafe0ba99562a0b9752197518c301de2) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Fix style sheet default value

## 0.0.3

### Patch Changes

- [`561aaa4`](https://github.com/nerdslabs/teiler/commit/561aaa4b1ffaba4264551501adcdd01655b108eb) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Lazy initialize StyleSheet for better handling

- [`bb70b5f`](https://github.com/nerdslabs/teiler/commit/bb70b5f6a376b67c4d8e0fea7bcf8fbe3f2ae4b7) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Fix typings for TSX

- Updated dependencies [[`2416abd`](https://github.com/nerdslabs/teiler/commit/2416abd6e7c91ca77c4d27f3541588eadd795dd4)]:
  - @teiler/core@0.0.23

## 0.0.2

### Patch Changes

- [`5083485`](https://github.com/nerdslabs/teiler/commit/508348594b2dacbd62942e600e7b782257dcbf5b) Thanks [@drozdzynski](https://github.com/drozdzynski)! - Rename style sheet context name to `STYLE_SHEET`

## 0.0.1

### Patch Changes

- Vue support
