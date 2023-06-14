import type { Sheet } from './sheet'

import { stylis } from './css'
import createStyleSheet from './sheet'
import hash from './hash'

type Expression<Props> = (props: Props) => string
type Style<Props> = [string[], Expression<Props>[]]

type TailorComponent<Type, Props> = Type & {
  styles: Array<Style<Props>>
}

const isFalsish = (chunk: unknown): chunk is undefined | null | false | '' => chunk === undefined || chunk === null || chunk === false || chunk === ''

function compile<Props>(styles: Array<Style<Props>>, props: Props) {
  return styles.map(([strings, expressions]) => {
    return strings.reduce((acc, strings, index) => {
      acc = [...acc, strings]

      const expression = expressions.at(index)

      if (expression) {
        const result = expression(props)
        if (isFalsish(result) === false) {
          acc = [...acc, result]
        }
      }

      return acc
    }, []).join('')
  })
}

type CreateFunction<Type, Props> = (styles: Array<Style<Props>>) => TailorComponent<Type, Props>

type Create<Type, Props> = (string: TemplateStringsArray, ...expressions: Expression<Props>[]) => TailorComponent<Type, Props>

function styled<Type, Props>(createComponent: CreateFunction<Type, Props>, binded: TailorComponent<Type, Props>): Create<Type, Props>
function styled<Type, Props>(createComponent: CreateFunction<Type, Props>, string: TemplateStringsArray, ...expressions: Expression<Props>[]): TailorComponent<Type, Props>
function styled<Type, Props>(createComponent: CreateFunction<Type, Props>, stringOrBinded: TailorComponent<Type, Props> | TemplateStringsArray, ...expressions: Expression<Props>[]): Create<Type, Props> | TailorComponent<Type, Props> {
  if (typeof stringOrBinded === 'function') {
    const binded = stringOrBinded as TailorComponent<Type, Props>
    return (strings: TemplateStringsArray, ...expressions: Expression<Props>[]) => {
      const style: Style<Props> = [Array.from(strings), expressions]
      return createComponent([...binded.styles, style])
    }
  } else {
    const strings = stringOrBinded as TemplateStringsArray
    const style: Style<Props> = [Array.from(strings), expressions]
    return createComponent([style])
  }
}

type HireOptions = {
  sheet?: Sheet
}

type Compile = <Props>(styles: Array<Style<Props>>, props: Props) => string[] | void[]

type Hired = {
  sheet: Sheet
  component: Compile
  global: Compile
}

function hire(options?: HireOptions): Hired {
  const sheet = options?.sheet || createStyleSheet({})

  return {
    sheet,
    component: <Props>(styles: Array<Style<Props>>, props: Props): string[] => {
      return compile(styles, props).map((css) => {
        const id = hash(css)
        const selector = 'teiler-' + id

        stylis(sheet, `.${selector} { ${css} }`)

        return selector
      })
    },
    global: <Props>(styles: Array<Style<Props>>, props: Props): void[] => {
      return compile(styles, props).map((css) => {
        stylis(sheet, css)
      })
    }
  }
}

export type { Compile, Hired, HireOptions, Expression, Sheet, Style, TailorComponent }
export { hire, createStyleSheet }
export default styled
