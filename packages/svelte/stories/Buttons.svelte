<script lang="ts">
  import { createStyleSheet } from '@teiler/core'
  import { hire } from '@teiler/svelte'

  // import teiler from '@teiler/svelte'
  import { createEventDispatcher } from 'svelte'

  const sheet = createStyleSheet({})
  const { component, global } = hire({
    sheet
  })

  export let _primary = false
  export let _primaryColor = "#f18805"

  export let _size: 'normal' | 'small' = 'normal'

  export let label = ''

  export let disabled

  const Button = component.button<{
    _primary: boolean
    _size: 'normal' | 'small',
    _primaryColor: string,
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
      background: ${( { _primaryColor } ) => _primaryColor};
      box-shadow: 0 0 0 3px ${( { _primaryColor } ) => _primaryColor} inset;
    }

    ${({ _primary, _primaryColor }) =>
      _primary &&
      `
        color: #fff;
        box-shadow: none;
        background: ${_primaryColor};

        &:hover {
          opacity: 0.9;
        }
      `}

    ${({ _size }) =>
      _size === 'small' &&
      `
      font-size: 0.81rem;
      padding: 0.3rem 1.2rem;
      min-width: auto;
    `}

    &[disabled] {
      background-image: none !important;
      background-color: #C0C0C0 !important;
      box-shadow: 0 0 0 3px #C0C0C0 inset !important;
      color: #fff !important;
      cursor: not-allowed;
    }
  `

  const ExtendedButton = component(Button)<{test?: boolean}>`
    font-weight: 300;
    background: red;

    ${props => `
        ${props}
      `}
  `

  const dispatch = createEventDispatcher()

  /**
   * Optional click handler
   */
  function onClick(event) {
    console.log('dump', sheet.dump())
    dispatch('click', event)
  }
</script>

<Button {_primary} {_size} {_primaryColor} {disabled} on:click={onClick}>
  {label}
</Button>
<ExtendedButton {_primary} {_size} {_primaryColor}>Test</ExtendedButton>
