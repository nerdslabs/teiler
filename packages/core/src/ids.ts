import type { Style } from './constructor'

const signatures = new Map<string, string>()
const collisions = new Set<string>()
const reported = new Set<string>()

function describe(property: unknown): string {
  if ((typeof property === 'object' || typeof property === 'function') && property !== null && 'styleDefinition' in property) {
    return (property.styleDefinition as { id: string }).id
  }
  if (typeof property === 'object' && property !== null && 'id' in property) {
    return String(property.id)
  }
  return String(property)
}

function register<Props>(id: string, styles: Array<Style<Props>>): void {
  const signature = styles.map(([strings, properties]) => strings.join('\u0000') + '\u0001' + properties.map(describe).join('\u0000')).join('\u0002')
  const known = signatures.get(id)

  if (known === undefined) {
    signatures.set(id, signature)
  } else if (known !== signature) {
    collisions.add(id)
  }
}

function report(id: string): void {
  if (collisions.has(id) && !reported.has(id)) {
    reported.add(id)
    console.warn('[teiler]', `The selector \`.${id}\` matches every component with the same tag and template strings, so it may apply to other components too. Add @teiler/unplugin or set an id with \`withConfig({ componentId })\`.`)
  }
}

export { register, report }
