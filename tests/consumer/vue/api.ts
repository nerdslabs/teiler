import type { ConcreteComponent } from 'vue'
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers'
import type { DefaultTheme } from '@teiler/vue'

import { createStyleSheet } from '@teiler/vue'
import { defineComponent, h, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Button, Global, LinkButton, Sized } from './components.js'

type Assert<T extends true> = T

export type Checks = [
  Assert<typeof LinkButton extends Omit<ConcreteComponent, 'props'> ? true : false>,
  Assert<typeof Global extends Omit<ConcreteComponent, 'props'> ? true : false>,
  Assert<'href' extends keyof ComponentProps<typeof LinkButton> ? true : false>,
  Assert<'disabled' extends keyof ComponentProps<typeof LinkButton> ? false : true>,
  Assert<ComponentExposed<typeof Button>['element'] extends HTMLElement | null ? true : false>,
  Assert<DefaultTheme['accent'] extends string ? true : false>,
]

export const sheet = createStyleSheet({})
export const button = ref<InstanceType<typeof Button>>()
export const element: HTMLElement | null | undefined = button.value?.element
export const Wrapper = defineComponent({ components: { Button, Global } })

h(Button, { as: 'a', href: '/docs' })
h(Button, { as: RouterLink, to: '/home' }, () => 'Home')
h(Sized, { size: 4 })

// @ts-expect-error missing required prop
h(Sized, {})
