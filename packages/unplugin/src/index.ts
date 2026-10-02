import type { FilterPattern, UnpluginFactory } from 'unplugin'

import { MODULES, transform } from './transform'
import { dirname, isAbsolute, join, relative, sep } from 'node:path'
import { existsSync, readFileSync, realpathSync } from 'node:fs'
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

const versions = new Map<string, string | null>()

function installed(directory: string, module: string): string | null {
  const key = `${directory}|${module}`
  if (!versions.has(key)) {
    const file = join(directory, 'node_modules', module, 'package.json')
    const parent = dirname(directory)
    const found = existsSync(file) ? (realpathSync(file).split(sep).includes('node_modules') ? String(JSON.parse(readFileSync(file, 'utf8')).version ?? '') : null) : parent === directory ? null : installed(parent, module)
    versions.set(key, found)
  }
  return versions.get(key) ?? null
}

function outdated(id: string, code: string): Array<[module: string, version: string]> {
  const file = id.split('?')[0]
  if (!isAbsolute(file)) {
    return []
  }
  return MODULES.filter((module) => code.includes(module)).flatMap((module): Array<[string, string]> => {
    const version = installed(dirname(file), module)
    const [major, minor] = (version ?? '').split('.').map(Number)
    return version !== null && major === 0 && minor < 2 ? [[module, version]] : []
  })
}

function scope(id: string): string {
  const file = id.split('?')[0]
  const found = isAbsolute(file) ? manifest(dirname(file)) : null
  return found === null ? file : `${found.name}|${relative(found.root, file).split(sep).join('/')}`
}

const factory: UnpluginFactory<Options | undefined> = (options = {}) => {
  const modules = [...MODULES, ...(options.modules ?? [])]
  let production = true
  const reported = new Set<string>()

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
        const componentId = options.componentId ?? true
        const displayName = options.displayName ?? !production
        const old = componentId || displayName ? outdated(id, code) : []

        for (const [module, version] of old) {
          if (!reported.has(`${module}@${version}`)) {
            reported.add(`${module}@${version}`)
            this.warn(`${module} ${version} does not support \`withConfig\`, so component ids and names are not added. Update it to 0.2 or later.`)
          }
        }

        const supported = old.length === 0
        const result = transform(code, id, { modules, minify: options.minify ?? production, pure: options.pure ?? production, componentId: componentId && supported, displayName: displayName && supported, scope: scope(id) })

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
