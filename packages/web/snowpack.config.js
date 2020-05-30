module.exports = {
  extends: '@snowpack/app-scripts-svelte',
  scripts: {
    'build:css': 'postcss'
  },
  plugins: [],
  installOptions: {
    rollup: {
      plugins: [require('rollup-plugin-svelte')()]
    }
  }
};
