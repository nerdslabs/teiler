import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import swc from '@rollup/plugin-swc';
import dts from 'rollup-plugin-dts'

import { terser } from 'rollup-plugin-terser'

const defaultPlugins = [
  commonjs(),
  nodeResolve({ extensions: ['.ts'], }),
  json(),
  swc(),
  terser(),
]

export default [
  {
    input: 'src/index.ts',
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
    watch: {
      clearScreen: false
    }
  },
  {
    input: 'src/index.ts',
    output: {
      file: `dist/teiler-core.d.ts`,
      format: 'es',
    },
    plugins: [dts.default()],
    watch: {
      clearScreen: false
    }
  },
]
