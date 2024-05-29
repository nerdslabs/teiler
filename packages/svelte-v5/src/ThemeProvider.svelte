<script context="module">
  export const context = 'THEME'
</script>

<script lang="ts">
  import type { DefaultTheme } from '@teiler/core'
  import { setContext } from 'svelte'
  import { writable, type Writable } from 'svelte/store'

  export let theme: DefaultTheme

  const themeStore = writable<DefaultTheme>(theme)

  setContext<Writable<DefaultTheme>>(context, themeStore)

  $: themeStore.set(theme)
</script>

<slot />
