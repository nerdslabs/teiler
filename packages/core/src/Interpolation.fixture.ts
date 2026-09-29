import type { TeilerComponent } from './constructor'

import { css, keyframes } from './constructor'
import { pattern } from './pattern'

const spin = keyframes`from { opacity: 0; } to { opacity: 1; }`
const button = pattern.button`color: blue;`
declare const Link: TeilerComponent<'a', { _primary?: boolean }>
const primary = pattern.button<{ _primary?: boolean }>`color: red;`
const border = css`
  border: 1px solid;
`

export const interpolations = pattern.div<{ size: number; _active?: boolean; color?: string }>`
  width: ${({ size }) => size * 2}px;
  height: ${({ size }) => size}px;
  ${({ _active }) => (_active ? 'outline: 1px solid;' : null)}
  ${({ _active }) => _active && 'cursor: pointer;'}
  ${({ color }) => color}
  ${({ _active }) =>
    _active &&
    css`
      ${button} {
        color: red;
      }
    `}
  ${({ _active }) =>
    _active &&
    css`
      color: ${({ color }) => color};
      width: ${({ size }) => size}px;
    `}
  ${({ _active }) => (_active ? border : undefined)}
  animation: ${spin} 1s;
`

export const withComponents = pattern.div<{ _active?: boolean }>`
  ${primary} {
    margin: 0;
  }
  ${Link} {
    margin: 0;
  }
  ${({ _active }) =>
    _active &&
    css`
      ${primary} {
        color: ${({ theme }) => String(theme.color)};
      }
      ${Link} {
        width: ${({ _active }) => (_active ? 1 : 2)}px;
      }
    `}
`

export const objectReturn = pattern.div<{ size: number }>`
  ${
    // @ts-expect-error object return
    () => ({})
  }
`

export const keyframesReturn = pattern.div<{ size: number }>`
  ${
    // @ts-expect-error keyframes return
    () => spin
  }
`

export const unknownNestedProp = pattern.div<{ size: number }>`
  ${() => css`
    color: ${
      // @ts-expect-error unknown prop in nested css
      ({ missing }) => missing
    };
  `}
`
