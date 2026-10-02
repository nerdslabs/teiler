import type { Sheet } from './sheet'
import type { HTMLElements } from './tags'
import type { Pattern } from './pattern'

import hash from './hash'
import { compile, transpile } from './css'
import { register } from './ids'

interface DefaultTheme {
  [key: string]: unknown
}

type Arguments<Props> = {
  theme: DefaultTheme
} & Props

type CSS<Props> = { styles: Style<Props>[]; id: string; __css__: true }
type Expression<Props> = (props: Arguments<Props>) => Raw | boolean | null | undefined | CSS<Props>
type Raw = string | number
type Properties<Props> = Expression<Props> | CSS<Props> | StyleDefinition<HTMLElements, never> | Pattern<HTMLElements, never> | TeilerComponent<HTMLElements, never> | Raw
type Style<Props> = [string[], Properties<Props>[]]

type StyleDefinition<Target extends HTMLElements, Props> = {
  type: 'component' | 'global' | 'keyframes'
  id: string
  styles: Array<Style<Props>>
  tag: Target
  target?: object
  componentId?: string
  displayName?: string
}

type Config = {
  componentId?: string
  displayName?: string
}

type ConfigArguments = [config: Config] | [componentId: string, displayName?: string]

type TeilerComponent<Target extends HTMLElements, Props> = {
  styleDefinition: StyleDefinition<Target, Props>
}

type CreateCallback<Type extends TeilerComponent<HTMLElements, Props>, Props> = (styles: StyleDefinition<HTMLElements, Props>) => Type
type Extend<Type extends TeilerComponent<HTMLElements, Props>, Props> = (string: ReadonlyArray<string>, ...properties: Properties<Props>[]) => Type
type ExtendCallback<Type extends TeilerComponent<HTMLElements, Props>, Props> = Extend<Type, Props> & { withConfig(...args: ConfigArguments): Extend<Type, Props> }

function styled<Props, Type extends TeilerComponent<HTMLElements, Props>>(
  tag: HTMLElements | undefined,
  compiler: Compiler,
  createComponent: CreateCallback<Type, Props>,
  stringOrBinded: TeilerComponent<HTMLElements, Props> | ReadonlyArray<string>,
  ...properties: Properties<Props>[]
): Type | ExtendCallback<Type, Props> {
  if (Array.isArray(stringOrBinded)) {
    const strings = stringOrBinded as ReadonlyArray<string>
    const style: Style<Props> = [Array.from(strings), properties]
    const styleDefinition = compiler(tag === undefined ? 'div' : tag, [style])
    return createComponent(styleDefinition)
  } else {
    const binded = stringOrBinded as TeilerComponent<HTMLElements, Props>
    const target = tag === undefined ? binded.styleDefinition.tag : tag
    const inherited = tag === undefined ? binded.styleDefinition.target : undefined
    const extend =
      (compiler: Compiler): Extend<Type, Props> =>
      (strings: ReadonlyArray<string>, ...properties: Properties<Props>[]) => {
        const style: Style<Props> = [Array.from(strings), properties]
        const styleDefinition = compiler(target, [...binded.styleDefinition.styles, style], inherited)
        return createComponent(styleDefinition)
      }

    return Object.assign(extend(compiler), { withConfig: (...args: ConfigArguments) => extend(configure(compiler, toConfig(...args))) })
  }
}

type Compiler = <Target extends HTMLElements, Props>(tag: Target, styles: Array<Style<Props>>, target?: object, config?: Config) => StyleDefinition<Target, Props>

function toConfig(...[config, displayName]: ConfigArguments): Config {
  return typeof config === 'string' ? identify({ componentId: config, displayName }) : config
}

function configure(compiler: Compiler, config: Config): Compiler {
  return (tag, styles, target, inner) => compiler(tag, styles, target, { ...config, ...inner })
}

function targetName(target: object): string {
  const { name, __name } = target as { name?: unknown; __name?: unknown }
  return typeof name === 'string' && name ? name : typeof __name === 'string' && __name ? __name : 'anonymous'
}

