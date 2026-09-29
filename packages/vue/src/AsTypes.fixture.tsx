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

const button = ref<InstanceType<typeof Button>>()
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
  </>
)
