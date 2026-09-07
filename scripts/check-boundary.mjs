import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
const root = "packages/engine";
const manifest = JSON.parse(fs.readFileSync(`${root}/package.json`, "utf8"));
if (Object.keys(manifest.dependencies ?? {}).length)
  throw new Error("Engine must remain dependency-free.");
for (const directory of ["src", "test"]) {
  for (const name of fs.readdirSync(`${root}/${directory}`)) {
    if (!name.endsWith(".ts")) continue;
    const filename = `${root}/${directory}/${name}`;
    const ast = ts.createSourceFile(
      filename,
      fs.readFileSync(filename, "utf8"),
      ts.ScriptTarget.Latest,
    );
    function visit(node) {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
        const specifier = node.moduleSpecifier.text;
        if (directory === "test" && specifier === "vitest") return;
        if (
          !specifier.startsWith(".") ||
          !path.resolve(path.dirname(filename), specifier).startsWith(path.resolve(root) + path.sep)
        )
          throw new Error(`Engine boundary violation: ${filename} → ${specifier}`);
      }
      ts.forEachChild(node, visit);
    }
    visit(ast);
  }
}
console.log("Engine boundary verified: local domain imports only; no production dependencies.");
