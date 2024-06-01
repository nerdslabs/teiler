import type { HTMLElements, Sheet, StyleDefinition } from '@teiler/core'

import { insert } from '@teiler/core'
import { defineComponent, h, inject, toRaw } from 'vue'
import { context } from './ThemeProvider'
import { getStyleSheet } from './sheet'

export default function <Target extends HTMLElements, Props>(styleDefinition: StyleDefinition<Target, Props>) {
  const component = defineComponent({
    inheritAttrs: false,
    styleDefinition,
    setup() {
      const styleSheet: Sheet = getStyleSheet()
      const theme = inject(context, {})

      return { styleSheet, theme }
    },
    render() {
      const slots = this.$slots
      const attrs = toRaw(this.$attrs)

      const styleClassName = insert(this.styleSheet, styleDefinition, { ...attrs, theme: this.theme })

      const filtredPropsEntries = Object.entries(attrs).filter(([key]) => key[0] !== '_' && key !== 'class')
      const filtredProps = Object.fromEntries(filtredPropsEntries)

      const attrsClass = attrs.class ? ' ' + attrs.class : ''
      const className = `${styleClassName} ${styleDefinition.id}${attrsClass}`

      const defaultSlot = slots.default ? slots.default() : null

      if (styleDefinition.tag) {
        return h(styleDefinition.tag, { ...filtredProps, className }, defaultSlot)
      } else {
        return null
      }
    },
  })

  return component
}
