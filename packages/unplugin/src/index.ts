import type { FilterPattern, UnpluginFactory } from 'unplugin'

import { MODULES, transform } from './transform'
import { createUnplugin } from 'unplugin'
import { minify } from './minify'

type Options = {
  include?: FilterPattern
  exclude?: FilterPattern
  modules?: string[]
  minify?: boolean
  pure?: boolean
}

const factory: UnpluginFactory<Options | undefined> = (options = {}) => {
  const modules = [...MODULES, ...(options.modules ?? [])]
  let production = true

  return {
    name: 'teiler',
    enforce: 'post',
    vite: {
      configResolved(config) {
        production = config.command === 'build'
      },
    },
    webpack(compiler) {
      production = compiler.options.mode === undefined || compiler.options.mode === 'production'
    },
    rspack(compiler) {
      production = compiler.options.mode === undefined || compiler.options.mode === 'production'
    },
    transform: {
      filter: {
        id: { include: options.include, exclude: options.exclude ?? [/node_modules/] },
        code: modules,
      },
      handler(code, id) {
        const result = transform(code, id, { modules, minify: options.minify ?? production, pure: options.pure ?? production })

        if (result === null) {
          return null
        }

        result.warnings.forEach((warning) => this.warn(warning))

        return result.code === code ? null : { code: result.code, map: result.map }
      },
    },
  }
}

const unplugin = createUnplugin(factory)

export type { Options }
export { minify, transform, unplugin }
export default unplugin
