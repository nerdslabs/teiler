import type { Style } from '.'
import { compile as stylisCompile, serialize, stringify, middleware, prefixer, rulesheet } from 'stylis'

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

function stylis(css: string): string[] {
  const results = []

  serialize(
    stylisCompile(css),
    middleware([
      stringify,
      prefixer,
      rulesheet((rule) => {
        results.push(rule)
      }),
    ]),
  )

  return results
}

export { stylis, compile }
