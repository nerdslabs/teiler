<script lang="ts">
  import { component } from './component'
  import Link from './Link.fixture.svelte'

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
  const ExtendedAnchor = component.a(ButtonWithLink)``
</script>

<Button type="submit" _primary>Submit</Button>
<Button as="a" href="/docs">Docs</Button>
<Button as={Link} to="/home">Home</Button>
<LinkButton href="/docs" _primary>Docs</LinkButton>
<ButtonWithLink to="/home" _primary>Home</ButtonWithLink>
<ButtonWithLink as="a" href="/docs">Docs</ButtonWithLink>
<ButtonAnchor href="/docs" _primary>Docs</ButtonAnchor>
<ExtendedButtonWithLink to="/home" _primary>Home</ExtendedButtonWithLink>
<ExtendedAnchor href="/docs">Docs</ExtendedAnchor>

<!-- @ts-expect-error -->
<Button as="nope">Invalid tag</Button>
<!-- @ts-expect-error -->
<Button as={Link}>Missing to</Button>
<!-- @ts-expect-error -->
<Button href="/docs">Href without as</Button>
<!-- @ts-expect-error -->
<Button as="a" disabled>Disabled on anchor</Button>
<!-- @ts-expect-error -->
<LinkButton disabled>Disabled on extended anchor</LinkButton>
<!-- @ts-expect-error -->
<ButtonWithLink>Missing to</ButtonWithLink>
<!-- @ts-expect-error -->
<ButtonWithLink to="/home" href="/docs">Href on component</ButtonWithLink>
<!-- @ts-expect-error -->
<ButtonAnchor disabled>Disabled on anchor</ButtonAnchor>
<!-- @ts-expect-error -->
<ExtendedButtonWithLink>Missing to</ExtendedButtonWithLink>
<!-- @ts-expect-error -->
<ExtendedAnchor to="/home">To on anchor</ExtendedAnchor>
