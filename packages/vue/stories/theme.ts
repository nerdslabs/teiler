import { component } from '@teiler/vue'

const Component = component.div`
  color: ${({ theme }) => theme.fontColor};
`

export { Component }
