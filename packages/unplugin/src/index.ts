import type { FilterPattern, UnpluginFactory } from 'unplugin'

import { MODULES, transform } from './transform'
import { dirname, isAbsolute, join, relative, sep } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'
import { createUnplugin } from 'unplugin'
import { minify } from './minify'

type Options = {
  include?: FilterPattern
  exclude?: FilterPattern
  modules?: string[]
  minify?: boolean
  pure?: boolean
  componentId?: boolean
  displayName?: boolean
}

const packages = new Map<string, { name: string; root: string } | null>()

function manifest(directory: string): { name: string; root: string } | null {
  if (!packages.has(directory)) {
    const file = join(directory, 'package.json')
    const parent = dirname(directory)
    const found = existsSync(file) ? { name: String(JSON.parse(readFileSync(file, 'utf8')).name ?? ''), root: directory } : parent === directory ? null : manifest(parent)
    packages.set(directory, found)
  }
  return packages.get(directory) ?? null
}

function scope(id: string): string {
  const file = id.split('?')[0]
  const found = isAbsolute(file) ? manifest(dirname(file)) : null
  return found === null ? file : `${found.name}|${relative(found.root, file).split(sep).join('/')}`
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
        const result = transform(code, id, { modules, minify: options.minify ?? production, pure: options.pure ?? production, componentId: options.componentId ?? true, displayName: options.displayName ?? !production, scope: scope(id) })

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
