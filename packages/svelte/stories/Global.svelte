<script lang="ts">
  import { Global } from './global'

  const { _color = '#f18805' }: { _color?: string } = $props()
</script>

<Global {_color} />
