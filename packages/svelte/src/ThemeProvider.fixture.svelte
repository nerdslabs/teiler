<script lang="ts">
  import type { DefaultTheme } from '@teiler/core'

  import ThemeProvider from './ThemeProvider.svelte'
  import { component } from './component'

  const { theme = { fontColor: 'green' } }: { theme?: DefaultTheme } = $props()

  const TestComponent = component`
    color: ${({ theme }) => theme.fontColor};
  `
</script>

<ThemeProvider {theme}>
  <TestComponent>abc</TestComponent>
</ThemeProvider>
