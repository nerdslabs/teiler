import type { Compile, Properties, Style, Target, TeilerComponent } from '@teiler/core'
import type { ComponentType, SvelteComponent } from 'svelte'

import { component, global, keyframes, styled } from '@teiler/core'
import Styled from './Styled.svelte'
import tags from './tags'

type SvelteTeilerComponent<Target, Props> = TeilerComponent<Target, Props> & ComponentType<SvelteComponent>

const createComponent = <Target, Props>(compile: Compile, tag: Target, styles: Array<Style<Props>>): SvelteTeilerComponent<Target, Props> => {
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

type InferProps<Component, Props> = Component extends SvelteTeilerComponent<Target, infer P> ? P & Props : Props
type InferComponent<Component, Props> = Component extends SvelteTeilerComponent<infer E, infer P> ? SvelteTeilerComponent<E, Props & P> : SvelteTeilerComponent<Target, Props>

type Component<Target> = {
  <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<Props>[]): SvelteTeilerComponent<Target, Props>
  <Component>(binded: Component): <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<InferProps<Component, Props>>[]) => InferComponent<Component, Props>
}

type Global = {
  <Props extends object = {}>(string: TemplateStringsArray, ...properties: Properties<Props>[]): SvelteTeilerComponent<unknown, Props>
}

type ComponentWithTags = Component<'div'> & { [K in (typeof tags)[number]]: Component<K> }

const construct = (tag: string, compile: Compile) => {
  return <Props extends object = {}>(stringOrBinded: TeilerComponent<Target, Props> | TemplateStringsArray, ...properties: Properties<Props>[]) => {
    const binded = createComponent.bind(null, compile, (stringOrBinded as TeilerComponent<Target, Props>).tag || tag)
    return styled<Props, SvelteTeilerComponent<Target, Props>>(binded, stringOrBinded, ...properties)
  }
}

const svelteComponent = construct('div', component)

tags.forEach((tag) => {
  svelteComponent[tag] = construct(tag, component)
})

const svelteGlobal = construct(null, global) as Global

export { svelteGlobal as global, keyframes, createComponent }
export default svelteComponent as ComponentWithTags
