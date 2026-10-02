import { describe, expect, test } from 'vitest'
import { minify } from './minify'
import { transpile } from '@teiler/core/css'

describe('minify', () => {
  test.each([
    { name: 'collapses whitespace', input: ['\n  color: red;\n  padding: 1px   2px;\n'], expected: ['color:red;padding:1px 2px;'] },
    { name: 'removes whitespace around braces', input: ['\n  &:hover {\n    color: red;\n  }\n'], expected: ['&:hover{color:red;}'] },
    { name: 'keeps descendant pseudo selectors', input: ['& :hover { color: red; }'], expected: ['& :hover{color:red;}'] },
    { name: 'keeps at-rule preludes', input: ['@media screen and (min-width: 100px) { color: red; }'], expected: ['@media screen and (min-width: 100px){color:red;}'] },
    { name: 'keeps nested at-rules', input: ['@supports (display: grid) {\n  @media print {\n    display: grid;\n  }\n}'], expected: ['@supports (display: grid){@media print{display:grid;}}'] },
    { name: 'keeps selectors lists', input: ['& > span + span ~ a, b :hover { margin: 0 auto !important; }'], expected: ['&>span+span~a,b :hover{margin:0 auto!important;}'] },
    { name: 'keeps calc', input: ['width: calc(100% - 10px);'], expected: ['width:calc(100% - 10px);'] },
    { name: 'removes block comments', input: ['/* comment */ color: red; /* another */'], expected: ['color:red;'] },
    { name: 'removes line comments', input: ['// comment\n  color: red;\n  // another'], expected: ['color:red;'] },
    { name: 'keeps double slash in url', input: ['background: url(//example.com/a.png);'], expected: ['background:url(//example.com/a.png);'] },
    { name: 'keeps strings', input: ['content: "a  /* b */  c";', "font-family: 'A  B';"], expected: ['content:"a  /* b */  c";', "font-family:'A  B';"] },
    { name: 'escapes backslashes', input: ['content: "\\f101";'], expected: ['content:"\\\\f101";'] },
    { name: 'escapes template syntax', input: ['content: "`${";'], expected: ['content:"\\`\\${";'] },
    { name: 'keeps keyframes', input: ['\n  from { opacity: 0; }\n  50% { opacity: 0.5; }\n  to { opacity: 1; }\n'], expected: ['from{opacity:0;}50%{opacity:0.5;}to{opacity:1;}'] },
    { name: 'keeps global rules', input: ['\n  @font-face {\n    font-family: "A";\n  }\n  body {\n    margin: 0;\n  }\n'], expected: ['@font-face{font-family:"A";}body{margin:0;}'] },
    { name: 'adds missing semicolon', input: ['color: red'], expected: ['color:red;'] },
    { name: 'keeps space between interpolations', input: ['padding: ', ' ', ';'], expected: ['padding:', ' ', ';'] },
    { name: 'keeps interpolated selectors', input: ['\n  ', ' + ', ' {\n    color: red;\n  }\n'], expected: ['', '+', '{color:red;}'] },
    { name: 'keeps interpolated declarations', input: ['\n  ', '\n  color: red;\n'], expected: ['', ' color:red;'] },
    { name: 'keeps strings across interpolations', input: ['content: "  ', '  ";'], expected: ['content:"  ', '  ";'] },
    { name: 'returns empty template', input: [''], expected: [''] },
  ])('$name', ({ input, expected }) => {
    expect(minify(input)).toEqual(expected)
  })

  test.each([
    { name: 'value fragments', input: ['1px solid'] },
    { name: 'value fragments with edges', input: ['\n  solid\n'] },
    { name: 'interpolations in comments', input: ['color: red; /* ', ' */'] },
    { name: 'invalid escapes', input: [undefined] },
    { name: 'placeholder collisions', input: ['content: "xxx0:xxx";'] },
  ])('skips $name', ({ input }) => {
    expect(minify(input)).toBeNull()
  })

  test.each([
    ['\n  color: red;\n  // comment\n  &:hover, &:focus {\n    color: blue; /* comment */\n  }\n  @media (min-width: 100px) and (max-width: 200px) {\n    padding: 1px 2px;\n  }\n'],
    ['\n  width: calc(100% - 10px);\n  background: url(//example.com/a.png) no-repeat;\n  font-family: "Open Sans", sans-serif;\n  & > span + span ~ a { margin: 0 auto !important; }\n'],
    ['\n  content: "  a  ";\n  & :not(.a) .b { color: red; }\n  @supports (display: grid) { display: grid; }\n  grid-template-areas: "a  b" "c  d";\n'],
  ])('transpiles to the same CSS %#', (input) => {
    expect(transpile(`.a{${minify([input])![0]}}`)).toBe(transpile(`.a{${input}}`))
  })
})
