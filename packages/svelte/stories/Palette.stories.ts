import type { Meta, StoryObj } from '@storybook/svelte'

import { expect } from 'storybook/test'
import Palette from './Palette.svelte'

const meta = {
  title: 'Palette',
  component: Palette,
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
} satisfies Meta<typeof Palette>

export default meta
type Story = StoryObj<typeof meta>

const buttons = (canvasElement: HTMLElement) => Array.from(canvasElement.querySelectorAll('button')).map((button) => getComputedStyle(button))

const play: Story['play'] = async ({ canvasElement }) => {
  const [button, extended] = buttons(canvasElement)

  await expect(button.backgroundColor).toBe('rgb(241, 136, 5)')
  await expect(button.fontSize).toBe('15px')
  await expect(extended.backgroundColor).toBe('rgb(255, 0, 0)')
  await expect(extended.color).toBe('rgb(0, 0, 255)')
}

export const Primary: Story = {
  args: {
    _primary: true,
    label: 'Button',
  },
  play,
}

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
  play,
}

export const Small: Story = {
  args: {
    _size: 'small',
    label: 'Button',
  },
  play,
}

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Button',
  },
  play: async ({ canvasElement }) => {
    const [button] = buttons(canvasElement)

    await expect(button.backgroundColor).toBe('rgb(128, 128, 128)')
    await expect(button.cursor).toBe('not-allowed')
  },
}
