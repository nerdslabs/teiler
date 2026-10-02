---
'@teiler/core': minor
'@teiler/vue': minor
'@teiler/svelte': minor
'@teiler/unplugin': minor
---

Name components. `withConfig({ displayName })` (or `withConfig(componentId, displayName)`) prefixes the component id, so the element of `Button` has the class `Button-t1x2y3z` instead of `t1x2y3z`, and sets the Vue component name shown in devtools. Components with different names no longer share an id. `@teiler/unplugin` adds the variable name in development (`displayName` option, same detection as `minify` and `pure`), names set by hand are kept.
