<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Global from "./Global.svelte";
</script>

<Meta
  title="Svelte/Global"
  component={Global}
  argTypes={{
    _color: { control: "color" },
  }}
/>

<Template let:args>
  <Global {...args} on:click={args.onClick} />
</Template>

<Story name="Primary" />
