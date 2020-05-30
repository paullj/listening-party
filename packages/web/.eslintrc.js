module.exports = {
  env: { browser: true },
  extends: ['semistandard'],
  plugins: ['svelte3'],
  //   parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 2, maxEOF: 0 }],
        'import/first': 'off',
        'import/no-duplicates': 'off',
        'import/no-mutable-exports': 'off',
        'import/no-unresolved': 'off'
      }
    }
    // {
    //   files: ['**/*.spec.*', '**/*.test.*'],
    //   env: { jest: true }
    // }
  ]
};
