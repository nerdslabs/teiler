import { beforeAll, describe, expect, test } from '@jest/globals'
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

describe('createStyleSheet SSR', () => {
  beforeAll(() => (global.document = undefined))

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

describe('extract', () => {
  test('should extract the CSS and IDs from the stylesheet', () => {
    const sheet = createStyleSheet({})
    sheet.insert('my-rule', 'my-rule { color: red }')
    const { css, ids } = sheet.extract()
    expect(css).toContain('my-rule { color: red }')
    expect(ids).toContain('my-rule')
  })
})

describe('hydrate', () => {
  test('should fill the cache with the provided IDs', () => {
    const sheet = createStyleSheet({})
    sheet.hydrate(['my-rule'])
    sheet.insert('my-rule', 'my-rule { color: red }')
    expect(sheet.dump()).toContain('')
  })
})
