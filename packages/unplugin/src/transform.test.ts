import { describe, expect, test } from 'vitest'
import { transform } from './transform'

const run = (code: string, id = 'file.js', modules?: string[]) => transform(code, id, modules)?.code

describe('transform', () => {
  test.each([
    { name: 'component tag', code: "import { component } from '@teiler/vue'\ncomponent.button`\n  color: red;\n`" },
    { name: 'component call', code: "import { component } from '@teiler/vue'\ncomponent(Button)`\n  color: red;\n`" },
    { name: 'component tag call', code: "import { component } from '@teiler/svelte'\ncomponent.a(Button)`\n  color: red;\n`" },
    { name: 'global', code: "import { global } from '@teiler/vue'\nglobal`\n  color: red;\n`" },
    { name: 'keyframes', code: "import { keyframes } from '@teiler/vue'\nkeyframes`\n  color: red;\n`" },
    { name: 'pattern', code: "import { pattern } from '@teiler/core'\npattern.button`\n  color: red;\n`" },
    { name: 'renamed import', code: "import { component as styled } from '@teiler/vue'\nstyled.button`\n  color: red;\n`" },
    { name: 'string import name', code: "import { 'component' as styled } from '@teiler/vue'\nstyled.button`\n  color: red;\n`" },
    { name: 'namespace import', code: "import * as teiler from '@teiler/vue'\nteiler.component.button`\n  color: red;\n`" },
    { name: 'namespace call', code: "import * as teiler from '@teiler/vue'\nteiler.component(Button)`\n  color: red;\n`" },
  ])('minifies $name', ({ code }) => {
    expect(run(code)).toContain('`color:red;`')
  })

  test.each([
    { name: 'other module', code: "import { component } from 'styled-components'\ncomponent.button`\n  color: red;\n`" },
    { name: 'other export', code: "import { createComponent } from '@teiler/vue'\ncreateComponent`\n  color: red;\n`" },
    { name: 'other namespace export', code: "import * as teiler from '@teiler/vue'\nteiler.createComponent`\n  color: red;\n`" },
    { name: 'computed member', code: "import { component } from '@teiler/vue'\ncomponent['button']`\n  color: red;\n`" },
    { name: 'untagged template', code: "import { component } from '@teiler/vue'\nconst a = `\n  color: red;\n`" },
    { name: 'minified template', code: "import { component } from '@teiler/vue'\ncomponent.button`color:red;`" },
    { name: 'invalid code', code: "import { component } from '@teiler/vue'\ncomponent.button`\n  color: red;\n`\n}" },
  ])('skips $name', ({ code }) => {
    expect(transform(code, 'file.js')).toBeNull()
  })

  test('skips css value fragments', () => {
    const code = "import { component, css } from '@teiler/vue'\ncomponent.div`\n  border: 1px ${() => css`\n    solid\n  `};\n`"
    expect(run(code)).toContain('component.div`border:1px ${() => css`\n    solid\n  `};`')
  })

  test('removes empty quasis', () => {
    const code = "import { component } from '@teiler/vue'\ncomponent.div`\n  ${Button} {\n    color: red;\n  }\n`"
    expect(run(code)).toContain('component.div`${Button}{color:red;}`')
  })

  test('supports custom modules', () => {
    const code = "import { component } from '@acme/ui'\ncomponent.button`\n  color: red;\n`"
    expect(run(code)).toBeUndefined()
    expect(run(code, 'file.js', ['@acme/ui'])).toContain('`color:red;`')
  })

  test.each([
    { id: 'file.ts', code: "import { component } from '@teiler/vue'\nconst a: number = 1\ncomponent.button<{ a: number }>`\n  color: red;\n`" },
    { id: 'file.tsx', code: "import { component } from '@teiler/vue'\nconst a = <div />\ncomponent.button<{ a: number }>`\n  color: red;\n`" },
    { id: 'file.mts', code: "import { component } from '@teiler/vue'\nconst a: number = 1\ncomponent.button`\n  color: red;\n`" },
    { id: 'App.vue?vue&type=script&setup=true&lang.ts', code: "import { component } from '@teiler/vue'\nconst a: number = 1\ncomponent.button`\n  color: red;\n`" },
  ])('parses $id', ({ id, code }) => {
    expect(run(code, id)).toContain('`color:red;`')
  })

  test('keeps offsets after non-ascii characters', () => {
    const code = "import { component } from '@teiler/vue'\nconst label = 'żółć 🎨'\ncomponent.button`\n  color: red;\n`"
    expect(run(code)).toBe("import { component } from '@teiler/vue'\nconst label = 'żółć 🎨'\ncomponent.button`color:red;`")
  })

  test('generates source map', () => {
    const result = transform("import { component } from '@teiler/vue'\ncomponent.button`\n  color: red;\n`", 'file.js')
    expect(result?.map.sources).toEqual(['file.js'])
    expect(result?.map.mappings).not.toBe('')
  })
})
