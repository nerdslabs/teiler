import type { Options } from '.'
import type { UnpluginOptions } from 'unplugin'

import { describe, expect, test } from 'vitest'
import { transform as transformCode, unplugin } from '.'
import { fileURLToPath } from 'node:url'

const code = "import { component } from '@teiler/vue'\ncomponent.div`\n  color: red;\n`"

function setup(framework: 'vite' | 'webpack' | 'rspack' | 'rollup', options?: Options) {
  const plugin = unplugin.raw({ componentId: false, ...options }, { framework } as never) as UnpluginOptions
  const handler = (plugin.transform as { handler: (this: unknown, code: string, id: string) => { code: string } | null }).handler
  const warnings: unknown[] = []
  return {
    plugin,
    transform: (source = code, id = 'file.js') => handler.call({ warn: (warning: unknown) => warnings.push(warning) }, source, id)?.code ?? null,
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

  test.each(['build', 'serve'])('adds component ids with the vite %s command', (command) => {
    const { plugin, transform } = setup('vite', { componentId: undefined })
    ;(plugin.vite?.configResolved as (config: unknown) => void)({ command })
    expect(transform()).toMatch(/component\.div\.withConfig\("[\w-]{9,}"\)/)
  })

  test('creates component ids from the package name and the path in the package', () => {
    const file = fileURLToPath(new URL('Button.ts', import.meta.url))
    const expected = transformCode(code, file, { scope: '@teiler/unplugin|src/Button.ts' })?.code

    expect(setup('rollup', { componentId: true }).transform(code, file)).toBe(expected)
    expect(setup('rollup', { componentId: true }).transform(code, `${file}?vue&type=script&lang.ts`)).toBe(expected)
  })

  test.each([
    { options: {}, expected: /withConfig\("[\w-]{9,}", "Button"\)/ },
    { options: { displayName: false }, expected: /withConfig\("[\w-]{9,}"\)/ },
  ])('adds names with $options', ({ options, expected }) => {
    const { transform } = setup('rollup', { componentId: undefined, ...options })
    expect(transform("import { component } from '@teiler/vue'\nconst Button = component.button`color: red;`")).toMatch(expected)
  })
})
