<script setup lang="ts">
import { Button, ButtonLink, Link } from './as'
</script>

<template>
  <Button>Button</Button>
  <Button as="a" href="#">Button as anchor</Button>
  <Button :as="Link" to="#">Button as component</Button>
  <ButtonLink href="#">Extended as anchor</ButtonLink>
</template>
