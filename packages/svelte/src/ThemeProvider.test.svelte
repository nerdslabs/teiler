<script lang="ts">
  import { DefaultTheme } from "@teiler/core"
  import ThemeProvider from "./ThemeProvider.svelte"
  import { component } from "./component"

  const theme: DefaultTheme = {
    fontColor: 'green'
  }

  const TestComponent = component`
    color: ${({theme}) => theme.fontColor};
  `
  
</script>
<ThemeProvider {theme}>
  <TestComponent>abc</TestComponent>
</ThemeProvider>
  