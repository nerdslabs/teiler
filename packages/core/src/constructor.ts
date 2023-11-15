import type { Sheet } from './sheet'

import { compile, transpile } from './css'
import hash from './hash'

type DefaultTheme = {[key: string]: string | boolean}

type Arguments<Props> = {
  theme?: DefaultTheme
} & Props

type Expression<Props> = (props: Arguments<Props>) => string | boolean
type StyleDefinition = {
  id: string
  name: string
  css: string
  type: 'component' | 'global' | 'keyframes'
}
type Raw = string | number
type Properties<Props> = Expression<Props> | StyleDefinition | Raw
type Style<Props> = [string[], Properties<Props>[]]

type Target = string

type TeilerComponent<Target, Props> = {
  styles: Array<Style<Props>>
  tag: Target
}

type CreateCallback<Props, Type extends TeilerComponent<Target, Props>> = (styles: Array<Style<Props>>) => Type
type ExtendCallback<Props, Type extends TeilerComponent<Target, Props>> = (string: ReadonlyArray<string>, ...properties: Properties<Props>[]) => Type

function styled<Props, Type extends TeilerComponent<Target, Props>>(
  createComponent: CreateCallback<Props, Type>,
  stringOrBinded: TeilerComponent<Target, Props> | ReadonlyArray<string>,
  ...properties: Properties<Props>[]
): ExtendCallback<Props, Type> | Type {
  if (Array.isArray(stringOrBinded)) {
    const strings = stringOrBinded as ReadonlyArray<string>
    const style: Style<Props> = [Array.from(strings), properties]
    return createComponent([style])
  } else {
    const binded = stringOrBinded as TeilerComponent<Target, Props>
    return (strings: ReadonlyArray<string>, ...properties: Expression<Props>[]) => {
      const style: Style<Props> = [Array.from(strings), properties]
      return createComponent([...binded.styles, style])
    }
  }
}

type Compile = <Props>(sheet: Sheet, styles: Array<Style<Props>>, props: Props) => string[] | void

function insert(sheet: Sheet, definitions: StyleDefinition[]): string[] {
  return definitions.reduce<string[]>((classes, { id, name, css, type }) => {
    if (type === 'component') {
      const result = transpile(`.${name} { ${css} }`).join(' ')
      sheet.insert(id, result)

      classes = [...classes, name]
    } else {
      const result = transpile(css).join(' ')
      sheet.insert(id, result)
    }

    return classes;
  }, [])
}

function component<Props>(sheet: Sheet, styles: Array<Style<Props>>, props: Arguments<Props>): string[] {
  const {css, definitions} = compile(styles, props)

  const id = hash(css)
  const definition: StyleDefinition = {
    id: id,
    name: 'teiler-' + id,
    css,
    type: 'component'
  }

  return insert(sheet, [...definitions, definition])
}

function global<Props>(sheet: Sheet, styles: Array<Style<Props>>, props: Arguments<Props>): void {
  const {css, definitions} = compile(styles, props)

  const id = hash(css)
  const definition: StyleDefinition = {
    id: id,
    name: 'teiler-' + id,
    css,
    type: 'global'
  }

  insert(sheet, [...definitions, definition])
}

function keyframes(strings: ReadonlyArray<string>, ...properties: Raw[]): StyleDefinition {
  const style: Style<{}> = [Array.from(strings), properties]

  const { css } = compile([style], {})
  const id = hash(css)
  const name = `teiler-keyframes-${id}`

  return { id, name, css: `@keyframes ${name} { ${css} }`, type: 'keyframes' }
}

export type { Arguments, Compile, DefaultTheme, Properties, Sheet, Style, StyleDefinition, TeilerComponent, Target }
export { keyframes, component, global, styled }
