import type { Meta, StoryObj } from '@storybook/vue3'

import { expect } from 'storybook/test'
import Theme from './Theme.vue'

const meta = {
  title: 'Theme',
  component: Theme,
  tags: ['autodocs'],
  argTypes: {
    theme: { control: 'object' },
  },
} satisfies Meta<typeof Theme>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByText('Some test text')).color).toBe('rgb(255, 0, 0)')
  },
}

export const ProvideOptions: Story = {
  args: {
    theme: {
      fontColor: 'green',
    },
  },
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByText('Some test text')).color).toBe('rgb(0, 128, 0)')
  },
}
