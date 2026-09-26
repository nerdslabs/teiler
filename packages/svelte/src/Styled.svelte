<script lang="ts">
  import type { DefaultTheme, HTMLElements, StyleDefinition } from '@teiler/core'
  import type { Snippet } from 'svelte'

  import { insert } from '@teiler/core'
  import { getStyleSheet } from './sheet.js'
  import { getTheme } from './theme.js'

  type Props = {
    styleDefinition: StyleDefinition<HTMLElements, unknown>
    class?: string
    children?: Snippet
    [key: string]: unknown
  }

  const { styleDefinition, class: className, children, ...props }: Props = $props()

  const sheet = getStyleSheet()
  const theme = getTheme()

  const styleClassName = $derived(insert(sheet, styleDefinition, { ...props, theme: theme?.() ?? ({} as DefaultTheme) }))

  const attributes = $derived(Object.fromEntries(Object.entries(props).filter(([key]) => key[0] !== '_')))
</script>

{#if styleClassName && styleDefinition.tag}
  <svelte:element this={styleDefinition.tag} class={[styleClassName, styleDefinition.id, className]} {...attributes}>{@render children?.()}</svelte:element>
{/if}
