import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import svelte from 'rollup-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import dts from 'rollup-plugin-dts'
import swc from '@rollup/plugin-swc';
import { transformSync } from '@swc/core'

import { terser } from 'rollup-plugin-terser'

const globals = {
  'svelte/internal': 'svelte/internal',
  svelte: 'svelte',
}

const defaultPlugins = [
  commonjs(),
  nodeResolve({ extensions: ['.ts'], resolveOnly: [/^(?!svelte.*$)/] }),
  json(),
  swc({ include: ['src/**/*.ts'] }),
  svelte({
    emitCss: false,
    compilerOptions: {
      sourcemap: true,
    },
    preprocess: sveltePreprocess({
      typescript({ content, filename }) {
        const { code, map } = transformSync(content, {
          filename: `${filename}.ts`,
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
