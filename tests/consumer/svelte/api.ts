import type { DefaultTheme } from '@teiler/svelte'

import { createStyleSheet } from '@teiler/svelte'
import { mount } from 'svelte'
import { render } from 'svelte/server'
import { Button, Sized } from './components.js'
import Link from './Link.svelte'

type Assert<T extends true> = T

export type Checks = [Assert<DefaultTheme['accent'] extends string ? true : false>]

const target = document.body
const sheet = createStyleSheet({})

mount(Button, { target, props: { type: 'submit', _primary: true } })
mount(Button<'a'>, { target, props: { as: 'a', href: '/docs' } })
mount(Button<typeof Link>, { target, props: { as: Link, to: '/home' } })
render(Sized, { props: { size: 4 }, context: new Map([['STYLE_SHEET', sheet]]) })

// @ts-expect-error missing required prop
mount(Sized, { target, props: {} })
// @ts-expect-error button prop on anchor
mount(Button<'a'>, { target, props: { as: 'a', disabled: true } })
// @ts-expect-error missing required prop of component
mount(Button<typeof Link>, { target, props: { as: Link } })
