import { defineComponent, h } from 'vue'
import { component } from '@teiler/vue'

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

const Link = defineComponent({
  props: {
    to: { type: String, required: true },
  },
  setup(props, { slots }) {
    return () => h('a', { href: props.to }, slots.default?.())
  },
})

export { Button, ButtonLink, Link }
