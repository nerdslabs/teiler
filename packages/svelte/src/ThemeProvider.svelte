<script lang="ts">
  import type { DefaultTheme } from '@teiler/core'
  import type { Snippet } from 'svelte'

  import { setTheme } from './theme.js'

  const { theme, children }: { theme: DefaultTheme; children?: Snippet } = $props()

  setTheme(() => theme)
</script>

{@render children?.()}
