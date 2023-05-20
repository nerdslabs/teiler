import type { Sheet } from './sheet'

import compile from './css'
import createStyleSheet from './sheet'

type Expression<Props> = (props: Props) => string
type Style<Props> = [string[], Expression<Props>[]]

type TailorComponent<Type, Props> = Type & {
  styles: Array<Style<Props>>
}

const isFalsish = (chunk: any): chunk is undefined | null | false | '' => chunk === undefined || chunk === null || chunk === false || chunk === ''

function css<Props>(sheet: Sheet, styles: Array<Style<Props>>, props: Props) {
  return styles.map(([strings, expressions]) => {
    const mapped = strings.reduce((acc, strings, index) => {
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

    return compile(sheet, mapped.join(''))
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

type CSS = <Props>(styles: Array<Style<Props>>, props: Props) => string[]

type Hired = {
  sheet: Sheet
  css: CSS
}

function hire(options?: HireOptions): Hired {
  const sheet = options?.sheet || createStyleSheet({})
  const cssBindedSheet = <Props>(styles: Array<Style<Props>>, props: Props): string[] => css(sheet, styles, props)

  return {
    sheet,
    css: cssBindedSheet,
  }
}

export type { CSS, Hired, HireOptions, Expression, Style, TailorComponent }
export { hire, createStyleSheet }
export default styled
