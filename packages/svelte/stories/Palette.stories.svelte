<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Palette from "./Palette.svelte";
</script>

<Meta
  title="Svelte/Palette"
  component={Palette}
  argTypes={{
    label: { control: "text" },
    _primary: { control: "boolean" },
    _primaryColor: { control: "color" },
    _size: {
      control: { type: "select", options: ["small", "medium", "large"] },
    },
    onClick: { action: "onClick" },
  }}
/>

<Template let:args>
  <Palette {...args} on:click={args.onClick} />
</Template>

<Story
  name="Primary"
  args={{
    _primary: true,
    label: "Button",
  }}
/>

<Story
  name="Secondary"
  args={{
    label: "Button",
  }}
/>

<Story
  name="Small"
  args={{
    _size: "small",
    label: "Button",
  }}
/>

<Story
  name="Disabled"
  args={{
    disabled: true,
    label: "Button",
  }}
/>
