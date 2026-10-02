---
'@teiler/core': patch
---

Support `css` templates interpolated directly, without a function (`${shared}`). They were inserted into the style sheet as a separate rule without a selector, and the component got the `css` id instead of the styles. Functions inside the `css` template get the props of the component.
