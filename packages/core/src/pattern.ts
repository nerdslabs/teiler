import type { Properties, Style, StyleDefinition, TeilerComponent } from './constructor'
import type { HTMLElements } from './tags'

import tags from './tags'
import hash from './hash'

type PropertiesWithPattern<Props> = Properties<Props> | Pattern<HTMLElements, Props>

type Pattern<Target extends HTMLElements, Props = {}> = {
  styles: Style<Props>[]
  tag: Target
  id: string
  __pattern__: true
}

type ExtendCallback<Target extends HTMLElements, Props> = <Component>(string: ReadonlyArray<string>, ...properties: Properties<Infer<Component, Props>>[]) => Pattern<Target, Infer<Component, Props>>

type Constructor<Target extends HTMLElements> = {
  <Props = {}>(pattern: Pattern<Target, Props>): ExtendCallback<Target, Props>
  <Props = {}>(string: ReadonlyArray<string>, ...properties: PropertiesWithPattern<Props>[]): Pattern<Target, Props>
}

type Infer<Component, Props> = Component extends Pattern<HTMLElements, infer P> ? P & Props : Props

const construct = <Target extends HTMLElements>(tag: Target) => {
  function create<Props = {}>(stringOrPattern: Pattern<Target, Props>): ExtendCallback<Target, Props>
  function create<Props = {}>(stringOrPattern: ReadonlyArray<string>, ...properties: PropertiesWithPattern<Props>[]): Pattern<Target, Props>
  function create<Props>(stringOrPattern: Pattern<Target, Props> | ReadonlyArray<string>, ...properties: Properties<Props>[]): Pattern<Target, Props> | ExtendCallback<Target, Props> {
    if ('__pattern__' in stringOrPattern) {
      return <Component>(strings: ReadonlyArray<string>, ...properties: Properties<Infer<Component, Props>>[]) => {
        const style: Style<Infer<Component, Props>> = [Array.from(strings), properties]
        const styles = [...stringOrPattern.styles, style]
        const id = styles.reduce((acc, [strings]) => acc + strings.join(''), '')
        return { styles: styles, id: 't' + hash(id), tag: stringOrPattern.tag, __pattern__: true }
      }
    } else {
      const strings = stringOrPattern as ReadonlyArray<string>
      const style: Style<Props> = [Array.from(strings), properties]
      const styles = [style]
      const id = styles.reduce((acc, [strings]) => acc + strings.join(''), '')
      return { styles: styles, id: 't' + hash(id), tag, __pattern__: true }
    }
  }

  return create
}

type HTMLElementsWithoutNull = Exclude<HTMLElements, null>
type ConstructorWithTags = Constructor<'div'> & { [K in HTMLElementsWithoutNull]: Constructor<K> } & { global: Constructor<null> }

const pattern = construct('div') as ConstructorWithTags

tags.forEach((tag) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  pattern[tag] = construct(tag)
})

pattern['global'] = construct(null)

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
