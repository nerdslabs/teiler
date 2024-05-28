import { createBrowserTag, createServerTag } from './tag'

type Options = {
  container?: HTMLElement
}

export type Sheet = {
  insert(key: string, styles: string): void
  dump(): string
  extract(): { css: string; ids: string[] }
  hydrate(ids: string[]): void
}

export default function createStyleSheet(_options: Options): Sheet {
  const options = {
    ...{
      //
    },
    ..._options,
  }

  let cache: string[] = []

  const isSSR = typeof document === 'undefined'
  const styleTag = isSSR ? createServerTag() : createBrowserTag(options.container)

  return {
    insert: (key: string, styles: string) => {
      if (cache.includes(key) === false) {
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
      }
    },
    hydrate: (ids: string[]) => {
      cache = ids || []
    },
  }
}
