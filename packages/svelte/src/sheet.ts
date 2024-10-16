import { type Sheet, createStyleSheet } from '@teiler/core'
import { getContext } from 'svelte'

export let styleSheet: Sheet | null = null

export const StyleSheet = 'STYLE_SHEET'

export function getStyleSheet(): Sheet {
  const fromContext = getContext<Sheet>(StyleSheet)

  if (fromContext) {
    return fromContext
  }

  if (styleSheet === null) {
    styleSheet = createStyleSheet({})
  }

  return styleSheet
}
