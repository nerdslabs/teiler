<script lang="ts">
  import type { Component, ComponentProps } from 'svelte'

  import { ThemeProvider } from '@teiler/svelte'
  import { Button, Card, Global, LinkButton, Primary, Sized, Themed } from './components.js'
  import Link from './Link.svelte'

  const active = true
  const Dynamic: Component<any> = Button
  const props: ComponentProps<typeof Sized> = { size: 4 }
  const onclick = (event: MouseEvent) => event.preventDefault()
</script>

<ThemeProvider theme={{ accent: 'red' }}>
  <Global _dark />
  <Button type="submit" _primary {onclick} class={{ active }}>Submit</Button>
  <Button class={['button', active && 'active']}>Submit</Button>
  <Button as="a" href="/docs">Docs</Button>
  <Button as={Link} to="/home">Home</Button>
  <Sized size={4} />
  <Sized {...props} />
  <Primary _big _primary />
  <Primary as="a" _big href="/docs" />
  <LinkButton href="/docs" />
  <LinkButton as={Link} to="/home" />
  <Card _active><Themed /></Card>
  <Dynamic />
</ThemeProvider>
