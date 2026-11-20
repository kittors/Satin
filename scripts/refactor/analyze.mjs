// 列出每个模块：导出、导入、顶层副作用（不是纯声明的顶层语句）、initX（展示页接线）函数
import fs from "node:fs";
import * as acorn from "acorn";
const files = process.argv.slice(2);
for (const f of files) {
  const src = fs.readFileSync(f, "utf8"), ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "module" });
  const exp = [], imp = [], side = [];
  const pure = (n) => !n || ["Literal", "ArrowFunctionExpression", "FunctionExpression", "TemplateLiteral", "Identifier", "ClassExpression"].includes(n.type) || (n.type === "ArrayExpression" && n.elements.every((e) => !e || pure(e))) || (n.type === "ObjectExpression" && n.properties.every((p) => p.type === "Property" && pure(p.value))) || (n.type === "UnaryExpression") || (n.type === "BinaryExpression" && pure(n.left) && pure(n.right)) || (n.type === "MemberExpression" && pure(n.object)) || (n.type === "NewExpression" && ["Map", "Set", "WeakMap", "WeakSet"].includes(n.callee.name) && n.arguments.length === 0) || (n.type === "CallExpression" && ["Object.freeze", "bezier", "Symbol"].includes(src.slice(n.callee.start, n.callee.end)));
  const line = (n) => src.slice(0, n.start).split("\n").length;
  for (const n of ast.body) {
    if (n.type === "ImportDeclaration") { imp.push(`${n.source.value}{${n.specifiers.map((s) => s.local.name).join(",")}}`); continue; }
    let d = n;
    if (n.type === "ExportNamedDeclaration") { if (n.declaration) { d = n.declaration; if (d.type === "FunctionDeclaration") exp.push(d.id.name); else if (d.type === "VariableDeclaration") exp.push(...d.declarations.map((x) => x.id.name || "?")); } else exp.push(...n.specifiers.map((s) => s.exported.name)); if (!n.declaration) continue; }
    if (d.type === "FunctionDeclaration" || d.type === "ClassDeclaration") continue;
    if (d.type === "VariableDeclaration") { for (const x of d.declarations) if (!pure(x.init)) side.push(`L${line(x)} ${x.id.name || "{..}"} = ${src.slice(x.init.start, Math.min(x.init.end, x.init.start + 70)).replace(/\s+/g, " ")}`); continue; }
    side.push(`L${line(n)} ${src.slice(n.start, Math.min(n.end, n.start + 90)).replace(/\s+/g, " ")}`);
  }
  console.log(`\n## ${f}  (${(src.length / 1024).toFixed(1)}KB)\n  导出: ${exp.join(", ")}\n  导入: ${imp.join(" ")}\n  顶层副作用:\n    ${side.join("\n    ") || "无"}`);
}
