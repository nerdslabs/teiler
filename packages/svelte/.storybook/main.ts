import type { StorybookConfig } from '@storybook/svelte-vite'
import { mergeConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import teiler from '@teiler/unplugin/vite'

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
        plugins: [svelte(), process.env.TEILER_UNPLUGIN === '1' && teiler()],
      },
      config,
    )
  },
}
export default config
