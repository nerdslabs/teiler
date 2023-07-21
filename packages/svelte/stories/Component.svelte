<script lang="ts">
  import { Component, ExtendedComponent } from './component'

  // import teiler from '@teiler/svelte'
  import { createEventDispatcher } from 'svelte'

  export let _primary = false
  export let _primaryColor = "#f18805"

  export let _size: 'normal' | 'small' = 'normal'

  export let label = ''

  export let disabled

  const dispatch = createEventDispatcher()

  /**
   * Optional click handler
   */
  function onClick(event) {
    dispatch('click', event)
  }
</script>

<Component {_primary} {_size} {_primaryColor} {disabled} on:click={onClick}>
  {label}
</Component>
<ExtendedComponent {_primary} {_size} {_primaryColor} {disabled}>Test</ExtendedComponent>
