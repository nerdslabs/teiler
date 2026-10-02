import type { Pattern } from './pattern'
import type { HTMLElements, StyleDefinition, TeilerComponent } from '.'

import { describe, expect, test } from 'vitest'
import { pattern, sew } from './pattern'
import { createStyleSheet, insert } from '.'

describe('pattern', () => {
  test('should create a pattern for a div', () => {
    const div = pattern`background: blue;`
    expect(div).toEqual({
      styles: [[['background: blue;'], []]],
      tag: 'div',
      __pattern__: true,
      id: 't1b79gyl',
    })
  })

  test('should extend a pattern', () => {
    const extend: Pattern<'div', {}> = {
      styles: [[['background: blue;'], []]],
      tag: 'div',
      __pattern__: true,
      id: 't1iflo4h',
    }

    const div = pattern<{}>(extend)`color: red;`

    expect(div).toEqual({
      styles: [
        [['background: blue;'], []],
        [['color: red;'], []],
      ],
      tag: 'div',
      __pattern__: true,
      id: 't1n7eb5r',
    })
  })

  test('should extend a pattern with different tag', () => {
    const button = pattern.button`background: blue;`
    const link: Pattern<'a', {}> = pattern.a(button)`color: red;`

    expect(link).toMatchObject({
      styles: [
        [['background: blue;'], []],
        [['color: red;'], []],
      ],
      tag: 'a',
      __pattern__: true,
    })
    expect(link.id).not.toBe(pattern.button(button)`color: red;`.id)
  })

  test('should keep tag of extended pattern when tag is not specified', () => {
    const button = pattern.button`background: blue;`
    const extended: Pattern<'button', {}> = pattern(button)`color: red;`

    expect(extended.tag).toBe('button')
  })

  test('should create a pattern for a global component', () => {
    const global = pattern.global`background: blue;`
    expect(global).toEqual({
      styles: [[['background: blue;'], []]],
      tag: null,
      __pattern__: true,
      id: 't1iflo4h',
    })
  })
})

type TestComponent<Target extends HTMLElements> = TeilerComponent<Target, {}> & {
  render(): string
}

const sheet = createStyleSheet({})

const createComponent = <Target extends HTMLElements>(styles: StyleDefinition<Target, {}>): TestComponent<Target> => {
  return {
    styleDefinition: styles,
    render() {
      const className = insert(sheet, styles, { theme: {} })

      if (className) {
        return `<${styles.tag} class="${className}">component</${styles.tag}>`
      } else {
        return ''
      }
    },
  }
}

describe('sew', () => {
  test('should sew a pattern into a component', () => {
    const div = pattern`background: blue;`
    const component = sew(div, createComponent)
    expect(component.render()).toEqual('<div class="teiler-1iflo4h">component</div>')
  })

  test('should sew a pattern into a global component', () => {
    const global = pattern.global`body { background: red; }`
    const component = sew(global, createComponent)
    expect(component.render()).toEqual('')
  })
})

describe('pattern componentId', () => {
  test('should create ids from the component id', () => {
    const base = pattern.withConfig({ componentId: 'a' })`color: red;`
    const button = pattern.button.withConfig({ componentId: 'a' })`color: red;`

    expect(base).toEqual({ styles: [[['color: red;'], []]], tag: 'div', __pattern__: true, id: expect.any(String), componentId: 'a' })
    expect(base.id).toBe(pattern.withConfig({ componentId: 'a' })`color: blue;`.id)
    expect(base.id).not.toBe(pattern`color: red;`.id)
    expect(button.id).not.toBe(base.id)
    expect(pattern.global.withConfig({ componentId: 'a' })`body { color: red; }`.tag).toBeNull()
  })

  test('should give extensions their own id', () => {
    const base = pattern`color: red;`

    expect(pattern(base)``.id).toBe(base.id)
    expect(pattern(base).withConfig({ componentId: 'a' })``.componentId).toBe('a')
    expect(pattern.withConfig({ componentId: 'a' })(base)``.id).toBe(pattern(base).withConfig({ componentId: 'a' })``.id)
    expect(pattern.a.withConfig({ componentId: 'a' })(base)``.tag).toBe('a')
  })

  test('should pass the component id to sewn components', () => {
    const create = <Target extends HTMLElements, Props>(styleDefinition: StyleDefinition<Target, Props>): TeilerComponent<Target, Props> => ({ styleDefinition })
    const base = pattern.withConfig({ componentId: 'a' })`color: red;`

    expect(sew(base, create).styleDefinition).toEqual({ type: 'component', id: base.id, styles: base.styles, tag: 'div', componentId: 'a' })
  })
})
