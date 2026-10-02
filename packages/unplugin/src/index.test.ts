import type { Options } from '.'
import type { UnpluginOptions } from 'unplugin'

import { describe, expect, test } from 'vitest'
import { unplugin } from '.'

const code = "import { component } from '@teiler/vue'\ncomponent.div`\n  color: red;\n`"

function setup(framework: 'vite' | 'webpack' | 'rspack' | 'rollup', options?: Options) {
  const plugin = unplugin.raw(options, { framework } as never) as UnpluginOptions
  const handler = (plugin.transform as { handler: (this: unknown, code: string, id: string) => { code: string } | null }).handler
  const warnings: unknown[] = []
  return {
    plugin,
    transform: (source = code) => handler.call({ warn: (warning: unknown) => warnings.push(warning) }, source, 'file.js')?.code ?? null,
    warnings,
  }
}

describe('plugin', () => {
  test.each([
    { command: 'build', expected: '/*#__PURE__*/ component.div(["color:red;"])' },
    { command: 'serve', expected: null },
  ])('uses the vite $command command', ({ command, expected }) => {
    const { plugin, transform } = setup('vite')
    ;(plugin.vite?.configResolved as (config: unknown) => void)({ command })
    expect(transform()?.split('\n')[1] ?? null).toBe(expected)
  })

  test.each([
    { framework: 'webpack', mode: 'production', changed: true },
    { framework: 'webpack', mode: undefined, changed: true },
    { framework: 'webpack', mode: 'development', changed: false },
    { framework: 'webpack', mode: 'none', changed: false },
    { framework: 'rspack', mode: 'production', changed: true },
    { framework: 'rspack', mode: 'development', changed: false },
  ] as const)('uses the $framework $mode mode', ({ framework, mode, changed }) => {
    const { plugin, transform } = setup(framework)
    plugin[framework]?.({ options: { mode } } as never)
    expect(transform() !== null).toBe(changed)
  })

  test('transforms without a mode', () => {
    expect(setup('rollup').transform()).toContain('/*#__PURE__*/ component.div(["color:red;"])')
  })

  test.each([
    { options: { minify: true }, expected: 'component.div`color:red;`' },
    { options: { pure: true }, expected: '/*#__PURE__*/ component.div(["\\n  color: red;\\n"])' },
    { options: { minify: true, pure: true }, expected: '/*#__PURE__*/ component.div(["color:red;"])' },
  ])('overrides the mode with $options', ({ options, expected }) => {
    const { plugin, transform } = setup('vite', options)
    ;(plugin.vite?.configResolved as (config: unknown) => void)({ command: 'serve' })
    expect(transform()?.split('\n')[1]).toBe(expected)
  })

  test('reports warnings in development', () => {
    const { plugin, transform, warnings } = setup('vite')
    ;(plugin.vite?.configResolved as (config: unknown) => void)({ command: 'serve' })
    expect(transform("import { component } from '@teiler/vue'\ncomponent.div`\n  color red;\n`")).toBeNull()
    expect(warnings).toEqual([expect.objectContaining({ message: expect.stringContaining('`component` template') })])
  })
})
