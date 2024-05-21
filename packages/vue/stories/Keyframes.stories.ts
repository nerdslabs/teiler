import type { Meta, StoryObj } from '@storybook/vue3'
import Keyframes from './Keyframes.vue'

const meta = {
  title: 'Keyframes',
  component: Keyframes,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
  },
  args: {
    label: 'Button',
  },
} satisfies Meta<typeof Keyframes>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    _primary: true,
    label: 'Button',
  },
}
