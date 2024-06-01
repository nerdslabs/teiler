import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'
import { StyleDefinition, createStyleSheet } from '@teiler/core'
import { ThemeProvider, component, createComponent, global, keyframes } from './index'
import { h } from 'vue'

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
    const wrapper = mount(component, {
      slots: {
        default: 'Hello',
      },
      global: {
        provide: {
          THEME: {},
          STYLE_SHEET: styleSheet,
        },
      },
    })

    expect(component).toEqual({
      inheritAttrs: false,
      styleDefinition: styleDefinition,
      render: expect.any(Function),
      setup: expect.any(Function),
    })

    expect(wrapper.html()).toBe('<div class="teiler-wq229y twq229y">Hello</div>')
    expect(styleSheet.dump()).toBe(' .teiler-wq229y{color:red;}')
  })
})

describe('component', () => {
  test('should create basic a component', () => {
    const StyledComponent = component`color: blue;`

    const wrapper = mount(StyledComponent, {
      global: {
        provide: {
          THEME: {},
        },
      },
    })

    expect(StyledComponent).toEqual({
      inheritAttrs: false,
      styleDefinition: {
        id: 't1r77qux',
        styles: [[['color: blue;'], []]],
        tag: 'div',
        type: 'component',
      },
      render: expect.any(Function),
      setup: expect.any(Function),
    })

    expect(wrapper.html()).toBe('<div class="teiler-1r77qux t1r77qux"></div>')
  })

  test('should create a component with props', () => {
    const styleSheet = createStyleSheet({})

    const StyledComponent = component<{ _color: string }>`color: ${(props) => props._color};`

    const wrapper = mount(StyledComponent, {
      props: {
        _color: 'yellow',
      },
      global: {
        provide: {
          THEME: {},
          STYLE_SHEET: styleSheet,
        },
      },
    })

    expect(StyledComponent).toEqual({
      inheritAttrs: false,
      styleDefinition: {
        id: 't10upe3l',
        styles: [[['color: ', ';'], [expect.any(Function)]]],
        tag: 'div',
        type: 'component',
      },
      render: expect.any(Function),
      setup: expect.any(Function),
    })

    expect(wrapper.html()).toBe('<div class="teiler-100tn2k t10upe3l"></div>')
    expect(styleSheet.dump()).toBe(' .teiler-100tn2k{color:yellow;}')
  })

  test('should create a component with custom theme', () => {
    const styleSheet = createStyleSheet({})

    const StyledComponent = component`color: ${(props) => props.theme.fontColor};`

    const wrapper = mount(StyledComponent, {
      global: {
        provide: {
          THEME: {
            fontColor: 'green',
          },
          STYLE_SHEET: styleSheet,
        },
      },
    })

    expect(StyledComponent).toEqual({
      inheritAttrs: false,
      styleDefinition: {
        id: 't10upe3l',
        styles: [[['color: ', ';'], [expect.any(Function)]]],
        tag: 'div',
        type: 'component',
      },
      render: expect.any(Function),
      setup: expect.any(Function),
    })

    expect(wrapper.html()).toBe('<div class="teiler-1dc5e1n t10upe3l"></div>')
    expect(styleSheet.dump()).toBe(' .teiler-1dc5e1n{color:green;}')
  })

  test('should create a component with custom class', () => {
    const styleSheet = createStyleSheet({})

    const StyledComponent = component`color: green;`

    const wrapper = mount(StyledComponent, {
      attrs: {
        class: 'custom-class',
      },
      global: {
        provide: {
          THEME: {},
          STYLE_SHEET: styleSheet,
        },
      },
    })

    expect(StyledComponent).toEqual({
      inheritAttrs: false,
      styleDefinition: {
        id: 't1dc5e1n',
        styles: [[['color: green;'], []]],
        tag: 'div',
        type: 'component',
      },
      render: expect.any(Function),
      setup: expect.any(Function),
    })

    expect(wrapper.html()).toBe('<div class="teiler-1dc5e1n t1dc5e1n custom-class"></div>')
    expect(styleSheet.dump()).toBe(' .teiler-1dc5e1n{color:green;}')
  })
})

describe('global', () => {
  test('should create a global style', () => {
    const styleSheet = createStyleSheet({})

    const GlobalStyle = global`color: red;`

    const wrapper = mount(GlobalStyle, {
      global: {
        provide: {
          THEME: {},
          STYLE_SHEET: styleSheet,
        },
      },
    })

    expect(GlobalStyle).toEqual({
      inheritAttrs: false,
      styleDefinition: {
        id: 'twq229y',
        styles: [[['color: red;'], []]],
        tag: null,
        type: 'global',
      },
      render: expect.any(Function),
      setup: expect.any(Function),
    })

    expect(wrapper.html()).toBe('')
    expect(styleSheet.dump()).toBe(' color:red;')
  })

  test('should create a global style with theme', () => {
    const styleSheet = createStyleSheet({})

    const GlobalStyle = global`color: ${(props) => props.theme.fontColor};`

    const wrapper = mount(GlobalStyle, {
      global: {
        provide: {
          THEME: {
            fontColor: 'green',
          },
          STYLE_SHEET: styleSheet,
        },
      },
    })

    expect(GlobalStyle).toEqual({
      inheritAttrs: false,
      styleDefinition: {
        id: 't10upe3l',
        styles: [[['color: ', ';'], [expect.any(Function)]]],
        tag: null,
        type: 'global',
      },
      render: expect.any(Function),
      setup: expect.any(Function),
    })

    expect(wrapper.html()).toBe('')
    expect(styleSheet.dump()).toBe(' color:green;')
  })

  describe('keyframes', () => {
    test('should create keyframes', () => {
      const styleSheet = createStyleSheet({})

      const animation = keyframes`from { opacity: 0; } to { opacity: 1; }`
      const StyledComponent = component`animation: ${animation} 5s infinite;`

      mount(StyledComponent, {
        global: {
          provide: {
            THEME: {},
            STYLE_SHEET: styleSheet,
          },
        },
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
})

describe('ThemeProvider', () => {
  test('should provide theme', () => {
    const styleSheet = createStyleSheet({})

    const StyledComponent = component`color: ${(props) => props.theme.fontColor};`

    const layout = h(ThemeProvider, {
      theme: {
        fontColor: 'green',
      },
    })

    const wrapper = mount(layout, {
      slots: {
        default: h(StyledComponent),
      },
      global: {
        provide: {
          STYLE_SHEET: styleSheet,
        },
      },
    })

    expect(wrapper.html()).toBe('<div class="teiler-1dc5e1n t10upe3l"></div>')
    expect(styleSheet.dump()).toBe(' .teiler-1dc5e1n{color:green;}')
  })

  test('should provide theme with empty slot', () => {
    const styleSheet = createStyleSheet({})

    const layout = h(ThemeProvider, {
      theme: {
        fontColor: 'green',
      },
    })

    const wrapper = mount(layout, {
      global: {
        provide: {
          STYLE_SHEET: styleSheet,
        },
      },
    })

    expect(wrapper.html()).toBe('')
    expect(styleSheet.dump()).toBe('')
  })
})
