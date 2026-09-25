---
'@teiler/core': patch
'@teiler/vue': patch
'@teiler/svelte': patch
---

Skip stylis when a rule is already in the sheet, and add `nonce` option to `createStyleSheet` for strict CSP: set on the browser `<style>` tag and returned from `extract()` for server rendering
