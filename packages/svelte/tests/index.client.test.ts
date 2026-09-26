import type { StyleDefinition } from '@teiler/core'

import { describe, expect, jest, test } from '@jest/globals'
import { render } from '@testing-library/svelte'
import { createStyleSheet } from '@teiler/core'
import { component, createComponent, global, keyframes } from '../src/index'

import ParentFixture from './Parent.fixture.svelte'
import ThemeProviderFixture from './ThemeProvider.fixture.svelte'

describe('createComponent', () => {
  test('should create a component', () => {
    const styleSheet = createStyleSheet({})

    const styleDefinition: StyleDefinition<'div', {}> = {
      type: 'component',
      id: 'twq229y',
      tag: 'div',
      styles: [[['color: red;'], []]],
    }

    const component = createComponent(styleDefinition)

    const { container } = render(component, {
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    expect(component.styleDefinition).toBe(styleDefinition)
    expect(container.firstElementChild?.outerHTML).toBe('<div class="teiler-wq229y twq229y"><!----></div>')
    expect(styleSheet.dump()).toBe(' .teiler-wq229y{color:red;}')
  })
})

describe('component', () => {
  test('should create basic a component', () => {
    const StyledComponent = component`color: blue;`

    const { container } = render(StyledComponent)

    expect(container.firstElementChild?.className).toBe('teiler-1r77qux t8e9dar')
  })

  test('should create a component with props', () => {
    const styleSheet = createStyleSheet({})

    const StyledComponent = component<{ _color: string }>`color: ${(props) => props._color};`

    const { container } = render(StyledComponent, {
      props: { _color: 'yellow' },
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    expect(container.firstElementChild?.className).toBe('teiler-100tn2k t1fqd64x')
    expect(styleSheet.dump()).toBe(' .teiler-100tn2k{color:yellow;}')
  })

  test('should create a component with custom theme', () => {
    const styleSheet = createStyleSheet({})

    const StyledComponent = component`color: ${(props) => props.theme.fontColor};`

    const { container } = render(StyledComponent, {
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet, THEME: () => ({ fontColor: 'green' }) })),
    })

    expect(container.firstElementChild?.className).toBe('teiler-1dc5e1n t1fqd64x')
    expect(styleSheet.dump()).toBe(' .teiler-1dc5e1n{color:green;}')
  })

  test('should create a component with custom class', () => {
    const styleSheet = createStyleSheet({})

    const StyledComponent = component`color: green;`

    const { container } = render(StyledComponent, {
      props: {
        class: 'custom-class',
      },
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    expect(container.firstElementChild?.className).toBe('teiler-1dc5e1n tsqxzcw custom-class')
    expect(styleSheet.dump()).toBe(' .teiler-1dc5e1n{color:green;}')
  })

  test('should forward attributes and skip underscore props', () => {
    const StyledComponent = component.a<{ _color: string }>`color: ${(props) => props._color};`

    const { container } = render(StyledComponent, {
      props: { _color: 'red', href: '/home', 'data-test': 'link' },
      context: new Map(Object.entries({ STYLE_SHEET: createStyleSheet({}) })),
    })

    const element = container.querySelector('a')

    expect(element?.getAttribute('href')).toBe('/home')
    expect(element?.getAttribute('data-test')).toBe('link')
    expect(element?.hasAttribute('_color')).toBe(false)
  })

  test('should update styles when props passed from parent change', async () => {
    const styleSheet = createStyleSheet({})

    const { container, rerender } = render(ParentFixture, {
      props: { color: 'yellow' },
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    const element = container.querySelector('button')

    expect(element?.className).toBe('teiler-1uosih1 t1o3x0cs')

    await rerender({ color: 'blue' })

    expect(container.querySelector('button')).toBe(element)
    expect(element?.className).toBe('teiler-13z0lem t1o3x0cs')
    expect(element?.textContent).toBe('blue')
    expect(styleSheet.dump()).toBe(' .teiler-1uosih1{color:yellow;} .teiler-13z0lem{color:blue;}')
  })

  test('should update attributes added by spread in parent', async () => {
    const { container, rerender } = render(ParentFixture, {
      context: new Map(Object.entries({ STYLE_SHEET: createStyleSheet({}) })),
    })

    expect(container.querySelector('button')?.hasAttribute('data-state')).toBe(false)

    await rerender({ attributes: { 'data-state': 'open' } })

    expect(container.querySelector('button')?.getAttribute('data-state')).toBe('open')
  })

  test('should forward event handlers', () => {
    const onclick = jest.fn()

    const { container } = render(ParentFixture, {
      props: { onclick },
      context: new Map(Object.entries({ STYLE_SHEET: createStyleSheet({}) })),
    })

    container.querySelector('button')?.click()

    expect(onclick).toHaveBeenCalledTimes(1)
  })
})

describe('global', () => {
  test('should create a global style', () => {
    const styleSheet = createStyleSheet({})

    const GlobalStyle = global`color: red;`

    const { container } = render(GlobalStyle, {
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    expect(container.children).toHaveLength(0)
    expect(styleSheet.dump()).toBe(' color:red;')
  })

  test('should create a global style with theme', () => {
    const styleSheet = createStyleSheet({})

    const GlobalStyle = global`color: ${(props) => props.theme.fontColor};`

    render(GlobalStyle, {
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet, THEME: () => ({ fontColor: 'green' }) })),
    })

    expect(styleSheet.dump()).toBe(' color:green;')
  })
})

describe('keyframes', () => {
  test('should create keyframes', () => {
    const styleSheet = createStyleSheet({})

    const animation = keyframes`from { opacity: 0; } to { opacity: 1; }`
    const StyledComponent = component`animation: ${animation} 5s infinite;`

    render(StyledComponent, {
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    expect(animation).toEqual({
      id: 'teiler-g1154k',
      styles: [[['from { opacity: 0; } to { opacity: 1; }'], []]],
      type: 'keyframes',
      tag: null,
    })

    expect(styleSheet.dump()).toBe(' @keyframes teiler-g1154k{from{opacity:0;}to{opacity:1;}} .teiler-jq8kuu{animation:teiler-g1154k 5s infinite;}')
  })
})

describe('ThemeProvider', () => {
  test('should provide theme', () => {
    const styleSheet = createStyleSheet({})

    const { container } = render(ThemeProviderFixture, {
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    expect(container.querySelector('div')?.className).toBe('teiler-9hfnro thjt86x')
    expect(container.querySelector('div')?.textContent).toBe('abc')
    expect(styleSheet.dump()).toBe(' .teiler-9hfnro{color:green;}')
  })

  test('should update styles when theme changes', async () => {
    const styleSheet = createStyleSheet({})

    const { container, rerender } = render(ThemeProviderFixture, {
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    await rerender({ theme: { fontColor: 'blue' } })

    expect(container.querySelector('div')?.className).toBe('teiler-13z0lem thjt86x')
    expect(styleSheet.dump()).toBe(' .teiler-9hfnro{color:green;} .teiler-13z0lem{color:blue;}')
  })
})
