import type { Config, ConfigArguments, Properties, Style, StyleDefinition, TeilerComponent } from './constructor'
import type { HTMLElements } from './tags'

import tags from './tags'
import { createId, toConfig } from './constructor'

type Pattern<Target extends HTMLElements, Props> = {
  styles: Array<Style<Props>>
  tag: Target
  id: string
  componentId?: string
  __pattern__: true
}

type Extend<Target extends HTMLElements, Props> = <Component>(string: ReadonlyArray<string>, ...properties: Properties<Infer<Component, Props>>[]) => Pattern<Target, Infer<Component, Props>>
type ExtendCallback<Target extends HTMLElements, Props> = Extend<Target, Props> & { withConfig(...args: ConfigArguments): Extend<Target, Props> }

type Constructor<Target extends HTMLElements, Tag extends HTMLElements | undefined = Target> = {
  <Props = {}, Source extends HTMLElements = HTMLElements>(pattern: Pattern<Source, Props>): ExtendCallback<Tag extends HTMLElements ? Tag : Source, Props>
  <Props = {}>(string: ReadonlyArray<string>, ...properties: Properties<Props>[]): Pattern<Target, Props>
  withConfig(...args: ConfigArguments): Constructor<Target, Tag>
}

type Infer<Component, Props> = Component extends Pattern<HTMLElements, infer P> ? P & Props : Props

const create = <Props>(tag: HTMLElements, styles: Array<Style<Props>>, { componentId }: Config): Pattern<HTMLElements, Props> => {
  const pattern: Pattern<HTMLElements, Props> = { styles: styles, id: createId(tag, styles, undefined, componentId), tag: tag, __pattern__: true }
  return componentId === undefined ? pattern : { ...pattern, componentId }
}

const construct = (tag: HTMLElements | undefined, config: Config = {}) => {
  function constructor<Props>(stringOrPattern: Pattern<HTMLElements, Props> | ReadonlyArray<string>, ...properties: Properties<Props>[]): Pattern<HTMLElements, Props> | ExtendCallback<HTMLElements, Props> {
    if ('__pattern__' in stringOrPattern) {
      const target = tag === undefined ? stringOrPattern.tag : tag
      const extend =
        (config: Config) =>
        <Component>(strings: ReadonlyArray<string>, ...properties: Properties<Infer<Component, Props>>[]) => {
          const style: Style<Infer<Component, Props>> = [Array.from(strings), properties]
          return create(target, [...stringOrPattern.styles, style], config)
        }

      return Object.assign(extend(config), { withConfig: (...args: ConfigArguments) => extend(toConfig(...args)) })
    } else {
      const strings = stringOrPattern as ReadonlyArray<string>
      const style: Style<Props> = [Array.from(strings), properties]
      return create(tag === undefined ? 'div' : tag, [style], config)
    }
  }

  return Object.assign(constructor, { withConfig: (...args: ConfigArguments) => construct(tag, toConfig(...args)) })
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
    ...(pattern.componentId === undefined ? {} : { componentId: pattern.componentId }),
  })
}

export { pattern, sew }
export type { Pattern }
