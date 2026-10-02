import type { PluginOption } from 'vite'

import { describe, expect, test } from 'vitest'
import { build, createLogger, createServer } from 'vite'
import { fileURLToPath } from 'node:url'
import { rolldown } from 'rolldown'
import { stripVTControlCharacters } from 'node:util'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import teiler from './vite'
import teilerRolldown from './rolldown'
import vue from '@vitejs/plugin-vue'

const fixture = (name: string) => fileURLToPath(new URL(name, import.meta.url))
const external = [/^@teiler\//, /^vue/, /^svelte/]

async function bundle(entry: string, plugins: PluginOption[], ssr = false) {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    plugins: [...plugins, teiler()],
    build: {
      write: false,
      minify: true,
      lib: { entry, formats: ['es'], fileName: 'index' },
      ssr,
      rolldownOptions: { external },
    },
  })
  const [output] = Array.isArray(result) ? result : [result]
  return 'output' in output ? output.output.map((chunk) => ('code' in chunk ? chunk.code : '')).join('') : ''
}

describe('build', () => {
  test.each([
    { name: 'vue', entry: fixture('Button.fixture.vue'), plugins: [vue()] },
    { name: 'svelte', entry: fixture('Button.fixture.svelte'), plugins: [svelte()] },
  ])('minifies templates in $name components with vite', async ({ entry, plugins }) => {
    const code = await bundle(entry, plugins)
    expect(code).toMatch(/\/\*\s*[#@]__PURE__\s*\*\/\s*\w+\.button\.withConfig\(\s*["`][\w-]{9,}["`](?:,\s*["`]\w+["`])?\s*\)\(\["color:",\s*";&:hover\{color:green;\}"\]/)
  })

  test.each([
    { name: 'vue', entry: fixture('Button.fixture.vue'), plugins: () => [vue()] },
    { name: 'svelte', entry: fixture('Button.fixture.svelte'), plugins: () => [svelte()] },
  ])('creates the same component ids for the client and the server in $name components', async ({ entry, plugins }) => {
    const ids = async (ssr: boolean) => [...(await bundle(entry, plugins(), ssr)).matchAll(/withConfig\(\s*["`]([\w-]{9,})["`]/g)].map(([, id]) => id)
    const client = await ids(false)
    expect(client).toHaveLength(1)
    expect(await ids(true)).toEqual(client)
  })

  test('minifies templates and removes unused definitions with rolldown', async () => {
    const input = fixture('Entry.fixture.ts')
    const result = await (await rolldown({ input, external, plugins: [teilerRolldown()] })).generate({ format: 'esm' })
    expect(result.output[0].code).toMatch(/pattern\.button\.withConfig\(\s*"[\w-]{9,}",\s*"Button"\s*\)\(\["color:red;&:hover\{color:green;\}"\]\)/)
    expect(result.output[0].code).not.toContain('unused')
  })

  test('reports warnings to the bundler', async () => {
    const logs: Array<{ level: string; plugin?: string; message: string; loc?: { line: number; column: number } }> = []
    const bundle = await rolldown({ input: fixture('Warnings.fixture.ts'), external, plugins: [teilerRolldown()], onLog: (level, log) => void logs.push({ level, ...log }) })
    await bundle.generate({ format: 'esm' })
    expect(logs).toEqual([expect.objectContaining({ level: 'warn', plugin: 'teiler', message: expect.stringContaining('`pattern` template'), loc: expect.objectContaining({ line: 7, column: 22 }) })])
  })

  test('keeps the CSS and reports warnings with a code frame in the vite dev server', async () => {
    const warnings: string[] = []
    const customLogger = createLogger()
    customLogger.warn = (message) => void warnings.push(stripVTControlCharacters(message))
    const server = await createServer({
      configFile: false,
      root: fixture('.'),
      customLogger,
      plugins: [teiler()],
      resolve: { alias: { '@teiler/core': fixture('../../core/src/index.ts') } },
      server: { middlewareMode: true, ws: false },
      optimizeDeps: { noDiscovery: true },
    })
    const result = await server.transformRequest('/Warnings.fixture.ts')
    await server.close()
    expect(result?.code).toMatch(/pattern\.button\.withConfig\("[\w-]{9,}"(?:, "\w+")?\)`\n {2}color red;\n`/)
    expect(warnings).toEqual([expect.stringMatching(/Warnings\.fixture\.ts:7:22\n[\s\S]*pattern\.button`\n\s+\|\s+\^/)])
  })
})
