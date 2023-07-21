import type { Sheet } from './sheet'

import { compile, stylis } from './css'
import createStyleSheet from './sheet'
import { pattern, sew } from './pattern'

type Expression<Props> = (props: Props) => string | boolean
type StyleDefinition = {
  id: string, name: string, css: string
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
type ExtendCallback<Props, Type extends TeilerComponent<Target, Props>> = (string: TemplateStringsArray, ...properties: Properties<Props>[]) => Type

function styled<Props, Type extends TeilerComponent<Target, Props>>(
  createComponent: CreateCallback<Props, Type>,
  stringOrBinded: TeilerComponent<Target, Props> | TemplateStringsArray,
  ...properties: Properties<Props>[]
): ExtendCallback<Props, Type> | Type {
  if (Array.isArray(stringOrBinded)) {
    const strings = stringOrBinded as TemplateStringsArray
    const style: Style<Props> = [Array.from(strings), properties]
    return createComponent([style])
  } else {
    const binded = stringOrBinded as TeilerComponent<Target, Props>
    return (strings: TemplateStringsArray, ...properties: Expression<Props>[]) => {
      const style: Style<Props> = [Array.from(strings), properties]
      return createComponent([...binded.styles, style])
    }
  }
}

type Compile = <Props>(sheet: Sheet, styles: Array<Style<Props>>, props: Props) => string[] | void

function component<Props>(sheet: Sheet, styles: Array<Style<Props>>, props: Props): string[] {
  return compile(styles, props).map(({id, name, css}) => {
    const result = stylis(`.${name} { ${css} }`).join(' ')
    sheet.insert(id, result)

    return name
  })
}

function global<Props>(sheet: Sheet, styles: Array<Style<Props>>, props: Props): void {
  compile(styles, props).map(({id, css}) => {
    const result = stylis(css).join(' ')
    sheet.insert(id, result)
  })
}

function keyframes(strings: TemplateStringsArray, ...properties: Raw[]): StyleDefinition {
  const style: Style<{}> = [Array.from(strings), properties]

  const [{id, css}] = compile([style], {})
  const name = `teiler-keyframes-${id}`

  return { id, name, css: `@keyframes ${name} { ${css} }` }
}

export type { Compile, Properties, Sheet, Style, StyleDefinition, TeilerComponent, Target }
export { component, global, keyframes, createStyleSheet, pattern, sew }
export default styled
