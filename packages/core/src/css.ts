import type { Sheet } from './sheet'

import hash from './hash'
import { compile, serialize, stringify, middleware, prefixer, rulesheet } from 'stylis'

function css(sheet: Sheet, styles: string) {
  const id = hash(styles)
  const selector = 'teiler-' + id

  serialize(
    compile(`.${selector} { ${styles} }`),
    middleware([
      stringify,
      prefixer,
      rulesheet((rule) => {
        sheet.insert(rule)
      }),
    ]),
  )

  return selector
}

export default css
