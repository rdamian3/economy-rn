module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  plugins: ['react'],
  rules: {
    'linebreak-style': 0,
    'import/no-cycle': 0,
    'no-underscore-dangle': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/no-did-update-set-state': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'react/no-string-refs': 0,
    'react/forbid-prop-types': 0,
    'no-alert': 0,
    'operator-linebreak': 0,
    'react/jsx-curly-newline': 0,
    'react/prop-types': 0,
    'implicit-arrow-linebreak': 0,
  },
};
