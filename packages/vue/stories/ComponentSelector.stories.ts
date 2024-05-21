import type { Meta, StoryObj } from '@storybook/vue3'
import ComponentSelector from './ComponentSelector.vue'

const meta = {
  title: 'ComponentSelector',
  component: ComponentSelector,
  tags: ['autodocs'],
} satisfies Meta<typeof ComponentSelector>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {},
}
