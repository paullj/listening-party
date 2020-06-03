module.exports = {
  env: { node: true },
  extends: [
    'semistandard',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  overrides: [
    {
      files: ['**/*.spec.*', '**/*.test.*'],
      env: { jest: true }
    }
  ]
};
