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

type Create<Props> = (stringOrBinded: TemplateStringsArray, ...expressions: Expression<Props>[]) => typeof SvelteComponentTyped<Props>

function component<Props>(binded: SvelteComponent<Props>): Create<Props>
function component<Props>(string: TemplateStringsArray, ...expressions: Expression<Props>[]): TailorComponent<Props>
function component<Props>(stringOrBinded: TemplateStringsArray, ...expressions: Expression<Props>[]): Create<Props> | typeof SvelteComponentTyped<Props> {
  console.log('stringOrBinded', typeof stringOrBinded, stringOrBinded)
  console.log('expressions', typeof expressions, expressions)

  const result = styled<Props>(createComponent, stringOrBinded, ...expressions)
  console.log('result', result)
  return result
}

export default component
