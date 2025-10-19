/** @type {import("eslint").Rule.RuleModule} */
const noBarrelImportRule = {
  meta: {
    type: "problem",
    docs: {
      description: "barrel imports increase build times in development builds.",
      url: "https://mui.com/material-ui/guides/minimizing-bundle-size/",
    },
    fixable: "code",
    messages: {
      noBarrelImport:
        "Replace named imports from '{{moduleName}}' with default imports to minimize bundle size.",
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      ImportDeclaration(node) {
        if (!node.source || typeof node.source.value !== "string") {
          return;
        }

        const moduleName = node.source.value;
        const packageSegments = moduleName.split("/");

        if (
          !moduleName.startsWith("@mui/") ||
          packageSegments.length !== 2 ||
          node.importKind === "type"
        ) {
          return;
        }

        const namedSpecifiers = node.specifiers.filter(
          (specifier) => specifier.type === "ImportSpecifier"
        );

        if (
          namedSpecifiers.length === 0 ||
          namedSpecifiers.length !== node.specifiers.length ||
          namedSpecifiers.some((specifier) => specifier.importKind === "type")
        ) {
          return;
        }

        const convertibleSpecifiers = namedSpecifiers.filter((specifier) => {
          return specifier.imported && /^[A-Z]/.test(specifier.imported.name);
        });

        if (
          convertibleSpecifiers.length === 0 ||
          convertibleSpecifiers.length !== namedSpecifiers.length
        ) {
          return;
        }

        context.report({
          node,
          messageId: "noBarrelImport",
          data: {
            moduleName,
          },
          fix(fixer) {
            const lineText = sourceCode.lines[node.loc.start.line - 1] || "";
            const indentation = lineText.match(/^\s*/)?.[0] || "";
            const quote = sourceCode.getText(node.source).charAt(0) || "'";

            const statements = namedSpecifiers.map((specifier) => {
              const localName = specifier.local.name;
              const importedName = specifier.imported.name;
              const newSource = `${moduleName}/${importedName}`;
              const literal = `${quote}${newSource}${quote}`;

              return `${indentation}import ${localName} from ${literal};`;
            });

            return fixer.replaceText(node, statements.join("\n"));
          },
        });
      },
    };
  },
};

module.exports = noBarrelImportRule;
