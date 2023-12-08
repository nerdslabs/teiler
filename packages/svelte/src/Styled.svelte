<script lang="ts">
  import type { DefaultTheme, HTMLElements, Sheet, StyleDefinition } from '@teiler/core'
  import { insert } from '@teiler/core'

  import { getStyleSheet } from './sheet'
  import { getContext } from 'svelte'
  import { context } from './ThemeProvider.svelte'

  export let styleDefinition: StyleDefinition<HTMLElements, unknown>

  const sheet: Sheet = getStyleSheet()

  const theme: DefaultTheme = getContext(context)

  const className = insert(sheet, styleDefinition, { ...$$restProps, theme })

  $: filtredPropsEntries = Object.entries($$restProps).filter(([key, _value]) => key[0] !== '_')
  $: filtredProps = Object.fromEntries(filtredPropsEntries)
</script>

<svelte:element this={styleDefinition.tag} class={className + ' ' + styleDefinition.id} on:click {...filtredProps}><slot /></svelte:element>
