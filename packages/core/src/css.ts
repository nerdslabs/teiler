import type { Arguments, HTMLElements } from './constructor'
import type { Pattern, Style, StyleDefinition } from '.'

import { middleware, prefixer, rulesheet, serialize, stringify, compile as stylisCompile } from 'stylis'

const isFalsish = (chunk: unknown): chunk is undefined | null | false | '' => chunk === undefined || chunk === null || chunk === false || chunk === ''

type CompileResult<Props> = {
  css: string
  definitions: StyleDefinition<HTMLElements, Props>[]
}

function compile<Props>(styles: Array<Style<Props>>, props: Arguments<Props>): CompileResult<Props> {
  return styles.reduce(
    (result, [strings, properties]) => {
      const compiled = strings
        .reduce((acc, strings, index) => {
          acc = [...acc, strings]

          const property = properties.at(index)

          if (property) {
            let value = null
            if (typeof property === 'function') {
              if ('styleDefinition' in property) {
                const styleDefinition = property.styleDefinition as StyleDefinition<HTMLElements, Props>
                result.definitions = [...result.definitions, styleDefinition]
                value = '.' + styleDefinition.id
              } else {
                value = property(props)
              }
            } else if (typeof property === 'object' && '__pattern__' in property) {
              const pattern = property as Pattern<HTMLElements, Props>
              value = '.' + pattern.id
            } else if (typeof property === 'object') {
              const styleDefinition = property as StyleDefinition<HTMLElements, Props>
              result.definitions = [...result.definitions, styleDefinition]
              value = styleDefinition.id
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

      result.css = result.css + compiled

      return result
    },
    { css: '', definitions: [] },
  )
}

function transpile(css: string): string {
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

  return results.join(' ')
}

export { transpile, compile }
