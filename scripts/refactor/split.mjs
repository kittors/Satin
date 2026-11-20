// 把一个 kit-*.js 拆成"库"和"展示页接线"两部分：按顶层声明之间的引用关系算。
// 根：库 = 除 initXxx 以外的导出；展示页 = initXxx（以及 --demo 指定的名字）。只被展示页用到的顶层声明（含演示数据）归展示页；
// 两边都用的归库（展示页从库里 import）。代码原样搬（连同前面的注释），不改一个字。
// 用法：node scripts/refactor/split.mjs 文件 [--demo a,b] [--lib x,y] [--analyze]
import fs from "node:fs";
import * as acorn from "acorn";
import * as walk from "acorn-walk";

export function analyze(src, { demoRoots = [], libRoots = [] } = {}) {
  const comments = [];
  const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "module", onComment: comments, ranges: true });
  const decls = []; // { names, start, end, node, exported, kind }
  const imports = [];
  for (const n of ast.body) {
    if (n.type === "ImportDeclaration") { imports.push({ node: n, names: n.specifiers.map((s) => s.local.name), source: n.source.value, specs: n.specifiers.map((s) => ({ local: s.local.name, imported: s.type === "ImportSpecifier" ? s.imported.name : s.type === "ImportDefaultSpecifier" ? "default" : "*" })) }); continue; }
    let d = n, exported = false;
    if (n.type === "ExportNamedDeclaration" && n.declaration) { d = n.declaration; exported = true; }
    else if (n.type === "ExportNamedDeclaration") { decls.push({ names: [], reexport: n.specifiers.map((s) => [s.local.name, s.exported.name]), start: n.start, end: n.end, node: n, kind: "export-list" }); continue; }
    const names = d.type === "FunctionDeclaration" || d.type === "ClassDeclaration" ? [d.id.name] : d.type === "VariableDeclaration" ? d.declarations.flatMap((x) => (x.id.type === "Identifier" ? [x.id.name] : collectPattern(x.id))) : [];
    decls.push({ names, start: n.start, end: n.end, node: n, exported, kind: d.type === "VariableDeclaration" ? "var" : d.type === "FunctionDeclaration" ? "fn" : d.type === "ClassDeclaration" ? "class" : "stmt" });
  }
  const top = new Set([...decls.flatMap((d) => d.names), ...imports.flatMap((i) => i.names)]);
  for (const d of decls) { const refs = new Set(); walk.full(d.node, (x) => { if (x.type === "Identifier" && top.has(x.name)) refs.add(x.name); }); d.refs = refs; }
  const byName = new Map(); for (const d of decls) for (const nm of d.names) byName.set(nm, d);
  const closure = (roots) => { const set = new Set(), stack = [...roots]; while (stack.length) { const nm = stack.pop(); if (set.has(nm)) continue; set.add(nm); const d = byName.get(nm); if (d) for (const r of d.refs) stack.push(r); } return set; };
  const exported = decls.filter((d) => d.exported).flatMap((d) => d.names).concat(decls.filter((d) => d.kind === "export-list").flatMap((d) => d.reexport.map(([l]) => l)));
  const demoR = new Set([...exported.filter((n) => /^init[A-Z]/.test(n)), ...demoRoots]), libR = new Set([...exported.filter((n) => !demoR.has(n)), ...libRoots]);
  // 顶层语句（document.addEventListener……）：归库（全局行为），它引用的名字也进库
  for (const d of decls) if (d.kind === "stmt") for (const r of d.refs) libR.add(r);
  const lib = closure(libR), demo = closure(demoR);
  for (const d of decls) d.side = d.kind === "stmt" || d.kind === "export-list" ? "lib" : d.names.some((n) => lib.has(n)) ? "lib" : d.names.some((n) => demo.has(n)) ? "demo" : "unused";
  // 每个声明前面的注释（上一个声明结束到这个声明开始之间）跟着它走
  let prevEnd = 0;
  for (const d of [...imports.map((i) => ({ ...i, start: i.node.start, end: i.node.end, isImport: true })), ...decls].sort((a, b) => a.start - b.start)) {
    const own = decls.includes(d) ? d : null;
    if (own) { const cs = comments.filter((c) => c.start >= prevEnd && c.end <= d.start); own.lead = cs.length ? cs[0].start : d.start; }
    prevEnd = d.end;
  }
  return { ast, decls, imports, lib, demo, demoR, libR, comments };
}
function collectPattern(p) { const out = []; walk.full(p, (x) => { if (x.type === "Identifier") out.push(x.name); }); return out; }

if (import.meta.url === `file://${process.argv[1]}`) {
  const f = process.argv[2], src = fs.readFileSync(f, "utf8"), arg = (k) => { const i = process.argv.indexOf("--" + k); return i > 0 ? process.argv[i + 1].split(",") : []; };
  const r = analyze(src, { demoRoots: arg("demo"), libRoots: arg("lib") });
  const show = (side) => r.decls.filter((d) => d.side === side).map((d) => d.names.join(",") || d.kind).join(" ");
  console.log(`## ${f}\n  库：${show("lib")}\n  展示页：${show("demo")}\n  没用到：${show("unused")}`);
  // 展示页代码用到的库名字（要从库模块 import）
  const demoUses = new Set(); for (const d of r.decls.filter((x) => x.side === "demo")) for (const n of d.refs) if (r.decls.some((x) => x.side === "lib" && x.names.includes(n))) demoUses.add(n);
  console.log(`  展示页从库里要用：${[...demoUses].join(" ")}`);
  const libImp = new Set(), demoImp = new Set();
  for (const i of r.imports) for (const n of i.names) { if (r.decls.some((d) => d.side === "lib" && d.refs.has(n))) libImp.add(`${n}←${i.source}`); if (r.decls.some((d) => d.side === "demo" && d.refs.has(n))) demoImp.add(`${n}←${i.source}`); }
  console.log(`  库的导入：${[...libImp].join(" ")}\n  展示页的导入：${[...demoImp].join(" ")}`);
}
