<script setup lang="ts">
import type { CustomTheme } from './customTheme'

import { Component } from './theme'
import ThemeProvider from '../src/ThemeProvider';

defineProps({
  theme: {
    type: Object as () => CustomTheme,
    default: () => ({
      fontColor: 'red',
    })
  }
});
</script>
<template>
  <ThemeProvider :theme="theme">
    <Component>Some test text</Component>
    Color: {{ theme.fontColor }}
  </ThemeProvider>
</template>
