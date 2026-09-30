import { pattern } from '@teiler/core'

export const Button = pattern.button`
  color: red;

  &:hover {
    color: green;
  }
`

export const Unused = pattern.a`
  color: unused;
`
