import { readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = resolve(import.meta.dirname, '..')
const directive = '<!-- @ts-expect-error -->'

const expected = new Set(
  readdirSync(join(root, 'src'), { recursive: true })
    .filter((file) => file.endsWith('.svelte'))
    .flatMap((file) =>
      readFileSync(join(root, 'src', file), 'utf8')
        .split('\n')
        .flatMap((line, index) => (line.trim() === directive ? [`src/${file}:${index + 2}`] : [])),
    ),
)

const check = spawnSync('svelte-check', ['--tsconfig', './tsconfig.json', '--output', 'machine'], { cwd: root, encoding: 'utf8', shell: true })

if (!/^\d+ COMPLETED /m.test(check.stdout)) {
  console.error(check.stdout, check.stderr)
  process.exit(1)
}

const errors = check.stdout
  .split('\n')
  .map((line) => line.match(/^\d+ ERROR "(.+?)" (\d+):\d+ "(.*)"$/))
  .filter((match) => match !== null)
  .map(([, file, line, message]) => ({ location: `${relative(root, resolve(root, file))}:${line}`, message }))

const unexpected = errors.filter(({ location }) => !expected.has(location))
const unused = [...expected].filter((location) => !errors.some((error) => error.location === location))

unexpected.forEach(({ location, message }) => console.error(`${location} ${message}`))
unused.forEach((location) => console.error(`${location} expected a type error, got none`))

console.log(`svelte-check: ${errors.length - unexpected.length} expected errors, ${unexpected.length} unexpected, ${unused.length} unused expectations`)

process.exit(unexpected.length > 0 || unused.length > 0 ? 1 : 0)
