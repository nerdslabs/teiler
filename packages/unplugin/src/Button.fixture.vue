<script setup lang="ts">
import { component } from '@teiler/vue'

const Button = component.button<{ _primary?: boolean }>`
  color: ${({ _primary }) => (_primary ? 'red' : 'blue')};

  &:hover {
    color: green;
  }
`
</script>

<template>
  <Button _primary>Button</Button>
</template>
