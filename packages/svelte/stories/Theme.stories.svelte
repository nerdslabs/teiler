<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Theme from "./Theme.svelte";
</script>

<Meta
  title="Svelte/Theme"
  component={Theme}
  argTypes={{
    label: { control: "text" },
  }}
/>

<Template let:args>
  <Theme {...args} on:click={args.onClick} />
</Template>

<Story
  name="Default"
/>

<Story
  name="Provide options"
  args={{
    theme: {
      fontColor: 'green',
    }
  }}
/>