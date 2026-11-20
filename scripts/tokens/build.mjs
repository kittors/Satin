// 令牌 JSON（spec/tokens，W3C DTCG 格式）→ CSS 变量。
// 用法：node scripts/tokens/build.mjs [--prefix sn-] [--out 文件]   （--prefix "" 生成不带前缀的原名，用来和改造前逐个比对）
// 也可以 import { buildCSS } 拿字符串
import fs from "node:fs";
import path from "node:path";

const SPEC = path.join(import.meta.dirname, "../../spec/tokens");
const fmtNum = (n) => { const s = String(+n); return s.replace(/^(-?)0\./, "$1."); };
// 读全部令牌：路径 → 变量名；以及每个模式里的 [路径, 令牌]
export function loadTokens(dir = SPEC) {
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8")), modes = [], varOf = new Map();
  for (const m of manifest.order) {
    const doc = JSON.parse(fs.readFileSync(path.join(dir, m.file), "utf8")), toks = [];
    const walk = (o, p) => { for (const [k, v] of Object.entries(o)) { if (k.startsWith("$")) continue; const q = p ? p + "." + k : k; if (v && typeof v === "object" && "$value" in v) { toks.push([q, v]); varOf.set(q, v.$extensions["com.satin"].var); } else if (v && typeof v === "object") walk(v, q); } };
    walk(doc, ""); modes.push({ ...m, toks });
  }
  return { manifest, modes, varOf };
}
export function cssValue(tok, varOf, prefix = "") {
  const ref = (s) => String(s).replace(/\{([\w.]+)\}/g, (_, p) => { const v = varOf.get(p); if (!v) throw new Error("找不到别名 " + p); return `var(--${prefix}${v.slice(2)})`; });
  const v = tok.$value;
  // 字体名原来带引号的照样带（"STSong" 和 STSong 在变量里是两种写法）
  if (tok.$type === "fontFamily" && Array.isArray(v)) { const q = tok.$extensions?.["com.satin"]?.quoted; return v.map((f, i) => ((q ? q[i] : /\s/.test(f)) ? `"${f}"` : f)).join(", "); }
  if (tok.$type === "cubicBezier" && Array.isArray(v)) return `cubic-bezier(${v.map(fmtNum).join(", ")})`;
  if (typeof v === "number") return fmtNum(v);
  return ref(v);
}
export function buildCSS({ prefix = "sn-", dir = SPEC, scoped = true } = {}) {
  const { modes, varOf } = loadTokens(dir);
  let css = "/* 由 spec/tokens/*.tokens.json 生成（node scripts/tokens/build.mjs），不要手改 */\n";
  // 局部主题（页面里某一块写 data-theme="dark"）：:root 上那些跟着主题走的令牌（引用了主题色的派生值、深色里另有值的），
  // 在浅色、深色两个主题块里各再声明一遍——嵌套的那一块才会按它自己的主题重新算，而不是继承根元素上算好的值。根元素上的取值不变
  if (scoped) {
    const base = modes.find((m) => m.file.startsWith("base")), light = modes.find((m) => m.file === "theme.light.tokens.json"), dark = modes.find((m) => m.file === "theme.dark.tokens.json");
    const themed = new Set([...light.toks, ...dark.toks].map(([, t]) => t.$extensions["com.satin"].var));
    const refsThemed = (t) => typeof t.$value === "string" && [...t.$value.matchAll(/\{([\w.]+)\}/g)].some(([, p]) => themed.has(varOf.get(p)));
    const has = (m, v) => m.toks.some(([, t]) => t.$extensions["com.satin"].var === v);
    for (const [p, t] of base.toks) {
      const v = t.$extensions["com.satin"].var, overridden = has(dark, v), derived = refsThemed(t);
      if ((overridden || derived) && !has(light, v)) light.toks.push([p, t]);
      if (derived && !overridden) dark.toks.push([p, t]);
    }
  }
  for (const m of modes) {
    if (!m.toks.length) continue;
    // 主题块里还有一条 color-scheme（表单控件、滚动条跟着深浅走），写在 manifest 的 declarations 里
    const extra = Object.entries(m.declarations || {}).map(([k, v]) => `  ${k}: ${v};\n`).join("");
    const body = extra + m.toks.map(([, t]) => `  --${prefix}${t.$extensions["com.satin"].var.slice(2)}: ${cssValue(t, varOf, prefix)};`).join("\n") + "\n";
    css += `${m.selector} {\n` + body + "}\n";
    // 没引 theme-boot（根元素上没有 data-theme）的页面也跟着系统的深浅走：同一份深色令牌再放进 prefers-color-scheme 里一遍。
    // 有 data-theme 的（theme-boot、用户切过）按 data-theme，这一块不生效
    if (m.file === "theme.dark.tokens.json") css += `@media (prefers-color-scheme: dark) {\n:root:not([data-theme]) {\n` + body + "}\n}\n";
  }
  return css;
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const i = process.argv.indexOf("--prefix"), prefix = i > 0 ? process.argv[i + 1] || "" : "sn-";
  // 写文件时整体放进 @layer satin（和库的其余样式同一层）
  const j = process.argv.indexOf("--out"), out = j > 0 ? process.argv[j + 1] : null, raw = buildCSS({ prefix }), css = out ? raw.replace(/^(\/\*[^\n]*\*\/\n)/, "$1@layer satin {\n") + "}\n" : raw;
  if (out) { fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, css); console.log(`写出 ${out}（${css.split("\n").length} 行）`); } else process.stdout.write(css);
}
