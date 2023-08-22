import type { Style, StyleDefinition } from '.'

import { middleware, prefixer, rulesheet, serialize, stringify, compile as stylisCompile } from 'stylis'
import hash from './hash'

const isFalsish = (chunk: unknown): chunk is undefined | null | false | '' => chunk === undefined || chunk === null || chunk === false || chunk === ''

function compile<Props>(styles: Array<Style<Props>>, props: Props): StyleDefinition[] {
  return styles.reduce((styles: StyleDefinition[], [strings, properties]) => {
    const compiled = strings
      .reduce((acc, strings, index) => {
        acc = [...acc, strings]

        const property = properties.at(index)

        if (property) {
          let result = null
          if (typeof property === 'function') {
            result = property(props)
          } else if (typeof property === 'object') {
            styles = [...styles, property]
            result = property.name
          } else {
            result = property
          }

          if (isFalsish(result) === false) {
            acc = [...acc, result]
          }
        }

        return acc
      }, [])
      .join('')

    const id = hash(compiled)
    const name = `teiler-${id}`

    const definition = {
      id,
      name,
      css: compiled,
    }

    return [...styles, definition]
  }, [])
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
