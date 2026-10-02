import type { Compiler, Config, HTMLElements, Properties, StyleDefinition, TeilerComponent } from '@teiler/core'
import type { DefineSetupFnComponent } from 'vue'
import type { AsTarget, PolymorphicComponent, StyledOptions, Tag } from './types'

import Styled from './Styled'

import { component, configure, global, keyframes, styled, tags } from '@teiler/core'

type VueTeilerComponent<Target extends HTMLElements, Props extends object, Default = Target> = PolymorphicComponent<Target, Props, Default> &
  TeilerComponent<Target, Props> & {
    withComponent<As extends AsTarget>(target: As): As extends Tag ? VueTeilerComponent<As, Props> : VueTeilerComponent<Target, Props, As>
  }

type VueGlobalComponent<Props extends object> = DefineSetupFnComponent<Props> & StyledOptions & TeilerComponent<null, Props>

const createComponent = <Target extends HTMLElements, Props extends object>(styleDefinition: StyleDefinition<Target, Props>): VueTeilerComponent<Target, Props> => {
  return Styled(styleDefinition)
}

type InferProps<Component, Props> = Component extends TeilerComponent<HTMLElements, infer P> ? P & Props : Props
type InferComponent<Component, Props extends object, Extended> =
  Component extends VueTeilerComponent<infer E, infer P extends object, infer D>
    ? Extended extends HTMLElements
      ? VueTeilerComponent<Extended, Props & P>
      : VueTeilerComponent<E, Props & P, D>
    : Component extends TeilerComponent<infer E, infer P extends object>
      ? VueTeilerComponent<Extended extends HTMLElements ? Extended : E, Props & P>
      : VueTeilerComponent<HTMLElements, Props>

type Extend<Component, Extended> = <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<InferProps<Component, Props>>[]) => InferComponent<Component, Props, Extended>

type Component<Target extends HTMLElements, Extended extends HTMLElements | undefined = Target> = {
  <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<Props>[]): VueTeilerComponent<Target, Props>
  <Component>(binded: Component): Extend<Component, Extended> & { withConfig(config: Config): Extend<Component, Extended> }
  withConfig(config: Config): Component<Target, Extended>
}

type Global = {
  <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<Props>[]): VueGlobalComponent<Props>
  withConfig(config: Config): Global
}

type ComponentWithTags = Component<'div', undefined> & { [K in Exclude<HTMLElements, null>]: Component<K> }

const construct = (tag: HTMLElements | undefined, compiler: Compiler): unknown => {
  const create = <Props extends object = {}>(stringOrBinded: TeilerComponent<HTMLElements, Props> | TemplateStringsArray, ...properties: Properties<Props>[]) => {
    return styled<Props, VueTeilerComponent<HTMLElements, Props>>(tag, compiler, createComponent, stringOrBinded, ...properties)
  }

  return Object.assign(create, { withConfig: (config: Config) => construct(tag, configure(compiler, config)) })
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
