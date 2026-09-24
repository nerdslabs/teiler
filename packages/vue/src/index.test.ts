import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'
import { StyleDefinition, createStyleSheet } from '@teiler/core'
import { ThemeProvider, component, createComponent, global, keyframes } from './index'
import { defineComponent, h } from 'vue'

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

    expect(wrapper.vm.element).toBeDefined()
    expect(wrapper.vm.element).not.toBeNull()

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

describe('as', () => {
  test('should render component as a different element', () => {
    const styleSheet = createStyleSheet({})

    const StyledComponent = component.button`color: green;`

    const wrapper = mount(StyledComponent, {
      attrs: {
        as: 'a',
        href: '/link',
      },
      slots: {
        default: 'Link',
      },
      global: {
        provide: {
          THEME: {},
          STYLE_SHEET: styleSheet,
        },
      },
    })

    expect(wrapper.html()).toBe('<a href="/link" class="teiler-1dc5e1n t1dc5e1n">Link</a>')
    expect(wrapper.vm.element).toBeInstanceOf(HTMLAnchorElement)
    expect(styleSheet.dump()).toBe(' .teiler-1dc5e1n{color:green;}')
  })

  test('should render component as another component', () => {
    const styleSheet = createStyleSheet({})

    const Link = defineComponent({
      props: { to: { type: String, required: true } },
      setup(props, { slots }) {
        return () => h('a', { href: props.to }, slots.default?.())
      },
    })

    const StyledComponent = component.button<{ _active: boolean }>`color: ${({ _active }) => (_active ? 'red' : 'green')};`

    const wrapper = mount(StyledComponent, {
      attrs: {
        as: Link,
        to: '/home',
        _active: true,
      },
      slots: {
        default: 'Home',
      },
      global: {
        provide: {
          THEME: {},
          STYLE_SHEET: styleSheet,
        },
      },
    })

    expect(wrapper.html()).toBe('<a href="/home" class="teiler-wq229y t10upe3l">Home</a>')
    expect(wrapper.vm.element).toBeInstanceOf(HTMLAnchorElement)
    expect(styleSheet.dump()).toBe(' .teiler-wq229y{color:red;}')
  })

  test('should extend component with different element', () => {
    const Button = component.button`color: green;`
    const ButtonLink = component.a(Button)``

    const wrapper = mount(ButtonLink, {
      global: {
        provide: {
          THEME: {},
        },
      },
    })

    expect(ButtonLink.styleDefinition.tag).toBe('a')
    expect(ButtonLink.styleDefinition.id).not.toBe(Button.styleDefinition.id)
    expect(wrapper.element.tagName).toBe('A')
  })

  test('should keep element of extended component when tag is not specified', () => {
    const Button = component.button`color: green;`
    const ExtendedButton = component(Button)`background: red;`

    expect(ExtendedButton.styleDefinition.tag).toBe('button')
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
