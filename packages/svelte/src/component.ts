import type { Compile, HTMLElements, Properties, Style, TeilerComponent } from '@teiler/core'
import type { ComponentType, SvelteComponent } from 'svelte'

import { component, global, keyframes, styled, tags } from '@teiler/core'
import Styled from './Styled.svelte'

type SvelteTeilerComponent<Target, Props> = TeilerComponent<Target, Props> & ComponentType<SvelteComponent>

const createComponent = <Target extends HTMLElements, Props>(compile: Compile, tag: Target, styles: Array<Style<Props>>): SvelteTeilerComponent<Target, Props> => {
  return class extends Styled {
    static styles = styles
    static tag = tag

    constructor(options) {
      super({
        ...options,
        props: {
          ...options.props,
          compile,
          tag,
          styles,
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
  <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<Props>[]): SvelteTeilerComponent<unknown, Props>
}

type ComponentWithTags = Component<'div'> & { [K in HTMLElements]: Component<K> }

const construct = <Target extends HTMLElements>(tag: Target, compile: Compile) => {
  return <Props extends object = {}>(stringOrBinded: TeilerComponent<Target, Props> | TemplateStringsArray, ...properties: Properties<Props>[]) => {
    const binded = createComponent.bind(null, compile, (stringOrBinded as TeilerComponent<Target, Props>).tag || tag)
    return styled<Props, SvelteTeilerComponent<Target, Props>>(binded, stringOrBinded, ...properties)
  }
}

const baseComponent = construct('div', component)

tags.forEach((tag) => {
  baseComponent[tag] = construct(tag, component)
})

const svelteComponent = baseComponent as ComponentWithTags

const svelteGlobal = construct(null, global) as Global

export { svelteComponent as component, svelteGlobal as global, keyframes, createComponent }
