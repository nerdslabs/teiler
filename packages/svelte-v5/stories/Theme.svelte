<script lang="ts">
  import type { CustomTheme } from './customTheme'

  import ThemeProvider from '../src/ThemeProvider.svelte'
  import { Component } from './theme'

  export let theme: CustomTheme = {
    fontColor: 'red',
  }
</script>

<ThemeProvider {theme}>
  <Component>Some test text</Component>
</ThemeProvider>
