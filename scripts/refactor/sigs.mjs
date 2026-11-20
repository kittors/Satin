// 列出库里每个导出函数的参数和返回值写法（为统一 API 做准备）
import fs from "node:fs"; import * as acorn from "acorn"; import * as walk from "acorn-walk";
for (const f of process.argv.slice(2)) {
  const src = fs.readFileSync(f, "utf8"), ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "module" });
  for (const n of ast.body) {
    if (n.type !== "ExportNamedDeclaration" || !n.declaration) continue;
    const d = n.declaration;
    const fns = d.type === "FunctionDeclaration" ? [[d.id.name, d]] : d.type === "VariableDeclaration" ? d.declarations.filter((x) => x.init && /Function/.test(x.init.type)).map((x) => [x.id.name, x.init]) : [];
    for (const [name, fn] of fns) {
      const params = src.slice(fn.params[0]?.start ?? fn.start, fn.params.at(-1)?.end ?? fn.start).replace(/\s+/g, " ").slice(0, 110);
      const rets = []; walk.simple(fn.body, { ReturnStatement(r) { if (r.argument) rets.push(src.slice(r.argument.start, Math.min(r.argument.end, r.argument.start + 60)).replace(/\s+/g, " ")); } });
      console.log(`${f.split("/").pop().padEnd(16)} ${name}(${params}) → ${rets.slice(-1)[0] || "—"}`);
    }
  }
}
