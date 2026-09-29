import type { HTMLElements } from '@teiler/core'
import type { AllowedComponentProps, ComponentOptionsMixin, CreateComponentPublicInstanceWithMixins, IntrinsicElementAttributes, PublicProps, VNodeProps } from 'vue'

type Tag = Exclude<HTMLElements, null>

type ElementProps<Target> = Target extends keyof IntrinsicElementAttributes ? IntrinsicElementAttributes[Target] : {}

type NotAny<Props> = 0 extends 1 & Props ? {} : Props

type ComponentProps<Component> = Component extends new (...args: never[]) => { $props: infer Props }
  ? NotAny<Omit<Props, keyof VNodeProps | keyof AllowedComponentProps>>
  : Component extends (props: infer Props, ...args: never[]) => unknown
    ? NotAny<Props>
    : {}

type AsTarget = Tag | (abstract new (...args: never[]) => unknown) | ((props: never, ...args: never[]) => unknown)

type TargetProps<As> = As extends Tag ? ElementProps<As> : ComponentProps<As>

type PolymorphicProps<Target extends HTMLElements, Props, As> = Props & { as?: As } & ([As] extends [never] ? ElementProps<Target> : [AsTarget] extends [As] ? ElementProps<Target> : TargetProps<As>)

type Exposed = { element: HTMLElement | null }

type Instance<Props> = CreateComponentPublicInstanceWithMixins<Props, Exposed, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, PublicProps>

type StyledOptions = { name: string; inheritAttrs: false }

type PolymorphicComponent<Target extends HTMLElements, Props> = (new <As extends AsTarget = never>(props: PolymorphicProps<Target, Props, As> & PublicProps) => Instance<PolymorphicProps<Target, Props, As>>) & StyledOptions

export type { AsTarget, Exposed, PolymorphicComponent, PolymorphicProps, StyledOptions }
