type Options = {
  container?: HTMLElement
}

function createStyleSheetElement(container: HTMLElement) {
  const style = document.createElement('style')
  container.appendChild(style)
  return style
}

function createStyleSheetAdapter({ container: _container }) {
  const isSSR = typeof document === 'undefined'
  const container = isSSR ? undefined : (_container || document.head)
  const style = isSSR ? null : createStyleSheetElement(container)

  return new Proxy(
    [],
    {
      get(object, index) {
        return object[index]
      },
      set(object, property, styles) {
        if (property !== 'length') {
          if (isSSR === false) {
            style.sheet.insertRule(styles, style.sheet.cssRules.length)
          }

          object[property] = styles

          return true
        }

        return object[property] === styles
      },
    },
  )
}

export type Sheet = {
  insert(styles: string): void
  dump(): string
}

export default function createStyleSheet(_options: Options): Sheet {
  const options = {
    ...{
      //
    },
    ..._options,
  }

  const styleSheetAdapter = createStyleSheetAdapter({ container: options.container })

  return {
    insert: (styles: string) => (styleSheetAdapter.push(styles)),
    dump: () => {
      return `<style>${styleSheetAdapter.join(' ')}</style>`
    }
  }
}
