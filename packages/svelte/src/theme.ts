import type { DefaultTheme } from '@teiler/core'

import { getContext, setContext } from 'svelte'

export const Theme = 'THEME'

export type ThemeGetter = () => DefaultTheme

export function setTheme(theme: ThemeGetter): void {
  setContext<ThemeGetter>(Theme, theme)
}

export function getTheme(): ThemeGetter | undefined {
  return getContext<ThemeGetter | undefined>(Theme)
}
