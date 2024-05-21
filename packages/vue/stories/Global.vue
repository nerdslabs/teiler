<script setup lang="ts">
import { Global } from './global'

withDefaults(defineProps<{
  _color: string,
}>(), {
  _color: "#f18805",
})
</script>

<template>
  <Global v-bind:_color />
</template>