function createId<Props>(tag: HTMLElements, styles: Array<Style<Props>>, target?: object, { componentId, displayName }: Config = {}): string {
  const id = componentId === undefined ? styles.reduce((acc, [strings]) => acc + strings.join(''), '') : '#' + componentId
  const prefix = target === undefined ? '' : targetName(target) + '|'
  const name = displayName?.replace(/[^\w-]/g, '').replace(/^(?=[\d-])/, '_')
  const result = (name ? name + '-' : '') + 't' + hash(tag === null ? id : tag + '|' + prefix + id)

  if (componentId === undefined) {
    register(result, styles)
  }

  return result
}

const identify = ({ componentId, displayName }: Config = {}): Config => ({ ...(componentId === undefined ? {} : { componentId }), ...(displayName === undefined ? {} : { displayName }) })

const component: Compiler = <Target extends HTMLElements, Props>(tag: Target, styles: Array<Style<Props>>, target?: object, config?: Config): StyleDefinition<Target, Props> => {
  const definition: StyleDefinition<Target, Props> = {
    type: 'component',
    id: createId(tag, styles, target, config),
    styles,
    tag,
    ...identify(config),
  }
  return target === undefined ? definition : { ...definition, target }
}

function withTarget<Props>(definition: StyleDefinition<HTMLElements, Props>, target: Exclude<HTMLElements, null> | object): StyleDefinition<HTMLElements, Props> {
  const { type, styles, tag } = definition
  const config = identify(definition)
  if (typeof target === 'string') {
    return { type, id: createId(target, styles, undefined, config), styles, tag: target, ...config }
  }
  return { type, id: createId(tag, styles, target, config), styles, tag, target, ...config }
}

const global: Compiler = <Target extends HTMLElements, Props>(tag: Target, styles: Array<Style<Props>>, _target?: object, config?: Config): StyleDefinition<Target, Props> => {
  return {
    type: 'global',
    id: createId(tag, styles, undefined, config),
    styles,
    tag,
    ...identify(config),
  }
}

function keyframes(strings: ReadonlyArray<string>, ...properties: Raw[]): StyleDefinition<null, {}> {
  const style: Style<{}> = [Array.from(strings), properties]
  const id = strings.reduce((acc, string, index) => acc + string + (index < properties.length ? String(properties[index]) : ''), '')

  return {
    type: 'keyframes',
    id: 'teiler-' + hash(id),
    styles: [style],
    tag: null,
  }
}

type NoInference<T> = [T][T extends unknown ? 0 : never]

function css<Props = {}>(strings: ReadonlyArray<string>, ...properties: Properties<NoInference<Props>>[]): CSS<Props> {
  const style: Style<Props> = [Array.from(strings), properties]
  const styles = [style]
  const id = styles.reduce((acc, [strings]) => acc + strings.join(''), '')
  return { styles: styles, id: 't' + hash(id), __css__: true }
}

function insert<Props = {}>(sheet: Sheet, definition: StyleDefinition<HTMLElements, Props>, props: Arguments<Props>): string | null {
  const { styles, type } = definition
  const { css, definitions } = compile(styles, props)
  const compiledId = hash(css)
  const key = type === 'component' ? compiledId : type === 'keyframes' ? `k-${definition.id}` : `g-${compiledId}`

  definitions.forEach((definition) => insert(sheet, definition, props))

  if (sheet.has(key) === false) {
    if (type === 'component') {
      sheet.insert(key, transpile(`.teiler-${compiledId} { ${css} }`))
    } else if (type === 'keyframes') {
      sheet.insert(key, transpile(`@keyframes ${definition.id} { ${css} }`))
    } else {
      sheet.insert(key, transpile(css))
    }
  }

  return type === 'component' ? `teiler-${compiledId}` : null
}

export type { Arguments, Compiler, Config, ConfigArguments, CreateCallback, CSS, DefaultTheme, Properties, Raw, Sheet, Style, StyleDefinition, TeilerComponent, HTMLElements }
export { component, configure, createId, css, global, identify, insert, keyframes, styled, targetName, toConfig, withTarget }
