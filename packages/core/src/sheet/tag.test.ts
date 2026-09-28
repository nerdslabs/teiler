import { describe, expect, test } from 'vitest'
import { createBrowserTag, createServerTag } from './tag'

describe('createServerTag', () => {
  test('should insert rules', () => {
    const tag = createServerTag()
    tag.insertRule('key1', 'h1 { color: red }')
    tag.insertRule('key2', 'h2 { color: green }')
    expect(tag.hasRule('key1')).toBe(true)
    expect(tag.hasRule('other')).toBe(false)
    expect(tag.getAllKeys()).toEqual(['key1', 'key2'])
    expect(tag.getAllRules()).toBe('h1 { color: red } h2 { color: green }')
  })
})

describe('createBrowserTag', () => {
  test('should insert rules', () => {
    const tag = createBrowserTag()
    tag.insertRule('key1', 'h1 { color: red }')
    tag.insertRule('key2', 'h2 { color: green }')
    expect(tag.hasRule('key1')).toBe(true)
    expect(tag.hasRule('other')).toBe(false)
    expect(tag.getAllKeys()).toEqual(['key1', 'key2'])
    expect(tag.getAllRules()).toBe(' h1 { color: red } h2 { color: green }')
  })
})
