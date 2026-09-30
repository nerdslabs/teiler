<script lang="ts">
  import { component } from '@teiler/svelte'

  const Button = component.button<{ _primary?: boolean }>`
    color: ${({ _primary }) => (_primary ? 'red' : 'blue')};

    &:hover {
      color: green;
    }
  `
</script>

<Button _primary>Button</Button>
