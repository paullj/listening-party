module.exports = {
  extends: '@snowpack/app-scripts-svelte',
  scripts: {
    'build:css': 'postcss'
  },
  plugins: ['@snowpack/plugin-dotenv'],
  installOptions: {
    rollup: {
      plugins: [require('rollup-plugin-svelte')()]
    }
  }
};
