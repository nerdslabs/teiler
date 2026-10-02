import type { HTMLElements, StyleDefinition, TeilerComponent } from '.'

import { afterEach, describe, expect, test, vi } from 'vitest'
import { component, configure, createStyleSheet, insert, pattern, styled } from '.'

const create = <Target extends HTMLElements, Props>(styleDefinition: StyleDefinition<Target, Props>): TeilerComponent<Target, Props> => ({ styleDefinition })
const define = (strings: string[], ...properties: unknown[]) => styled('div', component, create, strings, ...(properties as never[])) as TeilerComponent<'div', {}>
const select = (target: unknown) => insert(createStyleSheet({}), component('div', [[['& ', ' { color: red; }'], [target as never]]]), { theme: {} })

describe('id collisions', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

  afterEach(() => warn.mockClear())

  test('reports a selector shared by components with the same strings', () => {
    const A = define(['a-color: ', ';'], 'red')
    define(['a-color: ', ';'], 'blue')

    select(A)
    select(A)

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith('[teiler]', expect.stringContaining(`\`.${A.styleDefinition.id}\``))
  })

  test('reports a selector shared by an empty extension', () => {
    const Base = define(['b-color: red;'])
    ;(styled(undefined, component, create, Base) as (strings: string[]) => TeilerComponent<'div', {}>)([''])

    select(Base)

    expect(warn).toHaveBeenCalledTimes(1)
  })

  test('reports patterns', () => {
    const base = pattern`c-color: ${'red'};`
    const other = pattern`c-color: ${'blue'};`

    expect(other.id).toBe(base.id)

    select(base)

    expect(warn).toHaveBeenCalledTimes(1)
  })

  test.each([
    { name: 'the same definition evaluated again', setup: () => [define(['d-color: ', ';'], 'red'), define(['d-color: ', ';'], 'red')][0] },
    { name: 'the same function source', setup: () => [define(['e-color: ', ';'], () => 'red'), define(['e-color: ', ';'], () => 'red')][0] },
    { name: 'a component without duplicates', setup: () => define(['f-color: red;']) },
    {
      name: 'component ids',
      setup: () => {
        const A = styled('div', configure(component, { componentId: 'a' }), create, ['g-color: ', ';'], 'red') as TeilerComponent<'div', {}>
        styled('div', configure(component, { componentId: 'b' }), create, ['g-color: ', ';'], 'blue')
        return A
      },
    },
  ])('does not report $name', ({ setup }) => {
    select(setup())

    expect(warn).not.toHaveBeenCalled()
  })

  test('does not report components that are not used as selectors', () => {
    define(['h-color: ', ';'], 'red')
    const B = define(['h-color: ', ';'], 'blue')

    insert(createStyleSheet({}), B.styleDefinition, { theme: {} })

    expect(warn).not.toHaveBeenCalled()
  })
})
