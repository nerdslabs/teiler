import type { HTMLElements, StyleDefinition, TeilerComponent } from '.'

import { describe, expect, jest, test } from '@jest/globals'
import { component, css, global, insert, keyframes, styled } from '.'

const createComponent = <Target extends HTMLElements, Props>(styles: StyleDefinition<Target, Props>): TeilerComponent<Target, Props> => {
  return {
    styleDefinition: styles,
  }
}

describe('styled', () => {
  test('should create component', () => {
    const template = ['color: red;']
    const test = jest.fn(styled)

    test('div', component, createComponent, template)

    expect(test).toHaveReturnedWith({
      styleDefinition: {
        id: 't17bpjkr',
        styles: [[['color: red;'], []]],
        tag: 'div',
        type: 'component',
      },
    })
  })

  test('should extend component', () => {
    const template = ['background: blue;']
    const existingComponent: TeilerComponent<'div', {}> = {
      styleDefinition: {
        type: 'component',
        id: 'a',
        tag: 'div',
        styles: [[['color: red;'], []]],
      },
    }

    const extend = styled('div', component, createComponent, existingComponent)

    type Callable = Extract<typeof extend, (array: string[]) => {}>

    const test = jest.fn(extend as Callable)

    test(template)

    expect(test).toHaveReturnedWith({
      styleDefinition: {
        id: 'tl6tzvb',
        styles: [
          [['color: red;'], []],
          [['background: blue;'], []],
        ],
        tag: 'div',
        type: 'component',
      },
    })
  })

  test('should create div component when tag is not specified', () => {
    const template = ['color: red;']
    const test = jest.fn(styled)

    test(undefined, component, createComponent, template)

    expect(test).toHaveReturnedWith({
      styleDefinition: {
        id: 't17bpjkr',
        styles: [[['color: red;'], []]],
        tag: 'div',
        type: 'component',
      },
    })
  })

  test('should keep tag of extended component when tag is not specified', () => {
    const existingComponent: TeilerComponent<'button', {}> = {
      styleDefinition: {
        type: 'component',
        id: 'a',
        tag: 'button',
        styles: [[['color: red;'], []]],
      },
    }

    const extend = styled(undefined, component, createComponent, existingComponent)

    type Callable = Extract<typeof extend, (array: string[]) => {}>

    const test = jest.fn(extend as Callable)

    test(['background: blue;'])

    expect(test).toHaveReturnedWith({
      styleDefinition: {
        id: 'tusxsns',
        styles: [
          [['color: red;'], []],
          [['background: blue;'], []],
        ],
        tag: 'button',
        type: 'component',
      },
    })
  })

  test('should extend component with different tag', () => {
    const existingComponent: TeilerComponent<'button', {}> = {
      styleDefinition: {
        type: 'component',
        id: 'twq229y',
        tag: 'button',
        styles: [[['color: red;'], []]],
      },
    }

    const extend = styled('a', component, createComponent, existingComponent)

    type Callable = Extract<typeof extend, (array: string[]) => {}>

    const test = jest.fn(extend as Callable)

    test([''])

    expect(test).toHaveReturnedWith({
      styleDefinition: {
        id: 't12eqcfl',
        styles: [
          [['color: red;'], []],
          [[''], []],
        ],
        tag: 'a',
        type: 'component',
      },
    })
  })
})

describe('component', () => {
  test('should create style definition from styles', () => {
    const test = jest.fn(component)

    test('div', [[['color: red;'], []]])

    expect(test).toHaveReturnedWith({
      id: 't17bpjkr',
      styles: [[['color: red;'], []]],
      tag: 'div',
      type: 'component',
    })
  })

  test('should create style definition from styles with props', () => {
    const test = jest.fn(component<'div', { color: string }>)

    test('div', [[['color: ', ';'], [({ color }) => color]]])

    expect(test).toHaveReturnedWith({
      id: 'tnc696h',
      styles: [[['color: ', ';'], [expect.any(Function)]]],
      tag: 'div',
      type: 'component',
    })
  })

  test('should create different ids for same styles with different tags', () => {
    const div = component('div', [[['color: red;'], []]])
    const button = component('button', [[['color: red;'], []]])

    expect(div.id).not.toBe(button.id)
  })
})

describe('global', () => {
  test('should create style definition from styles', () => {
    const test = jest.fn(global)

    test(null, [[['body { color: red; }'], []]])

    expect(test).toHaveReturnedWith({
      id: 'tytz3vv',
      styles: [[['body { color: red; }'], []]],
      tag: null,
      type: 'global',
    })
  })

  test('should create style definition from styles with props', () => {
    const test = jest.fn(global<null, { color: string }>)

    test(null, [[['body { color: ', '; }'], [({ color }) => color]]])

    expect(test).toHaveReturnedWith({
      id: 't1420fqd',
      styles: [[['body { color: ', '; }'], [expect.any(Function)]]],
      tag: null,
      type: 'global',
    })
  })
})

