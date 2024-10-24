import type { Compiler, HTMLElements, Properties, StyleDefinition, TeilerComponent } from '@teiler/core'
import type { ComponentType, SvelteComponent } from 'svelte'

import { component, global, keyframes, styled, tags } from '@teiler/core'
import Styled from './Styled.svelte'

type SvelteTeilerComponent<Target extends HTMLElements, Props> = TeilerComponent<Target, Props> & ComponentType<SvelteComponent>

type Options = ConstructorParameters<typeof Styled>[0]

const createComponent = <Target extends HTMLElements, Props extends object = {}>(styleDefinition: StyleDefinition<Target, Props>): SvelteTeilerComponent<Target, Props> => {
  return class extends Styled<{}, Props> {
    static styleDefinition = styleDefinition

    constructor(options: Options) {
      super({
        ...options,
        props: {
          ...options.props,
          styleDefinition,
        },
      })
    }
  }
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

type ComponentWithTags = Component<'div'> & { [K in Exclude<HTMLElements, null>]: Component<K> }

const construct = (tag: HTMLElements, compiler: Compiler) => {
  return <Props extends object = {}>(stringOrBinded: TeilerComponent<HTMLElements, Props> | TemplateStringsArray, ...properties: Properties<Props>[]) => {
    return styled<Props, SvelteTeilerComponent<HTMLElements, Props>>(tag, compiler, createComponent, stringOrBinded, ...properties)
  }
}

const svelteComponent = construct('div', component) as ComponentWithTags

tags.forEach((tag) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  svelteComponent[tag] = construct(tag, component)
})

const svelteGlobal = construct(null, global) as Global

export { svelteComponent as component, svelteGlobal as global, keyframes, createComponent }
