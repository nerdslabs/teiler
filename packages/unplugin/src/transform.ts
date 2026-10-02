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

  for (const { start, tag, quasi } of templates) {
    const target = resolve(tag)
    const name = target && (namespaces.has(target.name) ? target.member : named.get(target.name))

    if (name === undefined || name === null || !TAGS.includes(name)) {
      continue
    }

    const cooked = quasi.quasis.map((element) => element.value.cooked)

    if (cooked.some((value) => typeof value !== 'string')) {
      continue
    }

    const strings = minify(cooked as string[]) ?? (cooked as string[])
    const bounds = [quasi.start, ...quasi.expressions.flatMap((expression) => [expression.start, expression.end]), quasi.end]
    const last = bounds.length - 2

    string.prependRight(start, '/*#__PURE__*/ ')

    for (let index = 0; index < bounds.length; index += 2) {
      const array = index === 0 ? `([${strings.map((value) => JSON.stringify(value)).join(', ')}]` : ''
      string.update(bounds[index], bounds[index + 1], array + (index === last ? ')' : ', '))
    }
  }

  if (!string.hasChanged()) {
    return null
  }

  return { code: string.toString(), map: string.generateMap({ hires: true, source: id, includeContent: true }) }
}

export { MODULES, transform }
