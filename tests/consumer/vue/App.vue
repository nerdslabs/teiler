<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'
import { ThemeProvider } from '@teiler/vue'
import { Button, Card, Global, LinkButton, Primary, Sized, Themed } from './components.js'

const button = useTemplateRef('button')
const element: HTMLElement | null | undefined = button.value?.element
const onClick = (event: MouseEvent) => event.preventDefault() ?? element
</script>

<template>
  <ThemeProvider :theme="{ accent: 'red' }">
    <Global _dark />
    <Button ref="button" type="submit" _primary @click="onClick" :class="{ active: true }">Submit</Button>
    <Button as="a" href="/docs">Docs</Button>
    <Button :as="RouterLink" to="/home" v-slot="{ isActive }">{{ isActive }}</Button>
    <Sized :size="4" />
    <Primary as="a" _big href="/docs" />
    <LinkButton :as="RouterLink" to="/home" />
    <Card _active><Themed /></Card>
    <component :is="Button" type="submit" />

    <!-- @vue-expect-error -->
    <Button as="nope" />
    <!-- @vue-expect-error -->
    <Button :as="RouterLink" />
    <!-- @vue-expect-error -->
    <Button href="/docs" />
    <!-- @vue-expect-error -->
    <Sized />
  </ThemeProvider>
</template>
