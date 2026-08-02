module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['app/frontend/**/*.{js,jsx}'],
      env: { browser: true, es2022: true },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      plugins: ['react', 'react-hooks'],
      extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
      settings: { react: { version: 'detect' } },
    },
    {
      files: ['**/*.test.js', '**/*.test.jsx'],
      env: { jest: true },
    },
  ],
};
