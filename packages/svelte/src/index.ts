import type { Expression, Style, TailorComponent } from '@teiler/core'

import styled from '@teiler/core'
import { SvelteComponentTyped } from 'svelte'
import Styled from './Styled.svelte'

type SvelteComponent<Props> = SvelteComponentTyped<Props> & TailorComponent<Props>

function createComponent<Props>(styles): SvelteComponent<Props> {
  return class SvelteComponent extends Styled {
    static styles: Array<Style<Props>> = styles

    constructor(options) {
      super({
        ...options,
        props: {
          ...options.props,
          styles: styles,
        },
      })
    }
  }
}

function component<Props>(stringOrBinded: TemplateStringsArray, ...expressions: Expression<Props>[]): SvelteComponent<Props> {
  console.log('stringOrBinded', typeof stringOrBinded, stringOrBinded)
  console.log('expressions', typeof expressions, expressions)

  const result = styled<Props>(createComponent, stringOrBinded, ...expressions)
  console.log('result', result)
  return result
}

export default component
