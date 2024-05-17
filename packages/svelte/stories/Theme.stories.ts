import type { Meta, StoryObj } from '@storybook/svelte'
import Theme from './Theme.svelte'

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

export const Default: Story = {}

export const ProvideOptions: Story = {
  args: {
    theme: {
      fontColor: 'green',
    },
  },
}
