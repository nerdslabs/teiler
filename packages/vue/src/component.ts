import type { Compiler, HTMLElements, Properties, StyleDefinition, TeilerComponent } from '@teiler/core'
import type { AllowedComponentProps, IntrinsicElementAttributes, VNode, VNodeProps } from 'vue'

import Styled from './Styled'

import { component, global, keyframes, styled, tags } from '@teiler/core'

type Tag = Exclude<HTMLElements, null>

type ElementProps<Target> = Target extends keyof IntrinsicElementAttributes ? IntrinsicElementAttributes[Target] : {}

type NotAny<Props> = 0 extends 1 & Props ? {} : Props

/* eslint-disable @typescript-eslint/no-explicit-any */
type ComponentProps<Component> = Component extends new (...args: any) => { $props: infer Props } ? NotAny<Omit<Props, keyof VNodeProps | keyof AllowedComponentProps>> : Component extends (props: infer Props, ...args: any) => any ? NotAny<Props> : {}

type AsTarget = Tag | (abstract new (...args: any) => any) | ((props: any, ...args: any) => any)
/* eslint-enable @typescript-eslint/no-explicit-any */

type TargetProps<As> = As extends Tag ? ElementProps<As> : ComponentProps<As>

type PolymorphicProps<Target extends HTMLElements, Props, As> = Props & { as?: As } & ([As] extends [never] ? ElementProps<Target> : [AsTarget] extends [As] ? ElementProps<Target> : TargetProps<As>)

type Exposed = { element: HTMLElement | null }

type Context<Props> = {
  props?: Props
  expose?: (exposed: Exposed) => void
  attrs?: Record<string, unknown>
  slots?: Record<string, (...args: unknown[]) => VNode[]>
  emit?: {}
}

interface VueTeilerComponent<Target extends HTMLElements, Props> extends TeilerComponent<Target, Props> {
  <As extends AsTarget = never>(
    props: PolymorphicProps<Target, Props, As> & AllowedComponentProps & VNodeProps,
    ctx?: unknown,
    expose?: (exposed: Exposed) => void,
  ): VNode & { __ctx?: Context<PolymorphicProps<Target, Props, As> & AllowedComponentProps & VNodeProps> }
}

interface VueGlobalComponent<Props> extends TeilerComponent<null, Props> {
  (props: Props & AllowedComponentProps & VNodeProps, ctx?: unknown): VNode & { __ctx?: Context<Props & AllowedComponentProps & VNodeProps> }
}

const createComponent = <Target extends HTMLElements, Props>(styleDefinition: StyleDefinition<Target, Props>): VueTeilerComponent<Target, Props> => {
  const component = Styled(styleDefinition)
  return component as unknown as VueTeilerComponent<Target, Props>
}

type InferProps<Component, Props> = Component extends TeilerComponent<HTMLElements, infer P> ? P & Props : Props
type InferComponent<Component, Props, Extended> = Component extends TeilerComponent<infer E, infer P> ? VueTeilerComponent<Extended extends HTMLElements ? Extended : E, Props & P> : VueTeilerComponent<HTMLElements, Props>

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
