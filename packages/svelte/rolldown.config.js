import { readFileSync } from 'fs'
import path from 'path'
import { compile, preprocess } from 'svelte/compiler'
import sveltePreprocess from 'svelte-preprocess'
import { dts } from 'rolldown-plugin-dts'
import { transformSync } from '@swc/core'

const globals = {
  'svelte/internal': 'svelte/internal',
  'svelte/internal/disclose-version': 'svelte/internal/disclose-version',
  'svelte/store': 'svelte/store',
  svelte: 'svelte',
}

function sveltePlugin() {
  return {
    name: 'svelte-rolldown',

    resolveId(source, importer) {
      if (source.endsWith('.svelte')) {
        if (!importer) return path.resolve(source)
        return path.resolve(path.dirname(importer), source)
      }
      return null
    },

    async transform(code, id) {
      if (!id.endsWith('.svelte')) return null

      const source = readFileSync(id, 'utf-8')

      const preprocessed = await preprocess(
        source,
        sveltePreprocess({
          typescript({ content, filename }) {
            const { code, map } = transformSync(content, {
              filename: `${filename}.ts`,
              sourceMaps: true,
            })
            return { code, map }
          },
        }),
        { filename: id },
      )

      const { js } = compile(preprocessed.code, {
        filename: id,
        sourcemap: false,
      })

      return {
        code: js.code,
        moduleType: 'js',
      }
    },
  }
}

export default [
  {
    input: 'src/index.ts',
    external: ['svelte', 'svelte/internal', /^svelte\//],
    output: [
      {
        file: 'dist/teiler-svelte.umd.js',
        name: 'teiler-svelte',
        format: 'umd',
        sourcemap: true,
        globals,
      },
      {
        file: 'dist/teiler-svelte.cjs.js',
        format: 'cjs',
        sourcemap: true,
        globals,
      },
      {
        file: 'dist/teiler-svelte.esm.js',
        format: 'esm',
        sourcemap: true,
        globals,
      },
    ],
    plugins: [sveltePlugin()],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: 'src/index.ts',
    external: ['svelte', 'svelte/internal', /^svelte\//],
    output: {
      dir: 'dist',
      format: 'es',
      entryFileNames: (chunk) => (chunk.name.endsWith('.d') ? 'teiler-svelte.d.ts' : '_entry.js'),
    },
    plugins: [
      {
        name: 'svelte-dts-redirect',
        resolveId(id, importer) {
          if (id.endsWith('.svelte') && importer) {
            return { id: path.resolve(path.dirname(importer), id + '.d.ts') }
          }
          return null
        },
      },
      dts({ emitDtsOnly: true }),
    ],
    watch: {
      clearScreen: false,
    },
  },
]
