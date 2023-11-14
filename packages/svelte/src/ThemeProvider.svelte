<script context="module">
  export const context = 'THEME'
</script>

<script lang="ts">
  import type { DefaultTheme } from '@teiler/core'
  import { setContext } from 'svelte'

  export let theme: DefaultTheme

  setContext<DefaultTheme>(context, theme)
</script>

<slot />
