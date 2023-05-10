module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "prettier", "eslint:recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "react-hooks"],
  globals: {
    JSX: "readonly",
  },
  rules: {
    // note you must disable the base rule as it can report incorrect errors
    "no-use-before-define": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "prefer-const": [
      "error",
      {
        destructuring: "all",
      },
    ],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-restricted-imports": [
      "warn",
      {
        name: "react-redux",
        importNames: ["useSelector", "useDispatch"],
        message:
          "Use typed hooks `useAppDispatch` and `useAppSelector` instead.",
      },
    ],
    "no-restricted-syntax": [
      "error",
      {
        message:
          "Do not override parseInt DOM function",
        selector: "VariableDeclaration [id.name='parseInt']",
      },
      "error",
      {
        message:
          "Use app version of function instead - parseAppInt, with already specified radix",
        selector: 'CallExpression[callee.name="parseInt"]',
      },
    ],
  },
};
