import type { Meta, StoryObj } from '@storybook/svelte'

import { expect } from 'storybook/test'
import ComponentSelector from './ComponentSelector.svelte'

const meta = {
  title: 'ComponentSelector',
  component: ComponentSelector,
  tags: ['autodocs'],
} satisfies Meta<typeof ComponentSelector>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByText('Default component')).color).toBe('rgb(0, 0, 0)')
    await expect(getComputedStyle(canvas.getByText('Same component with color override')).color).toBe('rgb(255, 0, 0)')
  },
}
