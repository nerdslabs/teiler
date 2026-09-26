import type { Compiler, HTMLElements, Properties, StyleDefinition, TeilerComponent } from '@teiler/core'
import type { ComponentProps, Component as SvelteComponent } from 'svelte'
import type { SvelteHTMLElements } from 'svelte/elements'

import { component, global, keyframes, styled, tags } from '@teiler/core'
import Styled from './Styled.svelte'

type ElementProps<Target extends HTMLElements> = Target extends keyof SvelteHTMLElements ? SvelteHTMLElements[Target] : {}

type SvelteTeilerComponent<Target extends HTMLElements, Props> = TeilerComponent<Target, Props> & SvelteComponent<Props & ElementProps<Target>>

const withStyleDefinition = <Props extends object, Definition>(props: Props, styleDefinition: Definition): Props & { styleDefinition: Definition } => {
  return new Proxy(props, {
    get: (target, key) => (key === 'styleDefinition' ? styleDefinition : Reflect.get(target, key)),
    has: (target, key) => key === 'styleDefinition' || Reflect.has(target, key),
  }) as Props & { styleDefinition: Definition }
}

const createComponent = <Target extends HTMLElements, Props extends object = {}>(styleDefinition: StyleDefinition<Target, Props>): SvelteTeilerComponent<Target, Props> => {
  const wrapped: SvelteComponent<Props & ElementProps<Target>> = (internals, props) => Styled(internals, withStyleDefinition(props, styleDefinition) as ComponentProps<typeof Styled>)

  return Object.assign(wrapped, { styleDefinition })
}

type InferProps<Component, Props> = Component extends SvelteTeilerComponent<HTMLElements, infer P> ? P & Props : Props
type InferComponent<Component, Props, Tag> = Component extends SvelteTeilerComponent<infer E, infer P> ? SvelteTeilerComponent<Tag extends HTMLElements ? Tag : E, Props & P> : SvelteTeilerComponent<HTMLElements, Props>

type Component<Target extends HTMLElements, Tag extends HTMLElements | undefined = Target> = {
  <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<Props>[]): SvelteTeilerComponent<Target, Props>
  <Component>(binded: Component): <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<InferProps<Component, Props>>[]) => InferComponent<Component, Props, Tag>
}

type Global = {
  <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<Props>[]): SvelteTeilerComponent<HTMLElements, Props>
}

type ComponentWithTags = Component<'div', undefined> & { [K in Exclude<HTMLElements, null>]: Component<K> }

const construct = (tag: HTMLElements | undefined, compiler: Compiler) => {
  return <Props extends object = {}>(stringOrBinded: TeilerComponent<HTMLElements, Props> | TemplateStringsArray, ...properties: Properties<Props>[]) => {
    return styled<Props, SvelteTeilerComponent<HTMLElements, Props>>(tag, compiler, createComponent, stringOrBinded, ...properties)
  }
}

const svelteComponent = construct(undefined, component) as ComponentWithTags

tags.forEach((tag) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  svelteComponent[tag] = construct(tag, component)
})

const svelteGlobal = construct(null, global) as Global

export { svelteComponent as component, svelteGlobal as global, keyframes, createComponent }
