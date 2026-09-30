import type { Element } from 'stylis'

import { COMMENT, compile } from 'stylis'

const PLACEHOLDER = /xxx\d+:xxx/

const placeholder = (index: number) => `xxx${index}:xxx`

function stringify(elements: Element[]): string {
  return elements
    .map((element) => {
      if (element.type === COMMENT) {
        return ''
      }
      if (!Array.isArray(element.children)) {
        return element.value
      }
      return `${element.value.replace(/&\f/g, '&')}{${stringify(element.children)}}`
    })
    .join('')
}

function comments(elements: Element[]): string[] {
  return elements.flatMap((element) => {
    if (element.type === COMMENT) {
      return [element.props === '/' ? element.value : '//' + element.value.slice(2, -2)]
    }
    return Array.isArray(element.children) ? comments(element.children) : []
  })
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
  const tree = compile(source)
  const output = stringify(tree)

  if (signature(output) !== signature(source, comments(tree))) {
    return { skipped: 'dropped' }
  }

  const strings = output.split(PLACEHOLDER)

  return strings.length === quasis.length ? { strings } : { skipped: 'interpolation' }
}

export type { Minified }
export { minify }
