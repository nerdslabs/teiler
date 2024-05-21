# Teiler 🪡 (ˈteɪlər - tailor)

![Discord](https://img.shields.io/discord/1125416414069661698?logo=discord&link=https%3A%2F%2Fdiscord.gg%2FJ6Sv9sQ64t)

**Teiler** is an open source library that simplifies the creation of stylish components for various frameworks.

Currently in the **alpha phase**, the library is actively being developed and improved.

Join our community on our [Discord Server](https://discord.gg/J6Sv9sQ64t) to stay informed about the latest developments, exchange ideas, and connect with fellow developers. We are continuously working on expanding our support to include more frameworks, allowing developers to effortlessly create components across various environments. 

### Example

```typescript
import { component } from '@teiler/vue'

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

## Keyframes

```typescript
import { component, keyframes } from '@teiler/vue'

const bouncing = keyframes`
  from, 20%, 53%, 80%, to {
    transform: translate3d(0,0,0);
  }

  40%, 43% {
    transform: translate3d(0, -40px, 0);
  }

  70% {
    transform: translate3d(0, -15px, 0);
  }

  90% {
    transform: translate3d(0,-4px,0);
  }
`

const Button = component.button<{}>`
  animation: ${bouncing} 1s ease infinite;
  display: inline-block;
  border-radius: 4px;
  font-size: 0.8rem;
  line-height: 1.5rem;
  background: transparent;
  box-shadow: 0 0 0 3px #CBCBCB inset;
`
```

## Theme

Example how to use themes.

```typescript
// Custom theme declaration (`theme.ts`)
export type CustomTheme = {
  fontColor: string;
};

// Main component inside application (`App.vue`)
<script setup lang="ts">
  import { ThemeProvider } from '@teiler/vue'
  import { CustomTheme } from './theme.ts'
  import { Component } from './theme'

  export let theme: CustomTheme = {
    fontColor: 'red',
  }
</script>

<template>
  <ThemeProvider :theme="theme">
    <Component>Some test text</Component>
  </ThemeProvider>
</template>

// Component with theme usage
import { component } from '@teiler/vue'

const Component = component.div`
  color: ${({ theme }) => theme.fontColor};
`

export { Component }
```

To add typing for Typescript applications you need to add `extend` inside declaration file (`d.ts`)
```typescript
import type { CustomTheme } from "./theme.ts";

declare module '@teiler/core' {
  export interface DefaultTheme extends CustomTheme {}
}
```

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
import { createComponent } from '@teiler/vue'

const Button = sew(ButtonPattern, createComponent)

export default Button
```
