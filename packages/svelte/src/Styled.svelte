<script lang="ts">
  import { type Style, type Compile, type Sheet } from '@teiler/core'
  import { getStyleSheet } from './sheet'
  import { getContext } from 'svelte'
  import { context } from './ThemeProvider.svelte'

  export let tag: string = 'div'

  export let styles: Array<Style<unknown>>
  export let compile: Compile

  const sheet: Sheet = getStyleSheet()

  const theme = getContext(context);

  $: classes = compile(sheet, styles, {...$$restProps, theme}) as string[]

  $: filtredPropsEntries = Object.entries($$restProps).filter(([key, _value]) => key[0] !== "_")
  $: filtredProps = Object.fromEntries(filtredPropsEntries)
</script>

<svelte:element this={tag} class={classes.join(' ')} on:click {...filtredProps}><slot /></svelte:element>
