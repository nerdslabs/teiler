import { component, css, global, keyframes } from '@teiler/vue'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const Button = component.button<{ _primary?: boolean }>`
  color: ${({ _primary }) => (_primary ? 'red' : 'blue')};
  animation: ${spin} 1s;
`

export const Sized = component.div<{ size: number }>`
  width: ${({ size }) => size * 2}px;
  ${({ size }) => (size > 10 ? 'overflow: hidden;' : null)}
`

export const Card = component.div<{ _active?: boolean }>`
  ${Button} {
    margin: 0;
  }
  ${({ _active }) =>
    _active &&
    css`
      ${Button} {
        color: ${({ theme }) => theme.accent};
      }
    `}
`

export const Themed = component.p`
  color: ${({ theme }) => theme.accent};
`

export const Primary = component(Button)<{ _big?: boolean }>`
  font-size: ${({ _big }) => (_big ? '2rem' : '1rem')};
`

export const LinkButton = component.a(Button)`
  text-decoration: none;
`

export const Global = global<{ _dark?: boolean }>`
  body {
    background: ${({ _dark }) => (_dark ? 'black' : 'white')};
  }
`
