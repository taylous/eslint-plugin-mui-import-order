const { name, version } = require("../package.json");

const muiImportOrderPlugin = {
  meta: { name, version },
  rules: {
    "no-barrel-import": require("./rules/no-barrel-import"),
  },
};

module.exports = muiImportOrderPlugin;
