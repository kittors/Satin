// 静态检查：每个模块的 import 都找得到文件，导入的名字对方都导出了（不用跑浏览器）
import fs from "node:fs";
import path from "node:path";
import * as acorn from "acorn";

const ROOT = path.resolve(import.meta.dirname, "../..");
const dirs = process.argv.slice(2).length ? process.argv.slice(2) : ["packages/satin-ui/src", "demo", "site"];
const files = []; const rec = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== "node_modules") rec(p); } else if (/\.(m?js)$/.test(e.name)) files.push(p); } };
for (const d of dirs) if (fs.existsSync(path.join(ROOT, d))) rec(path.join(ROOT, d));
const cache = new Map();
const exportsOf = (f) => {
  if (cache.has(f)) return cache.get(f);
  const ast = acorn.parse(fs.readFileSync(f, "utf8"), { ecmaVersion: "latest", sourceType: "module" }), names = new Set();
  for (const n of ast.body) {
    if (n.type === "ExportNamedDeclaration") { if (n.declaration) { const d = n.declaration; if (d.id) names.add(d.id.name); if (d.declarations) for (const x of d.declarations) if (x.id.name) names.add(x.id.name); } for (const s of n.specifiers || []) names.add(s.exported.name); }
    if (n.type === "ExportDefaultDeclaration") names.add("default");
    if (n.type === "ExportAllDeclaration") names.add("*");
  }
  cache.set(f, names); return names;
};
let bad = 0;
for (const f of files) {
  let ast; try { ast = acorn.parse(fs.readFileSync(f, "utf8"), { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { console.log(`✗ ${path.relative(ROOT, f)} 语法：${e.message}`); bad++; continue; }
  for (const n of ast.body) {
    if (n.type !== "ImportDeclaration" && !(n.type === "ExportNamedDeclaration" && n.source)) continue;
    const spec = n.source.value; if (!spec.startsWith(".")) continue;
    const target = path.resolve(path.dirname(f), spec);
    if (!fs.existsSync(target)) { console.log(`✗ ${path.relative(ROOT, f)}：找不到 ${spec}`); bad++; continue; }
    const ex = exportsOf(target);
    for (const s of n.specifiers || []) { const nm = s.type === "ImportSpecifier" ? s.imported.name : s.type === "ExportSpecifier" ? s.local.name : null; if (nm && !ex.has(nm) && !ex.has("*")) { console.log(`✗ ${path.relative(ROOT, f)}：${spec} 没有导出 ${nm}`); bad++; } }
  }
}
console.log(`import 检查：${files.length} 个文件，${bad ? bad + " 处问题" : "全部找得到"}`);
process.exitCode = bad ? 1 : 0;
