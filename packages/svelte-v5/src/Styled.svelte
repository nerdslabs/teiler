<script lang="ts">
  import type { DefaultTheme, HTMLElements, Sheet, StyleDefinition } from '@teiler/core'
  import type { Writable } from 'svelte/store'

  import { createStyleSheet, insert } from '@teiler/core'
  import { getContext } from 'svelte'
  import { context } from './ThemeProvider.svelte'
  import { getStyleSheet } from './sheet'

  const { styleDefinition, className, children, ...restProps }: { styleDefinition: StyleDefinition<HTMLElements, unknown>, className: string, children: any } = $props()

  const sheet: Sheet = getStyleSheet()

  const theme: Writable<DefaultTheme> = getContext(context)

  const styleClassName = $derived(insert(sheet, styleDefinition, { ...restProps, theme: $theme }))
  
  const filtredPropsEntries = $derived(Object.entries(restProps).filter(([key, _value]) => key[0] !== '_' && key !== 'class'))
  const filtredProps = $derived(Object.fromEntries(filtredPropsEntries))
  
  const generatedClassName = $derived(className ? `${styleClassName} ${styleDefinition.id} ${className}` : `${styleClassName} ${styleDefinition.id}`)
</script>

<svelte:element
  this={styleDefinition.tag}
  class={generatedClassName}
  {...filtredProps}>
  {@render children()}
</svelte:element>
