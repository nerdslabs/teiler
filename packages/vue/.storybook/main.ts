import type { StorybookConfig } from '@storybook/vue3-vite'

import { join, dirname } from 'path'
import { mergeConfig } from 'vite'

import vue from '@vitejs/plugin-vue'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
const config: StorybookConfig = {
  stories: ['../**/*.mdx', '../**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [getAbsolutePath('@storybook/addon-links'), getAbsolutePath('@storybook/addon-essentials'), getAbsolutePath('@chromatic-com/storybook'), getAbsolutePath('@storybook/addon-interactions')],
  framework: {
    name: getAbsolutePath('@storybook/vue3-vite'),
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config, options) {
    return mergeConfig(config, {
      plugins: [vue()],
    })
  }
}
export default config
