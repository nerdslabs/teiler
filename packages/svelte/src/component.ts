import type { Compiler, HTMLElements, Properties, StyleDefinition, TeilerComponent } from '@teiler/core'
import type { ComponentConstructorOptions, ComponentProps, Snippet, Component as SvelteComponent, SvelteComponent as SvelteComponentInstance } from 'svelte'
import type { ClassValue, SvelteHTMLElements } from 'svelte/elements'

import { component, global, keyframes, styled, tags } from '@teiler/core'
import Styled from './Styled.svelte'

type Tag = Exclude<HTMLElements, null>

type ElementProps<Target> = Target extends keyof SvelteHTMLElements ? SvelteHTMLElements[Target] : {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsTarget = Tag | SvelteComponent<any>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TargetProps<As> = As extends SvelteComponent<any> ? Omit<ComponentProps<As>, 'class' | 'children'> & { class?: ClassValue; children?: Snippet } : ElementProps<As>

type PolymorphicProps<Target extends HTMLElements, Props, As> = Props & { as?: As } & ([As] extends [never] ? ElementProps<Target> : [AsTarget] extends [As] ? ElementProps<Target> : TargetProps<As>)

interface SvelteTeilerComponent<Target extends HTMLElements, Props extends object> extends TeilerComponent<Target, Props> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <As extends AsTarget = never>(internals: any, props: PolymorphicProps<Target, Props, As>): {}
  new <As extends AsTarget = never>(options: ComponentConstructorOptions<PolymorphicProps<Target, Props, As>>): SvelteComponentInstance<PolymorphicProps<Target, Props, As>>
}

type SvelteGlobalComponent<Props extends object> = TeilerComponent<null, Props> & SvelteComponent<Props>

const withStyleDefinition = <Props extends object, Definition>(props: Props, styleDefinition: Definition): Props & { styleDefinition: Definition } => {
  return new Proxy(props, {
    get: (target, key) => (key === 'styleDefinition' ? styleDefinition : Reflect.get(target, key)),
    has: (target, key) => key === 'styleDefinition' || Reflect.has(target, key),
  }) as Props & { styleDefinition: Definition }
}

const createComponent = <Target extends HTMLElements, Props extends object = {}>(styleDefinition: StyleDefinition<Target, Props>): SvelteTeilerComponent<Target, Props> => {
  const wrapped: SvelteComponent<Props> = (internals, props) => Styled(internals, withStyleDefinition(props, styleDefinition) as ComponentProps<typeof Styled>)

  return Object.assign(wrapped, { styleDefinition }) as unknown as SvelteTeilerComponent<Target, Props>
}

type InferProps<Component, Props> = Component extends TeilerComponent<HTMLElements, infer P> ? P & Props : Props
type InferComponent<Component, Props extends object, Extended> =
  Component extends TeilerComponent<infer E, infer P extends object> ? SvelteTeilerComponent<Extended extends HTMLElements ? Extended : E, Props & P> : SvelteTeilerComponent<HTMLElements, Props>

type Component<Target extends HTMLElements, Extended extends HTMLElements | undefined = Target> = {
  <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<Props>[]): SvelteTeilerComponent<Target, Props>
  <Component>(binded: Component): <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<InferProps<Component, Props>>[]) => InferComponent<Component, Props, Extended>
}

type Global = {
  <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<Props>[]): SvelteGlobalComponent<Props>
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

export type { SvelteGlobalComponent, SvelteTeilerComponent }

export { svelteComponent as component, svelteGlobal as global, keyframes, createComponent }
