/**
 * @vitest-environment node
 */
import { describe, expect, test } from 'vitest'
import createStyleSheet from './index'

describe('createStyleSheet SSR', () => {
  test('should insert a style rule into the stylesheet', () => {
    const sheet = createStyleSheet({})
    sheet.insert('my-rule', 'my-rule { color: red }')
    expect(sheet.dump()).toContain('my-rule { color: red }')
  })
})

describe('extract', () => {
  test('should extract the CSS and IDs from the stylesheet', () => {
    const sheet = createStyleSheet({})
    sheet.insert('my-rule', 'my-rule { color: red }')
    const { css, ids } = sheet.extract()
    expect(css).toContain('my-rule { color: red }')
    expect(ids).toContain('my-rule')
  })

  test('should return the nonce passed in options', () => {
    const sheet = createStyleSheet({ nonce: 'abc123' })
    expect(sheet.extract().nonce).toBe('abc123')
  })
})

describe('hydrate', () => {
  test('should not insert rules with hydrated IDs', () => {
    const sheet = createStyleSheet({})
    sheet.hydrate(['my-rule'])
    sheet.insert('my-rule', 'my-rule { color: red }')
    expect(sheet.dump()).toBe('')
  })

  test('should report hydrated and inserted keys', () => {
    const sheet = createStyleSheet({})
    sheet.hydrate(['hydrated-rule'])
    sheet.insert('my-rule', 'my-rule { color: red }')
    expect(sheet.has('hydrated-rule')).toBe(true)
    expect(sheet.has('my-rule')).toBe(true)
    expect(sheet.has('other-rule')).toBe(false)
  })
})
