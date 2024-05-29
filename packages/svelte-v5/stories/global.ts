import { global } from '@teiler/svelte-v5'

const Global = global<{
  _color: string
}>`
  .docs-story {
    background: ${({ _color }) => _color};
  }
`

export { Global }
