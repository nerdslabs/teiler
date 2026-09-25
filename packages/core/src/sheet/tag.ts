type Tag = {
  insertRule(key: string, rule: string): number
  deleteRule(key: string): void
  hasRule(key: string): boolean
  getRule(key: string): string | null
  getAllRules(): string
  getAllKeys(): string[]
  [k: string]: unknown
}

function createStyleSheetElement(container?: HTMLElement, nonce?: string) {
  const head = document.head
  const target = container || head
  const style = document.createElement('style')

  style.setAttribute('data-teiler', '')
  if (nonce) {
    style.setAttribute('nonce', nonce)
  }
  target.appendChild(style)

  return style
}

export function createServerTag(): Tag {
  const rules: { [key: string]: string } = {}

  return {
    insertRule: function (key: string, rule: string): number {
      rules[key] = rule
      return Object.keys(rules).length
    },
    deleteRule: function (key: string): void {
      delete rules[key]
    },
    hasRule: function (key: string): boolean {
      return key in rules
    },
    getRule: function (key: string): string | null {
      return rules[key] || null
    },
    getAllRules: function (): string {
      return Object.values(rules).join(' ')
    },
    getAllKeys: function (): string[] {
      return Object.keys(rules)
    },
  }
}

export function createBrowserTag(container?: HTMLElement, nonce?: string): Tag {
  const rules = createStyleSheetElement(container, nonce)
  const inserted = new Map<string, Text>()

  return {
    insertRule: function (key: string, rule: string): number {
      const node = document.createTextNode(rule)
      if (inserted.has(key) === false) {
        inserted.set(key, node)
        rules.appendChild(node)
      }
      return inserted.size
    },
    deleteRule: function (key: string): void {
      rules.removeChild(inserted.get(key)!)
      inserted.delete(key)
    },
    hasRule: function (key: string): boolean {
      return inserted.has(key)
    },
    getRule: function (key: string): string | null {
      return inserted.get(key)?.textContent || null
    },
    getAllRules: function (): string {
      return Array.from(inserted.values()).reduce((string, node) => string + ' ' + node.textContent, '')
    },
    getAllKeys: function (): string[] {
      return Array.from(inserted.keys())
    },
  }
}
