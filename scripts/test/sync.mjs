// 生成物和源头是否一致（改了源头忘了重新生成，这里会报出来）：
// · packages/satin-ui/css/tokens.css      ← spec/tokens/*.tokens.json（scripts/tokens/build.mjs）
// · packages/satin-ui/tokens/*            ← spec/tokens/*（发布包里带一份令牌 JSON，给设计工具、Style Dictionary 用）
// · packages/satin-ui/src/theme-boot-script.js ← src/theme-boot.js（同一段脚本的字符串版，服务端渲染时内联）
// 用法：node scripts/test/sync.mjs          只检查，不一致退出码 1
//       node scripts/test/sync.mjs --write  按源头重新生成
import fs from "node:fs";
import path from "node:path";
import { buildCSS } from "../tokens/build.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const PKG = path.join(ROOT, "packages/satin-ui");
const write = process.argv.includes("--write");
const want = new Map(); // 目标文件 → 应有内容

// 1. tokens.css：和 build.mjs --out 写出的一模一样（整体放进 @layer satin）
const raw = buildCSS({ prefix: "sn-" });
want.set(path.join(PKG, "css/tokens.css"), raw.replace(/^(\/\*[^\n]*\*\/\n)/, "$1@layer satin {\n") + "}\n");

// 2. 令牌 JSON：逐个文件照抄
const SPEC = path.join(ROOT, "spec/tokens");
for (const f of fs.readdirSync(SPEC).filter((f) => f.endsWith(".json"))) want.set(path.join(PKG, "tokens", f), fs.readFileSync(path.join(SPEC, f), "utf8"));

// 3. theme-boot 的字符串版：取 theme-boot.js 里从 "(() =>" 起的原文
const boot = fs.readFileSync(path.join(PKG, "src/theme-boot.js"), "utf8");
const body = boot.slice(boot.indexOf("(() =>")).trimEnd() + "\n";
want.set(path.join(PKG, "src/theme-boot-script.js"),
  "// theme-boot.js 的字符串版：服务端渲染、构建工具里要把它内联进 <head> 时用（Next.js 的 layout、Nuxt 的 app.head、Vite 的 transformIndexHtml）。\n" +
  "// 由 scripts/test/sync.mjs 校验和 theme-boot.js 一字不差；改 theme-boot.js 后跑一次 node scripts/test/sync.mjs --write\n" +
  "export default " + JSON.stringify(body) + ";\n");

// 4. 检查器自带的规则快照（技能拷到别处也能跑）：和 spec/rules/anti-ai.json 一致
want.set(path.join(ROOT, "skills/satin/scripts/lib/rules.snapshot.json"), fs.readFileSync(path.join(ROOT, "spec/rules/anti-ai.json"), "utf8"));

// 5. 检查器的"存在的 --sn-* 变量"快照：库样式和脚本里出现过的全部 --sn-* 名字（令牌 + 组件变量 + 脚本写的）
{
  const names = new Set();
  const walkDir = (d) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) { if (f.name !== "node_modules" && f.name !== "locales") walkDir(p); } else if (/\.(css|js)$/.test(f.name)) for (const m of fs.readFileSync(p, "utf8").matchAll(/--sn-[\w-]+/g)) names.add(m[0].replace(/-+$/, "")); } };
  for (const d of ["css", "src", "react", "vue", "elements"]) walkDir(path.join(PKG, d));
  want.set(path.join(ROOT, "skills/satin/scripts/lib/vars.snapshot.json"), JSON.stringify([...names].sort(), null, 0) + "\n");
}

// 6. 检查器的"存在的 sn- 类名"快照：库样式的选择器里、脚本的字符串里出现过的 sn- 类名
{
  const names = new Set();
  const walkDir = (d) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) { if (f.name !== "node_modules" && f.name !== "locales") walkDir(p); } else if (f.name.endsWith(".css")) { for (const m of fs.readFileSync(p, "utf8").matchAll(/\.(sn-[\w-]+)/g)) names.add(m[1]); } else if (f.name.endsWith(".js")) { for (const m of fs.readFileSync(p, "utf8").matchAll(/(?<![\w-])(sn-[a-z0-9-]+)/g)) if (!m[1].endsWith("-")) names.add(m[1]); } } };
  for (const d of ["css", "src", "react", "vue", "elements"]) walkDir(path.join(PKG, d));
  // 设计稿标记里出现的 sn- 类（技能的参考文档照它抄）也算
  for (const m of fs.readFileSync(path.join(ROOT, "index.html"), "utf8").matchAll(/class="([^"]*)"/g)) for (const c of m[1].split(/\s+/)) if (/^sn-[a-z0-9-]+$/.test(c)) names.add(c);
  want.set(path.join(ROOT, "skills/satin/scripts/lib/classes.snapshot.json"), JSON.stringify([...names].sort(), null, 0) + "\n");
}

// 包里多出来的令牌文件（源头已经删了）也算不一致
const extra = fs.existsSync(path.join(PKG, "tokens")) ? fs.readdirSync(path.join(PKG, "tokens")).map((f) => path.join(PKG, "tokens", f)).filter((f) => !want.has(f)) : [];

let bad = 0;
for (const [file, content] of want) {
  const cur = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  if (cur === content) continue;
  if (write) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); console.log("  重新生成", path.relative(ROOT, file)); }
  else { bad++; console.log("  ✗ 和源头不一致：", path.relative(ROOT, file), cur === null ? "（文件不存在）" : ""); }
}
for (const f of extra) {
  if (write) { fs.unlinkSync(f); console.log("  删除多余的", path.relative(ROOT, f)); }
  else { bad++; console.log("  ✗ 源头里没有：", path.relative(ROOT, f)); }
}
console.log(write ? `生成物已按源头更新（${want.size} 个文件）` : `生成物检查：${want.size} 个文件，${bad ? bad + " 个不一致（跑 node scripts/test/sync.mjs --write）" : "全部一致"}`);
process.exitCode = bad ? 1 : 0;
