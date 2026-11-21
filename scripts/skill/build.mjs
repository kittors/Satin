// 生成 skills/satin/references/：组件（每个一份 + 一览）、令牌、去 AI 味规则、图标、页面配方。
// 来源：spec/components（组件契约：说明、验收要点、写法表、用法代码；填了手写 API 契约的（contract: 1）用契约里的属性、事件、键盘、示例……，
//      和官网组件页同一份）、index.html（设计稿里每个演示的标记、规则条目）、
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
// 契约里的说明已经是 Markdown（代码用反引号包住），原样用，不像旧数据那样去掉 HTML 标签
const pr = (v) => String(v ?? "").trim();
const cell = (v) => pr(v).replace(/\|/g, "\\|").replace(/\n/g, " ");
const tbl = (head, rows) => (rows.length ? `| ${head.join(" | ")} |\n|${head.map(() => "---").join("|")}|\n` + rows.map((r) => `| ${r.map(cell).join(" | ")} |`).join("\n") + "\n\n" : "");
const FW_NAME = { html: "纯 HTML", react: "React", vue: "Vue", svelte: "Svelte", angular: "Angular", solid: "Solid", preact: "Preact" };
const namesOf = (n = {}) => Object.entries(n).map(([k, v]) => `${{ js: "createXxx 选项", element: "自定义元素", markup: "标记", html: "纯 HTML", ...FW_NAME }[k] || k}：\`${v}\``).join("；");
function contractMD(c) {
  let o = "";
  if (c.lead) o += `**${pr(c.lead)}**\n\n`;
  if (c.whenToUse?.length) o += `## 什么时候用\n\n${c.whenToUse.map((x) => `- ${pr(x)}`).join("\n")}\n\n`;
  if (c.whenNotToUse?.length) o += `## 什么时候别用\n\n${c.whenNotToUse.map((x) => `- ${pr(x.text)}${x.use ? `（换成 \`${x.use}\`）` : ""}`).join("\n")}\n\n`;
  if (c.related?.length) o += `## 相近的组件\n\n${c.related.map((x) => `- \`${x.id}\`：${pr(x.diff)}`).join("\n")}\n\n`;
  if (c.import) o += `## 引入\n\n` + tbl(["写法", "引入"], Object.entries(c.import).map(([k, v]) => [FW_NAME[k] || k, "`" + String(v).replace(/\n/g, "` `") + "`"])) + (c.importNote ? (typeof c.importNote === "object" ? Object.entries(c.importNote).map(([k, v]) => `- ${FW_NAME[k] || k}：${pr(v)}`).join("\n") : pr(c.importNote)) + "\n\n" : "");
  if (c.examples?.length) {
    o += `## 示例（由浅入深）\n\n`;
    for (const e of c.examples) {
      o += `### ${pr(e.title)}\n\n${pr(e.why)}\n\n` + "```html\n" + e.html.trim() + "\n```\n\n" + (e.js ? "```js\n" + e.js.trim() + "\n```\n\n" : "") + (e.css ? "```css\n" + e.css.trim() + "\n```\n\n" : "");
      for (const [fw, code] of Object.entries(e.code || {})) o += `${FW_NAME[fw] || fw} 的写法：\n\n` + "```" + (fw === "vue" ? "vue" : fw === "angular" ? "ts" : "jsx") + "\n" + code.trim() + "\n```\n\n";
    }
  }
  // 某种写法的类型不一样（typeBy）：跟在后面写上，比如 Vue 里只收字符串
  const FWN = { react: "React", preact: "Preact", vue: "Vue", svelte: "Svelte", angular: "Angular", solid: "Solid", html: "纯 HTML", js: "JS" };
  const typeByOf = (x) => (x.typeBy ? "（" + Object.entries(x.typeBy).map(([k, v]) => `${FWN[k] || k}：${v}`).join("；") + "）" : "");
  // 说明按写法给（descBy）：通用说明后面按写法列出来（React、Preact 一样的只写一次）
  const descByOf = (x) => { if (!x.descBy) return ""; const seen = new Map(); for (const [k, v] of Object.entries(x.descBy)) { if (v === x.desc) continue; seen.set(v, [...(seen.get(v) || []), FWN[k] || k]); } return seen.size ? "<br>" + [...seen].map(([v, ks]) => `${ks.join("、")}：${v}`).join("<br>") : ""; };
  if (c.props?.length) o += `## 属性\n\n` + tbl(["名称", "类型", "默认值", "必填", "说明", "各写法里的叫法"], c.props.map((x) => [`\`${x.name}\``, `\`${x.type}\`` + typeByOf(x), x.default, x.required ? "是" : "否", pr(x.desc) + (x.example ? `（例：\`${x.example}\`）` : "") + pr(descByOf(x)), namesOf(x.names)]));
  // 列定义（表格的 columns 里每一列能写的字段）
  if (c.columnProps?.length) o += `## 列定义（columns 的每一项）\n\n` + tbl(["字段", "类型", "默认值", "说明"], c.columnProps.map((x) => [`\`${x.name}\``, `\`${x.type}\``, x.default, pr(x.desc)]));
  if (c.events?.length) o += `## 事件\n\n` + tbl(["名称", "参数", "什么时候", "各写法"], c.events.map((x) => [`\`${x.name}\``, `\`${x.payload}\``, pr(x.when), namesOf(x.names)]));
  if (c.slots?.length) o += `## 插槽 / 子元素\n\n` + tbl(["名称", "说明", "各写法"], c.slots.map((x) => [`\`${x.name}\``, pr(x.desc), namesOf(x.names)]));
  if (c.methods?.length) o += `## 实例方法（createXxx 的返回值、React / Vue 的 ref）\n\n` + tbl(["名称", "签名", "说明"], c.methods.map((x) => [`\`${x.name}\``, `\`${x.signature}\``, pr(x.desc)])) + "所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。\n\n";
  if (c.functions?.length) o += `## 函数\n\n` + tbl(["签名", "从哪引", "说明"], c.functions.map((x) => [`\`${x.signature}\``, `\`${x.from}\``, pr(x.desc)]));
  if (c.cssVars?.length || c.classes?.length) o += `## 样式定制\n\n` + tbl(["变量", "作用", "默认值"], (c.cssVars || []).map((x) => [`\`${x.name}\`${x.token ? "（全局令牌）" : ""}`, pr(x.desc), x.default])) + tbl(["类名 / 属性", "作用"], (c.classes || []).map((x) => [`\`${x.name}\``, pr(x.desc)]));
  if (c.types?.length) o += `## 导出的类型\n\n${c.types.map((x) => "`" + x + "`").join("、")}\n\n`;
  if (c.keyboard?.length) o += `## 键盘\n\n` + tbl(["按键", "什么时候", "做什么"], c.keyboard.map((x) => [x.keys, x.when || "", pr(x.does)]));
  if (c.a11y && !Array.isArray(c.a11y)) o += `## 无障碍\n\n${[...(c.a11y.roles || []), ...(c.a11y.focus || []), ...(c.a11y.notes || [])].map((x) => `- ${pr(x)}`).join("\n")}\n\n`;
  const d = c.design || {};
  if (d.do?.length || d.dont?.length) o += `## 设计规范\n\n` + (d.do || []).map((x) => `- 这样做：${pr(x)}`).join("\n") + "\n" + (d.dont || []).map((x) => `- 不要：${pr(x.text)}${x.rule ? `（规则 \`${x.rule}\`）` : ""}`).join("\n") + "\n\n"
    + (d.copy?.length ? `文案：\n\n${d.copy.map((x) => `- ${pr(x)}`).join("\n")}\n\n` : "")
    + (d.motion?.length ? tbl(["动效", "曲线", "时长"], d.motion.map((x) => [pr(x.what), "`" + x.easing + "`", x.duration])) : "");
  return o;
}
for (const c of contracts) {
  const s = sections.get(c.id) || { demos: [], rules: [], intro: "" };
  let out = `# ${c.name}${c.en ? ` · ${c.en}` : ""}\n\n> 组件 id：\`${c.id}\`　分组：${c.group || "—"}\n\n${md(c.summary || s.intro)}\n\n`;
  if (c.contract) out += contractMD(c);
  if (c.acceptance?.length) out += `## 验收要点\n\n${c.acceptance.map((a) => `- ${md(a)}`).join("\n")}\n\n`;
  if (c.api?.length && !c.contract) out += `## 写法\n\n` + c.api.map((t) => (t.title ? `### ${md(t.title)}\n\n` : "") + table(t)).join("\n") + "\n";
  const ex = c.example && Object.values(c.example)[0];
  if (ex && (ex.html || ex.js) && !c.contract) out += `## 用法\n\n` + (ex.html ? "```html\n" + ex.html.trim() + "\n```\n\n" : "") + (ex.js ? "```js\n" + ex.js.trim() + "\n```\n\n" : "");
  const demos = s.demos.filter((d) => d.html.length > 30).slice(0, MAX_DEMOS);
  if (demos.length && !c.contract) {
    out += `## 设计稿里的标记（照抄即可；\`data-i\` 的图标要调 \`injectIcons()\`，交互组件还要接 JS，见上面的写法）\n\n`;
    for (const d of demos) out += (d.title ? `### ${d.title}\n\n` : "") + "```html\n" + (d.html.length > MAX_DEMO ? d.html.slice(0, MAX_DEMO) + "\n<!-- ……后面还有，略 -->" : d.html) + "\n```\n\n";
  }
  if (s.rules.length) out += `## 规则\n\n${s.rules.map((r) => `- ${r}`).join("\n")}\n\n`;
  for (const k of ["states", "interactions", "a11y", "mobile"]) if (Array.isArray(c[k]) && c[k].length && !c.contract) out += `## ${{ states: "状态", interactions: "交互", a11y: "无障碍", mobile: "手机上" }[k]}\n\n${c[k].map((x) => `- ${md(typeof x === "string" ? x : JSON.stringify(x))}`).join("\n")}\n\n`;
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
