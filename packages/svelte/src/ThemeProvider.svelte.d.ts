import type { SvelteComponent } from 'svelte'
import type { DefaultTheme } from '@teiler/core'
export default class ThemeProvider extends SvelteComponent<{ theme: DefaultTheme }> {}
