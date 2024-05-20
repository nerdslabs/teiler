import type { StyleDefinition } from '@teiler/core'

import { writable } from 'svelte/store'
import { describe, expect, test } from '@jest/globals'
import { render } from '@testing-library/svelte'
import { createStyleSheet } from '@teiler/core'
import { component, createComponent, global, keyframes } from './index'

import ThemeProviderTest from './ThemeProvider.test.svelte'

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

    const { baseElement } = render(component, {
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    expect(baseElement.innerHTML).toBe('<div><div class="teiler-wq229y twq229y"></div></div>')
    expect(styleSheet.dump()).toBe(' .teiler-wq229y{color:red;}')
  })
})

describe('component', () => {
  test('should create basic a component', () => {
    const StyledComponent = component`color: blue;`

    const { baseElement } = render(StyledComponent)

    expect(baseElement.innerHTML).toBe('<div><div class="teiler-1r77qux t1r77qux"></div></div>')
  })

  test('should create a component with props', () => {
    const styleSheet = createStyleSheet({})

    const StyledComponent = component<{ _color: string }>`color: ${(props) => props._color};`

    const { baseElement } = render(StyledComponent, {
      props: { _color: 'yellow' },
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    expect(baseElement.innerHTML).toBe('<div><div class="teiler-100tn2k t10upe3l"></div></div>')
    expect(styleSheet.dump()).toBe(' .teiler-100tn2k{color:yellow;}')
  })

  test('should create a component with custom theme', () => {
    const styleSheet = createStyleSheet({})

    const StyledComponent = component`color: ${(props) => props.theme.fontColor};`

    const { baseElement } = render(StyledComponent, {
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet, THEME: writable({ fontColor: 'green' }) })),
    })

    expect(baseElement.innerHTML).toBe('<div><div class="teiler-1dc5e1n t10upe3l"></div></div>')
    expect(styleSheet.dump()).toBe(' .teiler-1dc5e1n{color:green;}')
  })

  test('should create a component with custom class', () => {
    const styleSheet = createStyleSheet({})

    const StyledComponent = component`color: green;`

    const { baseElement } = render(StyledComponent, {
      props: {
        class: 'custom-class',
      },
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    expect(baseElement.innerHTML).toBe('<div><div class="teiler-1dc5e1n t1dc5e1n custom-class"></div></div>')
    expect(styleSheet.dump()).toBe(' .teiler-1dc5e1n{color:green;}')
  })
})

describe('global', () => {
  test('should create a global style', () => {
    const styleSheet = createStyleSheet({})

    const GlobalStyle = global`color: red;`

    const { baseElement } = render(GlobalStyle, {
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    // expect(GlobalStyle.styleDefinition).toEqual({ id: 'twq229y', styles: [[['color: red;'], []]], tag: null, type: 'global' })

    expect(baseElement.innerHTML).toBe('<div></div>')
    expect(styleSheet.dump()).toBe(' color:red;')
  })

  test('should create a global style with theme', () => {
    const styleSheet = createStyleSheet({})

    const GlobalStyle = global`color: ${(props) => props.theme.fontColor};`

    const { baseElement } = render(GlobalStyle, {
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet, THEME: writable({ fontColor: 'green' }) })),
    })

    expect(baseElement.innerHTML).toBe('<div></div>')
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

    const { baseElement } = render(ThemeProviderTest, {
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    expect(baseElement.innerHTML).toBe('<div><div class="teiler-9hfnro ta5e6s7">abc</div></div>')
    expect(styleSheet.dump()).toBe(' .teiler-9hfnro{color:green;}')
  })
})
