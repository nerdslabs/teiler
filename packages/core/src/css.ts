import type { Arguments } from './constructor'
import type { Style, StyleDefinition } from '.'

import { middleware, prefixer, rulesheet, serialize, stringify, compile as stylisCompile } from 'stylis'

const isFalsish = (chunk: unknown): chunk is undefined | null | false | '' => chunk === undefined || chunk === null || chunk === false || chunk === ''

type CompileResult = {
  css: string,
  definitions: StyleDefinition[]
}

function compile<Props>(styles: Array<Style<Props>>, props: Arguments<Props>): CompileResult {
  return styles.reduce<CompileResult>((result, [strings, properties]) => {
    const compiled = strings
      .reduce((acc, strings, index) => {
        acc = [...acc, strings]

        const property = properties.at(index)

        if (property) {
          let value = null
          if (typeof property === 'function') {
            value = property(props)
          } else if (typeof property === 'object') {
            result.definitions = [...result.definitions, property]
            value = property.name
          } else {
            value = property
          }

          if (isFalsish(value) === false) {
            acc = [...acc, value]
          }
        }

        return acc
      }, [])
      .join('')

    result.css = result.css + compiled;

    return result
  }, {css: '', definitions: []})
}

function transpile(css: string): string[] {
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

export { transpile, compile }
