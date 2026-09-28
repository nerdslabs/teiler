<script lang="ts">
  import type { Snippet } from 'svelte'

  const { to, class: className, children }: { to: string; class?: string; children?: Snippet } = $props()
</script>

<a href={to} class="link {className}">{@render children?.()}</a>
