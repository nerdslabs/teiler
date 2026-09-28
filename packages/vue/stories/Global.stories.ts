import type { Meta, StoryObj } from '@storybook/vue3'

import { expect } from 'storybook/test'
import Global from './Global.vue'

const meta = {
  title: 'Global',
  component: Global,
  tags: ['autodocs'],
  argTypes: {
    _color: { control: 'color' },
  },
  args: {
    _color: '#f18805',
  },
} satisfies Meta<typeof Global>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const element = document.createElement('div')
    element.className = 'docs-story'
    canvasElement.appendChild(element)

    await expect(getComputedStyle(element).backgroundColor).toBe('rgb(241, 136, 5)')

    element.remove()
  },
}
