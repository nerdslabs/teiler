import type { Compile, Expression, Style, TeilerComponent, Target } from '.'

import { component } from './index'
import tags from './tags'

type Pattern<Target, Props> = { styles: Style<Props>[]; tag: Target; __teiler__: true }
type ExtendCallback<Target, Props> = <Component>(string: TemplateStringsArray, ...expressions: Expression<Inter<Component, Props>>[]) => Pattern<Target, Inter<Component, Props>>

type Constructor<Target> = {
  <Props>(pattern: Pattern<Target, Props>): ExtendCallback<Target, Props>
  <Props>(string: TemplateStringsArray, ...expressions: Expression<Props>[]): Pattern<Target, Props>
}

type ConstructorWithTags = Constructor<'div'> & { [K in (typeof tags)[number]]: Constructor<K> }

type Inter<Component, Props> = Component extends Pattern<Target, infer P> ? P & Props : Props

const construct = (tag: string) => {
  return <Props>(stringOrPattern: Pattern<Target, Props> | TemplateStringsArray, ...expressions: Expression<Props>[]): Pattern<Target, Props> | ExtendCallback<Target, Props> => {
    if ('__teiler__' in stringOrPattern) {
      return <Component>(strings: TemplateStringsArray, ...expressions: Expression<Inter<Component, Props>>[]) => {
        const style: Style<Props> = [Array.from(strings), expressions]
        return { styles: [...stringOrPattern.styles, style], tag, __teiler__: true }
      }
    } else {
      const strings = stringOrPattern as TemplateStringsArray
      const style: Style<Props> = [Array.from(strings), expressions]
      return { styles: [style], tag, __teiler__: true }
    }
  }
}

const pattern = construct('div')

tags.forEach((tag) => {
  pattern[tag] = construct(tag)
})

const binded = pattern as ConstructorWithTags

type CreateFunction<Target, Props, Type extends TeilerComponent<Target, Props>> = (compile: Compile, tag: Target, styles: Array<Style<Props>>) => Type

function sew<Target, Props, Type extends TeilerComponent<Target, Props>>(pattern: Pattern<Target, Props>, createComponent: CreateFunction<Target, Props, Type>): Type {
  return createComponent(component, pattern.tag, pattern.styles)
}

export { binded as pattern, sew }
