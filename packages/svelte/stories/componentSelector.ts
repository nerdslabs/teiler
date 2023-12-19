import { component } from '@teiler/svelte'

const Component = component.div`
  color: black;
  background: #efefef;
  border-radius: 5px;
  padding: 10px 12px;
  display: inline-block;
`

const InnerComponent = component`
  display: inline-block;

  & ${Component} {
    color: red !important;
  }
`

export { Component, InnerComponent }
