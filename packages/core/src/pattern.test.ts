import type { Pattern } from './pattern'
import type { Compile, Style, TeilerComponent } from '.'

import { describe, expect, test } from '@jest/globals'
import { pattern, sew } from './pattern'
import { createStyleSheet } from '.'

describe('pattern', () => {
  test('should create a pattern for a div', () => {
    const div = pattern`background: blue;`
    expect(div).toEqual({
      styles: [[['background: blue;'], []]],
      tag: 'div',
      __teiler__: true,
    })
  })

  test('should extend a pattern', () => {
    const extend: Pattern<'div', {}> = {
      styles: [[['background: blue;'], []]],
      tag: 'div',
      __teiler__: true,
    }

    const div = pattern<{}>(extend)`color: red;`

    expect(div).toEqual({
      styles: [
        [['background: blue;'], []],
        [['color: red;'], []],
      ],
      tag: 'div',
      __teiler__: true,
    })
  })

  test('should create a pattern with params', () => {
    const button = pattern.button<{color: string}>`background: ${({ color }) => color};`
    expect(button).toMatchObject({
      styles: [[['background: ', ';'], [expect.any(Function)]]],
      tag: 'button',
      __teiler__: true,
    })
  })

  test('should create a pattern for a global component', () => {
    const global = pattern.global`background: blue;`
    expect(global).toEqual({
      styles: [[Array('background: blue;'), []]],
      tag: null,
      __teiler__: true,
    })
  })
})

type TestComponent<Target, Props> = TeilerComponent<Target, Props> & {
  render(): string
}

const createComponent = <Target, Props>(compile: Compile, tag: Target, styles: Array<Style<Props>>): TestComponent<Target, Props> => {
  return {
    tag,
    styles,
    render() {
      const classes = compile(createStyleSheet({}), styles, {})
      if (classes) {
        return `<${tag} class="${classes.join(' ')}">component</${tag}>`
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
