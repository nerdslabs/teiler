import type { HTMLElements, StyleDefinition, TeilerComponent } from '.'

import { describe, expect, test, vi } from 'vitest'
import { component, createStyleSheet, css, global, insert, keyframes, styled } from '.'

const createComponent = <Target extends HTMLElements, Props>(styles: StyleDefinition<Target, Props>): TeilerComponent<Target, Props> => {
  return {
    styleDefinition: styles,
  }
}

type Callable = (strings: string[]) => TeilerComponent<HTMLElements, {}>

describe('styled', () => {
  test('should create component', () => {
    const result = styled('div', component, createComponent, ['color: red;'])

    expect(result).toEqual({
      styleDefinition: {
        id: 't19bgd6n',
        styles: [[['color: red;'], []]],
        tag: 'div',
        type: 'component',
      },
    })
  })

  test('should extend component', () => {
    const existingComponent: TeilerComponent<'div', {}> = {
      styleDefinition: {
        type: 'component',
        id: 'a',
        tag: 'div',
        styles: [[['color: red;'], []]],
      },
    }

    const extend = styled('div', component, createComponent, existingComponent) as Callable

    expect(extend(['background: blue;'])).toEqual({
      styleDefinition: {
        id: 't4akc9y',
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
    const result = styled(undefined, component, createComponent, ['color: red;'])

    expect(result).toEqual({
      styleDefinition: {
        id: 't19bgd6n',
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

    const extend = styled(undefined, component, createComponent, existingComponent) as Callable

    expect(extend(['background: blue;'])).toEqual({
      styleDefinition: {
        id: 't6ptvm5',
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

    const extend = styled('a', component, createComponent, existingComponent) as Callable

    expect(extend([''])).toEqual({
      styleDefinition: {
        id: 't19i8bub',
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
  test('should create different ids for same styles with different tags', () => {
    const div = component('div', [[['color: red;'], []]])
    const button = component('button', [[['color: red;'], []]])

    expect(div.id).not.toBe(button.id)
  })
})

describe('global', () => {
  test('should create style definition from styles', () => {
    expect(global(null, [[['body { color: red; }'], []]])).toEqual({
      id: 'tytz3vv',
      styles: [[['body { color: red; }'], []]],
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
    const sheet = createStyleSheet({})

    const definition: StyleDefinition<'div', {}> = {
      id: 'twq229y',
      styles: [[['color: red;'], []]],
      tag: 'div',
      type: 'component',
    }

    const result = insert(sheet, definition, { theme: {} })

    expect(result).toBe('teiler-wq229y')
    expect(sheet.dump()).toBe(' .teiler-wq229y{color:red;}')
  })

  test('should insert keyframes styles into the sheet', () => {
    const sheet = createStyleSheet({})

    const definition: StyleDefinition<null, {}> = {
      id: 'teiler-1ep7axc',
      styles: [[['from { background-color: red; } to { background-color: green; }'], []]],
      tag: null,
      type: 'keyframes',
    }

    const result = insert(sheet, definition, { theme: {} })

    expect(result).toBeNull()
    expect(sheet.dump()).toBe(' @keyframes teiler-1ep7axc{from{background-color:red;}to{background-color:green;}}')
  })

  test('should insert global styles into the sheet', () => {
    const sheet = createStyleSheet({})

    const definition: StyleDefinition<null, {}> = {
      id: 'tytz3vv',
      styles: [[['body { color: red; }'], []]],
      tag: null,
      type: 'global',
    }

    const result = insert(sheet, definition, { theme: {} })

    expect(result).toBeNull()
    expect(sheet.dump()).toBe(' body{color:red;}')
  })

  test('should transpile the same styles only once', async () => {
    const stylis = await vi.importActual<typeof import('stylis')>('stylis')
    const stylisCompile = vi.fn(stylis.compile)
    vi.resetModules()
    vi.doMock('stylis', () => ({ ...stylis, compile: stylisCompile }))

    const core: typeof import('.') = await import('.')
    vi.doUnmock('stylis')

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
