<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Component from "./Component.svelte";
</script>

<Meta
  title="Svelte/Component"
  component={Component}
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
  <Component {...args} on:click={args.onClick} />
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
