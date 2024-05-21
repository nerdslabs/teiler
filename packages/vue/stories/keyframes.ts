import { component, keyframes } from '@teiler/vue'

const test = "20px"

const animation = keyframes`
  from, 20%, 53%, 80%, to {
    transform: translate3d(0,0,0);
  }

  40%, 43% {
    transform: translate3d(0, -${test}, 0);
  }

  70% {
    transform: translate3d(0, -15px, 0);
  }

  90% {
    transform: translate3d(0,-4px,0);
  }
`

const Component = component.div`
  animation: ${animation} 1s ease infinite;
`

export { Component }
