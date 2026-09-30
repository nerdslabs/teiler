import type { Expression, ParserOptions, TaggedTemplateExpression } from 'oxc-parser'

import MagicString from 'magic-string'
import { Visitor, parseSync } from 'oxc-parser'
import { minify } from './minify'

type Result = { code: string; map: ReturnType<MagicString['generateMap']> }

const MODULES = ['@teiler/core', '@teiler/vue', '@teiler/svelte']
const TAGS = ['component', 'global', 'keyframes', 'css', 'pattern']

function lang(id: string): ParserOptions['lang'] {
  const [path, query = ''] = id.split('?')
  const match = /\.[cm]?([jt]sx?)$/.exec(path) ?? /lang\.([jt]sx?)(&|$)/.exec(query)
  return (match?.[1] ?? 'js') as ParserOptions['lang']
}

function resolve(node: Expression): { name: string; member?: string } | null {
  let member: string | undefined
  let current = node

  while (current.type !== 'Identifier') {
    if (current.type === 'MemberExpression' && !current.computed && current.property.type === 'Identifier') {
      member = current.property.name
      current = current.object
    } else if (current.type === 'CallExpression') {
      current = current.callee
    } else {
      return null
    }
  }

  return { name: current.name, member }
}

function transform(code: string, id: string, modules: string[] = MODULES): Result | null {
  const { program, errors } = parseSync(id, code, { lang: lang(id), sourceType: 'module', astType: 'js' })

  if (errors.length > 0) {
    return null
  }

  const named = new Map<string, string>()
  const namespaces = new Set<string>()
  const templates: TaggedTemplateExpression[] = []

  new Visitor({
    ImportDeclaration(node) {
      if (!modules.includes(node.source.value)) {
        return
      }
      for (const specifier of node.specifiers) {
        if (specifier.type === 'ImportNamespaceSpecifier') {
          namespaces.add(specifier.local.name)
        } else if (specifier.type === 'ImportSpecifier') {
          named.set(specifier.local.name, specifier.imported.type === 'Identifier' ? specifier.imported.name : specifier.imported.value)
        }
      }
    },
    TaggedTemplateExpression(node) {
      templates.push(node)
    },
  }).visit(program)

  const string = new MagicString(code)

  for (const { tag, quasi } of templates) {
    const target = resolve(tag)
    const name = target && (namespaces.has(target.name) ? target.member : named.get(target.name))

    if (name === undefined || name === null || !TAGS.includes(name)) {
      continue
    }

    const minified = minify(quasi.quasis.map((element) => element.value.cooked))

    if (minified === null) {
      continue
    }

    quasi.quasis.forEach((element, index) => {
      if (minified[index] === element.value.raw) {
        return
      }
      if (minified[index] === '') {
        string.remove(element.start, element.end)
      } else {
        string.update(element.start, element.end, minified[index])
      }
    })
  }

  if (!string.hasChanged()) {
    return null
  }

  return { code: string.toString(), map: string.generateMap({ hires: true, source: id, includeContent: true }) }
}

export { MODULES, transform }
