import js from "@eslint/js"
import tsParser from "@typescript-eslint/parser"

export default [
  {
    files: ["**/*.{js,cjs,mjs}"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        Buffer: "readonly",
      },
    },
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        fetch: "readonly",
        RequestInit: "readonly",
        URLSearchParams: "readonly",
        Crypto: "readonly",
        Headers: "readonly",
        TextEncoder: "readonly",
        Buffer: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-empty": "off",
    },
  },
]

