const path = require("node:path");

const eslintModulePath = require.resolve("eslint", {
  paths: [path.resolve(__dirname, "../sandbox/node_modules")],
});
const { RuleTester } = require(eslintModulePath);
const tsParserPath = require.resolve("@typescript-eslint/parser", {
  paths: [path.resolve(__dirname, "../sandbox/node_modules")],
});
const tsParser = require(tsParserPath);

const rule = require("../lib/rules/no-barrel-import");

RuleTester.describe = (text, method) => {
  method();
};

RuleTester.describeSkip = () => {};
RuleTester.describeOnly = (text, method) => {
  method();
};
RuleTester.it = (text, method) => {
  method();
};
RuleTester.itOnly = (text, method) => {
  method();
};
RuleTester.itSkip = () => {};

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: "latest",
    sourceType: "module",
  },
});

ruleTester.run("no-barrel-import", rule, {
  valid: [
    "import { Box } from 'not-mui';",
    "import type { BoxProps } from '@mui/material';",
    "import { useTheme } from '@mui/material/styles';",
    "import { Box, useTheme } from '@mui/material';",
    "import Box from '@mui/material/Box';",
  ],
  invalid: [
    {
      code: "import { Box } from '@mui/material';",
      output: "import Box from '@mui/material/Box';",
      errors: [
        {
          messageId: "noBarrelImport",
          data: { moduleName: "@mui/material" },
        },
      ],
    },
    {
      code: "import { Box, Stack as MuiStack } from '@mui/material';",
      output: [
        "import Box from '@mui/material/Box';",
        "import MuiStack from '@mui/material/Stack';",
      ].join("\n"),
      errors: [
        {
          messageId: "noBarrelImport",
          data: { moduleName: "@mui/material" },
        },
      ],
    },
    {
      code: "import { Add, Remove } from '@mui/icons-material';",
      output: [
        "import Add from '@mui/icons-material/Add';",
        "import Remove from '@mui/icons-material/Remove';",
      ].join("\n"),
      errors: [
        {
          messageId: "noBarrelImport",
          data: { moduleName: "@mui/icons-material" },
        },
      ],
    },
  ],
});
