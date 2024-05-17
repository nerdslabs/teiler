import type { Meta, StoryObj } from '@storybook/svelte'
import Keyframes from './Keyframes.svelte'

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
