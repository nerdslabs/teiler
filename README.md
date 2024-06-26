# Teiler 🪡 (ˈteɪlər - tailor)

![Discord](https://img.shields.io/discord/1125416414069661698?logo=discord&link=https%3A%2F%2Fdiscord.gg%2FJ6Sv9sQ64t)

**Teiler** is an open source library that simplifies the creation of stylish components for various frameworks.

Currently in the **alpha phase**, the library is actively being developed and improved.

Join our community on our [Discord Server](https://discord.gg/J6Sv9sQ64t) to stay informed about the latest developments, exchange ideas, and connect with fellow developers. We are continuously working on expanding our support to include more frameworks, allowing developers to effortlessly create components across various environments. 

## Features

- 🧰 **Multiple** frameworks support
- 🪡 **Patterns system** for UI libraries
- 🚉 **Server-Side Rendering** (SSR)*
- ⚡ **Babel** not required

\* Not all frameworks, more details [here](#frameworks)

### Example

```typescript
import { component } from '@teiler/framework'

const Button = component.button<{
  _primary: boolean
}>`
  display: inline-block;
  border-radius: 4px;
  font-size: 0.8rem;
  line-height: 1.5rem;
  background: transparent;
  box-shadow: 0 0 0 3px #CBCBCB inset;

  ${({ _primary }) =>
    _primary && `
      color: #fff;
      box-shadow: none;
      background: #CBCBCB;
    `
  }
`
```

## Frameworks

These are the frameworks we are currently working on and planning to support in the future.

| Framework     | CSR   | SSR  | More details |
| :---          | :---- | :--- | :----------- |
| Svelte v4     | ✓     | ✕    | [README](https://github.com/nerdslabs/teiler/blob/master/packages/svelte/README.md) |
| VueJS         | ✓     | ✓    | [README](https://github.com/nerdslabs/teiler/blob/master/packages/vue/README.md) |
| SolidJS       | ✕     | ✕    | ---          |
| React         | ✕     | ✕    | ---          |

> [!NOTE]
> CSR - Client Side Rendering*\
> SSR - Server Side Rendering*

## Sew a Pattern

This tool simplifies the creation of consistent and reusable visual styles for components across various web frameworks. It provides a pattern-based approach, where patterns serve as blueprints for defining the visual style of components.

### Example

```typescript
// Pattern file in ui kit library
import { pattern } from '@teiler/core'

const ButtonPattern = pattern.button`
  display: inline-block;
  border-radius: 4px;
  font-size: 0.8rem;
  line-height: 1.5rem;
  background: transparent;
  box-shadow: 0 0 0 3px #CBCBCB inset;
`

export default ButtonPattern

// Usage of Pattern
import { ButtonPattern } from 'some-uikit-library'
import { sew } from '@teiler/core'
import { createComponent } from '@teiler/framework'

const Button = sew(ButtonPattern, createComponent)

export default Button
```

## Packages

| Package       | Download | Size
| :---          | :------ | :---- |
| Core          | ![npm](https://img.shields.io/npm/dm/%40teiler%2Fcore) | ![npm bundle size](https://img.shields.io/bundlephobia/min/%40teiler%2Fcore) |
| Svelte        | ![npm](https://img.shields.io/npm/dm/%40teiler%2Fsvelte) | ![npm bundle size](https://img.shields.io/bundlephobia/min/%40teiler%2Fsvelte) |
| Vue           | ![npm](https://img.shields.io/npm/dm/%40teiler%2Fvue) | ![npm bundle size](https://img.shields.io/bundlephobia/min/%40teiler%2Fvue) |