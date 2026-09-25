import { dts } from 'rolldown-plugin-dts'

const globals = {
  vue: 'Vue',
}

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
    external: ['vue'],
    watch: {
      clearScreen: false
    }
  },
  {
    input: 'src/index.ts',
    external: ['vue', /^vue\//],
    output: {
      dir: 'dist',
      format: 'es',
      entryFileNames: (chunk) => chunk.name.endsWith('.d') ? 'teiler-vue.d.ts' : '_entry.js',
    },
    plugins: [dts({ emitDtsOnly: true })],
    watch: {
      clearScreen: false
    }
  },
]
