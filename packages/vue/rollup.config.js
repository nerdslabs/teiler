import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'

import { terser } from 'rollup-plugin-terser'

const globals = {
  vue: 'Vue',
}

const defaultPlugins = [
  commonjs(),
  nodeResolve({}),
  json(),
  esbuild.default({ sourceMap: true }),
]

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/teiler-vue.umd.js',
        name: 'teiler-vue',
        format: 'umd',
        sourcemap: true,
        globals,
      },
      {
        file: 'dist/teiler-vue.cjs.js',
        format: 'cjs',
        sourcemap: true,
        globals,
      },
      {
        file: 'dist/teiler-vue.esm.js',
        format: 'esm',
        sourcemap: true,
        globals,
      },
    ],
    plugins: [...defaultPlugins, terser()],
    external: ["vue"],
    watch: {
      clearScreen: false
    }
  },
  {
    input: 'src/index.ts',
    output: {
      file: `dist/teiler-vue.d.ts`,
      format: 'es',
    },
    plugins: [...defaultPlugins, dts.default()],
    watch: {
      clearScreen: false
    }
  },
]
