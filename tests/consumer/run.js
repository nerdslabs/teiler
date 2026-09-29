import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'

const root = resolve(import.meta.dirname, '../..')
const source = import.meta.dirname
const packages = ['core', 'vue', 'svelte']

const run = (command, args, cwd) => spawnSync(command, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' }).status === 0
const pnpm = (args, cwd) => {
  const execpath = process.env.npm_execpath
  if (!execpath) {
    return run('pnpm', args, cwd)
  }
  return /\.[cm]?js$/.test(execpath) ? run(process.execPath, [execpath, ...args], cwd) : run(execpath, args, cwd)
}

for (const name of packages) {
  if (!existsSync(join(root, 'packages', name, 'dist'))) {
    console.error(`packages/${name}/dist is missing, run \`pnpm build\` first`)
    process.exit(1)
  }
}

const directory = mkdtempSync(join(tmpdir(), 'teiler-consumer-'))
const packs = join(directory, 'packs')
const project = join(directory, 'project')

mkdirSync(packs)
mkdirSync(project)

const tarballs = Object.fromEntries(
  packages.map((name) => {
    if (!pnpm(['pack', '--pack-destination', packs], join(root, 'packages', name))) {
      process.exit(1)
    }
    const tarball = readdirSync(packs).find((file) => file.startsWith(`teiler-${name}-`))
    return [`@teiler/${name}`, `file:${join(packs, tarball)}`]
  }),
)

for (const entry of readdirSync(source)) {
  if (entry !== 'run.js' && entry !== 'node_modules') {
    cpSync(join(source, entry), join(project, entry), { recursive: true })
  }
}

const manifest = JSON.parse(readFileSync(join(source, 'package.json'), 'utf8'))
manifest.dependencies = { ...manifest.dependencies, '@teiler/svelte': tarballs['@teiler/svelte'], '@teiler/vue': tarballs['@teiler/vue'] }
writeFileSync(join(project, 'package.json'), JSON.stringify(manifest, null, 2))
writeFileSync(join(project, 'pnpm-workspace.yaml'), `overrides:\n  '@teiler/core': '${tarballs['@teiler/core']}'\n`)

if (!pnpm(['install', '--no-frozen-lockfile'], project)) {
  process.exit(1)
}

const bin = (name, path) => join(project, 'node_modules', name, path)

const checks = [
  ...['typescript-5.0', 'typescript-5.9', 'typescript', 'typescript-7.0'].map((typescript) => ({
    name: `vue: tsc (${JSON.parse(readFileSync(bin(typescript, 'package.json'), 'utf8')).version})`,
    args: [bin(typescript, 'bin/tsc'), '-p', 'tsconfig.vue.json'],
  })),
  {
    name: 'vue: tsc, nodenext',
    args: [bin('typescript', 'bin/tsc'), '-p', 'tsconfig.vue.json', '--module', 'nodenext', '--moduleResolution', 'nodenext'],
  },
  {
    name: 'vue: vue-tsc',
    args: [bin('vue-tsc', 'bin/vue-tsc.js'), '-p', 'tsconfig.vue.json'],
  },
  {
    name: 'svelte: svelte-check',
    args: [bin('svelte-check', 'bin/svelte-check'), '--tsconfig', './tsconfig.svelte.json'],
  },
]

const failed = checks.filter(({ name, args }) => {
  console.log(`\n> ${name}`)
  return !run(process.execPath, args, project)
})

console.log()
checks.forEach(({ name }) => console.log(`${failed.some((check) => check.name === name) ? '✗' : '✓'} ${name}`))

if (failed.length > 0) {
  console.log(`\nConsumer project kept in ${project}`)
  process.exit(1)
}

rmSync(directory, { recursive: true, force: true })
