import { describe, expect, test } from '@jest/globals'
import { stylis, compile } from './css'
import { Style } from '.'

describe('stylis', () => {
  test('should return an empty array if the CSS string is empty', () => {
    const css = ''
    const results = stylis(css)
    expect(results).toHaveLength(0)
  })

  test('should return an array of CSS strings with comments removed', () => {
    const css = '/* This is a comment */ p { color: red; } /* This is another comment */'
    const results = stylis(css)
    expect(results).toHaveLength(1)
    expect(results.at(0)).toBe('p{color:red;}')
  })

  test('should return button with hover from nasted selector ', () => {
    const css = 'button { color: blue; &:hover: { color: red; } }'
    const results = stylis(css)
    expect(results).toHaveLength(2)
    expect(results).toEqual(["button{color:blue;}", "button:hover:{color:red;}"])
  })
})

describe('compile', () => {
  test('without props', () => {
    const style: Style<{}> = [['color: blue;'], []]
    const compiled = compile<{}>([style], {})

    expect(compiled).toEqual([{ id: '1r77qux', name: 'teiler-1r77qux', css: 'color: blue;' }])
  })

  test('with props', () => {
    type Props = { color: string }

    const style: Style<Props> = [['color: ', ';'], [({ color }) => color]]
    const compiled = compile<Props>([style], { color: 'red' })

    expect(compiled).toEqual([{ id: 'wq229y', name: 'teiler-wq229y', css: 'color: red;' }])
  })
})
