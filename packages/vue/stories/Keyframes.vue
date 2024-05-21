<script setup lang="ts">
import { Component } from './keyframes'

withDefaults(defineProps<{
  label: String
}>(), {})
</script>

<template>
  <Component>{{label}}</Component>
</template>
