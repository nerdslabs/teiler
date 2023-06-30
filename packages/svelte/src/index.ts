import type { Expression, Style, TeilerComponent, Compile } from '@teiler/core'

import styled, { component, global } from '@teiler/core'
import type { SvelteComponent, ComponentType } from 'svelte';
import Styled from './Styled.svelte'
import tags from './tags'

type SvelteTeilerComponent<Element, Props> = ComponentType<SvelteComponent> & TeilerComponent<Props>

function createComponent<Props>(compile: Compile, tag: string, styles: Array<Style<Props>>): SvelteTeilerComponent<Element, Props> {

  
  return class extends Styled {
    static styles = styles

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

type Inter<Component, Props> = Component extends SvelteTeilerComponent<Element, infer P> ? P & Props : Props

type Component<Element> = {
  <Props extends object = {}>(string: TemplateStringsArray, ...expressions: Expression<Props>[]): SvelteTeilerComponent<Element, Props>
  <Component>(binded: Component): <Props extends object = {}>(string: TemplateStringsArray, ...expressions: Expression<Inter<Component, Props>>[])
    => SvelteTeilerComponent<Element, Inter<Component, Props>>
}

type ComponentWithTags = Component<'div'> & { [K in (typeof tags)[number]]: Component<K> }

const construct = (tag: string, compile: Compile) => {
  const binded = createComponent.bind(null, compile, tag)

  return <Props extends object = {}>(stringOrBinded: TemplateStringsArray, ...expressions: Expression<Props>[]) => {
    return styled<Props, SvelteTeilerComponent<Element, Props>>(binded, stringOrBinded, ...expressions)
  }
}

const svelteComponent = construct('div', component)

tags.forEach((tag) => {
  svelteComponent[tag] = construct(tag, component)
})

const svelteGlobal = construct(null, global)

export { svelteGlobal as global }
export default svelteComponent as ComponentWithTags
