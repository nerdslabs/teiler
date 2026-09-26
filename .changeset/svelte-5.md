---
'@teiler/svelte': minor
---

Support Svelte 5 (CSR and SSR) and drop Svelte 4. `svelte` peer dependency is now `^5.16.0`. The package ships `.svelte` source through the `svelte` export condition instead of pre-compiled UMD/CJS/ESM bundles, so it needs a Svelte-aware bundler (Vite/SvelteKit, rollup-plugin-svelte, …). Event handlers are passed as props (`onclick`) instead of `on:click`, and the `THEME` context now holds a getter (`() => theme`) instead of a writable store.
