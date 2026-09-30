---
'@teiler/core': patch
---

Fix style sheet key collisions between components, globals and keyframes with the same body. A `global` or `keyframes` rule was silently skipped when a rule of another type with an identical body was already in the sheet (or hydrated). Sheet keys of globals and keyframes change, so the server and the client must use the same version of `@teiler/core` for `extract()` and `hydrate()` to match.
