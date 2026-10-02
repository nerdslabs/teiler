import { mount } from 'svelte'
import { render } from 'svelte/server'
import { component } from './component'
import Link from './Link.fixture.svelte'

const Button = component.button<{ _primary?: boolean }>`
  color: ${({ _primary }) => (_primary ? 'red' : 'blue')};
`

const target = document.body

mount(Button, { target, props: { type: 'submit', _primary: true } })
mount(Button<'a'>, { target, props: { as: 'a', href: '/docs' } })
mount(Button<typeof Link>, { target, props: { as: Link, to: '/home' } })
render(Button<'a'>, { props: { as: 'a', href: '/docs', _primary: true } })

// @ts-expect-error button prop on anchor
mount(Button<'a'>, { target, props: { as: 'a', disabled: true } })
// @ts-expect-error missing required prop of component
mount(Button<typeof Link>, { target, props: { as: Link } })
