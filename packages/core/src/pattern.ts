import type { Properties, Style, StyleDefinition, TeilerComponent } from './constructor'
import type { HTMLElements } from './tags'

import tags from './tags'
import { createId } from './constructor'

type Pattern<Target extends HTMLElements, Props> = {
  styles: Array<Style<Props>>
  tag: Target
  id: string
  __pattern__: true
}

type ExtendCallback<Target extends HTMLElements, Props> = <Component>(string: ReadonlyArray<string>, ...properties: Properties<Infer<Component, Props>>[]) => Pattern<Target, Infer<Component, Props>>

type Constructor<Target extends HTMLElements, Tag extends HTMLElements | undefined = Target> = {
  <Props = {}, Source extends HTMLElements = HTMLElements>(pattern: Pattern<Source, Props>): ExtendCallback<Tag extends HTMLElements ? Tag : Source, Props>
  <Props = {}>(string: ReadonlyArray<string>, ...properties: Properties<Props>[]): Pattern<Target, Props>
}

type Infer<Component, Props> = Component extends Pattern<HTMLElements, infer P> ? P & Props : Props

const construct = (tag: HTMLElements | undefined) => {
  function create<Props>(stringOrPattern: Pattern<HTMLElements, Props> | ReadonlyArray<string>, ...properties: Properties<Props>[]): Pattern<HTMLElements, Props> | ExtendCallback<HTMLElements, Props> {
    if ('__pattern__' in stringOrPattern) {
      const target = tag === undefined ? stringOrPattern.tag : tag

      return <Component>(strings: ReadonlyArray<string>, ...properties: Properties<Infer<Component, Props>>[]) => {
        const style: Style<Infer<Component, Props>> = [Array.from(strings), properties]
        const styles = [...stringOrPattern.styles, style]
        return { styles: styles, id: createId(target, styles), tag: target, __pattern__: true }
      }
    } else {
      const strings = stringOrPattern as ReadonlyArray<string>
      const style: Style<Props> = [Array.from(strings), properties]
      const styles = [style]
      const target = tag === undefined ? 'div' : tag
      return { styles: styles, id: createId(target, styles), tag: target, __pattern__: true }
    }
  }

  return create
}

type HTMLElementsWithoutNull = Exclude<HTMLElements, null>
type ConstructorWithTags = Constructor<'div', undefined> & { [K in HTMLElementsWithoutNull]: Constructor<K> } & { global: Constructor<null> }

const pattern = construct(undefined) as ConstructorWithTags

tags.forEach((tag) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  pattern[tag] = construct(tag)
})

pattern['global'] = construct(null) as Constructor<null>

type CreateCallback<Target extends HTMLElements, Type extends TeilerComponent<Target, Props>, Props> = (styles: StyleDefinition<Target, Props>) => Type

function sew<Target extends HTMLElements, Props, Type extends TeilerComponent<Target, Props>>(pattern: Pattern<Target, Props>, createComponent: CreateCallback<Target, Type, Props>): Type {
  return createComponent({
    type: pattern.tag === null ? 'global' : 'component',
    id: pattern.id,
    styles: pattern.styles,
    tag: pattern.tag,
  })
}

export { pattern, sew }
export type { Pattern }
