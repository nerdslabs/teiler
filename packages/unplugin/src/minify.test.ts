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
    { name: 'keeps escapes', input: ['content: "\\f101";'], expected: ['content:"\\f101";'] },
    { name: 'keeps keyframes', input: ['\n  from { opacity: 0; }\n  50% { opacity: 0.5; }\n  to { opacity: 1; }\n'], expected: ['from{opacity:0;}50%{opacity:0.5;}to{opacity:1;}'] },
    { name: 'keeps global rules', input: ['\n  @font-face {\n    font-family: "A";\n  }\n  body {\n    margin: 0;\n  }\n'], expected: ['@font-face{font-family:"A";}body{margin:0;}'] },
    { name: 'adds missing semicolon', input: ['color: red'], expected: ['color:red;'] },
    { name: 'keeps space between interpolations', input: ['padding: ', ' ', ';'], expected: ['padding:', ' ', ';'] },
    { name: 'keeps interpolated selectors', input: ['\n  ', ' + ', ' {\n    color: red;\n  }\n'], expected: ['', '+', '{color:red;}'] },
    { name: 'keeps interpolated declarations', input: ['\n  ', '\n  color: red;\n'], expected: ['', ' color:red;'] },
    { name: 'keeps strings across interpolations', input: ['content: "  ', '  ";'], expected: ['content:"  ', '  ";'] },
    { name: 'returns empty template', input: [''], expected: [''] },
    { name: 'keeps nested rules', input: ['\n  &:hover {\n    img {\n      color: red;\n    }\n  }\n'], expected: ['&:hover{img{color:red;}}'] },
    { name: 'keeps order of declarations and nested rules', input: ['\n  a {\n    b { color: red; }\n    ', ';\n    c { color: blue; }\n  }\n'], expected: ['a{b{color:red;}', ';c{color:blue;}}'] },
    { name: 'keeps at-rules in nested rules', input: ['\n  a {\n    @media print {\n      color: red;\n      b { color: blue; }\n    }\n    color: green;\n  }\n'], expected: ['a{@media print{color:red;b{color:blue;}}color:green;}'] },
    { name: 'removes comments in nested rules', input: ['\n  a {\n    b { /* one */ color: red; }\n    /* two */\n  }\n'], expected: ['a{b{color:red;}}'] },
    { name: 'keeps statement at-rules', input: ['\n  @import url(a.css);\n  @layer a, b;\n  body { margin: 0; }\n'], expected: ['@import url(a.css);@layer a,b;body{margin:0;}'] },
  ])('$name', ({ input, expected }) => {
    expect(minify(input)).toEqual({ strings: expected })
  })

  test.each([
    { name: 'value fragments', input: ['1px solid'], reason: 'dropped' },
    { name: 'value fragments with edges', input: ['\n  solid\n'], reason: 'dropped' },
    { name: 'missing colons', input: ['color red; background: blue;'], reason: 'dropped' },
    { name: 'unclosed braces', input: ['&:hover { color: red;'], reason: 'dropped' },
    { name: 'extra braces', input: ['color: red; }'], reason: 'dropped' },
    { name: 'interpolations in comments', input: ['color: red; /* ', ' */'], reason: 'interpolation' },
    { name: 'placeholder collisions', input: ['content: "xxx0:xxx";'], reason: 'placeholder' },
  ])('skips $name', ({ input, reason }) => {
    expect(minify(input)).toEqual({ skipped: reason })
  })

  test.each([
    ['\n  color: red;\n  // comment\n  &:hover, &:focus {\n    color: blue; /* comment */\n  }\n  @media (min-width: 100px) and (max-width: 200px) {\n    padding: 1px 2px;\n  }\n'],
    ['\n  width: calc(100% - 10px);\n  background: url(//example.com/a.png) no-repeat;\n  font-family: "Open Sans", sans-serif;\n  & > span + span ~ a { margin: 0 auto !important; }\n'],
    ['\n  content: "  a  ";\n  & :not(.a) .b { color: red; }\n  @supports (display: grid) { display: grid; }\n  grid-template-areas: "a  b" "c  d";\n'],
    ['\n  span {\n    position: absolute;\n    &:before { content: ""; }\n    @media (min-width: 100px) { color: red; b { color: blue; } }\n    margin: 0;\n  }\n  &:hover { img { filter: drop-shadow(0 0 8px red); } }\n'],
  ])('transpiles to the same CSS %#', (input) => {
    const minified = minify([input])
    expect(minified).toHaveProperty('strings')
    expect(transpile(`.a{${'strings' in minified && minified.strings[0]}}`)).toBe(transpile(`.a{${input}}`))
  })
})
