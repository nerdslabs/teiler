---
'@teiler/core': minor
'@teiler/vue': minor
'@teiler/svelte': minor
'@teiler/unplugin': minor
---

Give components stable ids. Component ids are hashed from the tag and the template strings, so components with the same strings and different interpolations, or an empty extension and its base, shared an id, and a `${A}` selector matched `B` too.

- `withConfig({ componentId })` on `component`, `component.<tag>`, extensions (`component(Button)`), `global` and `pattern` hashes the id from the given `componentId` instead.
- `@teiler/unplugin` adds a `componentId` to every component, global and pattern, from the package name, the file path in the package and the variable name, in every mode (`componentId` option). Templates with a `componentId` set by hand are left as they are.
- Without the plugin, a component used as a selector while another component shares its id logs a warning.
