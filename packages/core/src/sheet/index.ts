import { createBrowserTag, createServerTag } from './tag'

type Options = {
  container?: HTMLElement
  nonce?: string
}

export type Sheet = {
  has(key: string): boolean
  insert(key: string, styles: string): void
  dump(): string
  extract(): { css: string; ids: string[]; nonce?: string }
  hydrate(ids: string[]): void
}

export default function createStyleSheet(_options: Options): Sheet {
  const options = {
    ...{
      //
    },
    ..._options,
  }

  let cache = new Set<string>()

  const isSSR = typeof document === 'undefined'
  const styleTag = isSSR ? createServerTag() : createBrowserTag(options.container, options.nonce)

  const has = (key: string) => cache.has(key) || styleTag.hasRule(key)

  return {
    has,
    insert: (key: string, styles: string) => {
      if (has(key) === false) {
        styleTag.insertRule(key, styles)
      }
    },
    dump: () => {
      return styleTag.getAllRules()
    },
    extract: () => {
      return {
        css: styleTag.getAllRules(),
        ids: styleTag.getAllKeys(),
        nonce: options.nonce,
      }
    },
    hydrate: (ids: string[]) => {
      cache = new Set(ids || [])
    },
  }
}
