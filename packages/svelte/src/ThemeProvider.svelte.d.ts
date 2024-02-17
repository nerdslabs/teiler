import type { SvelteComponent } from 'svelte'
import type { DefaultTheme } from '@teiler/core'

export const context: string = 'THEME'
export default class ThemeProvider extends SvelteComponent<{ theme: DefaultTheme }> {}
