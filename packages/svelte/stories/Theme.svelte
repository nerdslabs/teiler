<script context="module" lang="ts">
  export type CustomTheme = {
    fontColor: string,
  }
</script>
<script lang="ts">
  import ThemeProvider from '../src/ThemeProvider.svelte'
  import { Component } from './theme'

  export let theme: CustomTheme = {
    fontColor: 'red',
  }
</script>

<ThemeProvider {theme}>
  <Component>Some test text</Component>
</ThemeProvider>
