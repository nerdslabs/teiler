<script lang="ts">
  import { Button, ButtonLink } from './as'
  import Link from './Link.svelte'
</script>

<Button>Button</Button>
<Button as="a" href="#">Button as anchor</Button>
<Button as={Link} to="#">Button as component</Button>
<ButtonLink href="#">Extended as anchor</ButtonLink>
