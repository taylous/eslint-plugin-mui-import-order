import { name, version } from "../package.json";

const plugin = {
  meta: { name, version },
  rules: {
    "no-barrel-import": require("./rules/no-barrel-import"),
  },
};

export default plugin;
