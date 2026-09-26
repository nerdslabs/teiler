<script lang="ts">
  import { component } from '../src/component'

  const { color = 'yellow', attributes = {}, onclick }: { color?: string; attributes?: Record<string, string>; onclick?: (event: MouseEvent) => void } = $props()

  const Button = component.button<{ _color: string }>`
    color: ${({ _color }) => _color};
  `
</script>

<Button _color={color} {onclick} {...attributes}>{color}</Button>
