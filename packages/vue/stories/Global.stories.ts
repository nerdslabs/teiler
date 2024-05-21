import type { Meta, StoryObj } from '@storybook/vue3'
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
  args: {
    _primary: true,
    label: 'Button',
  },
}
