import type { Compiler, HTMLElements, Properties, StyleDefinition, TeilerComponent } from '@teiler/core'
import type { Component as SvelteComponent } from 'svelte'
import type Styled from './Styled.svelte'

import { component, global, keyframes, styled, tags } from '@teiler/core'

type SvelteTeilerComponent<Target extends HTMLElements, Props> = TeilerComponent<Target, Props> & SvelteComponent<Props>

const createComponent = <Target extends HTMLElements, Props>(styledComponent: typeof Styled, styleDefinition: StyleDefinition<Target, Props>): SvelteTeilerComponent<Target, Props> => {
  const Wrapped = ($$anchor, $$props) => styledComponent($$anchor, {...$$props, styleDefinition})
  Wrapped.styleDefinition = styleDefinition

  return Wrapped
}

type InferProps<Component, Props> = Component extends SvelteTeilerComponent<HTMLElements, infer P> ? P & Props : Props
type InferComponent<Component, Props> = Component extends SvelteTeilerComponent<infer E, infer P> ? SvelteTeilerComponent<E, Props & P> : SvelteTeilerComponent<HTMLElements, Props>

type Component<Target extends HTMLElements> = {
  <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<Props>[]): SvelteTeilerComponent<Target, Props>
  <Component>(binded: Component): <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<InferProps<Component, Props>>[]) => InferComponent<Component, Props>
}

type Global = {
  <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<Props>[]): SvelteTeilerComponent<HTMLElements, Props>
}

type ComponentWithTags = Component<'div'> & { [K in HTMLElements]: Component<K> }

const construct = (tag: HTMLElements, styledComponent: typeof Styled, compiler: Compiler) => {
  const bindedCreateComponent = createComponent.bind(null, styledComponent)

  return <Props extends object = {}>(stringOrBinded: TeilerComponent<HTMLElements, Props> | TemplateStringsArray, ...properties: Properties<Props>[]) => {
    return styled<Props, SvelteTeilerComponent<HTMLElements, Props>>(tag, compiler, bindedCreateComponent, stringOrBinded, ...properties)
  }
}

const init = (styledComponent: typeof Styled) => {
  const baseComponent = construct('div', styledComponent, component)

  tags.forEach((tag) => {
    baseComponent[tag] = construct(tag, styledComponent, component)
  })

  const svelteComponent = baseComponent as ComponentWithTags

  const svelteGlobal = construct(null, styledComponent, global) as Global

  return {
    component: svelteComponent,
    global: svelteGlobal,
  }
}

export { init, keyframes, createComponent }
