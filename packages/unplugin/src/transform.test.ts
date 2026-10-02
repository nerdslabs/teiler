import type { Options } from './transform'
import type { Pattern } from '@teiler/core'

import { createStyleSheet, css, insert, pattern } from '@teiler/core'
import { describe, expect, test } from 'vitest'
import { transform } from './transform'

const run = (code: string, id = 'file.js', options?: Options) => transform(code, id, { componentId: false, ...options })?.code

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
    expect(transform(code, 'file.js', { componentId: false })).toBeNull()
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
    expect(run(code, 'file.js', { modules: ['@acme/ui'] })).toContain('/*#__PURE__*/ component.button(["color:red;"])')
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

  test.each([
    { name: 'only minifies', options: { pure: false }, expected: 'component.div`color:${({ color }) => color};content:"\\\\f101 \\` \\${a}";`' },
    { name: 'only adds pure calls', options: { minify: false }, expected: '/*#__PURE__*/ component.div(["\\n  color: ", ";\\n  content: \\"\\\\f101 ` ${a}\\";\\n"], ({ color }) => color)' },
  ])('$name', ({ options, expected }) => {
    const code = 'import { component } from \'@teiler/vue\'\ncomponent.div`\n  color: ${({ color }) => color};\n  content: "\\\\f101 \\` \\${a}";\n`'
    expect(run(code, 'file.js', options)).toBe(`import { component } from '@teiler/vue'\n${expected}`)
  })

  test('keeps templates with nothing to do', () => {
    expect(transform("import { component } from '@teiler/vue'\ncomponent.div`\n  color: red;\n`", 'file.js', { minify: false, pure: false, componentId: false })).toBeNull()
    expect(transform("import { component, css } from '@teiler/vue'\ncomponent.div`\n  border: 1px ${() => css`solid`};\n`", 'file.js', { pure: false, componentId: false })?.code).toBe(
      "import { component, css } from '@teiler/vue'\ncomponent.div`border:1px ${() => css`solid`};`",
    )
  })

  test.each([{}, { pure: false }, { minify: false }])('produces the same styles at runtime with %o', (options) => {
    const code = 'import { css, pattern } from \'@teiler/core\'\nexport const Button = pattern.button`\n  content: "\\\\f101 \\` \\${a}";\n  color: ${({ color }) => color};\n  ${({ active }) => active && css`\n    &:hover { color: red; }\n  `}\n`'
    expect(render(run(code, 'file.js', options)!)).toBe(render(code))
  })

  test('generates source map', () => {
    const result = transform("import { component } from '@teiler/vue'\ncomponent.button`\n  color: red;\n`", 'file.js')
    expect(result?.map.sources).toEqual(['file.js'])
    expect(result?.map.mappings).not.toBe('')
  })
})

