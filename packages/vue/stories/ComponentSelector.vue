<script setup lang="ts">
import { Component, InnerComponent } from './componentSelector'
</script>

<template>
  <Component>Default component</Component>
  <InnerComponent>
    <Component>Same component with color override</Component>
  </InnerComponent>
</template>
