---
'@teiler/vue': patch
---

Type props from the `as` prop: `<Button as="a" href="/docs">` and `<Button :as="RouterLink" to="/home">` type-check, required props of the `as` component are enforced, and an unknown tag in `as` is reported. Without `as`, props are typed from the element of the styled component as before. `global` components no longer accept element attributes.

Styled components are now typed as a generic component constructor instead of `DefineComponent`. `InstanceType<typeof Button>` and template refs keep the exposed `element: HTMLElement | null`.
