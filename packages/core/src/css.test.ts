import { describe, expect, test } from '@jest/globals'
import { compile, transpile } from './css'
import { Style, StyleDefinition } from '.'

describe('transpile', () => {
  test('should return an empty array if the CSS string is empty', () => {
    const css = ''
    const results = transpile(css)
    expect(results).toHaveLength(0)
  })

  test('should return an array of CSS strings with comments removed', () => {
    const css = '/* This is a comment */ p { color: red; } /* This is another comment */'
    const results = transpile(css)
    expect(results).toHaveLength(1)
    expect(results.at(0)).toBe('p{color:red;}')
  })

  test('should return button with hover from nasted selector ', () => {
    const css = 'button { color: blue; &:hover: { color: red; } }'
    const results = transpile(css)
    expect(results).toHaveLength(2)
    expect(results).toEqual(['button{color:blue;}', 'button:hover:{color:red;}'])
  })
})

describe('compile', () => {
  test('without props', () => {
    const style: Style<{}> = [['color: blue;'], []]
    const compiled = compile<{}>([style], {})

    expect(compiled).toEqual({ css: 'color: blue;', definitions: [] })
  })

  test('with props', () => {
    type Props = { color: string }

    const style: Style<Props> = [['color: ', ';'], [({ color }) => color]]
    const compiled = compile<Props>([style], { color: 'red' })

    expect(compiled).toEqual({ css: 'color: red;', definitions: [] })
  })

  test('with object', () => {
    const keyframes: StyleDefinition = {
      css: '@keyframes test { from { background-color: yellow; } to { background-color: red; } }',
      id: '14uknit',
      name: 'teiler-keyframes-14uknit',
      type: 'keyframes',
    }

    const style: Style<{}> = [['animation: ', ' 5s;'], [keyframes]]
    const compiled = compile<{}>([style], {})

    expect(compiled).toEqual({
      css: 'animation: teiler-keyframes-14uknit 5s;',
      definitions: [keyframes],
    })
  })
})
