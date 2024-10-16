import type { Compiler, DefaultTheme, HTMLElements, Properties, Sheet, StyleDefinition, TeilerComponent } from '@teiler/core'
import type { ComponentOptionsMixin, DefineComponent, IntrinsicElementAttributes } from 'vue'

import Styled from './Styled'

import { component, global, keyframes, styled, tags } from '@teiler/core'

type ElementAttributes<Target extends HTMLElements> = Target extends keyof IntrinsicElementAttributes ? IntrinsicElementAttributes[Target] : {}

type VueRawBindings = { styleSheet: Sheet; theme: DefaultTheme }
type VueTeilerComponent<Target extends HTMLElements, Props> = TeilerComponent<Target, Props> & DefineComponent<Props, VueRawBindings, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, ElementAttributes<Target>>

const createComponent = <Target extends HTMLElements, Props>(styleDefinition: StyleDefinition<Target, Props>): VueTeilerComponent<Target, Props> => {
  const component = Styled(styleDefinition)
  return component as VueTeilerComponent<Target, Props>
}

type InferProps<Component, Props> = Component extends VueTeilerComponent<HTMLElements, infer P> ? P & Props : Props
type InferComponent<Component, Props> = Component extends VueTeilerComponent<infer E extends HTMLElements, infer P> ? VueTeilerComponent<E, Props & P> : VueTeilerComponent<HTMLElements, Props>

type Component<Target extends HTMLElements> = {
  <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<Props>[]): VueTeilerComponent<Target, Props>
  <Component>(binded: Component): <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<InferProps<Component, Props>>[]) => InferComponent<Component, Props>
}

type Global = {
  <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<Props>[]): VueTeilerComponent<HTMLElements, Props>
}

type ComponentWithTags = Component<'div'> & { [K in Exclude<HTMLElements, null>]: Component<K> }

const construct = (tag: HTMLElements, compiler: Compiler) => {
  return <Props extends object = {}>(stringOrBinded: TeilerComponent<HTMLElements, Props> | TemplateStringsArray, ...properties: Properties<Props>[]) => {
    return styled<Props, VueTeilerComponent<HTMLElements, Props>>(tag, compiler, createComponent, stringOrBinded, ...properties)
  }
}

const vueComponent = construct('div', component) as ComponentWithTags

tags.forEach((tag) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  vueComponent[tag] = construct(tag, component)
})

const vueGlobal = construct(null, global) as Global

export type { VueTeilerComponent }

export { vueComponent as component, vueGlobal as global, keyframes, createComponent }
