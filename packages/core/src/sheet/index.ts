import { createBrowserTag, createServerTag } from "./tag"

type Options = {
  container?: HTMLElement
}

export type Sheet = {
  insert(key: string, styles: string): void
  dump(): string
}

export default function createStyleSheet(_options: Options): Sheet {
  const options = {
    ...{
      //
    },
    ..._options,
  }

  const isSSR = typeof document === 'undefined'
  const styleTag = isSSR ? createServerTag() : createBrowserTag(options.container)

  return {
    insert: (key: string, styles: string) => (styleTag.insertRule(key, styles)),
    dump: () => {
      return styleTag.getAllRules()
    }
  }
}
