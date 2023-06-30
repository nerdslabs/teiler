module.exports = {
  stories: ['../stories/*.stories.mdx', '../stories/*.stories.@(js|jsx|ts|tsx)'],
  framework: "@storybook/html-vite",
  refs: {
    svelte: {
      title: 'Svelte',
      url: 'http://localhost:6006',
    },
  },
}