describe('keyframes', () => {
  test('should create a keyframes definition with the given strings and properties', () => {
    const keyframesDefinition = keyframes`from { background-color: red; } to { background-color: green; }`

    expect(keyframesDefinition).toStrictEqual({
      id: 'teiler-1ep7axc',
      styles: [[['from { background-color: red; } to { background-color: green; }'], []]],
      tag: null,
      type: 'keyframes',
    })
  })

  test('should allow passing properties to the keyframes definition', () => {
    const props = {
      from: 'yellow',
      to: 'red',
    }

    const keyframesDefinition = keyframes`from { background-color: ${props.from}; } to { background-color: ${props.to}; }`

    expect(keyframesDefinition).toEqual({
      id: 'teiler-14uknit',
      styles: [
        [
          ['from { background-color: ', '; } to { background-color: ', '; }'],
          ['yellow', 'red'],
        ],
      ],
      tag: null,
      type: 'keyframes',
    })
  })

  test('should create different ids for different property values', () => {
    const fadeHalf = keyframes`from { opacity: ${0.5}; } to { opacity: 1; }`
    const fadeZero = keyframes`from { opacity: ${0}; } to { opacity: 1; }`

    expect(fadeHalf.id).not.toEqual(fadeZero.id)
  })
})

describe('css', () => {
  test('should create a css styles', () => {
    // prettier-ignore
    const div = css`background: blue;`

    expect(div).toEqual({
      styles: [[['background: blue;'], []]],
      __css__: true,
      id: 't1iflo4h',
    })
  })

  test('should create a css styles with properties', () => {
    const color = 'blue'
    // prettier-ignore
    const div = css`background: ${color};`

    expect(div).toEqual({
      styles: [[['background: ', ';'], ['blue']]],
      __css__: true,
      id: 't42o50t',
    })
  })
})

describe('insert', () => {
  test('should insert component styles into the sheet', () => {
    const sheet = {
      has: jest.fn(() => false),
      insert: jest.fn(),
      dump: jest.fn<() => string>(),
      extract: jest.fn<() => { css: string; ids: string[] }>(),
      hydrate: jest.fn<(ids: string[]) => void>(),
    }

    const definition: StyleDefinition<'div', {}> = {
      id: 'twq229y',
      styles: [[['color: red;'], []]],
      tag: 'div',
      type: 'component',
    }

    const props = { theme: {} }

    const result = insert(sheet, definition, props)

    expect(sheet.insert).toHaveBeenCalledWith('wq229y', '.teiler-wq229y{color:red;}')
    expect(result).toBe('teiler-wq229y')
  })

  test('should insert keyframes styles into the sheet', () => {
    const sheet = {
      has: jest.fn(() => false),
      insert: jest.fn(),
      dump: jest.fn<() => string>(),
      extract: jest.fn<() => { css: string; ids: string[] }>(),
      hydrate: jest.fn<(ids: string[]) => void>(),
    }

    const definition: StyleDefinition<null, {}> = {
      id: 'teiler-1ep7axc',
      styles: [[['from { background-color: red; } to { background-color: green; }'], []]],
      tag: null,
      type: 'keyframes',
    }

    const props = { theme: {} }

    const result = insert(sheet, definition, props)

    expect(sheet.insert).toHaveBeenCalledWith('1ep7axc', '@keyframes teiler-1ep7axc{from{background-color:red;}to{background-color:green;}}')
    expect(result).toBeNull()
  })

  test('should insert global styles into the sheet', () => {
    const sheet = {
      has: jest.fn(() => false),
      insert: jest.fn(),
      dump: jest.fn<() => string>(),
      extract: jest.fn<() => { css: string; ids: string[] }>(),
      hydrate: jest.fn<(ids: string[]) => void>(),
    }

    const definition: StyleDefinition<null, {}> = {
      id: 'tytz3vv',
      styles: [[['body { color: red; }'], []]],
      tag: null,
      type: 'global',
    }

    const props = { theme: {} }

    const result = insert(sheet, definition, props)

    expect(sheet.insert).toHaveBeenCalledWith('ytz3vv', 'body{color:red;}')
    expect(result).toBeNull()
  })

  test('should transpile the same styles only once', async () => {
    const stylis = jest.requireActual<typeof import('stylis')>('stylis')
    const stylisCompile = jest.fn(stylis.compile)
    jest.doMock('stylis', () => ({ ...stylis, compile: stylisCompile }))

    let core!: typeof import('.')
    await jest.isolateModulesAsync(async () => {
      core = await import('.')
    })
    jest.dontMock('stylis')

    const sheet = core.createStyleSheet({})

    const definition: StyleDefinition<'div', {}> = {
      id: 'twq229y',
      styles: [[['color: red;'], []]],
      tag: 'div',
      type: 'component',
    }

    const first = core.insert(sheet, definition, { theme: {} })
    const second = core.insert(sheet, definition, { theme: {} })

    expect(stylisCompile).toHaveBeenCalledTimes(1)
    expect(second).toBe(first)
    expect(sheet.dump()).toBe(' .teiler-wq229y{color:red;}')
  })
})
