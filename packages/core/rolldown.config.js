import { dts } from 'rolldown-plugin-dts'

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
    watch: {
      clearScreen: false
    }
  },
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'es',
      entryFileNames: (chunk) => chunk.name.endsWith('.d') ? 'teiler-core.d.ts' : '_entry.js',
    },
    plugins: [dts({ emitDtsOnly: true })],
    watch: {
      clearScreen: false
    }
  },
]
