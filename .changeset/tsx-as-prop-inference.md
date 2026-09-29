---
'@teiler/vue': patch
---

The `as` prop is inferred in TSX: `<Button as="a" href="/docs" />` and `<Button as={RouterLink} to="/home" />` typecheck without an explicit type argument
