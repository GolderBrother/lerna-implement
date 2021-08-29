module.exports = {
  parserOptions: { ecmaVersion: 2017, sourceType: "module" },
  extends: ["eslint:recommended"],
  rules: {
    "no-unused-vars": ["off"],
  },
  env: { node: true, jest: false },
};