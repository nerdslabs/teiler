---
'@teiler/core': patch
'@teiler/vue': patch
---

Publish ES modules only. The CommonJS build never worked: `exports.require` pointed to a missing `.cjs.ts` file, and with `"type": "module"` the `.cjs.js` file loaded as an empty ES module. `require('@teiler/core')` and `require('@teiler/vue')` now load the ES module build on Node.js 22.12 and later. The `types` condition comes first, `main` points to the ES module build, and the packages contain only `dist`.
