module.exports = {
  stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  // staticDirs: ["../public"],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-svelte-csf', '@storybook/addon-interactions'],
  features: {
    postcss: false,
    interactionsDebugger: true,
    buildStoriesJson: true,
  },
  typescript: {
    check: false,
    reactDocgen: 'none',
  },
  framework: '@storybook/svelte',
  svelteOptions: {
    preprocess: require('svelte-preprocess')(),
  },
}
