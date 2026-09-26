import type { HTMLElements, Sheet, StyleDefinition } from '@teiler/core'
import type { Component, ComponentPublicInstance } from 'vue'

import { DefaultTheme, insert } from '@teiler/core'
import { defineComponent, h, inject, ref, toRaw } from 'vue'
import { context } from './ThemeProvider'
import { getStyleSheet } from './sheet'

export default function <Target extends HTMLElements, Props>(styleDefinition: StyleDefinition<Target, Props>) {
  const component = defineComponent({
    inheritAttrs: false,
    styleDefinition,
    setup(_, { expose }) {
      const styleSheet: Sheet = getStyleSheet()
      const theme = inject<DefaultTheme>(context, {})

      const element = ref<HTMLElement | null>(null)

      const setElement = (el: Element | ComponentPublicInstance | null) => {
        element.value = (el && '$el' in el ? el.$el : el) as HTMLElement | null
      }

      expose({ element })

      return { styleSheet, theme, element, setElement }
    },
    render() {
      const slots = this.$slots
      const attrs = toRaw(this.$attrs) as Props & Record<string, unknown>

      const styleClassName = insert<Props>(this.styleSheet, styleDefinition, { ...attrs, theme: this.theme })

      const filtredPropsEntries = Object.entries(attrs).filter(([key]) => key[0] !== '_' && key !== 'class' && key !== 'as')
      const filtredProps = Object.fromEntries(filtredPropsEntries)

      const attrsClass = attrs.class ? ' ' + attrs.class : ''
      const className = `${styleClassName} ${styleDefinition.id}${attrsClass}`

      if (styleDefinition.tag) {
        const target = toRaw(attrs.as as string | Component | undefined) || styleDefinition.tag
        const props = { ...filtredProps, class: className, ref: this.setElement }

        if (typeof target === 'string') {
          return h(target, props, slots.default ? slots.default() : undefined)
        } else {
          return h(target, props, slots)
        }
      } else {
        return null
      }
    },
  })

  return component
}
