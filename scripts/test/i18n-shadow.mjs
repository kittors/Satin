// 多语言取词函数被局部变量挡住：模块顶层 const tt = scoped(...)，函数里又有一个同名的局部变量（原来叫 t 时出过 37 处：const t = T.get() 之类），
// 这个函数里的 tt("模块.序号") 调到的就是局部变量 → 运行时报 "is not a function"。抽文案的脚本按字面替换，看不出作用域，这里按作用域查。
// 用法：node scripts/test/i18n-shadow.mjs [--dir 目录]   （默认查 packages/satin-ui 和 demo 下所有 .js，有问题退出码 1）
import fs from "node:fs";
import path from "node:path";
import { Linter } from "eslint";

const ROOT = path.resolve(import.meta.dirname, "../..");
const DIRS = ["packages/satin-ui/src", "packages/satin-ui/react", "packages/satin-ui/vue", "packages/satin-ui/elements", "demo"];
const KEY = /^[a-z][a-z0-9-]*\.\d+$/;
let visited = 0; // 规则真的跑过的文件数：配置没匹配上时 ESLint 只给一条提示、不跑规则，不能当成通过
const rule = {
  meta: { type: "problem", schema: [] },
  create(context) {
    const calls = [];
    return {
      CallExpression(node) { const a = node.arguments[0]; if (a?.type === "Literal" && typeof a.value === "string" && KEY.test(a.value)) calls.push(node); },
      "Program:exit"() {
        visited++;
        // 模块顶层用 scoped(...) 得到的取词函数（叫什么名字都行）
        const mod = context.sourceCode.scopeManager.scopes.find((s) => s.type === "module");
        const fn = mod && [...mod.set.values()].find((v) => { const i = v.defs[0]?.node?.init; return i?.type === "CallExpression" && i.callee.name === "scoped"; });
        if (!fn) return;
        for (const node of calls) {
          const c = node.callee, key = node.arguments[0].value;
          if (c.type !== "Identifier") continue; // 对象方法之类（比如 map.get("a.1")）不是取词
          // 从调用处往外找这个名字的绑定：必须正好是模块顶层那个取词函数
          let v = null; for (let s = context.sourceCode.getScope(node); s && !v; s = s.upper) v = s.set.get(c.name) || null;
          if (v === fn) continue;
          if (c.name !== fn.name && !v) continue; // 别的全局函数（不是取词）
          context.report({ node, message: `${c.name}("${key}") 调到的是 ${v ? `第 ${v.defs[0]?.name?.loc?.start.line} 行的局部变量 ${c.name}` : "未定义的名字"}，不是模块顶层的取词函数 ${fn.name}` });
        }
      },
    };
  },
};
const linter = new Linter({ configType: "flat", cwd: "/" }); // 基准目录设成根：绝对路径都在"里面"，不会因为在当前目录外被跳过
const config = [{ files: ["**/*.js"], languageOptions: { ecmaVersion: "latest", sourceType: "module" }, plugins: { satin: { rules: { "i18n-shadow": rule } } }, rules: { "satin/i18n-shadow": "error" }, linterOptions: { reportUnusedDisableDirectives: "off" } }];
let bad = 0, files = 0;
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith(".js")) check(p); } };
function check(file) {
  files++;
  const msgs = linter.verify(fs.readFileSync(file, "utf8"), config, { filename: file });
  for (const m of msgs.filter((x) => x.fatal || x.ruleId === "satin/i18n-shadow" || !x.ruleId)) { bad++; console.log(`  ✗ ${path.relative(ROOT, file)}:${m.line} ${m.message}`); }
}
const ONLY = process.argv.includes("--dir") ? [path.resolve(process.argv[process.argv.indexOf("--dir") + 1])] : DIRS.map((d) => path.join(ROOT, d));
for (const d of ONLY) if (fs.existsSync(d)) walk(d);
if (visited !== files) { bad++; console.log(`  ✗ 只有 ${visited} / ${files} 个文件真的查过`); }
console.log(bad ? `取词函数被挡：${bad} 处` : `取词函数被挡：${files} 个文件 0 处`);
process.exitCode = bad ? 1 : 0;
