// 生成 skills/satin/references/：组件（每个一份 + 一览）、令牌、去 AI 味规则、图标、页面配方。
// 来源：spec/components（组件契约：说明、验收要点、写法表、用法代码）、index.html（设计稿里每个演示的标记、规则条目）、
// spec/tokens（令牌）、spec/rules/anti-ai.json（规则）、satin-ui/icons（图标名）、spec/recipes（页面配方）。
// 设计稿里展示页自己的排版类（row、stack、grid-m……）在标记里换成库里的骨架类（sn-row、sn-stack、sn-cols），照抄就能用。
// 用法：node scripts/skill/build.mjs
import fs from "node:fs";
import path from "node:path";
import { parseHTML } from "linkedom";

const ROOT = path.resolve(import.meta.dirname, "../..");
const OUT = path.join(ROOT, "skills/satin/references");
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "components"), { recursive: true });
const w = (f, s) => fs.writeFileSync(path.join(OUT, f), s.replace(/\n{3,}/g, "\n\n"));
const md = (s) => String(s ?? "").replace(/<code[^>]*>(.*?)<\/code>/g, "`$1`").replace(/<b>(.*?)<\/b>/g, "**$1**").replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').trim();

// ———— 设计稿里的演示标记 ————
const { document } = parseHTML(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"));
const DEMO_CLASS = { row: "sn-row", stack: "sn-stack", "grid-m": "sn-cols" };
function cleanMarkup(el) {
  const c = el.cloneNode(true);
  for (const n of c.querySelectorAll("[class]")) {
    const cls = n.getAttribute("class").split(/\s+/).filter(Boolean);
    const out = []; for (const k of cls) { if (DEMO_CLASS[k]) out.push(DEMO_CLASS[k]); else if (k.startsWith("sn-") || k === "k") out.push(k); }
    if (out.length) n.setAttribute("class", out.join(" ")); else n.removeAttribute("class");
  }
  for (const n of c.querySelectorAll("[style]")) n.setAttribute("style", n.getAttribute("style").replace(/--min:/g, "--sn-min:"));
  // 展示页的接线用的 id（演示脚本按 id 找元素）去掉不影响样式；保留 for / aria 引用到的 id
  let h = c.innerHTML.replace(/\s+/g, " ").replace(/> </g, ">\n<").trim();
  return h;
}
const sections = new Map();
for (const s of document.querySelectorAll("section.spec[id]")) {
  const demos = [...s.querySelectorAll(":scope > .demo, :scope > div > .demo")].map((d, i) => {
    let title = ""; for (let p = d.previousElementSibling; p; p = p.previousElementSibling) { if (p.tagName === "H3") { title = p.textContent.trim(); break; } if (p.classList.contains("demo")) break; }
    return { title, html: cleanMarkup(d) };
  });
  const rules = [...s.querySelectorAll(":scope > ul.rules > li")].map((li) => md(li.innerHTML));
  const intro = s.querySelector(":scope > p") ? md(s.querySelector(":scope > p").innerHTML) : "";
  sections.set(s.id, { demos, rules, intro, name: s.querySelector("h2")?.childNodes[0]?.textContent.trim() || s.id });
}

// ———— 组件契约 ————
const SPEC = path.join(ROOT, "spec/components");
const contracts = fs.readdirSync(SPEC).filter((f) => f.endsWith(".json") && !f.startsWith("_") && f !== "index.json").map((f) => JSON.parse(fs.readFileSync(path.join(SPEC, f), "utf8")));
const order = [...sections.keys()];
contracts.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
const FOUNDATION = new Set(["color", "type", "spacing", "layout", "space", "elevation", "motion", "icons"]);
const MAX_DEMO = 2600, MAX_DEMOS = 4;
const table = (t) => (t?.rows?.length ? `| ${t.head.join(" | ")} |\n|${t.head.map(() => "---").join("|")}|\n` + t.rows.map((r) => `| ${r.map((c) => md(c).replace(/\|/g, "\\|").replace(/\n/g, " ")).join(" | ")} |`).join("\n") + "\n" : "");
const index = [];
for (const c of contracts) {
  const s = sections.get(c.id) || { demos: [], rules: [], intro: "" };
  let out = `# ${c.name}${c.en ? ` · ${c.en}` : ""}\n\n> 组件 id：\`${c.id}\`　分组：${c.group || "—"}\n\n${md(c.summary || s.intro)}\n\n`;
  if (c.acceptance?.length) out += `## 验收要点\n\n${c.acceptance.map((a) => `- ${md(a)}`).join("\n")}\n\n`;
  if (c.api?.length) out += `## 写法\n\n` + c.api.map((t) => (t.title ? `### ${md(t.title)}\n\n` : "") + table(t)).join("\n") + "\n";
  const ex = c.example && Object.values(c.example)[0];
  if (ex && (ex.html || ex.js)) out += `## 用法\n\n` + (ex.html ? "```html\n" + ex.html.trim() + "\n```\n\n" : "") + (ex.js ? "```js\n" + ex.js.trim() + "\n```\n\n" : "");
  const demos = s.demos.filter((d) => d.html.length > 30).slice(0, MAX_DEMOS);
  if (demos.length) {
    out += `## 设计稿里的标记（照抄即可；\`data-i\` 的图标要调 \`injectIcons()\`，交互组件还要接 JS，见上面的写法）\n\n`;
    for (const d of demos) out += (d.title ? `### ${d.title}\n\n` : "") + "```html\n" + (d.html.length > MAX_DEMO ? d.html.slice(0, MAX_DEMO) + "\n<!-- ……后面还有，略 -->" : d.html) + "\n```\n\n";
  }
  if (s.rules.length) out += `## 规则\n\n${s.rules.map((r) => `- ${r}`).join("\n")}\n\n`;
  for (const k of ["states", "interactions", "a11y", "mobile"]) if (Array.isArray(c[k]) && c[k].length) out += `## ${{ states: "状态", interactions: "交互", a11y: "无障碍", mobile: "手机上" }[k]}\n\n${c[k].map((x) => `- ${md(typeof x === "string" ? x : JSON.stringify(x))}`).join("\n")}\n\n`;
  fs.writeFileSync(path.join(OUT, "components", c.id + ".md"), out.replace(/\n{3,}/g, "\n\n"));
  index.push({ id: c.id, name: c.name, en: c.en, group: c.group, summary: md(c.summary || s.intro).split(/[。；]/)[0], foundation: FOUNDATION.has(c.id) });
}
let idx = "# 组件一览\n\n每个组件的写法、选项、设计稿标记、验收要点在 `components/<id>.md`。基础（颜色、排版、间距……）的数值以 `tokens.md` 为准。\n\n";
for (const g of [...new Set(index.map((i) => i.group || "其他"))]) {
  idx += `## ${g}\n\n| id | 组件 | 一句话 |\n|---|---|---|\n` + index.filter((i) => (i.group || "其他") === g).map((i) => `| [\`${i.id}\`](components/${i.id}.md) | ${i.name}${i.en ? " · " + i.en : ""} | ${i.summary.replace(/\|/g, "\\|")} |`).join("\n") + "\n\n";
}
w("components.md", idx);

// ———— 令牌 ————
const TOK = path.join(ROOT, "spec/tokens"), manifest = JSON.parse(fs.readFileSync(path.join(TOK, "manifest.json"), "utf8"));
const flat = (o, pre = []) => Object.entries(o).flatMap(([k, v]) => (k.startsWith("$") ? [] : v && typeof v === "object" && "$value" in v ? [[[...pre, k], v]] : v && typeof v === "object" ? flat(v, [...pre, k]) : []));
const load = (f) => JSON.parse(fs.readFileSync(path.join(TOK, f), "utf8"));
const varName = (t) => t.$extensions?.["com.satin"]?.var?.replace(/^--/, "--sn-") ?? "";
// 别名 {color.bg.raised} 写成 CSS 的 var(--sn-raised)；数组（字体栈、曲线）写成 CSS 的样子
const PATH2VAR = new Map();
for (const f of fs.readdirSync(TOK).filter((f) => f.endsWith(".tokens.json"))) for (const [p, t] of flat(load(f))) PATH2VAR.set(p.join("."), varName(t));
const val = (v) => {
  if (Array.isArray(v)) return v.every((x) => typeof x === "number") ? `cubic-bezier(${v.join(", ")})` : v.map((x) => (/\s/.test(x) ? `"${x}"` : x)).join(", ");
  return (typeof v === "object" ? JSON.stringify(v) : String(v)).replace(/\{([\w.-]+)\}/g, (m, k) => (PATH2VAR.get(k) ? `var(${PATH2VAR.get(k)})` : m));
};
let tok = "# 令牌\n\n写样式只用这些变量（`var(--sn-xxx)`），深浅主题、换主色、换圆角时自动跟着变。值以 `satin-ui/css/tokens.css` 为准（由 spec/tokens 生成）。\n\n";
const light = new Map(flat(load("theme.light.tokens.json")).map(([p, t]) => [varName(t), t])), dark = new Map(flat(load("theme.dark.tokens.json")).map(([p, t]) => [varName(t), t]));
const groups = new Map();
for (const [p, t] of flat(load("base.tokens.json"))) { const g = p[0]; if (!groups.has(g)) groups.set(g, []); groups.get(g).push([p, t]); }
tok += "## 颜色（深浅两套）\n\n| 变量 | 浅色 | 深色 | 用途 |\n|---|---|---|---|\n";
for (const [v, t] of light) tok += `| \`${v}\` | \`${val(t.$value)}\` | \`${val(dark.get(v)?.$value ?? t.$value)}\` | ${md(t.$description || "")} |\n`;
for (const [g, list] of groups) {
  tok += `\n## ${g}\n\n| 变量 | 值 | 说明 |\n|---|---|---|\n` + list.map(([p, t]) => `| \`${varName(t)}\` | \`${val(t.$value).replace(/\|/g, "\\|")}\` | ${md(t.$description || "").replace(/\|/g, "\\|")} |`).join("\n") + "\n";
}
tok += "\n## 圆角档（根元素 `data-radius`，默认胶囊）\n\n" + manifest.modes?.filter?.((m) => /radius/.test(m.file)).map((m) => `- \`${m.selector}\``).join("\n") + "\n";
w("tokens.md", tok);

// ———— 规则 ————
const rules = JSON.parse(fs.readFileSync(path.join(ROOT, "spec/rules/anti-ai.json"), "utf8")).rules;
let rl = "# 去 AI 味规则\n\n每条都写了为什么、怎么写、不要怎么写、检查器怎么判、怎么改。`severity: error` 的必须改到 0。\n\n";
for (const r of rules) rl += `## ${r.title}（\`${r.id}\`，${r.severity}）\n\n**为什么**：${r.why}\n\n**这样写**：\n\`\`\`\n${r.do}\n\`\`\`\n\n**不要这样**：\n\`\`\`\n${r.dont}\n\`\`\`\n\n**检查器怎么判**（${r.check?.kind}）：${r.check?.how}\n\n**怎么改**：${r.fix}\n\n`;
w("rules.md", rl);

// ———— 图标 ————
const { ICONS } = await import(path.join(ROOT, "packages/satin-ui/src/icons.js"));
w("icons.md", `# 图标（${Object.keys(ICONS).length} 个，线性、1.5 线宽）\n\n标记里写 \`data-i="名字"\`（在文字前：\`data-i="名字:before"\`，后：\`:after\`）再调 \`injectIcons()\`；JS 里 \`icon("名字")\` 得到 SVG 字符串；React \`<Icon name="名字" />\`、按钮 \`icon="名字"\`。不要用 emoji 当图标。\n\n` + Object.keys(ICONS).map((k) => `\`${k}\``).join(" ") + "\n");

// ———— 页面配方 ————
const REC = path.join(ROOT, "spec/recipes");
if (fs.existsSync(REC)) {
  const files = fs.readdirSync(REC).filter((f) => f.endsWith(".md") && f !== "README.md").sort();
  w("recipes.md", "# 页面配方\n\n先照着搭骨架，再换成自己的内容。每份都用 Satin 的骨架类和组件，不需要自己写布局和颜色。\n\n" + files.map((f) => fs.readFileSync(path.join(REC, f), "utf8").replace(/^# /m, "## ").replace(/^## (?!#)/gm, (m, i) => m)).join("\n\n"));
}
// ———— 手机和 H5 ————
if (fs.existsSync(path.join(ROOT, "spec/mobile.md"))) fs.copyFileSync(path.join(ROOT, "spec/mobile.md"), path.join(OUT, "mobile.md"));
console.log(`写出 ${path.relative(ROOT, OUT)}：组件 ${contracts.length} 份、令牌、规则 ${rules.length} 条、图标 ${Object.keys(ICONS).length} 个${fs.existsSync(REC) ? "、页面配方" : ""}`);
