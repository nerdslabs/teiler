<script setup lang="ts">
import { BasicComponent, ExtendedComponent } from './component'

withDefaults(defineProps<{
  _primary: boolean,
  _primaryColor: string,
  _size: "small" | "normal",
  disabled: boolean
  label: String
}>(), {
  _primaryColor: "#f18805",
  _size: "normal",
  disabled: false
})
</script>

<template>
  <BasicComponent v-bind:_primary v-bind:_primaryColor v-bind:_size v-bind:disabled>{{label}}</BasicComponent>
  <ExtendedComponent v-bind:_primary v-bind:_primaryColor v-bind:_size v-bind:disabled>Test</ExtendedComponent>
</template>
