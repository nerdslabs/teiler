import type { Meta, StoryObj } from '@storybook/svelte'
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
}
