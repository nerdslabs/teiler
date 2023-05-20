import type { HireOptions, Hired, Expression, Style, TailorComponent, CSS } from '@teiler/core'

import styled, { hire } from '@teiler/core'
import { SvelteComponentTyped } from 'svelte'
import Styled from './Styled.svelte'
import tags from './tags'

type SvelteComponent<Props> = TailorComponent<typeof SvelteComponentTyped<Props & Record<string | number | symbol, unknown>>, Props>

function createComponent<Props>(css: CSS, tag: string, styles: Array<Style<Props>>): Partial<SvelteComponentTyped<Props>> {
  return class extends Styled {
    static styles: Array<Style<Props>> = styles

    constructor(options) {
      super({
        ...options,
        props: {
          ...options.props,
          css,
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

type HiredSvelte = Hired & {
  component: ComponentWithTags
}

function construct(tag: string, css: CSS) {
  const binded = createComponent.bind(null, css, tag)

  return <Type, Props>(stringOrBinded: TemplateStringsArray, ...expressions: Expression<Props>[]) => {
    return styled<Type, Props>(binded, stringOrBinded, ...expressions)
  }
}

function hireSvelte(options: HireOptions): HiredSvelte {
  const hired = hire(options)

  const component = construct('div', hired.css)

  tags.forEach((tag) => {
    component[tag] = construct(tag, hired.css)
  })

  return {
    ...hired,
    component: component as ComponentWithTags,
  }
}

export { hireSvelte as hire }
export default hireSvelte({})
