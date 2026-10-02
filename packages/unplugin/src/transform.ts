import type { Expression, ParserOptions, TaggedTemplateExpression, TemplateLiteral } from 'oxc-parser'

import MagicString from 'magic-string'
import { createHash } from 'node:crypto'
import { Visitor, parseSync, visitorKeys } from 'oxc-parser'
import { minify } from './minify'

type Warning = { message: string; pos: number; loc: { file: string; line: number; column: number } }
type Result = { code: string; map: ReturnType<MagicString['generateMap']>; warnings: Warning[] }
type Node = { type: string; [key: string]: unknown }
type Options = { modules?: string[]; minify?: boolean; pure?: boolean; componentId?: boolean; scope?: string }

const MODULES = ['@teiler/core', '@teiler/vue', '@teiler/svelte']
const TAGS = ['component', 'global', 'keyframes', 'css', 'pattern']
const IDENTIFIED = ['component', 'global', 'pattern']
const PASCAL_CASE = /^[A-Z](?=.*[a-z])/

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

function configured(node: Expression): boolean {
  let current = node

  while (current.type === 'CallExpression' || current.type === 'MemberExpression') {
    if (current.type === 'CallExpression') {
      const [config] = current.arguments
      const withConfig = current.callee.type === 'MemberExpression' && !current.callee.computed && current.callee.property.type === 'Identifier' && current.callee.property.name === 'withConfig'
      if (
        withConfig &&
        config?.type === 'ObjectExpression' &&
        config.properties.some((property) => property.type === 'Property' && !property.computed && (property.key.type === 'Identifier' ? property.key.name : property.key.type === 'Literal' ? property.key.value : null) === 'componentId')
      ) {
        return true
      }
      current = current.callee
    } else {
      current = current.object
    }
  }

  return false
}

function walk(node: unknown, enter: (node: Node) => boolean): void {
  if (typeof node !== 'object' || node === null || !('type' in node)) {
    return
  }

  const current = node as Node

  if (enter(current)) {
    for (const key of visitorKeys[current.type] ?? []) {
      const child = current[key]
      if (Array.isArray(child)) {
        child.forEach((item) => walk(item, enter))
      } else {
        walk(child, enter)
      }
    }
  }
}

function location(code: string, file: string, offset: number): Pick<Warning, 'pos' | 'loc'> {
  const lines = code.slice(0, offset).split('\n')
  return { pos: offset, loc: { file, line: lines.length, column: lines[lines.length - 1].length } }
}

const escape = (cooked: string) => cooked.replace(/\\|`|\$\{/g, (match) => '\\' + match)

const identify = (scope: string, name: string, index: number) => createHash('sha256').update(`${scope}|${name}|${index}`).digest('base64url').slice(0, 8)

function transform(code: string, id: string, { modules = MODULES, minify: compress = true, pure = true, componentId = true, scope = id.split('?')[0] }: Options = {}): Result | null {
  const { program, errors } = parseSync(id, code, { lang: lang(id), sourceType: 'module', astType: 'js' })

  if (errors.length > 0) {
    return null
  }

  const named = new Map<string, string>()
  const namespaces = new Set<string>()
  const imported = new Set<string>()
  const declarations = new Map<string, TaggedTemplateExpression>()
  const templates: TaggedTemplateExpression[] = []

  new Visitor({
    ImportDeclaration(node) {
      for (const specifier of node.specifiers) {
        if (!modules.includes(node.source.value)) {
          if (PASCAL_CASE.test(specifier.local.name)) {
            imported.add(specifier.local.name)
          }
        } else if (specifier.type === 'ImportNamespaceSpecifier') {
          namespaces.add(specifier.local.name)
        } else if (specifier.type === 'ImportSpecifier') {
          named.set(specifier.local.name, specifier.imported.type === 'Identifier' ? specifier.imported.name : specifier.imported.value)
        }
      }
    },
    VariableDeclarator(node) {
      if (node.id.type === 'Identifier' && node.init?.type === 'TaggedTemplateExpression') {
        declarations.set(node.id.name, node.init)
      }
    },
    TaggedTemplateExpression(node) {
      templates.push(node)
    },
  }).visit(program)

  const tagName = ({ tag }: TaggedTemplateExpression) => {
    const target = resolve(tag)
    const name = target && (namespaces.has(target.name) ? target.member : named.get(target.name))
    return name !== undefined && name !== null && TAGS.includes(name) ? name : null
  }

  const definitions = new Set([...imported, ...[...declarations].filter(([, init]) => tagName(init) !== null).map(([name]) => name)])
  const names = new Map([...declarations].map(([name, init]) => [init, name]))
  const counts = new Map<string, number>()
  const warnings: Warning[] = []
  const string = new MagicString(code)

  for (const node of templates) {
    const name = tagName(node)

    if (name === null) {
      continue
    }

    const { start, quasi } = node

    if (componentId && IDENTIFIED.includes(name) && !configured(node.tag)) {
      const variable = names.get(node) ?? ''
      const index = counts.get(variable) ?? 0
      counts.set(variable, index + 1)
      string.appendLeft(node.tag.end, `.withConfig({ componentId: ${JSON.stringify(identify(scope, variable, index))} })`)
    }

    for (const expression of quasi.expressions) {
      if (expression.type !== 'ArrowFunctionExpression' && expression.type !== 'FunctionExpression') {
        continue
      }
      walk(expression.body, (child) => {
        if (child.type === 'TemplateLiteral') {
          for (const inner of (child as unknown as TemplateLiteral).expressions) {
            if (inner.type === 'Identifier' && definitions.has(inner.name)) {
              warnings.push({
                message: `\`\${${inner.name}}\` inside a plain template string becomes "[object Object]" at runtime. Build the string with \`css\` instead: \${(props) => css\`\${${inner.name}} { ... }\`}`,
                ...location(code, id, inner.start),
              })
            }
          }
        }
        return child.type !== 'TaggedTemplateExpression'
      })
    }

    const cooked = quasi.quasis.map((element) => element.value.cooked)

    if (cooked.some((value) => typeof value !== 'string')) {
      continue
    }

    const result = minify(cooked as string[])

    if ('skipped' in result && result.skipped === 'dropped' && name !== 'css') {
      warnings.push({
        message: `Part of the CSS in this \`${name}\` template is not a declaration or a rule, so it is ignored at runtime. Check for a missing \`:\`, an unclosed \`{\` or an extra \`}\`.`,
        ...location(code, id, start),
      })
    }

    if (!pure && !(compress && 'strings' in result)) {
      continue
    }

    const strings = compress && 'strings' in result ? result.strings : (cooked as string[])
    const bounds = [quasi.start, ...quasi.expressions.flatMap((expression) => [expression.start, expression.end]), quasi.end]
    const last = bounds.length - 2

    if (pure) {
      string.prependRight(start, '/*#__PURE__*/ ')
    }

    for (let index = 0; index < bounds.length; index += 2) {
      const replacement = pure ? (index === 0 ? `([${strings.map((value) => JSON.stringify(value)).join(', ')}]` : '') + (index === last ? ')' : ', ') : (index === 0 ? '`' : '}') + escape(strings[index / 2]) + (index === last ? '`' : '${')
      string.update(bounds[index], bounds[index + 1], replacement)
    }
  }

  if (!string.hasChanged() && warnings.length === 0) {
    return null
  }

  return { code: string.toString(), map: string.generateMap({ hires: true, source: id, includeContent: true }), warnings }
}

export type { Options, Warning }
export { MODULES, transform }
