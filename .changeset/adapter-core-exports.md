---
'@teiler/vue': patch
'@teiler/svelte': patch
---

Export `css`, `createStyleSheet`, `sew` and the `DefaultTheme` type, so the theme can be typed with `declare module '@teiler/vue'` (or `'@teiler/svelte'`) without installing `@teiler/core`
