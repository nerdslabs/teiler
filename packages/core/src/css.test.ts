import { describe, expect, test } from '@jest/globals'
import { compile, transpile } from './css'
import { Style, StyleDefinition } from '.'
import { CSS } from './constructor'

describe('transpile', () => {
  test('should return an empty array if the CSS string is empty', () => {
    const css = ''
    const result = transpile(css)
    expect(result).toHaveLength(0)
  })

  test('should return an array of CSS strings with comments removed', () => {
    const css = '/* This is a comment */ p { color: red; } /* This is another comment */'
    const result = transpile(css)
    expect(result).toBe('p{color:red;}')
  })

  test('should return button with hover from nasted selector ', () => {
    const css = 'button { color: blue; &:hover { color: red; } }'
    const result = transpile(css)
    expect(result).toEqual('button{color:blue;} button:hover{color:red;}')
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
    const keyframes: StyleDefinition<null, {}> = {
      tag: null,
      id: 'teiler-1vxhd59',
      styles: [
        [
          ['from { background-color: ', '; } to { background-color: ', '; }'],
          ['yellow', 'red'],
        ],
      ],
      type: 'keyframes',
    }

    const style: Style<{}> = [['animation: ', ' 5s;'], [keyframes]]
    const compiled = compile<{}>([style], {})

    expect(compiled).toEqual({
      css: 'animation: teiler-1vxhd59 5s;',
      definitions: [keyframes],
    })
  })

  test('with css', () => {
    const css: CSS<{}> = {
      id: 't1vxhd59',
      styles: [[['background: ', ';'], ['red']]],
      __css__: true,
    }

    const style: Style<{}> = [['color: #fff; '], [() => css]]
    const compiled = compile<{}>([style], {})

    expect(compiled).toEqual({
      css: 'color: #fff; background: red;',
      definitions: [],
    })
  })
})
