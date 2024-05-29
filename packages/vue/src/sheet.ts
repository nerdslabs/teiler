import { type Sheet, createStyleSheet } from '@teiler/core'
import { inject } from 'vue'

export let styleSheet = null

export const StyleSheet = 'STYLE_SHEET'

export function getStyleSheet(): Sheet {
  const provided = inject<Sheet>('STYLE_SHEET', () => createStyleSheet({}), true)

  if (provided) {
    return provided
  }

  if (styleSheet === null) {
    styleSheet = createStyleSheet({})
  }

  return styleSheet
}
