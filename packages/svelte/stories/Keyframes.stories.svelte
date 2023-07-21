<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Keyframes from "./Keyframes.svelte";
</script>

<Meta
  title="Svelte/Keyframes"
  component={Keyframes}
  argTypes={{
    label: { control: "text" },
  }}
/>

<Template let:args>
  <Keyframes {...args} on:click={args.onClick} />
</Template>

<Story
  name="Example"
  args={{
    label: "Bouncing text",
  }}
/>