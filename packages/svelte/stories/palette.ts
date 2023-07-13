import { pattern, sew } from '@teiler/core'

import component, { createComponent } from '@teiler/svelte'

const Test = pattern.button<{
  _primaryColor: string
}>`
  background: ${({ _primaryColor }) => _primaryColor};
  font-size: 15px;
  font-family: Roboto;
  border: 0;
  padding: 6px 9px;
  border-radius: 3px;
  cursor: pointer;
`

const Button = sew(Test, createComponent)

const ExtendedButton = component(Button)<{ _test: boolean }>`
  font-weight: 300;
  background: red;

  ${(props) => `
    color: ${props._test ? 'red' : 'blue'};
  `}
`

export { Button, ExtendedButton }
