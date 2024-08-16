import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import svelte from 'rollup-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import { transformSync } from 'esbuild'

import { terser } from 'rollup-plugin-terser'

const globals = {
  'svelte/internal': 'svelte/internal',
  svelte: 'svelte',
}

const defaultPlugins = [
  commonjs(),
  nodeResolve({ resolveOnly: [/^(?!svelte.*$)/] }),
  json(),
  esbuild.default({ sourceMap: true }),
  svelte({
    emitCss: false,
    compilerOptions: {
      // dev: production === false,
      sourcemap: true,
      // generate: 'ssr',
    },
    preprocess: sveltePreprocess({
      typescript({ content }) {
        const { code, map } = transformSync(content, {
          loader: 'ts',
          tsconfigRaw: {
            compilerOptions: {
              importsNotUsedAsValues: 'error',
              preserveValueImports: true,
            },
          },
        })
        return { code, map }
      },
    }),
  }),
]

export default [
  {
    input: 'src/index.ts',
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
    plugins: [...defaultPlugins, terser()],
    watch: {
      clearScreen: false
    }
  },
  {
    input: 'src/index.ts',
    output: {
      file: `dist/teiler-svelte.d.ts`,
      format: 'es',
    },
    plugins: [...defaultPlugins, dts.default()],
    watch: {
      clearScreen: false
    }
  },
]
