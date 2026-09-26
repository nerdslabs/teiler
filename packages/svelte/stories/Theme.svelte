<script lang="ts">
  import type { CustomTheme } from './customTheme'

  import { ThemeProvider } from '@teiler/svelte'
  import { Component } from './theme'

  const { theme = { fontColor: 'red' } }: { theme?: CustomTheme } = $props()
</script>

<ThemeProvider {theme}>
  <Component>Some test text</Component>
</ThemeProvider>
