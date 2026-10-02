import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'
import teiler from '@teiler/unplugin/vite'
import vue from '@vitejs/plugin-vue'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-links', '@chromatic-com/storybook', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [vue(), process.env.TEILER_UNPLUGIN === '1' && teiler({ minify: true, pure: true })],
    })
  },
}
export default config
