import type { Sheet } from './sheet'

import { stylis } from './css'
import createStyleSheet from './sheet'
import hash from './hash'

type Expression<Props> = (props: Props) => string | boolean
type Style<Props> = [string[], Expression<Props>[]]

const isFalsish = (chunk: unknown): chunk is undefined | null | false | '' => chunk === undefined || chunk === null || chunk === false || chunk === ''

function compile<Props>(styles: Array<Style<Props>>, props: Props) {
  return styles.map(([strings, expressions]) => {
    return strings
      .reduce((acc, strings, index) => {
        acc = [...acc, strings]

        const expression = expressions.at(index)

        if (expression) {
          const result = expression(props)
          if (isFalsish(result) === false) {
            acc = [...acc, result]
          }
        }

        return acc
      }, [])
      .join('')
  })
}

type TeilerComponent<Props> = {
  styles: Array<Style<Props>>
}

type CreateFunction<Props, Type extends TeilerComponent<Props>> = (styles: Array<Style<Props>>) => Type
type ExtendCallback<Props, Type extends TeilerComponent<Props>> = (string: TemplateStringsArray, ...expressions: Expression<Props>[]) => Type

function styled<Props, Type extends TeilerComponent<Props>>(createComponent: CreateFunction<Props, Type>, binded: TeilerComponent<Props>): ExtendCallback<Props, Type>
function styled<Props, Type extends TeilerComponent<Props>>(createComponent: CreateFunction<Props, Type>, string: TemplateStringsArray, ...expressions: Expression<Props>[]): Type
function styled<Props, Type extends TeilerComponent<Props>>(createComponent: CreateFunction<Props, Type>, stringOrBinded: TeilerComponent<Props> | TemplateStringsArray, ...expressions: Expression<Props>[]): ExtendCallback<Props, Type> | Type {
  if (Array.isArray(stringOrBinded)) {
    const strings = stringOrBinded as TemplateStringsArray
    const style: Style<Props> = [Array.from(strings), expressions]
    return createComponent([style])
  } else {
    const binded = stringOrBinded as TeilerComponent<Props>
    return (strings: TemplateStringsArray, ...expressions: Expression<Props>[]) => {
      const style: Style<Props> = [Array.from(strings), expressions]
      return createComponent([...binded.styles, style])
    }
  }
}

type Compile = <Props>(sheet: Sheet, styles: Array<Style<Props>>, props: Props) => string[] | void[]

type Hired = {
  component: Compile
  global: Compile
}

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

export type { Compile, Hired, Expression, Sheet, Style, TeilerComponent }
export { component, global, createStyleSheet }
export default styled
