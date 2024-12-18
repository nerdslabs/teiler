import type { Sheet } from './sheet'
import type { HTMLElements } from './tags'
import type { Pattern } from './pattern'

import hash from './hash'
import { compile, transpile } from './css'

interface DefaultTheme {
  [key: string]: unknown
}

type Arguments<Props> = {
  theme: DefaultTheme
} & Props

type CSS<Props> = { styles: Style<Props>[]; id: string; __css__: true }
type Expression<Props> = (props: Arguments<Props>) => string | boolean | undefined | CSS<Props>
type Raw = string | number
type Properties<Props> = Expression<Props> | StyleDefinition<HTMLElements, Props> | Pattern<HTMLElements, Props> | TeilerComponent<HTMLElements, Props> | Raw
type Style<Props> = [string[], Properties<Props>[]]

type StyleDefinition<Target extends HTMLElements, Props> = {
  type: 'component' | 'global' | 'keyframes'
  id: string
  styles: Array<Style<Props>>
  tag: Target
}

type TeilerComponent<Target extends HTMLElements, Props> = {
  styleDefinition: StyleDefinition<Target, Props>
}

type CreateCallback<Type extends TeilerComponent<HTMLElements, Props>, Props> = (styles: StyleDefinition<HTMLElements, Props>) => Type
type ExtendCallback<Type extends TeilerComponent<HTMLElements, Props>, Props> = (string: ReadonlyArray<string>, ...properties: Properties<Props>[]) => Type

function styled<Props, Type extends TeilerComponent<HTMLElements, Props>>(
  tag: HTMLElements,
  compiler: Compiler,
  createComponent: CreateCallback<Type, Props>,
  stringOrBinded: TeilerComponent<HTMLElements, Props> | ReadonlyArray<string>,
  ...properties: Properties<Props>[]
): Type | ExtendCallback<Type, Props> {
  if (Array.isArray(stringOrBinded)) {
    const strings = stringOrBinded as ReadonlyArray<string>
    const style: Style<Props> = [Array.from(strings), properties]
    const styleDefinition = compiler(tag, [style])
    return createComponent(styleDefinition)
  } else {
    const binded = stringOrBinded as TeilerComponent<HTMLElements, Props>
    return (strings: ReadonlyArray<string>, ...properties: Properties<Props>[]) => {
      const style: Style<Props> = [Array.from(strings), properties]
      const styleDefinition = compiler(binded.styleDefinition.tag, [...binded.styleDefinition.styles, style])
      return createComponent(styleDefinition)
    }
  }
}

type Compiler = <Target extends HTMLElements, Props>(tag: Target, styles: Array<Style<Props>>) => StyleDefinition<Target, Props>

const component: Compiler = <Target extends HTMLElements, Props>(tag: Target, styles: Array<Style<Props>>): StyleDefinition<Target, Props> => {
  const id = styles.reduce((acc, [strings]) => acc + strings.join(''), '')

  return {
    type: 'component',
    id: 't' + hash(id),
    styles,
    tag,
  }
}

const global: Compiler = <Target extends HTMLElements, Props>(tag: Target, styles: Array<Style<Props>>): StyleDefinition<Target, Props> => {
  const id = styles.reduce((acc, [strings]) => acc + strings.join(''), '')

  return {
    type: 'global',
    id: 't' + hash(id),
    styles,
    tag,
  }
}

function keyframes(strings: ReadonlyArray<string>, ...properties: Raw[]): StyleDefinition<null, {}> {
  const style: Style<{}> = [Array.from(strings), properties]
  const id = strings.join('')

  return {
    type: 'keyframes',
    id: 'teiler-' + hash(id),
    styles: [style],
    tag: null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function css(strings: ReadonlyArray<string>, ...properties: Exclude<Properties<any>, Expression<unknown>>[]): CSS<unknown> {
  const style: Style<unknown> = [Array.from(strings), properties]
  const styles = [style]
  const id = styles.reduce((acc, [strings]) => acc + strings.join(''), '')
  return { styles: styles, id: 't' + hash(id), __css__: true }
}

function insert<Props = {}>(sheet: Sheet, definition: StyleDefinition<HTMLElements, Props>, props: Arguments<Props>): string | null {
  const { styles, type } = definition
  const { css, definitions } = compile(styles, props)
  const compiledId = hash(css)

  definitions.forEach((definition) => insert(sheet, definition, props))

  if (type === 'component') {
    const transpiled = transpile(`.teiler-${compiledId} { ${css} }`)
    sheet.insert(compiledId, transpiled)

    return `teiler-${compiledId}`
  } else if (type === 'keyframes') {
    const { id: definitionId } = definition
    const transpiled = transpile(`@keyframes ${definitionId} { ${css} }`)
    sheet.insert(compiledId, transpiled)
  } else {
    const transpiled = transpile(`${css}`)
    sheet.insert(compiledId, transpiled)
  }

  return null
}

export type { Arguments, Compiler, CreateCallback, CSS, DefaultTheme, Properties, Raw, Sheet, Style, StyleDefinition, TeilerComponent, HTMLElements }
export { component, css, global, insert, keyframes, styled }
