<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import ComponentSelector from "./ComponentSelector.svelte";
</script>

<Meta
  title="Svelte/ComponentSelector"
  component={ComponentSelector}
  argTypes={{
    label: { control: "text" },
  }}
/>

<Template let:args>
  <ComponentSelector {...args} on:click={args.onClick} />
</Template>

<Story
  name="Default"
/>
