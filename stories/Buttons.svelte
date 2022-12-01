<script lang="ts">
  import component from '@teiler/svelte'
  import { createEventDispatcher } from 'svelte'

  /**
   * Is this the principal call to action on the page?
   */
  export let primary = false

  /**
   * What background color to use
   */
  export let backgroundColor
  /**
   * How large should the button be?
   */
  export let size = 'normal'
  /**
   * Button contents
   */
  export let label = ''

  const Button = component<{
    primary: boolean
    size: 'normal' | 'small'
  }>`
    border-radius: 4px;
    box-shadow: none;
    display: inline-block;
    padding: 0.5rem 1.6rem;
    text-align: center;
    font-size: 0.8rem;
    line-height: 1.5rem;
    background: transparent;
    box-shadow: 0 0 0 3px #CBCBCB inset;
    border: 0;
    color: #0f121a;
    appearance: none;
    cursor: pointer;
    font-weight: 700;
    font-family: Roboto;

    &:hover {
      text-decoration: none;
      color: #fcfbff;
      background: #f18805;
      box-shadow: 0 0 0 3px #f18805 inset;
    }

    ${({ primary }) =>
      primary &&
      `
        color: #fff;
        box-shadow: none;
        background: #f18805;
      `}

    ${({ size }) =>
      size === 'small' &&
      `
      font-size: 0.81rem;
      padding: 0.3rem 1.2rem;
      min-width: auto;
    `}
  `

  const ExtendedButton = component<{}>(Button)`
    background: red;
  `

  const dispatch = createEventDispatcher()

  /**
   * Optional click handler
   */
  function onClick(event) {
    dispatch('click', event)
  }
</script>

<Button {primary} {size} on:click={onClick}>
  {label}
</Button>
<ExtendedButton>Test</ExtendedButton>
