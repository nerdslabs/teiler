<script lang="ts">
  import { Component, ExtendedComponent } from './component'

  const {
    _primary = false,
    _primaryColor = '#f18805',
    _size = 'normal',
    label = '',
    disabled = false,
    onclick,
  }: {
    _primary?: boolean
    _primaryColor?: string
    _size?: 'normal' | 'small'
    label?: string
    disabled?: boolean
    onclick?: (event: MouseEvent) => void
  } = $props()
</script>

<Component {_primary} {_size} {_primaryColor} {disabled} {onclick}>
  {label}
</Component>
<ExtendedComponent {_primary} {_size} {_primaryColor} {disabled}>Test</ExtendedComponent>
