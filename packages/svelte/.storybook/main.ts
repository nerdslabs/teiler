import type { StorybookConfig } from '@storybook/svelte-vite'
import { mergeConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-links', '@chromatic-com/storybook', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/svelte-vite',
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(
      {
        plugins: [svelte()],
      },
      config,
    )
  },
}
export default config
