<script lang="ts">
  import type { Style } from '@teiler/core'
  import { stylesToCSS } from '@teiler/core'

  export let tag: string = 'div'

  export let styles: Array<Style<unknown>>

  $: classes = stylesToCSS(styles, $$restProps)
</script>

<svelte:element this={tag} class={classes.join(' ')} on:click><slot /></svelte:element>
