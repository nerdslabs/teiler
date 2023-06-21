import { compile, serialize, stringify, middleware, prefixer, rulesheet } from 'stylis'

function stylis(css: string): string[] {
  const results = []

  serialize(
    compile(css),
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

export { stylis }