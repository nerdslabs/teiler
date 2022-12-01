import css from './css'

type Expression<Props> = (props: Props) => string
type Style<Props> = [string[], Expression<Props>[]]

type TailorComponent<Props> = any & {
  styles: Array<Style<Props>>
}

function stylesToCSS<Props>(styles: Array<Style<Props>>, props: Props) {
  return styles.map(([strings, expressions]) => {
    const mapped = strings.reduce((acc, strings, index) => {
      acc = [...acc, strings]

      const expression = expressions.at(index)

      if (expression) {
        const result = expression(props)
        acc = [...acc, result]
      }

      return acc
    }, [])

    return css(mapped.join(''))
  })
}

type CreateFunction<Props> = (styles: Array<Style<Props>>) => TailorComponent<Props>

type Create<Props> = (string: TemplateStringsArray, ...expressions: Expression<Props>[]) => TailorComponent<Props>

function styled<Props>(createComponent: CreateFunction<Props>, binded: TailorComponent<Props>): Create<Props>
function styled<Props>(createComponent: CreateFunction<Props>, string: TemplateStringsArray, ...expressions: Expression<Props>[]): TailorComponent<Props>
function styled<Props>(createComponent: CreateFunction<Props>, stringOrBinded: TailorComponent<Props> | TemplateStringsArray, ...expressions: Expression<Props>[]): Create<Props> | TailorComponent<Props> {
  if (typeof stringOrBinded === 'function') {
    const binded = stringOrBinded as TailorComponent<Props>
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

export type { Expression, Style, TailorComponent }
export { stylesToCSS }
export default styled
