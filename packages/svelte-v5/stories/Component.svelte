<script lang="ts">
  import { Component, ExtendedComponent } from './component'
  
  Component; ExtendedComponent;

  const {
    _primary = false,
    _primaryColor = "#f18805",
    _size,
    label = "Test",
    disabled,
    onClick
  }: {
    _primary: boolean
    _primaryColor: string
    _size?: 'normal' | 'small'
    label: string
    disabled?: boolean,
    onClick?: (event: MouseEvent) => void
  } = $props()
</script>

<Component {_primary} {_size} {_primaryColor} {disabled} onclick={onClick}>
  {label}
</Component>
<ExtendedComponent {_primary} {_size} {_primaryColor} {disabled}>Test</ExtendedComponent>
