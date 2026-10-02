import type { HTMLElements, StyleDefinition, TeilerComponent } from '.'

import { describe, expect, test, vi } from 'vitest'
import { component, configure, createStyleSheet, css, global, insert, keyframes, styled, withTarget } from '.'

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

  test('should keep target of extended component when tag is not specified', () => {
    const Link = { name: 'Link' }
    const existingComponent: TeilerComponent<'button', {}> = { styleDefinition: withTarget(component('button', [[['color: red;'], []]]), Link) as StyleDefinition<'button', {}> }

    const extended = (styled(undefined, component, createComponent, existingComponent) as Callable)(['background: blue;']).styleDefinition
    const plain = (styled(undefined, component, createComponent, { styleDefinition: component('button', [[['color: red;'], []]]) }) as Callable)(['background: blue;']).styleDefinition

    expect(extended.target).toBe(Link)
    expect(extended.tag).toBe('button')
    expect(extended.id).not.toBe(plain.id)
  })

  test('should drop target of extended component when tag is specified', () => {
    const existingComponent: TeilerComponent<'button', {}> = { styleDefinition: withTarget(component('button', [[['color: red;'], []]]), { name: 'Link' }) as StyleDefinition<'button', {}> }

    const extended = (styled('a', component, createComponent, existingComponent) as Callable)(['']).styleDefinition

    expect(extended.target).toBeUndefined()
    expect(extended.tag).toBe('a')
    expect(extended.id).toBe(
      component('a', [
        [['color: red;'], []],
        [[''], []],
      ]).id,
    )
  })
})

describe('withTarget', () => {
  const definition = component('button', [[['color: red;'], []]])

  test('should change tag and id for a tag target', () => {
    expect(withTarget(definition, 'a')).toEqual(component('a', [[['color: red;'], []]]))
  })

  test('should keep tag and styles for a component target', () => {
    const Link = { name: 'Link' }
    const result = withTarget(definition, Link)

    expect(result.target).toBe(Link)
    expect(result.tag).toBe('button')
    expect(result.styles).toBe(definition.styles)
    expect(result.id).not.toBe(definition.id)
  })

  test('should create stable ids from component names', () => {
    expect(withTarget(definition, { name: 'Link' }).id).toBe(withTarget(definition, { name: 'Link' }).id)
    expect(withTarget(definition, { __name: 'Link' }).id).toBe(withTarget(definition, { name: 'Link' }).id)
    expect(withTarget(definition, { name: 'Link' }).id).not.toBe(withTarget(definition, { name: 'RouterLink' }).id)
    expect(withTarget(definition, function Link() {}).id).toBe(withTarget(definition, { name: 'Link' }).id)
    expect(withTarget(definition, {}).id).toBe(withTarget(definition, { name: '' }).id)
  })

  test('should drop component target when changing to a tag', () => {
    expect(withTarget(withTarget(definition, { name: 'Link' }), 'span').target).toBeUndefined()
  })
})

describe('component', () => {
  test('should create different ids for same styles with different tags', () => {
    const div = component('div', [[['color: red;'], []]])
    const button = component('button', [[['color: red;'], []]])

    expect(div.id).not.toBe(button.id)
  })
})

