import type { Element } from 'stylis'

import { COMMENT, RULESET, compile } from 'stylis'

const PLACEHOLDER = /xxx\d+:xxx/

const placeholder = (index: number) => `xxx${index}:xxx`

function flatten(elements: Element[]): Element[] {
  return elements.flatMap((element) => [element, ...(Array.isArray(element.children) ? flatten(element.children) : [])])
}

function nest(elements: Element[]): Map<Element | null, Element[]> {
  const blocks = new Map<Element | null, Element[]>()

  for (const element of elements) {
    if (element.type !== RULESET || element.parent?.line !== element.line || element.parent.column !== element.column) {
      blocks.set(element.parent, [...(blocks.get(element.parent) ?? []), element])
    }
  }

  return blocks
}

function stringify(blocks: Map<Element | null, Element[]>, parent: Element | null = null): string {
  return (blocks.get(parent) ?? [])
    .map((element) => {
      if (element.type === COMMENT) {
        return ''
      }
      if (!Array.isArray(element.children) || element.value.endsWith(';')) {
        return element.value
      }
      return `${element.value.replace(/&\f/g, '&')}{${stringify(blocks, element)}}`
    })
    .join('')
}

function comments(elements: Element[]): string[] {
  return elements.filter((element) => element.type === COMMENT).map((element) => (element.props === '/' ? element.value : '//' + element.value.slice(2, -2)))
}

function signature(css: string, removed: string[] = []): string {
  let result = css
  let cursor = 0

  for (const comment of removed) {
    const index = result.indexOf(comment, cursor)
    if (index !== -1) {
      const newline = result.indexOf('\n', index)
      const end = !comment.startsWith('//') ? index + comment.length : newline === -1 ? result.length : newline
      result = result.slice(0, index) + result.slice(end)
      cursor = index
    }
  }

  return result.replace(/[\s;]/g, '')
}

type Minified = { strings: string[] } | { skipped: 'placeholder' | 'dropped' | 'interpolation' }

function minify(quasis: string[]): Minified {
  if (quasis.some((quasi) => PLACEHOLDER.test(quasi))) {
    return { skipped: 'placeholder' }
  }

  const source = quasis.reduce((css, quasi, index) => css + (index > 0 ? placeholder(index - 1) : '') + quasi, '')
  const elements = flatten(compile(source)).sort((a, b) => a.line - b.line || a.column - b.column)
  const output = stringify(nest(elements))

  if (signature(output) !== signature(source, comments(elements))) {
    return { skipped: 'dropped' }
  }

  const strings = output.split(PLACEHOLDER)

  return strings.length === quasis.length ? { strings } : { skipped: 'interpolation' }
}

export type { Minified }
export { minify }
