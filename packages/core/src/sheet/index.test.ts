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
