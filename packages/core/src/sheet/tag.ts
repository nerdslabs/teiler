type Tag = {
  insertRule(key: string, rule: string): number
  deleteRule(key: string): void
  getRule(key: string): string
  getAllRules(): string
  [k: string]: unknown
}

function createStyleSheetElement(container?: HTMLElement) {
  const head = document.head
  const target = container || head
  const style = document.createElement('style')

  style.setAttribute('data-teiler', '')
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
    getRule: function (key: string): string | null {
      return rules[key] || null
    },
    getAllRules: function (): string {
      return Object.values(rules).join(' ')
    },
  }
}

export function createBrowserTag(container?: HTMLElement): Tag {
  const rules = createStyleSheetElement(container)
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
      rules.removeChild(inserted.get(key))
      inserted.delete(key)
    },
    getRule: function (key: string): string | null {
      return inserted.get(key)?.textContent || null
    },
    getAllRules: function (): string {
      return Array.from(inserted.values()).reduce((string, node) => string + ' ' + node.textContent, '')
    },
  }
}
