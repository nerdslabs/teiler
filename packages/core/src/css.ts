import type { Sheet } from './sheet'

import { compile, serialize, stringify, middleware, prefixer, rulesheet } from 'stylis'

function stylis(sheet: Sheet, css: string) {
  serialize(
    compile(css),
    middleware([
      stringify,
      prefixer,
      rulesheet((rule) => {
        sheet.insert(rule)
      }),
    ]),
  )
}

export { stylis }