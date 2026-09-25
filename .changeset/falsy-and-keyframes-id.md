---
'@teiler/core': patch
'@teiler/vue': patch
'@teiler/svelte': patch
---

Keep `0` interpolations in styles, don't crash on functions returning `null`, and include interpolated values in keyframes id so keyframes with the same template but different values no longer share an animation name
