import type { Pattern } from './pattern'
import type { HTMLElements, StyleDefinition, TeilerComponent } from '.'

import { describe, expect, test } from '@jest/globals'
import { pattern, sew } from './pattern'
import { createStyleSheet, insert } from '.'

describe('pattern', () => {
  test('should create a pattern for a div', () => {
    const div = pattern`background: blue;`
    expect(div).toEqual({
      styles: [[['background: blue;'], []]],
      tag: 'div',
      __pattern__: true,
      id: 't1iflo4h',
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
      id: 'tu2c2va',
    })
  })

  test('should create a pattern with params', () => {
    const button = pattern.button<{ color: string }>`background: ${({ color }) => color};`
    expect(button).toMatchObject({
      styles: [[['background: ', ';'], [expect.any(Function)]]],
      tag: 'button',
      __pattern__: true,
    })
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

  test('should sew a pattern into a button', () => {
    const button = pattern.button`background: blue;`
    const component = sew(button, createComponent)
    expect(component.render()).toEqual('<button class="teiler-1iflo4h">component</button>')
  })

  test('should sew a pattern into a global component', () => {
    const global = pattern.global`body { background: red; }`
    const component = sew(global, createComponent)
    expect(component.render()).toEqual('')
  })
})
