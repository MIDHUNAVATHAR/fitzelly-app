import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  // Ignore build and config files
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "*.config.js",
      "*.config.ts"
    ],
  },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { "argsIgnorePattern": "^_" }
      ],
      "no-console": "off"
    }
  }
];
