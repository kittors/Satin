// 一次性改写：模块顶层的取词函数 const t = scoped(...) 改名 tt，连同它的所有引用；
// 原来被局部变量 t 挡住的 t("模块.序号") 调用（运行时 "t is not a function"）也一并改成 tt。按 ESLint 的作用域分析改，不按字面替换。
// 用法：node scripts/refactor/i18n-rename.mjs [--dry]
import fs from "node:fs";
import path from "node:path";
import { Linter } from "eslint";

const ROOT = path.resolve(import.meta.dirname, "../..");
const NEW = "tt", KEY = /^[a-z][a-z0-9-]*\.\d+$/, DRY = process.argv.includes("--dry");
const files = [];
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith(".js")) files.push(p); } };
for (const d of ["packages/satin-ui/src", "packages/satin-ui/react", "packages/satin-ui/vue", "packages/satin-ui/elements"]) walk(path.join(ROOT, d));

let edits = null;
const rule = {
  meta: { type: "problem", schema: [] },
  create(context) {
    const calls = [];
    return {
      CallExpression(node) { const a = node.arguments[0]; if (node.callee.type === "Identifier" && node.callee.name === "t" && a?.type === "Literal" && typeof a.value === "string" && KEY.test(a.value)) calls.push(node); },
      "Program:exit"() {
        const sm = context.sourceCode.scopeManager, mod = sm.scopes.find((s) => s.type === "module");
        const v = mod?.set.get("t"), init = v?.defs[0]?.node?.init;
        if (!v || init?.type !== "CallExpression" || init.callee.name !== "scoped") return;
        if (mod.set.get(NEW)) throw new Error(context.filename + " 里已经有 " + NEW);
        const ids = new Set([...v.identifiers, ...v.references.map((r) => r.identifier)]);
        for (const c of calls) ids.add(c.callee); // 被局部变量挡住的那些也改：它们本来要调的就是取词函数
        for (const id of ids) edits.push(id.range);
      },
    };
  },
};
const linter = new Linter({ configType: "flat" });
const config = [{ files: ["**/*.js"], languageOptions: { ecmaVersion: "latest", sourceType: "module" }, plugins: { x: { rules: { r: rule } } }, rules: { "x/r": "error" }, linterOptions: { reportUnusedDisableDirectives: "off" } }];
let total = 0;
for (const f of files) {
  const src = fs.readFileSync(f, "utf8"); edits = [];
  const msgs = linter.verify(src, config, { filename: f }).filter((m) => m.fatal || m.ruleId === "x/r");
  if (msgs.length) { console.log("  ! " + path.relative(ROOT, f), msgs.map((m) => m.message)); continue; }
  if (!edits.length) continue;
  // 去重、从后往前改
  const uniq = [...new Map(edits.map((r) => [r[0], r])).values()].sort((a, b) => b[0] - a[0]);
  let out = src; for (const [s, e] of uniq) { if (out.slice(s, e) !== "t") throw new Error(`${f}@${s}: 不是 t：${out.slice(s, e)}`); out = out.slice(0, s) + NEW + out.slice(e); }
  total += uniq.length; console.log(`  ${path.relative(ROOT, f)}：${uniq.length} 处`);
  if (!DRY) fs.writeFileSync(f, out);
}
console.log(`${DRY ? "（试跑）" : ""}共改 ${total} 处`);
