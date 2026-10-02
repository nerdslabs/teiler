import { dts } from 'rolldown-plugin-dts'

const input = ['index', 'vite', 'rollup', 'rolldown', 'webpack', 'rspack', 'esbuild'].map((name) => `src/${name}.ts`)
const external = /^[^./]/

export default [
  {
    input,
    external,
    output: {
      dir: 'dist',
      format: 'esm',
      sourcemap: true,
    },
    watch: {
      clearScreen: false
    }
  },
  {
    input,
    external,
    output: {
      dir: 'dist',
      format: 'es',
    },
    plugins: [dts({ emitDtsOnly: true })],
    watch: {
      clearScreen: false
    }
  },
]
