<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { ClassValue } from 'svelte/elements'

  const { to, class: className, children }: { to: string; class?: ClassValue; children?: Snippet } = $props()
</script>

<a href={to} class={className}>{@render children?.()}</a>
