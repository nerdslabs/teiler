import type { DefaultTheme } from '@teiler/core'

import { defineComponent, toRefs } from 'vue'
import { provide } from 'vue'
import type { PropType } from 'vue'

export const context = 'THEME'

export default defineComponent({
  props: {
    theme: {
      type: Object as PropType<DefaultTheme>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const { theme } = toRefs(props)

    provide(context, theme)

    return () => slots.default?.()
  },
})
