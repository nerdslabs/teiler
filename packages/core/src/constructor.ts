import type { Sheet } from './sheet'
import type { HTMLElements } from './tags'

import hash from './hash'
import { compile, transpile } from './css'

type DefaultTheme = { [key: string]: string | boolean }

type Arguments<Props> = {
  theme?: DefaultTheme
} & Props

type Expression<Props> = (props: Arguments<Props>) => string | boolean
type Raw = string | number
type Properties<Props> = Expression<Props> | StyleDefinition<null, Props> | TeilerComponent<HTMLElements, Props> | Raw
type Style<Props> = [string[], Properties<Props>[]]

type StyleDefinition<Target extends HTMLElements, Props> = {
  type: 'component' | 'global' | 'keyframes'
  id: string
  styles: Array<Style<Props>>
  tag: Target | null
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
): ExtendCallback<Type, Props> | Type {
  if (Array.isArray(stringOrBinded)) {
    const strings = stringOrBinded as ReadonlyArray<string>
    const style: Style<Props> = [Array.from(strings), properties]
    const styleDefinition = compiler(tag, [style])
    return createComponent(styleDefinition)
  } else {
    const binded = stringOrBinded as TeilerComponent<HTMLElements, Props>
    return (strings: ReadonlyArray<string>, ...properties: Expression<Props>[]) => {
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

const global: Compiler = <Target extends HTMLElements, Props>(tag: null, styles: Array<Style<Props>>): StyleDefinition<Target, Props> => {
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

function insert(sheet: Sheet, definition: StyleDefinition<HTMLElements, unknown>, props: Arguments<unknown>): string {
  const compiled = compile(definition.styles, props)
  const rootId = hash(compiled.css)

  const definitions = [definition, ...compiled.definitions]

  definitions.forEach(({ id, type, styles }) => {
    const compiled = compile(styles, props)
    const compiledId = hash(compiled.css)

    if (type === 'component') {
      const transpiled = transpile(`.teiler-${compiledId} { ${compiled.css} }`)
      sheet.insert(compiledId, transpiled)
    } else if (type === 'keyframes') {
      const transpiled = transpile(`@keyframes ${id} { ${compiled.css} }`)
      sheet.insert(compiledId, transpiled)
    } else {
      const transpiled = transpile(`${compiled.css}`)
      sheet.insert(compiledId, transpiled)
    }
  })

  return `teiler-${rootId}`
}

export type { Arguments, Compiler, CreateCallback, DefaultTheme, Properties, Sheet, Style, StyleDefinition, TeilerComponent, HTMLElements }
export { component, global, insert, keyframes, styled }
