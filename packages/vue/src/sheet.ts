import { type Sheet, createStyleSheet } from '@teiler/core'
import { inject } from 'vue'

export let styleSheet: Sheet | null = null

export const StyleSheet = 'STYLE_SHEET'

export function getStyleSheet(): Sheet {
  const provided = inject<Sheet | null>('STYLE_SHEET', () => null, true)

  if (provided) {
    return provided
  }

  if (styleSheet === null) {
    styleSheet = createStyleSheet({})
  }

  return styleSheet
}
