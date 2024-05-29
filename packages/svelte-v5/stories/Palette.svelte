<script lang="ts">
  import { Button, ExtendedButton} from './palette'

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

<Button {_primary} {_size} {_primaryColor} {disabled} on:click={onClick}>
  {label}
</Button>
<ExtendedButton {_primary} {_size} {_primaryColor} {disabled}>Test</ExtendedButton>
