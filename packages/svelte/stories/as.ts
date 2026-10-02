import { component } from '@teiler/svelte'
import Link from './Link.svelte'

const Button = component.button`
  display: inline-block;
  padding: 0.5rem 1.6rem;
  border: 0;
  border-radius: 4px;
  background: #f18805;
  color: #fff;
  font-family: Roboto;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
`

const ButtonLink = component.a(Button)`
  text-decoration: underline;
`

const ButtonWithLink = Button.withComponent(Link)

export { Button, ButtonLink, ButtonWithLink }
