import type { Compile, Style, TeilerComponent } from '.'

import { describe, jest, expect, test } from '@jest/globals'
import styled, { component, global, keyframes, createStyleSheet } from '.'

const createComponent = <Target, Props>(compile: Compile, tag: Target, styles: Array<Style<Props>>): TeilerComponent<Target, Props> => {
  return {
    tag,
    styles,
  }
}

describe('styled', () => {
  test('should create component', () => {
    const createComponentBinded = createComponent.bind(null, null, 'div')
    const template = ['color: red;']
    const test = jest.fn(styled)

    test(createComponentBinded, template)

    expect(test).toHaveReturnedWith({ styles: [[['color: red;'], []]], tag: 'div' })
  })

  test('should extend component', () => {
    const createComponentBinded = createComponent.bind(null, null, 'div')
    const template = ['background: blue;']
    const component: TeilerComponent<'div', {}> = { tag: 'div', styles: [[['color: red;'], []]] }

    const extend = styled(createComponentBinded, component)

    type Callable = Extract<typeof extend, Function>

    const test = jest.fn(extend as Callable)

    test(template)

    expect(test).toHaveReturnedWith({
      styles: [
        [['color: red;'], []],
        [['background: blue;'], []],
      ],
      tag: 'div',
    })
  })
})

describe('component', () => {
  test('should create style from styles', () => {
    const styleSheet = createStyleSheet({})
    const test = jest.fn(component)

    test(styleSheet, [[['color: red;'], []]], [])

    expect(test).toHaveReturnedWith(['teiler-wq229y'])
  })

  test('should create style from styles with props', () => {
    const styleSheet = createStyleSheet({})
    const test = jest.fn(component)

    test(styleSheet, [[['color: ', ';'], [({ color }) => color]]], [{ color: 'red' }])

    expect(test).toHaveReturnedWith(['teiler-10upe3l'])
  })
})

describe('global', () => {
  test('should create style from styles', () => {
    const styleSheet = createStyleSheet({})
    const test = jest.fn(global)

    test(styleSheet, [[['body { color: red; }'], []]], {})

    expect(test).toHaveReturnedWith(undefined)
    expect(styleSheet.dump()).toContain(' body{color:red;}')
  })

  test('should create style from styles with props', () => {
    const styleSheet = createStyleSheet({})
    const test = jest.fn(global)

    test(styleSheet, [[['body { color: ', '; }'], [({ color }) => color]]], { color: 'blue' })

    expect(test).toHaveReturnedWith(undefined)
    expect(styleSheet.dump()).toContain(' body{color:blue;}')
  })
})

describe('keyframes', () => {
  test('should create a keyframes definition with the given strings and properties', () => {
    const keyframesDefinition = keyframes`from { background-color: red; } to { background-color: green; }`

    expect(keyframesDefinition).toStrictEqual({
      css: `@keyframes teiler-keyframes-1ep7axc { from { background-color: red; } to { background-color: green; } }`,
      id: '1ep7axc',
      name: 'teiler-keyframes-1ep7axc',
    })
  })

  test('should allow passing properties to the keyframes definition', () => {
    const props = {
      from: 'yellow',
      to: 'red',
    }

    const keyframesDefinition = keyframes`from { background-color: ${props.from}; } to { background-color: ${props.to}; }`

    expect(keyframesDefinition).toEqual({
      css: '@keyframes teiler-keyframes-14uknit { from { background-color: yellow; } to { background-color: red; } }',
      id: '14uknit',
      name: 'teiler-keyframes-14uknit',
    })
  })
})
