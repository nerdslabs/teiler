import type { Sheet } from './sheet'

import { compile, stylis } from './css'
import createStyleSheet from './sheet'
import hash from './hash'
import { pattern, sew } from './pattern'

type Expression<Props> = (props: Props) => string | boolean
type Style<Props> = [string[], Expression<Props>[]]

type Target = string

type TeilerComponent<Target, Props> = {
  styles: Array<Style<Props>>
  tag: Target
}

type CreateCallback<Props, Type extends TeilerComponent<Target, Props>> = (styles: Array<Style<Props>>) => Type
type ExtendCallback<Props, Type extends TeilerComponent<Target, Props>> = (string: TemplateStringsArray, ...expressions: Expression<Props>[]) => Type

function styled<Props, Type extends TeilerComponent<Target, Props>>(
  createComponent: CreateCallback<Props, Type>,
  stringOrBinded: TeilerComponent<Target, Props> | TemplateStringsArray,
  ...expressions: Expression<Props>[]
): ExtendCallback<Props, Type> | Type {
  if (Array.isArray(stringOrBinded)) {
    const strings = stringOrBinded as TemplateStringsArray
    const style: Style<Props> = [Array.from(strings), expressions]
    return createComponent([style])
  } else {
    const binded = stringOrBinded as TeilerComponent<Target, Props>
    return (strings: TemplateStringsArray, ...expressions: Expression<Props>[]) => {
      const style: Style<Props> = [Array.from(strings), expressions]
      return createComponent([...binded.styles, style])
    }
  }
}

type Compile = <Props>(sheet: Sheet, styles: Array<Style<Props>>, props: Props) => string[] | void[]

function component<Props>(sheet: Sheet, styles: Array<Style<Props>>, props: Props): string[] {
  return compile(styles, props).map((css) => {
    const id = hash(css)
    const selector = 'teiler-' + id

    const result = stylis(`.${selector} { ${css} }`).join(' ')
    sheet.insert(id, result)

    return selector
  })
}

function global<Props>(sheet: Sheet, styles: Array<Style<Props>>, props: Props): void[] {
  return compile(styles, props).map((css) => {
    const result = stylis(css).join(' ')
    const id = hash(result)
    sheet.insert(id, result)
  })
}

export type { Compile, Expression, Sheet, Style, TeilerComponent, Target }
export { component, global, createStyleSheet, pattern, sew }
export default styled
