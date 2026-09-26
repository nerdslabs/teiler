---
'@teiler/core': patch
'@teiler/vue': patch
'@teiler/svelte': patch
---

Include element tag in style definition id, so components with the same styles but different elements no longer share a selector. Definition ids (`t…` class names) change for all components
