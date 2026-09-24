import type { Meta, StoryObj } from '@storybook/vue3'
import As from './As.vue'

const meta = {
  title: 'As',
  component: As,
  tags: ['autodocs'],
} satisfies Meta<typeof As>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {},
}
