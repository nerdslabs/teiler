<script lang="ts">
  import { component } from './component'
  import Link from './Link.fixture.svelte'

  const Button = component.button<{ _primary?: boolean }>`
    color: ${({ _primary }) => (_primary ? 'red' : 'blue')};
  `

  const LinkButton = component.a(Button)`
    text-decoration: none;
  `
</script>

<Button type="submit" _primary>Submit</Button>
<Button as="a" href="/docs">Docs</Button>
<Button as={Link} to="/home">Home</Button>
<LinkButton href="/docs" _primary>Docs</LinkButton>

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
