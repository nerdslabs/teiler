<script lang="ts">
  import { Button, ExtendedButton } from './palette'

  const {
    _primaryColor = '#f18805',
    label = '',
    disabled = false,
    onclick,
  }: {
    _primaryColor?: string
    label?: string
    disabled?: boolean
    onclick?: (event: MouseEvent) => void
  } = $props()
</script>

<Button {_primaryColor} {disabled} {onclick}>
  {label}
</Button>
<ExtendedButton {_primaryColor} {disabled} _test={false}>Test</ExtendedButton>
