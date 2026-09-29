import type { ConcreteComponent } from 'vue'
import type { VueGlobalComponent, VueTeilerComponent } from './component'

type StorybookComponent = Omit<ConcreteComponent, 'props'>

type ComponentProps<T> = T extends new (...args: never[]) => { $props: infer P } ? NonNullable<P> : T extends (props: infer P, ...args: never[]) => unknown ? P : {}

type Assert<T extends true> = T

type Link = VueTeilerComponent<'a', { _primary?: boolean }>

export type Checks = [
  Assert<Link extends StorybookComponent ? true : false>,
  Assert<VueGlobalComponent<{}> extends StorybookComponent ? true : false>,
  Assert<'href' extends keyof ComponentProps<Link> ? true : false>,
  Assert<'_primary' extends keyof ComponentProps<Link> ? true : false>,
  Assert<'disabled' extends keyof ComponentProps<Link> ? false : true>,
]
