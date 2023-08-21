import { JSDOM } from "jsdom"
const dom = new JSDOM()
global.document = dom.window.document
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.window = dom.window
