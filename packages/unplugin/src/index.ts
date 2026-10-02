import type { FilterPattern, UnpluginFactory } from 'unplugin'

import { MODULES, transform } from './transform'
import { createUnplugin } from 'unplugin'
import { minify } from './minify'

type Options = {
  include?: FilterPattern
  exclude?: FilterPattern
  modules?: string[]
}

const factory: UnpluginFactory<Options | undefined> = (options = {}) => {
  const modules = [...MODULES, ...(options.modules ?? [])]

  return {
    name: 'teiler',
    enforce: 'post',
    transform: {
      filter: {
        id: { include: options.include, exclude: options.exclude ?? [/node_modules/] },
        code: modules,
      },
      handler(code, id) {
        return transform(code, id, modules)
      },
    },
  }
}

const unplugin = createUnplugin(factory)

export type { Options }
export { minify, transform, unplugin }
export default unplugin
