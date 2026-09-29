import { ThemeProvider } from '@teiler/vue'
import { RouterLink } from 'vue-router'
import { Button, Card, Global, LinkButton, Primary, Sized, Themed } from './components.js'

export const valid = () => (
  <ThemeProvider theme={{ accent: 'red' }}>
    <Global _dark />
    <Button type="submit" _primary onClick={(event: MouseEvent) => event.preventDefault()} class={{ active: true }} style={{ margin: 0 }}>
      Submit
    </Button>
    <Button as="a" href="/docs" _primary>
      Docs
    </Button>
    <Button as={RouterLink} to={{ name: 'home' }} replace>
      Home
    </Button>
    <Button<'a'> as="a" href="/docs">
      Docs
    </Button>
    <Sized size={4} />
    <Sized as="a" size={4} href="/docs" />
    <Primary _big _primary />
    <Primary as="a" _big href="/docs" />
    <LinkButton href="/docs" />
    <LinkButton as={RouterLink} to="/home" />
    <Card _active>
      <Themed />
    </Card>
  </ThemeProvider>
)

export const invalid = () => (
  <>
    {/* @ts-expect-error unknown tag */}
    <Button as="nope" />
    {/* @ts-expect-error missing required prop of component */}
    <Button as={RouterLink} />
    {/* @ts-expect-error component prop on anchor */}
    <Button as="a" to="/home" />
    {/* @ts-expect-error anchor prop without as */}
    <Button href="/docs" />
    {/* @ts-expect-error button prop on extended anchor */}
    <LinkButton disabled />
    {/* @ts-expect-error missing required prop */}
    <Sized />
    {/* @ts-expect-error missing theme key */}
    <ThemeProvider theme={{}} />
  </>
)
