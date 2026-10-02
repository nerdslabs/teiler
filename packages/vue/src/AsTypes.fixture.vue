<script setup lang="ts">
import { createApp, defineComponent, h, useTemplateRef } from 'vue'
import { component } from './component'
import Link from './Link.fixture.vue'

const Button = component.button<{ _primary?: boolean }>`
  color: ${({ _primary }) => (_primary ? 'red' : 'blue')};
`

const LinkButton = component.a(Button)`
  text-decoration: none;
`

const ButtonWithLink = Button.withComponent(Link)
const ButtonAnchor = Button.withComponent('a')
const ExtendedButtonWithLink = component(ButtonWithLink)`
  text-decoration: none;
`

const button = useTemplateRef('button')
const element: HTMLElement | null | undefined = button.value?.element
// @ts-expect-error
button.value?.missing

h(Button, { as: 'a', href: '/docs' })
createApp({}).component('TeilerButton', Button)
defineComponent({ components: { Button } })
</script>

<template>
  <Button ref="button" type="submit" _primary>Submit</Button>
  <Button as="a" href="/docs">Docs</Button>
  <Button :as="Link" to="/home">Home</Button>
  <LinkButton href="/docs" _primary>Docs</LinkButton>
  <ButtonWithLink to="/home" _primary>Home</ButtonWithLink>
  <ButtonAnchor href="/docs">Docs</ButtonAnchor>
  <ExtendedButtonWithLink to="/home">Home</ExtendedButtonWithLink>

  <!-- @vue-expect-error -->
  <Button as="nope">Invalid tag</Button>
  <!-- @vue-expect-error -->
  <Button :as="Link">Missing to</Button>
  <!-- @vue-expect-error -->
  <Button href="/docs">Href without as</Button>
  <!-- @vue-expect-error -->
  <Button as="a" disabled>Disabled on anchor</Button>
  <!-- @vue-expect-error -->
  <LinkButton disabled>Disabled on extended anchor</LinkButton>
  <!-- @vue-expect-error -->
  <ButtonWithLink>Missing to</ButtonWithLink>
  <!-- @vue-expect-error -->
  <ButtonAnchor disabled>Disabled on anchor</ButtonAnchor>
  <!-- @vue-expect-error -->
  <ExtendedButtonWithLink>Missing to</ExtendedButtonWithLink>
</template>
