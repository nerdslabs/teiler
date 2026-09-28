import type { HTMLElements, StyleDefinition } from '@teiler/core'
import type { AsTarget, PolymorphicComponent, PolymorphicProps } from './types'
import type { Component, ComponentPublicInstance, Ref, SetupContext } from 'vue'

import { DefaultTheme, insert } from '@teiler/core'
import { defineComponent, h, inject, ref, toRaw, unref } from 'vue'
import { context } from './ThemeProvider'
import { getStyleSheet } from './sheet'

const displayName = (tag: HTMLElements) => (tag ? 'Styled' + tag[0].toUpperCase() + tag.slice(1) : 'StyledGlobal')

export default function <Target extends HTMLElements, Props extends object>(styleDefinition: StyleDefinition<Target, Props>) {
  const component = defineComponent(
    <As extends AsTarget = never>(_props: PolymorphicProps<Target, Props, As>, { attrs, slots, expose }: SetupContext) => {
      const styleSheet = getStyleSheet()
      const theme = inject<Ref<DefaultTheme> | DefaultTheme>(context, {})

      const element = ref<HTMLElement | null>(null)

      const setElement = (el: Element | ComponentPublicInstance | null) => {
        element.value = (el && '$el' in el ? el.$el : el) as HTMLElement | null
      }

      expose({ element })

      return () => {
        const props = toRaw(attrs) as Props & Record<string, unknown>

        const styleClassName = insert<Props>(styleSheet, styleDefinition, { ...props, theme: unref(theme) })

        const filtredProps = Object.fromEntries(Object.entries(props).filter(([key]) => key[0] !== '_' && key !== 'class' && key !== 'as'))

        const attrsClass = props.class ? ' ' + props.class : ''
        const className = `${styleClassName} ${styleDefinition.id}${attrsClass}`

        if (styleDefinition.tag) {
          const target = toRaw(props.as as string | Component | undefined) || styleDefinition.tag
          const elementProps = { ...filtredProps, class: className, ref: setElement }

          if (typeof target === 'string') {
            return h(target, elementProps, slots.default ? slots.default() : undefined)
          } else {
            return h(target, elementProps, slots)
          }
        } else {
          return null
        }
      }
    },
    { name: displayName(styleDefinition.tag), inheritAttrs: false },
  )

  return Object.assign(component as PolymorphicComponent<Target, Props>, { styleDefinition })
}
