module.exports = {
  stories: ['../src/components/**/*.stories.tsx'],
  staticDirs: ['../public'],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "@storybook/addon-backgrounds",
    "@storybook/addon-themes",
  ],
  docs: {
    autodocs: "tag",
  },
  framework: "@storybook/react-vite",
};