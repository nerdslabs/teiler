import { describe, expect, test } from 'vitest'
import hash from './hash'

describe('hash', () => {
  test('create hash', () => {
    const styles = `
    color: red;
    background: blue;
  `

    const generated = hash(styles)
    expect(generated).toEqual('1a6449z')
  })
})
