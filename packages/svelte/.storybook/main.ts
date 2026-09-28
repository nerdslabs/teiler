import type { StorybookConfig } from '@storybook/svelte-vite'

import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const resolve = (name: string) => dirname(fileURLToPath(import.meta.resolve(`${name}/package.json`)))

const config: StorybookConfig = {
  stories: ['../stories/*.mdx', '../stories/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [resolve('@storybook/addon-links'), resolve('@chromatic-com/storybook')],
  framework: {
    name: resolve('@storybook/svelte-vite'),
    options: {},
  },
}
export default config