describe('componentId', () => {
  const ids = (code: string, options?: Options) => [...(transform(code, 'src/file.js', options)?.code ?? '').matchAll(/(\w+(?:\.\w+)*(?:\(\w+\))?)\.withConfig\("([\w-]{9,})"(?:, "\w+")?\)/g)].map(([, tag, id]) => ({ tag, id }))

  test('adds component ids to components, globals and patterns', () => {
    const code =
      "import { component, css, global, keyframes } from '@teiler/vue'\nimport { pattern } from '@teiler/core'\nconst Button = component.button`color: red;`\nconst Link = component.a(Button)`color: blue;`\nconst Global = global`body { margin: 0; }`\nconst Base = pattern`color: red;`\nconst fade = keyframes`from { opacity: 0; }`\nconst shared = css`margin: 0;`"
    expect(ids(code).map(({ tag }) => tag)).toEqual(['component.button', 'component.a(Button)', 'global', 'pattern'])
    expect(new Set(ids(code).map(({ id }) => id)).size).toBe(4)
  })

  test('keeps the ids of other components', () => {
    const before = ids("import { component } from '@teiler/vue'\nconst Button = component.button`color: red;`")
    const after = ids("import { component } from '@teiler/vue'\nconst Icon = component.span`color: red;`\nconst Button = component.button`color: blue;`")
    expect(after[1].id).toBe(before[0].id)
  })

  test('numbers templates with the same name', () => {
    const code = "import { component } from '@teiler/vue'\nexport default component.div`a: b;`\nfunction f() { const A = component.div`a: b;` }\nfunction g() { const A = component.div`a: b;` }\ncomponent.div`a: b;`"
    expect(new Set(ids(code).map(({ id }) => id)).size).toBe(4)
  })

  test('creates ids from the scope', () => {
    const code = "import { component } from '@teiler/vue'\nconst Button = component.button`color: red;`"
    expect(ids(code, { scope: 'a' })).toEqual(ids(code, { scope: 'a' }))
    expect(ids(code, { scope: 'a' })).not.toEqual(ids(code, { scope: 'b' }))
    expect(ids(code)).toEqual(ids(code, { scope: 'src/file.js' }))
  })

  test.each([{}, { pure: false }, { minify: false, pure: false }])('keeps type arguments and works with %o', (options) => {
    const code = "import { component } from '@teiler/vue'\nconst Button = component.button<{ a: number }>`\n  color: red;\n`"
    expect(transform(code, 'file.ts', options)?.code).toMatch(/component\.button\.withConfig\("[\w-]{9,}"(?:, "\w+")?\)<\{ a: number \}>[(`]/)
  })

  test.each([
    { name: 'a component id', tag: "component.button.withConfig({ componentId: 'button' })", expected: 0 },
    { name: 'a quoted component id', tag: "component.button.withConfig({ 'componentId': 'button' })", expected: 0 },
    { name: 'a component id string', tag: "component.button.withConfig('button')", expected: 0 },
    { name: 'an extension with a component id', tag: "component(Base).withConfig({ componentId: 'button' })", expected: 0 },
    { name: 'a component id before the extension', tag: "component.withConfig({ componentId: 'button' })(Base)", expected: 0 },
    { name: 'other options', tag: 'component.button.withConfig({ other: true })', expected: 1 },
    { name: 'a config variable', tag: 'component.button.withConfig(config)', expected: 1 },
  ])('keeps templates configured with $name', ({ tag, expected }) => {
    const code = transform(`import { component } from '@teiler/vue'\nconst Button = ${tag}\`color: red;\``, 'file.js')?.code
    expect(code?.match(/withConfig\("[\w-]{9,}"(?:, "\w+")?\)/g) ?? []).toHaveLength(expected)
  })

  test('keeps ids unique in large files', () => {
    const code = "import { component } from '@teiler/vue'\n" + Array.from({ length: 500 }, (_, index) => `const C${index} = component.div\`a: b;\``).join('\n')
    const found = ids(code).map(({ id }) => id)
    expect(found).toHaveLength(500)
    expect(new Set(found).size).toBe(500)
    expect(new Set(found.map((id) => id.slice(0, 6))).size).toBe(1)
    expect(found.some((id) => id.length > 9)).toBe(true)
  })

  test('adds component ids to templates with invalid escapes', () => {
    expect(ids("import { component } from '@teiler/vue'\nconst Button = component.button`content: '\\unicode';`")).toHaveLength(1)
  })

  test('produces the same styles at runtime', () => {
    const code = "import { css, pattern } from '@teiler/core'\nexport const Button = pattern.button`\n  color: ${({ color }) => color};\n`"
    expect(render(transform(code, 'file.js')!.code)).toBe(render(code))
  })
})

describe('displayName', () => {
  const configs = (code: string, options?: Options) => [...(transform(code, 'file.js', options)?.code ?? '').matchAll(/\.withConfig\(([^)]*)\)/g)].map(([, config]) => config)

  test('adds variable names', () => {
    const code = "import { component, global } from '@teiler/vue'\nconst Button = component.button`color: red;`\nexport const Global = global`body { margin: 0; }`\nexport default component.div`color: red;`"
    expect(configs(code, { componentId: false })).toEqual(['{ displayName: "Button" }', '{ displayName: "Global" }'])
  })

  test.each([
    { name: 'a name set by hand', tag: "component.button.withConfig({ displayName: 'Primary' })", expected: [/^"[\w-]{9,}"$/] },
    { name: 'a component id set by hand', tag: "component.button.withConfig({ componentId: 'button' })", expected: [/^\{ displayName: "Button" \}$/] },
    { name: 'both set by hand', tag: "component.button.withConfig({ componentId: 'button', displayName: 'Primary' })", expected: [] },
    { name: 'a component id string set by hand', tag: "component.button.withConfig('button')", expected: [/^\{ displayName: "Button" \}$/] },
    { name: 'both strings set by hand', tag: "component.button.withConfig('button', 'Primary')", expected: [] },
  ])('keeps $name', ({ tag, expected }) => {
    const added = configs(`import { component } from '@teiler/vue'\nconst Button = ${tag}\`color: red;\``).slice(1)
    expect(added).toHaveLength(expected.length)
    added.forEach((config, index) => expect(config).toMatch(expected[index]))
  })

  test('can be turned off', () => {
    expect(configs("import { component } from '@teiler/vue'\nconst Button = component.button`color: red;`", { displayName: false })).toEqual([expect.stringMatching(/^"[\w-]{9,}"$/)])
  })
})

describe('warnings', () => {
  const warnings = (code: string) => (transform(code, 'file.js')?.warnings ?? []).map(({ message, loc }) => ({ message, line: loc.line, column: loc.column, file: loc.file }))
  const position = (code: string, search: string) => {
    const lines = code.slice(0, code.indexOf(search)).split('\n')
    return { line: lines.length, column: lines[lines.length - 1].length }
  }

  test.each([
    { name: 'component', code: "import { component } from '@teiler/vue'\nconst Button = component.button`\n  color red;\n`" },
    { name: 'global', code: "import { global } from '@teiler/vue'\nconst Global = global`\n  body { color: red;\n`" },
    { name: 'pattern', code: "import { pattern } from '@teiler/core'\nconst Button = pattern.button`\n  color: red; }\n`" },
  ])('reports ignored CSS in $name', ({ name, code }) => {
    expect(warnings(code)).toEqual([
      expect.objectContaining({ message: expect.stringContaining(`\`${name}\` template`), file: 'file.js', ...position(code, name === 'pattern' ? 'pattern.button`' : name === 'global' ? 'global`' : 'component.button`') }),
    ])
  })

  test('does not report css value fragments', () => {
    expect(warnings("import { component, css } from '@teiler/vue'\ncomponent.div`\n  border: 1px ${() => css`solid`};\n`")).toEqual([])
  })

  test.each([
    { name: 'a local component', code: "import { component } from '@teiler/vue'\nconst Button = component.button`color: red;`\ncomponent.div`\n  ${({ _active }) => _active && `${Button} { color: red; }`}\n`", identifier: 'Button' },
    { name: 'local keyframes', code: "import { component, keyframes } from '@teiler/vue'\nconst fade = keyframes`from { opacity: 0; }`\ncomponent.div`\n  ${({ _active }) => _active && `animation: ${fade} 1s;`}\n`", identifier: 'fade' },
    { name: 'an imported component', code: "import { component } from '@teiler/vue'\nimport Button from './Button'\ncomponent.div`\n  ${function () { return `${Button} { color: red; }` }}\n`", identifier: 'Button' },
  ])('reports $name in a plain template string inside a function', ({ code, identifier }) => {
    const search = '${' + identifier + '}'
    const { line, column } = position(code, search)
    expect(warnings(code)).toEqual([expect.objectContaining({ message: expect.stringContaining(`\`\${${identifier}}\``), line, column: column + 2 })])
  })

  test.each([
    { name: 'css', code: "import { component, css } from '@teiler/vue'\nimport Button from './Button'\ncomponent.div`\n  ${({ _active }) => _active && css`${Button} { color: red; }`}\n`" },
    { name: 'selectors outside functions', code: "import { component } from '@teiler/vue'\nimport Button from './Button'\ncomponent.div`\n  ${Button} { color: red; }\n`" },
    { name: 'strings', code: "import { component } from '@teiler/vue'\nimport { selector } from './selectors'\ncomponent.div`\n  ${() => `${selector} { color: red; }`}\n`" },
    { name: 'constants', code: "import { component } from '@teiler/vue'\nimport { COLOR } from './colors'\ncomponent.div`\n  ${() => `color: ${COLOR};`}\n`" },
    { name: 'members', code: "import { component } from '@teiler/vue'\nimport Theme from './theme'\ncomponent.div`\n  ${() => `color: ${Theme.color};`}\n`" },
    { name: 'other tags', code: "import { component } from '@teiler/vue'\nconst Other = html`<div></div>`\ncomponent.div`\n  ${() => `${Other} { color: red; }`}\n`" },
  ])('does not report $name', ({ code }) => {
    expect(warnings(code)).toEqual([])
  })

  test('reports templates with invalid escapes', () => {
    const code = "import { component } from '@teiler/vue'\nimport Button from './Button'\ncomponent.div`\n  content: '\\unicode';\n  ${() => `${Button} {}`}\n`"
    expect(transform(code, 'file.js', { componentId: false })).toEqual(expect.objectContaining({ code, warnings: [expect.objectContaining({ loc: expect.objectContaining({ line: 5 }) })] }))
  })
})
