import type { Meta, StoryObj } from '@storybook/svelte'
import Component from './Component.svelte'

const meta = {
  title: 'Component',
  component: Component,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    _primary: { control: 'boolean' },
    _primaryColor: { control: 'color' },
    _size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
    },
  },
  args: {
    _primary: false,
    _primaryColor: '#f18805',
    _size: 'normal',
    disabled: false,
    label: 'Button',
  },
} satisfies Meta<typeof Component>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    _primary: true,
    label: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
}

export const Small: Story = {
  args: {
    _size: 'small',
    label: 'Button',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Button',
  },
}
