import type { HTMLElements, StyleDefinition } from '@teiler/core'
import type { AsTarget, PolymorphicProps } from './types'
import type { Component, ComponentPublicInstance, Ref, SetupContext } from 'vue'
import type { VueTeilerComponent } from './component'

import { DefaultTheme, insert, targetName, withTarget } from '@teiler/core'
import { defineComponent, h, inject, ref, toRaw, unref } from 'vue'
import { context } from './ThemeProvider'
import { getStyleSheet } from './sheet'

const displayName = ({ tag, target }: { tag: HTMLElements; target?: object }) => {
  const name = target ? targetName(target) : tag
  return name ? 'Styled' + name[0].toUpperCase() + name.slice(1) : 'StyledGlobal'
}

export default function Styled<Target extends HTMLElements, Props extends object>(styleDefinition: StyleDefinition<Target, Props>): VueTeilerComponent<Target, Props> {
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
          const target = toRaw(props.as as string | Component | undefined) || (styleDefinition.target as Component | undefined) || styleDefinition.tag
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
    { name: displayName(styleDefinition), inheritAttrs: false },
  )

  const withComponent = (target: AsTarget) => Styled(withTarget(styleDefinition, target))

  return Object.assign(component, { styleDefinition, withComponent }) as unknown as VueTeilerComponent<Target, Props>
}
