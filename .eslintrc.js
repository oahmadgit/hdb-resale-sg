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
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
      },
      settings: { react: { version: 'detect' } },
    },
    {
      files: ['app/frontend/**/*.test.{js,jsx}'],
      env: { browser: true, es2022: true, node: true },
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        vi: 'readonly',
      },
    },
    {
      files: ['app/backend/**/*.test.js'],
      env: { jest: true },
    },
  ],
};
