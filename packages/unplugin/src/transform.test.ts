import type { Pattern } from '@teiler/core'

import { createStyleSheet, css, insert, pattern } from '@teiler/core'
import { describe, expect, test } from 'vitest'
import { transform } from './transform'

const run = (code: string, id = 'file.js', modules?: string[]) => transform(code, id, modules)?.code

const render = (code: string) => {
  const definition: Pattern<'button', { color: string; active: boolean }> = new Function('pattern', 'css', code.replace(/^import .*\n/, '').replace('export const Button =', 'return'))(pattern, css)
  const sheet = createStyleSheet({})
  insert(sheet, { ...definition, type: 'component' }, { theme: {}, color: 'blue', active: true })
  return sheet.dump().replace(/teiler-\w+/g, 'teiler-x')
}

describe('transform', () => {
  test.each([
    { name: 'component tag', code: "import { component } from '@teiler/vue'\ncomponent.button`\n  color: red;\n`", expected: '/*#__PURE__*/ component.button(["color:red;"])' },
    { name: 'component call', code: "import { component } from '@teiler/vue'\ncomponent(Button)`\n  color: red;\n`", expected: '/*#__PURE__*/ component(Button)(["color:red;"])' },
    { name: 'component tag call', code: "import { component } from '@teiler/svelte'\ncomponent.a(Button)`\n  color: red;\n`", expected: '/*#__PURE__*/ component.a(Button)(["color:red;"])' },
    { name: 'global', code: "import { global } from '@teiler/vue'\nglobal`\n  color: red;\n`", expected: '/*#__PURE__*/ global(["color:red;"])' },
    { name: 'keyframes', code: "import { keyframes } from '@teiler/vue'\nkeyframes`\n  color: red;\n`", expected: '/*#__PURE__*/ keyframes(["color:red;"])' },
    { name: 'pattern', code: "import { pattern } from '@teiler/core'\npattern.button`\n  color: red;\n`", expected: '/*#__PURE__*/ pattern.button(["color:red;"])' },
    { name: 'renamed import', code: "import { component as styled } from '@teiler/vue'\nstyled.button`\n  color: red;\n`", expected: '/*#__PURE__*/ styled.button(["color:red;"])' },
    { name: 'string import name', code: "import { 'component' as styled } from '@teiler/vue'\nstyled.button`\n  color: red;\n`", expected: '/*#__PURE__*/ styled.button(["color:red;"])' },
    { name: 'namespace import', code: "import * as teiler from '@teiler/vue'\nteiler.component.button`\n  color: red;\n`", expected: '/*#__PURE__*/ teiler.component.button(["color:red;"])' },
    { name: 'namespace call', code: "import * as teiler from '@teiler/vue'\nteiler.component(Button)`\n  color: red;\n`", expected: '/*#__PURE__*/ teiler.component(Button)(["color:red;"])' },
    { name: 'empty template', code: "import { component } from '@teiler/vue'\ncomponent(Button)``", expected: '/*#__PURE__*/ component(Button)([""])' },
  ])('transforms $name', ({ code, expected }) => {
    expect(run(code)).toContain(expected)
  })

  test.each([
    { name: 'other module', code: "import { component } from 'styled-components'\ncomponent.button`\n  color: red;\n`" },
    { name: 'other export', code: "import { createComponent } from '@teiler/vue'\ncreateComponent`\n  color: red;\n`" },
    { name: 'other namespace export', code: "import * as teiler from '@teiler/vue'\nteiler.createComponent`\n  color: red;\n`" },
    { name: 'computed member', code: "import { component } from '@teiler/vue'\ncomponent['button']`\n  color: red;\n`" },
    { name: 'untagged template', code: "import { component } from '@teiler/vue'\nconst a = `\n  color: red;\n`" },
    { name: 'invalid escapes', code: "import { component } from '@teiler/vue'\ncomponent.button`content: '\\unicode';`" },
    { name: 'invalid code', code: "import { component } from '@teiler/vue'\ncomponent.button`\n  color: red;\n`\n}" },
  ])('skips $name', ({ code }) => {
    expect(transform(code, 'file.js')).toBeNull()
  })

  test('passes interpolations as arguments', () => {
    const code = "import { component, css } from '@teiler/vue'\ncomponent.div`\n  color: ${({ color }) => color};\n  ${({ _active }) => _active && css`\n    ${Button} { color: red; }\n  `}\n`"
    expect(run(code)).toContain('/*#__PURE__*/ component.div(["color:", ";", ";"], ({ color }) => color, ({ _active }) => _active && /*#__PURE__*/ css(["", "{color:red;}"], Button))')
  })

  test('keeps css value fragments unminified', () => {
    const code = "import { component, css } from '@teiler/vue'\ncomponent.div`\n  border: 1px ${() => css`\n    solid\n  `};\n`"
    expect(run(code)).toContain('/*#__PURE__*/ component.div(["border:1px ", ";"], () => /*#__PURE__*/ css(["\\n    solid\\n  "]))')
  })

  test('escapes strings', () => {
    const code = 'import { component } from \'@teiler/vue\'\ncomponent.div`\n  content: "\\\\f101 \\` \\${a}";\n`'
    expect(run(code)).toContain('/*#__PURE__*/ component.div(["content:\\"\\\\f101 ` ${a}\\";"])')
  })

  test('supports custom modules', () => {
    const code = "import { component } from '@acme/ui'\ncomponent.button`\n  color: red;\n`"
    expect(run(code)).toBeUndefined()
    expect(run(code, 'file.js', ['@acme/ui'])).toContain('/*#__PURE__*/ component.button(["color:red;"])')
  })

  test.each([
    { id: 'file.ts', code: "import { component } from '@teiler/vue'\nconst a: number = 1\ncomponent.button<{ a: number }>`\n  color: red;\n`", expected: '/*#__PURE__*/ component.button<{ a: number }>(["color:red;"])' },
    { id: 'file.tsx', code: "import { component } from '@teiler/vue'\nconst a = <div />\ncomponent.button<{ a: number }>`\n  color: red;\n`", expected: '/*#__PURE__*/ component.button<{ a: number }>(["color:red;"])' },
    { id: 'file.mts', code: "import { component } from '@teiler/vue'\nconst a: number = 1\ncomponent.button`\n  color: red;\n`", expected: '/*#__PURE__*/ component.button(["color:red;"])' },
    { id: 'App.vue?vue&type=script&setup=true&lang.ts', code: "import { component } from '@teiler/vue'\nconst a: number = 1\ncomponent.button`\n  color: red;\n`", expected: '/*#__PURE__*/ component.button(["color:red;"])' },
  ])('parses $id', ({ id, code, expected }) => {
    expect(run(code, id)).toContain(expected)
  })

  test('keeps offsets after non-ascii characters', () => {
    const code = "import { component } from '@teiler/vue'\nconst label = 'żółć 🎨'\ncomponent.button`\n  color: red;\n`"
    expect(run(code)).toBe("import { component } from '@teiler/vue'\nconst label = 'żółć 🎨'\n/*#__PURE__*/ component.button([\"color:red;\"])")
  })

  test('produces the same styles at runtime', () => {
    const code = 'import { css, pattern } from \'@teiler/core\'\nexport const Button = pattern.button`\n  content: "\\\\f101 \\`";\n  color: ${({ color }) => color};\n  ${({ active }) => active && css`\n    &:hover { color: red; }\n  `}\n`'
    const transformed = run(code)!
    expect(transformed).toContain('/*#__PURE__*/ pattern.button([')
    expect(render(transformed)).toBe(render(code))
  })

  test('generates source map', () => {
    const result = transform("import { component } from '@teiler/vue'\ncomponent.button`\n  color: red;\n`", 'file.js')
    expect(result?.map.sources).toEqual(['file.js'])
    expect(result?.map.mappings).not.toBe('')
  })
})
