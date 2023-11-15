import { component } from '@teiler/svelte'

const Component = component.div`
  color: ${({ theme }) => theme.fontColor};
`

export { Component }
