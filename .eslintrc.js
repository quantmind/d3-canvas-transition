const OFF = 0;
const ERROR = 2;

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },

  parserOptions: {
    sourceType: "module",
  },

  extends: ["eslint:recommended"],

  rules: {
    "no-cond-assign": OFF,
    "no-floating-decimal": ERROR,
    "no-trailing-spaces": ERROR,
    "no-multiple-empty-lines": [ERROR, { max: 2, maxEOF: 0 }],
    "eol-last": ERROR,
    semi: ERROR,
    complexity: [ERROR, { max: 18 }],
  },
};
