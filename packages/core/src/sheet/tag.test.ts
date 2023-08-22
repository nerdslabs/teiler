import { describe, expect, test } from '@jest/globals'
import { createBrowserTag, createServerTag } from './tag'

describe('createServerTag', () => {
  test('should insert a rule', () => {
    const tag = createServerTag()
    const rule = 'h1 { color: red }'
    const index = tag.insertRule('key', rule)
    expect(index).toBe(1)
    expect(tag.getRule('key')).toBe(rule)
  })

  test('should delete a rule', () => {
    const tag = createServerTag()
    const rule = 'h1 { color: red }'
    tag.insertRule('key', rule)
    tag.deleteRule('key')
    expect(tag.getRule('key')).toBeNull()
  })

  test('should get all rules', () => {
    const tag = createServerTag()
    const rule1 = 'h1 { color: red }'
    const rule2 = 'h2 { color: green }'
    tag.insertRule('key1', rule1)
    tag.insertRule('key2', rule2)
    expect(tag.getAllRules()).toBe('h1 { color: red } h2 { color: green }')
  })
})

describe('createBrowserTag', () => {
  test('should insert a rule', () => {
    const tag = createBrowserTag()
    const rule = 'h1 { color: red }'
    const index = tag.insertRule('key', rule)
    expect(index).toBe(1)
    expect(tag.getRule('key')).toBe(rule)
  })

  test('should delete a rule', () => {
    const tag = createBrowserTag()
    const rule = 'h1 { color: red }'
    tag.insertRule('key', rule)
    tag.deleteRule('key')
    expect(tag.getRule('key')).toBeNull()
  })

  test('should get all rules', () => {
    const tag = createBrowserTag()
    const rule1 = 'h1 { color: red }'
    const rule2 = 'h2 { color: green }'
    tag.insertRule('key1', rule1)
    tag.insertRule('key2', rule2)
    expect(tag.getAllRules()).toBe(' h1 { color: red } h2 { color: green }')
  })
})
