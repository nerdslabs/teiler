import { describe, expect, test } from '@jest/globals'
import createStyleSheet from './index'

describe('createStyleSheet CSR', () => {
  test('should create a new StyleSheet object', () => {
    const sheet = createStyleSheet({})
    expect(sheet).toBeDefined()
    expect(sheet.insert).toBeDefined()
    expect(sheet.dump).toBeDefined()
  })

  test('should insert a style rule into the stylesheet', () => {
    const sheet = createStyleSheet({})
    sheet.insert('my-rule', 'my-rule { color: red }')
    expect(sheet.dump()).toContain('my-rule { color: red }')
  })
})

describe('has', () => {
  test('should return true for inserted and hydrated keys', () => {
    const sheet = createStyleSheet({})
    sheet.insert('my-rule', 'my-rule { color: red }')
    sheet.hydrate(['hydrated-rule'])
    expect(sheet.has('my-rule')).toBe(true)
    expect(sheet.has('hydrated-rule')).toBe(true)
    expect(sheet.has('other-rule')).toBe(false)
  })
})

describe('nonce', () => {
  test.each([
    { name: 'from options', nonce: 'abc123', expected: 'abc123' },
    { name: 'none when not provided', nonce: undefined, expected: null },
  ])('should set nonce $name', ({ nonce, expected }) => {
    const container = document.createElement('div')
    createStyleSheet({ container, nonce })
    expect(container.querySelector('style[data-teiler]')?.getAttribute('nonce')).toBe(expected)
  })
})
