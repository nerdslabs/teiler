import type { Compile, Properties, Style, TeilerComponent, Target } from './constructor'

import { component, global } from './constructor'
import tags from './tags'

type Pattern<Target, Props> = { styles: Style<Props>[]; tag: Target; __teiler__: true }
type ExtendCallback<Target, Props> = <Component>(string: ReadonlyArray<string>, ...properties: Properties<Inter<Component, Props>>[]) => Pattern<Target, Inter<Component, Props>>

type Constructor<Target> = {
  <Props>(pattern: Pattern<Target, Props>): ExtendCallback<Target, Props>
  <Props>(string: ReadonlyArray<string>, ...properties: Properties<Props>[]): Pattern<Target, Props>
}

type ConstructorWithTags = Constructor<'div'> & { [K in (typeof tags)[number]]: Constructor<K> } & { global: Constructor<null> }

type Inter<Component, Props> = Component extends Pattern<Target, infer P> ? P & Props : Props

const construct = (tag: string) => {
  return <Props>(stringOrPattern: Pattern<Target, Props> | ReadonlyArray<string>, ...properties: Properties<Props>[]): Pattern<Target, Props> | ExtendCallback<Target, Props> => {
    if ('__teiler__' in stringOrPattern) {
      return <Component>(strings: ReadonlyArray<string>, ...properties: Properties<Inter<Component, Props>>[]) => {
        const style: Style<Props> = [Array.from(strings), properties]
        return { styles: [...stringOrPattern.styles, style], tag, __teiler__: true }
      }
    } else {
      const strings = stringOrPattern as ReadonlyArray<string>
      const style: Style<Props> = [Array.from(strings), properties]
      return { styles: [style], tag, __teiler__: true }
    }
  }
}

const pattern = construct('div')

tags.forEach((tag) => {
  pattern[tag] = construct(tag)
})

pattern['global'] = construct(null)

const binded = pattern as ConstructorWithTags

type CreateFunction<Target, Props, Type extends TeilerComponent<Target, Props>> = (compile: Compile, tag: Target, styles: Array<Style<Props>>) => Type

function sew<Target, Props, Type extends TeilerComponent<Target, Props>>(pattern: Pattern<Target, Props>, createComponent: CreateFunction<Target, Props, Type>): Type {
  const compiler = pattern.tag === null ? global : component
  return createComponent(compiler, pattern.tag, pattern.styles)
}

export { binded as pattern, sew }
export type { Pattern }
