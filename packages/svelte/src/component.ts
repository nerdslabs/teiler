import type { Compiler, HTMLElements, Properties, StyleDefinition, TeilerComponent } from '@teiler/core'
import type { ComponentConstructorOptions, ComponentInternals, ComponentProps, Snippet, Component as SvelteComponent, SvelteComponent as SvelteComponentInstance } from 'svelte'
import type { ClassValue, SvelteHTMLElements } from 'svelte/elements'

import { component, global, keyframes, styled, tags, withTarget } from '@teiler/core'
import Styled from './Styled.svelte'

type Tag = Exclude<HTMLElements, null>

type ElementProps<Target> = Target extends keyof SvelteHTMLElements ? SvelteHTMLElements[Target] : {}

type AsTarget = Tag | SvelteComponent<never>

type TargetProps<As> = As extends SvelteComponent<infer Props> ? Omit<Props, 'class' | 'children'> & { class?: ClassValue; children?: Snippet } : ElementProps<As>

type PolymorphicProps<Target extends HTMLElements, Props, As, Default = Target> = Props & { as?: As } & ([As] extends [never] ? TargetProps<Default> : [AsTarget] extends [As] ? TargetProps<Default> : TargetProps<As>)

interface SvelteTeilerComponent<Target extends HTMLElements, Props extends object, Default = Target> extends TeilerComponent<Target, Props> {
  <As extends AsTarget = never>(internals: ComponentInternals, props: PolymorphicProps<Target, Props, As, Default>): {}
  new <As extends AsTarget = never>(options: ComponentConstructorOptions<PolymorphicProps<Target, Props, As, Default>>): SvelteComponentInstance<PolymorphicProps<Target, Props, As, Default>>
  withComponent<As extends AsTarget>(target: As): As extends Tag ? SvelteTeilerComponent<As, Props> : SvelteTeilerComponent<Target, Props, As>
}

type SvelteGlobalComponent<Props extends object> = TeilerComponent<null, Props> & SvelteComponent<Props>

const withStyleDefinition = <Props extends object, Definition>(props: Props, styleDefinition: Definition): Props & { styleDefinition: Definition } => {
  return new Proxy(props, {
    get: (target, key) => (key === 'styleDefinition' ? styleDefinition : Reflect.get(target, key)),
    has: (target, key) => key === 'styleDefinition' || Reflect.has(target, key),
  }) as Props & { styleDefinition: Definition }
}

const createComponent = <Target extends HTMLElements, Props extends object = {}>(styleDefinition: StyleDefinition<Target, Props>): SvelteTeilerComponent<Target, Props> => {
  const wrapped = <As extends AsTarget = never>(internals: ComponentInternals, props: PolymorphicProps<Target, Props, As>) => Styled(internals, withStyleDefinition(props, styleDefinition) as ComponentProps<typeof Styled>)
  const withComponent = (target: AsTarget) => createComponent(withTarget(styleDefinition, target))

  return Object.assign(wrapped, { styleDefinition, withComponent }) as unknown as SvelteTeilerComponent<Target, Props>
}

type InferProps<Component, Props> = Component extends TeilerComponent<HTMLElements, infer P> ? P & Props : Props
type InferComponent<Component, Props extends object, Extended> =
  Component extends SvelteTeilerComponent<infer E, infer P extends object, infer D>
    ? Extended extends HTMLElements
      ? SvelteTeilerComponent<Extended, Props & P>
      : SvelteTeilerComponent<E, Props & P, D>
    : Component extends TeilerComponent<infer E, infer P extends object>
      ? SvelteTeilerComponent<Extended extends HTMLElements ? Extended : E, Props & P>
      : SvelteTeilerComponent<HTMLElements, Props>

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
