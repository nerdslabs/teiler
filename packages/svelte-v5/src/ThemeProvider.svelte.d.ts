import type { SvelteComponent } from 'svelte'
import type { DefaultTheme } from '@teiler/core'

type ThemeProvider = SvelteComponent<{ theme: DefaultTheme }>

export const context: string = 'THEME'
export default ThemeProvider
