import type { Meta, StoryObj } from '@storybook/vue3'

import { expect } from 'storybook/test'
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
  play: async ({ canvas }) => {
    const button = canvas.getByText('Button')
    const anchor = canvas.getByText('Button as anchor')
    const component = canvas.getByText('Button as component')
    const extended = canvas.getByText('Extended as anchor')
    const withComponent = canvas.getByText('With component')

    await expect(button.tagName).toBe('BUTTON')
    await expect(anchor.tagName).toBe('A')
    await expect(anchor.getAttribute('href')).toBe('#')
    await expect(component.tagName).toBe('A')
    await expect(component.getAttribute('href')).toBe('#')
    await expect(extended.tagName).toBe('A')
    await expect(withComponent.tagName).toBe('A')
    await expect(withComponent.getAttribute('href')).toBe('#')

    const background = getComputedStyle(button).backgroundColor

    await expect(background).toBe('rgb(241, 136, 5)')
    await expect(getComputedStyle(anchor).backgroundColor).toBe(background)
    await expect(getComputedStyle(component).backgroundColor).toBe(background)
    await expect(getComputedStyle(extended).backgroundColor).toBe(background)
    await expect(getComputedStyle(withComponent).backgroundColor).toBe(background)
    await expect(getComputedStyle(extended).textDecorationLine).toBe('underline')
  },
}
