<script lang="ts">
  import type { Style, Compile } from '@teiler/core'

  export let tag: string = 'div'

  export let styles: Array<Style<unknown>>
  export let compile: Compile

  $: classes = compile(styles, $$restProps)

  $: filtredPropsEntries = Object.entries($$restProps).filter(([key, _value]) => key[0] !== "_")
  $: filtredProps = Object.fromEntries(filtredPropsEntries)
</script>

<svelte:element this={tag} class={classes.join(' ')} on:click {...filtredProps}><slot /></svelte:element>
