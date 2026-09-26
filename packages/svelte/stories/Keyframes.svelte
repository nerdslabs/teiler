<script lang="ts">
  import { Component } from './keyframes'

  const { label = '' }: { label?: string } = $props()
</script>

<Component>
  {label}
</Component>
