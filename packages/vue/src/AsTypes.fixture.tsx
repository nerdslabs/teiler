import { defineComponent, h, ref } from 'vue'
import { component } from './component'

const Link = defineComponent({
  props: { to: { type: String, required: true } },
  setup: (props) => () => <a href={props.to} />,
})

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

const button = ref<InstanceType<typeof Button>>()
const buttonWithLink = ref<InstanceType<typeof ButtonWithLink>>()
export const linkElement: HTMLElement | null | undefined = buttonWithLink.value?.element
export const element: HTMLElement | null | undefined = button.value?.element

h(Button, { as: 'a', href: '/docs' })

export const fixture = () => (
  <>
    <Button type="submit" _primary>
      Submit
    </Button>
    <Button as="a" href="/docs" _primary>
      Docs
    </Button>
    <Button as={Link} to="/home" _primary>
      Home
    </Button>
    <Button<'a'> as="a" href="/docs">
      Docs
    </Button>
    <Button<typeof Link> as={Link} to="/home">
      Home
    </Button>
    <LinkButton href="/docs" _primary>
      Docs
    </LinkButton>
    <ButtonWithLink to="/home" _primary>
      Home
    </ButtonWithLink>
    <ButtonWithLink as="a" href="/docs">
      Docs
    </ButtonWithLink>
    <ButtonAnchor href="/docs" _primary>
      Docs
    </ButtonAnchor>
    <ExtendedButtonWithLink to="/home" _primary>
      Home
    </ExtendedButtonWithLink>
    <ExtendedAnchor href="/docs">Docs</ExtendedAnchor>

    {/* @ts-expect-error unknown tag */}
    <Button as="nope">Invalid tag</Button>
    {/* @ts-expect-error missing required prop of component */}
    <Button as={Link}>Missing to</Button>
    {/* @ts-expect-error component prop on anchor */}
    <Button as="a" to="/home">
      To on anchor
    </Button>
    {/* @ts-expect-error anchor prop without as */}
    <Button href="/docs">Href without as</Button>
    {/* @ts-expect-error button prop on anchor */}
    <Button as="a" disabled>
      Disabled on anchor
    </Button>
    {/* @ts-expect-error button prop on extended anchor */}
    <LinkButton disabled>Disabled on extended anchor</LinkButton>
    {/* @ts-expect-error missing required prop of target component */}
    <ButtonWithLink>Missing to</ButtonWithLink>
    {/* @ts-expect-error anchor prop on target component */}
    <ButtonWithLink to="/home" href="/docs">
      Href on component
    </ButtonWithLink>
    {/* @ts-expect-error button prop on anchor target */}
    <ButtonAnchor disabled>Disabled on anchor</ButtonAnchor>
    {/* @ts-expect-error missing required prop of inherited target component */}
    <ExtendedButtonWithLink>Missing to</ExtendedButtonWithLink>
    {/* @ts-expect-error component prop on extended anchor */}
    <ExtendedAnchor to="/home">To on anchor</ExtendedAnchor>
  </>
)
