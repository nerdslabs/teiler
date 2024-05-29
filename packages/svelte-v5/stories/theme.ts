import { component } from '@teiler/svelte-v5'

const Component = component.div`
  color: ${({ theme }) => theme.fontColor};
`

export { Component }