describe('componentId', () => {
  const styles = [[['color: red;'], []]] as StyleDefinition<'div', {}>['styles']

  test('should create ids from the component id instead of the styles', () => {
    expect(component('div', styles, undefined, 'a')).toEqual({ type: 'component', id: expect.any(String), styles, tag: 'div', componentId: 'a' })
    expect(component('div', styles, undefined, 'a').id).toBe(component('div', [[['color: blue;'], []]], undefined, 'a').id)
    expect(component('div', styles, undefined, 'a').id).not.toBe(component('div', styles, undefined, 'b').id)
    expect(component('div', styles, undefined, 'a').id).not.toBe(component('div', styles).id)
    expect(component('div', styles, undefined, 'a').id).not.toBe(component('span', styles, undefined, 'a').id)
    expect(global(null, styles, undefined, 'a')).toEqual({ type: 'global', id: expect.any(String), styles, tag: null, componentId: 'a' })
  })

  test('should configure a compiler, the last component id wins', () => {
    expect(configure(component, { componentId: 'a' })('div', styles)).toEqual(component('div', styles, undefined, 'a'))
    expect(configure(configure(component, { componentId: 'a' }), { componentId: 'b' })('div', styles)).toEqual(component('div', styles, undefined, 'b'))
    expect(configure(component, {})('div', styles)).toEqual(component('div', styles))
  })

  test('should give empty extensions their own id', () => {
    const Button = styled('button', component, createComponent, ['color: red;']) as TeilerComponent<'button', {}>
    const extend = styled(undefined, component, createComponent, Button) as Callable & { withConfig: (config: { componentId: string }) => Callable }

    expect(extend(['']).styleDefinition.id).toBe(Button.styleDefinition.id)
    expect(extend.withConfig({ componentId: 'a' })(['']).styleDefinition).toEqual(component('button', [...Button.styleDefinition.styles, [[''], []]], undefined, 'a'))
    expect((extend.withConfig as unknown as (id: string) => Callable)('a')(['']).styleDefinition).toEqual(extend.withConfig({ componentId: 'a' })(['']).styleDefinition)
  })

  test('should keep the component id when changing the target', () => {
    const Link = { name: 'Link' }
    const definition = component('button', styles, undefined, 'a')

    expect(withTarget(definition, 'a')).toEqual(component('a', styles, undefined, 'a'))
    expect(withTarget(definition, Link)).toEqual(component('button', styles, Link, 'a'))
    expect(withTarget(definition, Link).id).not.toBe(withTarget(component('button', styles), Link).id)
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
    expect(sheet.dump()).toBe('.teiler-wq229y{color:red;}')
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
    expect(sheet.dump()).toBe('@keyframes teiler-1ep7axc{from{background-color:red;}to{background-color:green;}}')
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
    expect(sheet.dump()).toBe('body{color:red;}')
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
    expect(sheet.dump()).toBe('.teiler-wq229y{color:red;}')
  })

  test.each([
    { name: 'component before global', first: 'component', second: 'global' },
    { name: 'global before component', first: 'global', second: 'component' },
    { name: 'keyframes before component', first: 'keyframes', second: 'component' },
    { name: 'component before keyframes', first: 'component', second: 'keyframes' },
  ] as const)('should insert definitions of different types with the same body: $name', ({ first, second }) => {
    const sheet = createStyleSheet({})
    const definitions = {
      component: { id: 'tcomponent', styles: [[['from { color: red; }'], []]], tag: 'div', type: 'component' },
      global: { id: 'tglobal', styles: [[['from { color: red; }'], []]], tag: null, type: 'global' },
      keyframes: { id: 'teiler-keyframes', styles: [[['from { color: red; }'], []]], tag: null, type: 'keyframes' },
    } satisfies Record<string, StyleDefinition<HTMLElements, {}>>
    const rules = {
      component: '.teiler-8l2r7j from{color:red;}',
      global: 'from{color:red;}',
      keyframes: '@keyframes teiler-keyframes{from{color:red;}}',
    }

    insert(sheet, definitions[first], { theme: {} })
    insert(sheet, definitions[second], { theme: {} })

    expect(sheet.dump()).toBe(`${rules[first]}${rules[second]}`)
  })

  test('should insert a global on the client with the same body as a hydrated component', () => {
    const server = createStyleSheet({})
    const client = createStyleSheet({})
    const component: StyleDefinition<'div', {}> = { id: 'tcomponent', styles: [[['h1 { color: red; }'], []]], tag: 'div', type: 'component' }
    const global: StyleDefinition<null, {}> = { id: 'tglobal', styles: [[['h1 { color: red; }'], []]], tag: null, type: 'global' }

    insert(server, component, { theme: {} })
    client.hydrate(server.extract().ids)
    insert(client, component, { theme: {} })
    insert(client, global, { theme: {} })

    expect(client.dump()).toBe('h1{color:red;}')
  })

  test('should insert css interpolated directly', () => {
    const sheet = createStyleSheet({})
    const shared = css<{ color: string }>`
      color: ${({ color }) => color};
    `
    const result = styled('div', component, createComponent, ['margin: 0;', ''], shared) as TeilerComponent<'div', { color: string }>

    insert(sheet, result.styleDefinition, { theme: {}, color: 'red' })

    expect(sheet.dump()).toMatch(/^\.teiler-\w+\{margin:0;color:red;\}$/)
  })

  test('should insert keyframes once per name', () => {
    const sheet = createStyleSheet({})
    const definition: StyleDefinition<null, {}> = { id: 'teiler-keyframes', styles: [[['from { opacity: 0; }'], []]], tag: null, type: 'keyframes' }

    insert(sheet, definition, { theme: {} })
    insert(sheet, { ...definition }, { theme: {} })

    expect(sheet.extract().ids).toEqual(['k-teiler-keyframes'])
  })
})
