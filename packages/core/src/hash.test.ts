import { expect, test } from '@jest/globals'
import hash from './hash'

test('create hash', () => {
  const styles = `
    color: red;
    background: blue;
  `

  const generated = hash(styles)
  expect(generated).toEqual('1a6449z')
})

test('compare hashe of styles', () => {
  const styles = `
    color: red;
    background: blue;
  `

  const hash1 = hash(styles)
  const hash2 = hash(styles)

  expect(hash1).toEqual(hash2)
})
