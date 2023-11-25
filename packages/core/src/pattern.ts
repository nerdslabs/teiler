import type { Properties, Style, StyleDefinition, TeilerComponent } from './constructor'
import type { HTMLElements } from './tags'

import tags from './tags'
import hash from './hash'

type Pattern<Target extends HTMLElements, Props> = { styles: Style<Props>[]; tag: Target; __teiler__: true }
type ExtendCallback<Target extends HTMLElements, Props> = <Component>(string: ReadonlyArray<string>, ...properties: Properties<Inter<Component, Props>>[]) => Pattern<Target, Inter<Component, Props>>

type Constructor<Target extends HTMLElements> = {
  <Props>(pattern: Pattern<Target, Props>): ExtendCallback<Target, Props>
  <Props>(string: ReadonlyArray<string>, ...properties: Properties<Props>[]): Pattern<Target, Props>
}

type ConstructorWithTags = Constructor<'div'> & { [K in HTMLElements]: Constructor<K> } & { global: Constructor<null> }

type Inter<Component, Props> = Component extends Pattern<HTMLElements, infer P> ? P & Props : Props

const construct = (tag: HTMLElements) => {
  return <Props>(stringOrPattern: Pattern<HTMLElements, Props> | ReadonlyArray<string>, ...properties: Properties<Props>[]): Pattern<HTMLElements, Props> | ExtendCallback<HTMLElements, Props> => {
    if ('__teiler__' in stringOrPattern) {
      return <Component>(strings: ReadonlyArray<string>, ...properties: Properties<Inter<Component, Props>>[]) => {
        const style: Style<Props> = [Array.from(strings), properties]
        return { styles: [...stringOrPattern.styles, style], tag: stringOrPattern.tag, __teiler__: true }
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

type CreateCallback<Target extends HTMLElements, Type extends TeilerComponent<Target, Props>, Props> = (styles: StyleDefinition<Target, Props>) => Type

function sew<Target extends HTMLElements, Props, Type extends TeilerComponent<Target, Props>>(pattern: Pattern<Target, Props>, createComponent: CreateCallback<Target, Type, Props>): Type {
  const id = pattern.styles.reduce((acc, [strings]) => acc + strings.join(''), '')

  return createComponent({
    type: pattern.tag === null ? 'global' : 'component',
    id: hash(id),
    styles: pattern.styles,
    tag: pattern.tag,
  })
}

export { binded as pattern, sew }
export type { Pattern }
