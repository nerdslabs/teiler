# @teiler/vue

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
