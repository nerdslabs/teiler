import type { Compiler, HTMLElements, Properties, StyleDefinition, TeilerComponent } from '@teiler/core'
import type { DefineSetupFnComponent } from 'vue'
import type { PolymorphicComponent, StyledOptions } from './types'

import Styled from './Styled'

import { component, global, keyframes, styled, tags } from '@teiler/core'

type VueTeilerComponent<Target extends HTMLElements, Props extends object> = PolymorphicComponent<Target, Props> & TeilerComponent<Target, Props>

type VueGlobalComponent<Props extends object> = DefineSetupFnComponent<Props> & StyledOptions & TeilerComponent<null, Props>

const createComponent = <Target extends HTMLElements, Props extends object>(styleDefinition: StyleDefinition<Target, Props>): VueTeilerComponent<Target, Props> => {
  return Styled(styleDefinition)
}

type InferProps<Component, Props> = Component extends TeilerComponent<HTMLElements, infer P> ? P & Props : Props
type InferComponent<Component, Props extends object, Extended> =
  Component extends TeilerComponent<infer E, infer P extends object> ? VueTeilerComponent<Extended extends HTMLElements ? Extended : E, Props & P> : VueTeilerComponent<HTMLElements, Props>

type Component<Target extends HTMLElements, Extended extends HTMLElements | undefined = Target> = {
  <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<Props>[]): VueTeilerComponent<Target, Props>
  <Component>(binded: Component): <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<InferProps<Component, Props>>[]) => InferComponent<Component, Props, Extended>
}

type Global = {
  <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<Props>[]): VueGlobalComponent<Props>
}

type ComponentWithTags = Component<'div', undefined> & { [K in Exclude<HTMLElements, null>]: Component<K> }

const construct = (tag: HTMLElements | undefined, compiler: Compiler) => {
  return <Props extends object = {}>(stringOrBinded: TeilerComponent<HTMLElements, Props> | TemplateStringsArray, ...properties: Properties<Props>[]) => {
    return styled<Props, VueTeilerComponent<HTMLElements, Props>>(tag, compiler, createComponent, stringOrBinded, ...properties)
  }
}

const vueComponent = construct(undefined, component) as ComponentWithTags

tags.forEach((tag) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  vueComponent[tag] = construct(tag, component)
})

const vueGlobal = construct(null, global) as Global

export type { VueGlobalComponent, VueTeilerComponent }

export { vueComponent as component, vueGlobal as global, keyframes, createComponent }
