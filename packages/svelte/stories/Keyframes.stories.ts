import type { Meta, StoryObj } from '@storybook/svelte'

import { expect } from 'storybook/test'
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
  play: async ({ canvas }) => {
    const { animationName } = getComputedStyle(canvas.getByText('Button'))
    const rules = Array.from(document.styleSheets).flatMap((sheet) => Array.from(sheet.cssRules))

    await expect(animationName).toMatch(/^teiler-/)
    await expect(rules.some((rule) => rule instanceof CSSKeyframesRule && rule.name === animationName)).toBe(true)
  },
}
