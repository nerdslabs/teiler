import type { Expression, Style, TailorComponent, Compile } from '@teiler/core'

import styled, { component, global } from '@teiler/core'
import { SvelteComponentTyped } from 'svelte'
import Styled from './Styled.svelte'
import tags from './tags'

type SvelteComponent<Props> = TailorComponent<typeof SvelteComponentTyped<Props & Record<string | number | symbol, unknown>>, Props>

function createComponent<Props>(compile: Compile, tag: string, styles: Array<Style<Props>>): Partial<SvelteComponentTyped<Props>> {
  return class extends Styled {
    static styles: Array<Style<Props>> = styles

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

type Component = {
  <Component extends SvelteComponent<unknown>>(binded: Component): <Props extends object>(
    string: TemplateStringsArray,
    ...expressions: Expression<Component extends SvelteComponent<infer P> ? P & Props : Props>[]
  ) => SvelteComponent<Component extends SvelteComponent<infer P> ? P & Props : Props>
  <Props>(string: TemplateStringsArray, ...expressions: Expression<Props>[]): SvelteComponent<Props>
}

type ComponentWithTags = Component & { [K in (typeof tags)[number]]: Component }

function construct(tag: string, compile: Compile) {
  const binded = createComponent.bind(null, compile, tag)

  return <Type, Props>(stringOrBinded: TemplateStringsArray, ...expressions: Expression<Props>[]) => {
    return styled<Type, Props>(binded, stringOrBinded, ...expressions)
  }
}

const svelteComponent = construct('div', component)

tags.forEach((tag) => {
  svelteComponent[tag] = construct(tag, component)
})

const svelteGlobal = construct(null, global)

export { svelteGlobal as global }
export default svelteComponent as ComponentWithTags
