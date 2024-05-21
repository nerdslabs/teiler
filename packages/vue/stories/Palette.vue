<script setup lang="ts">
import { Button, ExtendedButton} from './palette'

withDefaults(defineProps<{
  _primary: boolean,
  _primaryColor: string,
  _size: string,
  label: string,
  disabled: boolean
}>(), {
  _primary: false,
  _primaryColor: "#f18805",
  _size: 'normal',
  label: '',
  disabled: false
})
</script>

<template>
  <Button v-bind:_primary v-bind:_primaryColor v-bind:_size v-bind:disabled>{{label}}</Button>
  <ExtendedButton v-bind:_primary v-bind:_primaryColor v-bind:_size v-bind:disabled>Test</ExtendedButton>
</template>
