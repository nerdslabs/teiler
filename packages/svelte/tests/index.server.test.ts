import { describe, expect, test } from '@jest/globals'
import { createStyleSheet } from '@teiler/core'
import { render } from 'svelte/server'
import { component, global, keyframes } from '../src/index'

import ParentFixture from './Parent.fixture.svelte'
import ThemeProviderFixture from './ThemeProvider.fixture.svelte'

const strip = (html: string) => html.replace(/<!--.*?-->/g, '')

describe('component', () => {
  test('should render a component', () => {
    const styleSheet = createStyleSheet({})

    const StyledComponent = component`color: blue;`

    const { body } = render(StyledComponent, {
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    expect(strip(body)).toBe('<div class="teiler-1r77qux t8e9dar"></div>')
    expect(styleSheet.dump()).toBe('.teiler-1r77qux{color:blue;}')
  })

  test('should render a component with props, attributes and class', () => {
    const styleSheet = createStyleSheet({})

    const StyledComponent = component.a<{ _color: string }>`color: ${(props) => props._color};`

    const { body } = render(StyledComponent, {
      props: { _color: 'yellow', href: '/home', class: 'custom-class' },
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    expect(strip(body)).toBe('<a class="teiler-100tn2k tsfls2d custom-class" href="/home"></a>')
    expect(styleSheet.dump()).toBe('.teiler-100tn2k{color:yellow;}')
  })

  test('should render a component with props passed from parent', () => {
    const styleSheet = createStyleSheet({})

    const { body } = render(ParentFixture, {
      props: { color: 'blue', attributes: { 'data-state': 'open' } },
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    expect(strip(body)).toBe('<button class="teiler-13z0lem t1o3x0cs" data-state="open">blue</button>')
    expect(styleSheet.dump()).toBe('.teiler-13z0lem{color:blue;}')
  })

  test('should render an extended component', () => {
    const styleSheet = createStyleSheet({})

    const Button = component.button`color: blue;`
    const BigButton = component(Button)`font-size: 2rem;`

    const { body } = render(BigButton, {
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    expect(strip(body)).toMatch(/^<button class="teiler-\w+ t\w+"><\/button>$/)
    expect(styleSheet.dump()).toMatch(/{color:blue;font-size:2rem;}$/)
  })

  test('should render an extended component with overridden tag', () => {
    const styleSheet = createStyleSheet({})

    const Button = component.button`color: blue;`
    const ButtonLink = component.a(Button)`text-decoration: none;`
    const PrimaryButton = component(Button)`text-decoration: none;`

    const link = strip(render(ButtonLink, { props: { href: '/home' }, context: new Map(Object.entries({ STYLE_SHEET: styleSheet })) }).body)
    const button = strip(render(PrimaryButton, { context: new Map(Object.entries({ STYLE_SHEET: styleSheet })) }).body)

    expect(ButtonLink.styleDefinition.tag).toBe('a')
    expect(PrimaryButton.styleDefinition.tag).toBe('button')
    expect(ButtonLink.styleDefinition.id).not.toBe(PrimaryButton.styleDefinition.id)
    expect(link).toBe(`<a class="teiler-znz8j3 ${ButtonLink.styleDefinition.id}" href="/home"></a>`)
    expect(button).toBe(`<button class="teiler-znz8j3 ${PrimaryButton.styleDefinition.id}"></button>`)
    expect(styleSheet.dump()).toBe('.teiler-znz8j3{color:blue;text-decoration:none;}')
  })
})

describe('global', () => {
  test('should insert global style without markup', () => {
    const styleSheet = createStyleSheet({})

    const GlobalStyle = global`color: ${(props) => props.theme.fontColor};`

    const { body } = render(GlobalStyle, {
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet, THEME: () => ({ fontColor: 'green' }) })),
    })

    expect(strip(body)).toBe('')
    expect(styleSheet.dump()).toBe('color:green;')
  })
})

describe('keyframes', () => {
  test('should insert keyframes', () => {
    const styleSheet = createStyleSheet({})

    const animation = keyframes`from { opacity: 0; } to { opacity: 1; }`
    const StyledComponent = component`animation: ${animation} 5s infinite;`

    const { body } = render(StyledComponent, {
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    expect(strip(body)).toBe('<div class="teiler-jq8kuu t4yzacq"></div>')
    expect(styleSheet.dump()).toBe('@keyframes teiler-g1154k{from{opacity:0;}to{opacity:1;}} .teiler-jq8kuu{animation:teiler-g1154k 5s infinite;}')
  })
})

describe('ThemeProvider', () => {
  test('should provide theme', () => {
    const styleSheet = createStyleSheet({})

    const { body } = render(ThemeProviderFixture, {
      props: { theme: { fontColor: 'blue' } },
      context: new Map(Object.entries({ STYLE_SHEET: styleSheet })),
    })

    expect(strip(body)).toBe('<div class="teiler-13z0lem thjt86x">abc</div>')
    expect(styleSheet.dump()).toBe('.teiler-13z0lem{color:blue;}')
  })
})
