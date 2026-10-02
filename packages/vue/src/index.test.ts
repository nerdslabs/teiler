import { describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { StyleDefinition, createStyleSheet } from '@teiler/core'
import { ThemeProvider, component, createComponent, global, keyframes } from './index'
import { defineComponent, h } from 'vue'

declare module '@teiler/core' {
  interface DefaultTheme {
    fontColor?: string
  }
}

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

    expect(component.styleDefinition).toBe(styleDefinition)

    expect(wrapper.html()).toBe('<div class="teiler-wq229y twq229y">Hello</div>')
    expect(styleSheet.dump()).toBe('.teiler-wq229y{color:red;}')
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

    expect(StyledComponent.styleDefinition).toEqual({
      id: 't8e9dar',
      styles: [[['color: blue;'], []]],
      tag: 'div',
      type: 'component',
    })

    expect(wrapper.vm.element).toBeInstanceOf(HTMLDivElement)

    expect(wrapper.html()).toBe('<div class="teiler-1r77qux t8e9dar"></div>')
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

    expect(StyledComponent.styleDefinition).toEqual({
      id: 't1fqd64x',
      styles: [[['color: ', ';'], [expect.any(Function)]]],
      tag: 'div',
      type: 'component',
    })

    expect(wrapper.html()).toBe('<div class="teiler-100tn2k t1fqd64x"></div>')
    expect(styleSheet.dump()).toBe('.teiler-100tn2k{color:yellow;}')
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

    expect(StyledComponent.styleDefinition).toEqual({
      id: 't1fqd64x',
      styles: [[['color: ', ';'], [expect.any(Function)]]],
      tag: 'div',
      type: 'component',
    })

    expect(wrapper.html()).toBe('<div class="teiler-1dc5e1n t1fqd64x"></div>')
    expect(styleSheet.dump()).toBe('.teiler-1dc5e1n{color:green;}')
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

    expect(StyledComponent.styleDefinition).toEqual({
      id: 'tsqxzcw',
      styles: [[['color: green;'], []]],
      tag: 'div',
      type: 'component',
    })

    expect(wrapper.html()).toBe('<div class="teiler-1dc5e1n tsqxzcw custom-class"></div>')
    expect(styleSheet.dump()).toBe('.teiler-1dc5e1n{color:green;}')
  })

  test('should forward attributes and skip underscore props', () => {
    const StyledComponent = component.a<{ _color: string }>`color: ${(props) => props._color};`

    const wrapper = mount(StyledComponent, {
      attrs: { _color: 'red', href: '/home', 'data-test': 'link' },
      global: { provide: { STYLE_SHEET: createStyleSheet({}) } },
    })

    expect(wrapper.attributes('href')).toBe('/home')
    expect(wrapper.attributes('data-test')).toBe('link')
    expect(wrapper.attributes('_color')).toBeUndefined()
  })

  test('should forward event handlers', async () => {
    const onClick = vi.fn()

    const StyledComponent = component.button`color: red;`

    const wrapper = mount(StyledComponent, {
      attrs: { onClick },
      global: { provide: { STYLE_SHEET: createStyleSheet({}) } },
    })

    await wrapper.trigger('click')

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('should update styles when props change', async () => {
    const styleSheet = createStyleSheet({})

    const StyledComponent = component<{ _color: string }>`color: ${(props) => props._color};`

    const wrapper = mount(StyledComponent, {
      props: { _color: 'yellow' },
      global: { provide: { STYLE_SHEET: styleSheet } },
    })

    const [yellowClass] = wrapper.classes()

    await wrapper.setProps({ _color: 'blue' })

    const [blueClass] = wrapper.classes()

    expect(blueClass).not.toBe(yellowClass)
    expect(styleSheet.dump()).toContain(`.${blueClass}{color:blue;}`)
  })

  test('should use component id as selector', () => {
    const styleSheet = createStyleSheet({})

    const Button = component.button`color: red;`
    const Group = component`& ${Button} { margin: 0; }`

    mount(Group, { global: { provide: { STYLE_SHEET: styleSheet } } })

    expect(styleSheet.dump()).toContain(`.${Button.styleDefinition.id}{margin:0;}`)
    expect(styleSheet.dump()).toContain('{color:red;}')
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

    expect(wrapper.html()).toBe('<a href="/link" class="teiler-1dc5e1n t1alcjr5">Link</a>')
    expect(wrapper.vm.element).toBeInstanceOf(HTMLAnchorElement)
    expect(styleSheet.dump()).toBe('.teiler-1dc5e1n{color:green;}')
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

    expect(wrapper.html()).toBe('<a href="/home" class="teiler-wq229y t1m1b485">Home</a>')
    expect(wrapper.vm.element).toBeInstanceOf(HTMLAnchorElement)
    expect(styleSheet.dump()).toBe('.teiler-wq229y{color:red;}')
  })

  test('should extend component with different element', () => {
    const styleSheet = createStyleSheet({})

    const Button = component.button`color: green;`
    const ButtonLink = component.a(Button)``

    const wrapper = mount(ButtonLink, {
      global: {
        provide: {
          THEME: {},
          STYLE_SHEET: styleSheet,
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

  test('should switch rendered element when as changes', async () => {
    const StyledComponent = component.button`color: green;`

    const wrapper = mount(StyledComponent, {
      attrs: { href: '/link' },
      global: { provide: { STYLE_SHEET: createStyleSheet({}) } },
    })

    await wrapper.setProps({ as: 'a' })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/link')
  })
})

describe('withComponent', () => {
  const Link = defineComponent({
    name: 'Link',
    props: { to: { type: String, required: true } },
    setup(props, { slots }) {
      return () => h('a', { href: props.to }, slots.default?.())
    },
  })

  test('should render the target component', () => {
    const Button = component.button`color: green;`
    const ButtonWithLink = Button.withComponent(Link)

    const wrapper = mount(ButtonWithLink, {
      attrs: { to: '/home' },
      slots: { default: 'Home' },
      global: { provide: { STYLE_SHEET: createStyleSheet({}) } },
    })

    expect(wrapper.html()).toBe(`<a href="/home" class="teiler-1dc5e1n ${ButtonWithLink.styleDefinition.id}">Home</a>`)
    expect(wrapper.vm.element).toBeInstanceOf(HTMLAnchorElement)
    expect(ButtonWithLink.name).toBe('StyledLink')
  })

  test('should prefer as over the target component', () => {
    const ButtonWithLink = component.button`color: green;`.withComponent(Link)

    const wrapper = mount(ButtonWithLink, {
      attrs: { as: 'span', to: '/home' },
      global: { provide: { STYLE_SHEET: createStyleSheet({}) } },
    })

    expect(wrapper.element.tagName).toBe('SPAN')
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

    expect(GlobalStyle.styleDefinition).toEqual({
      id: 'twq229y',
      styles: [[['color: red;'], []]],
      tag: null,
      type: 'global',
    })

    expect(wrapper.html()).toBe('')
    expect(styleSheet.dump()).toBe('color:red;')
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

    expect(GlobalStyle.styleDefinition).toEqual({
      id: 't10upe3l',
      styles: [[['color: ', ';'], [expect.any(Function)]]],
      tag: null,
      type: 'global',
    })

    expect(wrapper.html()).toBe('')
    expect(styleSheet.dump()).toBe('color:green;')
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

      expect(styleSheet.dump()).toBe('@keyframes teiler-g1154k{from{opacity:0;}to{opacity:1;}}.teiler-jq8kuu{animation:teiler-g1154k 5s infinite;}')
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

    expect(wrapper.html()).toBe('<div class="teiler-1dc5e1n t1fqd64x"></div>')
    expect(styleSheet.dump()).toBe('.teiler-1dc5e1n{color:green;}')
  })

  test('should update styles when theme changes', async () => {
    const styleSheet = createStyleSheet({})

    const StyledComponent = component`color: ${(props) => props.theme.fontColor};`

    const wrapper = mount(ThemeProvider, {
      props: { theme: { fontColor: 'green' } },
      slots: { default: () => h(StyledComponent) },
      global: { provide: { STYLE_SHEET: styleSheet } },
    })

    const element = wrapper.find('div')
    const [greenClass] = element.classes()

    await wrapper.setProps({ theme: { fontColor: 'blue' } })

    const [blueClass] = element.classes()

    expect(blueClass).not.toBe(greenClass)
    expect(styleSheet.dump()).toContain(`.${blueClass}{color:blue;}`)
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

describe('withConfig', () => {
  test('should create ids from the component id', () => {
    const A = component.div.withConfig({ componentId: 'a' })`color: ${'red'};`
    const B = component.div.withConfig({ componentId: 'b' })`color: ${'blue'};`
    const C = component.withConfig({ componentId: 'a' })`color: ${'red'};`

    expect(A.styleDefinition.componentId).toBe('a')
    expect(A.styleDefinition.id).not.toBe(B.styleDefinition.id)
    expect(A.styleDefinition.id).toBe(C.styleDefinition.id)
    expect(component.div.withConfig('a')`color: ${'red'};`.styleDefinition).toEqual(A.styleDefinition)
    expect(component.div`color: ${'red'};`.styleDefinition.id).toBe(component.div`color: ${'blue'};`.styleDefinition.id)
  })

  test('should give extensions and targets their own ids', () => {
    const Button = component.button`color: red;`
    const Extended = component(Button).withConfig({ componentId: 'a' })``
    const Link = component.a.withConfig({ componentId: 'a' })(Button)``

    expect(component(Button)``.styleDefinition.id).toBe(Button.styleDefinition.id)
    expect(Extended.styleDefinition.id).not.toBe(Button.styleDefinition.id)
    expect(Extended.styleDefinition.tag).toBe('button')
    expect(Link.styleDefinition.tag).toBe('a')
    expect(Extended.withComponent('a').styleDefinition).toEqual(expect.objectContaining({ tag: 'a', componentId: 'a', id: Link.styleDefinition.id }))
  })

  test('should configure globals', () => {
    expect(global.withConfig({ componentId: 'a' })`body { color: red; }`.styleDefinition.componentId).toBe('a')
  })
})
