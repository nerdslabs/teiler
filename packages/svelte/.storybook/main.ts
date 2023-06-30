import type { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
  stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-svelte-csf', '@storybook/addon-interactions', '@storybook/addon-mdx-gfm'],
  features: {
    buildStoriesJson: true
  },
  typescript: {
    check: false,
  },
  framework: '@storybook/svelte-vite',
  docs: {
    autodocs: true
  },
  async viteFinal(config, options) {
    return config
  },
};

export default config