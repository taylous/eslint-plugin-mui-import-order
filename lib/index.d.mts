import type { Linter } from "eslint";

type RulesRecord = NonNullable<Linter.Plugin["rules"]>;

declare const muiImportOrderPlugin: Linter.Plugin & {
  readonly meta: {
    readonly name: string;
    readonly version: string;
  };
  readonly rules: RulesRecord;
};

export default muiImportOrderPlugin;
export declare const meta: typeof muiImportOrderPlugin.meta;
export declare const rules: RulesRecord;
