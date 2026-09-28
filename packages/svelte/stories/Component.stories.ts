import type { Meta, StoryObj } from '@storybook/svelte'

import { expect } from 'storybook/test'
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

const buttons = (canvasElement: HTMLElement) => Array.from(canvasElement.querySelectorAll('button')).map((button) => [button, getComputedStyle(button)] as const)

export const Primary: Story = {
  args: {
    _primary: true,
    label: 'Button',
  },
  play: async ({ canvasElement }) => {
    const [[, button], [, extended]] = buttons(canvasElement)

    await expect(button.backgroundColor).toBe('rgb(241, 136, 5)')
    await expect(button.color).toBe('rgb(255, 255, 255)')
    await expect(extended.backgroundColor).toBe('rgb(255, 0, 0)')
    await expect(extended.color).toBe('rgb(0, 0, 255)')
  },
}

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
  play: async ({ canvasElement }) => {
    const [[, button], [, extended]] = buttons(canvasElement)

    await expect(button.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    await expect(button.color).toBe('rgb(15, 18, 26)')
    await expect(button.fontWeight).toBe('700')
    await expect(extended.backgroundColor).toBe('rgb(255, 0, 0)')
    await expect(extended.fontWeight).toBe('300')
  },
}

export const Small: Story = {
  args: {
    _size: 'small',
    label: 'Button',
  },
  play: async ({ canvasElement }) => {
    const [[, button]] = buttons(canvasElement)

    await expect(button.fontSize).toBe('12.96px')
    await expect(button.paddingTop).toBe('4.8px')
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Button',
  },
  play: async ({ canvasElement }) => {
    const [[button, style], [, extended]] = buttons(canvasElement)

    await expect(button.disabled).toBe(true)
    await expect(style.backgroundColor).toBe('rgb(192, 192, 192)')
    await expect(extended.backgroundColor).toBe('rgb(192, 192, 192)')
  },
}
