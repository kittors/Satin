import fs from "node:fs"; import * as acorn from "acorn"; import * as walk from "acorn-walk";
for (const f of process.argv.slice(2)) {
  const src = fs.readFileSync(f, "utf8"), ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "module" });
  const imported = new Set(ast.body.filter((n) => n.type === "ImportDeclaration").flatMap((n) => n.specifiers.map((s) => s.local.name)));
  walk.full(ast, (n) => {
    const t = n.type === "AssignmentExpression" ? n.left : n.type === "UpdateExpression" ? n.argument : null;
    if (t?.type === "Identifier" && imported.has(t.name)) console.log(`${f}:${src.slice(0, n.start).split("\n").length} 给导入的 ${t.name} 赋值`);
  });
}
