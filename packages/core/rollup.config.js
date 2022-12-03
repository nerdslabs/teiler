import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'

import { terser } from 'rollup-plugin-terser'

const defaultPlugins = [
  commonjs(),
  nodeResolve({ resolveOnly: [/^(?!svelte.*$)/] }),
  json(),
  esbuild.default({ sourceMap: true }),
  // terser(),
]

export default [
  {
    input: 'src/styled.ts',
    output: [
      {
        file: 'dist/teiler-core.umd.js',
        name: 'teiler-core',
        format: 'umd',
        sourcemap: true,
      },
      {
        file: 'dist/teiler-core.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/teiler-core.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: defaultPlugins,
  },
  {
    input: 'src/styled.ts',
    output: {
      file: `dist/teiler-core.d.ts`,
      format: 'es',
    },
    plugins: [dts.default()],
  },
]
