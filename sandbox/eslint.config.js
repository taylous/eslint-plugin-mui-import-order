import parser from "@typescript-eslint/parser";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const muiImportOrderPlugin = require("../lib");

const config = [
  {
    ignores: ["node_modules/", "dist/"],
  },
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "mui-import-order": muiImportOrderPlugin,
    },
    rules: {
      "mui-import-order/no-barrel-import": "warn",
    },
  },
];

export default config;
