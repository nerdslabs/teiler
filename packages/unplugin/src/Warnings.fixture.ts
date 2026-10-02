import { pattern } from '@teiler/core'

interface Props {
  color: string
}

export const Broken = pattern.button<Props>`
  color red;
`
