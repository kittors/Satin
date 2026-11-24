// 生成 spec/ 下的规范文档（JSON 是给工具和 AI 读的，Markdown 是给人和 AI 读的）：
// · guides/：设计规范（原则、颜色、排版、间距……去 AI 感、可访问性、文案），来自官网的规范页数据
// · components/：组件契约（名字、分组、说明、验收要点、标记、参数、用法、演示源码、状态 / 变体 / 尺寸、交互、动效、无障碍、移动端）
// · motion/：曲线和时长（展示页"动效"一节的定义）+ 样式表和脚本里实际用到的过渡 / 动画清单
// 用法：node scripts/spec/build.mjs   （改了展示页、官网规范页、组件契约的手写部分 spec/components/_extra.json、_api/<id>.mjs 以后重跑）
//      node scripts/spec/build.mjs --components   只重新生成组件契约（spec/components），别的不动
import fs from "node:fs";
import path from "node:path";
import { parseHTML } from "linkedom";
import postcss from "postcss";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "../.."), SPEC = path.join(ROOT, "spec");
const ONLY_COMPONENTS = process.argv.includes("--components");
const w = (p, s) => { fs.mkdirSync(path.dirname(path.join(SPEC, p)), { recursive: true }); fs.writeFileSync(path.join(SPEC, p), s); };
const wrapCode = (_, inner) => { const max = Math.max(0, ...(inner.match(/`+/g) || []).map((x) => x.length)); const f = "`".repeat(max + 1); const pad = inner.startsWith("`") || inner.endsWith("`") ? " " : ""; return `${f}${pad}${inner}${pad}${f}`; };
const strip = (h) => String(h).replace(/<code[^>]*>(.*?)<\/code>/g, wrapCode).replace(/<b>(.*?)<\/b>/g, "**$1**").replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').trim();

// ———— 1. 设计规范 ————
const { GUIDES, START } = await import(path.join(ROOT, "site/pages.js"));
const mdBlock = ([k, ...a]) => {
  if (k === "h2") return `## ${strip(a[0])}\n`;
  if (k === "p") return strip(a[0]) + "\n";
  if (k === "ul") return a[0].map((x) => `- ${strip(x)}`).join("\n") + "\n";
  if (k === "code") return "```" + a[0] + "\n" + a[1] + "\n```\n";
  if (k === "do") return `**这样做**：${strip(a[0])}\n\n**不要**：${strip(a[1])}\n`;
  if (k === "table") return `| ${a[0].map(strip).join(" | ")} |\n| ${a[0].map(() => "---").join(" | ")} |\n` + a[1].map((r) => `| ${r.map((c) => strip(c).replace(/\|/g, "\\|")).join(" | ")} |`).join("\n") + "\n";
  return "";
};
const guideIndex = [];
if (!ONLY_COMPONENTS) for (const g of GUIDES) {
  w(`guides/${g.id}.json`, JSON.stringify(g, null, 2) + "\n");
  // 有的章节没写一句话摘要（brief）：用导语的第一句
  const brief = g.brief ? strip(g.brief) : g.lead ? strip(g.lead).split(/(?<=[。；])/)[0] : "";
  w(`guides/${g.id}.md`, `# ${g.title}（${g.en}）\n\n${brief ? `> ${brief}\n\n` : ""}${g.lead ? strip(g.lead) + "\n\n" : ""}${(g.body || []).map(mdBlock).join("\n")}`);
  guideIndex.push(`| [${g.title}](${g.id}.md) | ${g.en} | ${brief} |`);
}
if (!ONLY_COMPONENTS) w("guides/README.md", `# 设计规范\n\n平台无关：Web、移动端、原生都照这一套。数值以 spec/tokens 为准。\n\n| 章节 | English | 一句话 |\n| --- | --- | --- |\n${guideIndex.join("\n")}\n`);

// ———— 2. 组件契约 ————
const { document } = parseHTML(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"));
const { API, EXAMPLES } = await import(path.join(ROOT, "site/examples.js"));
const { USAGE } = await import(path.join(ROOT, "site/usage.js"));
const extra = fs.existsSync(path.join(SPEC, "components/_extra.json")) ? JSON.parse(fs.readFileSync(path.join(SPEC, "components/_extra.json"), "utf8")) : {};
// 手写的 API 契约（属性、事件、方法、键盘、无障碍、设计规范、示例……，格式见 spec/components/_api/README.md）：有就合并进去，带 contract: 1
const API_DIR = path.join(SPEC, "components/_api");
const apiOf = async (id) => { const f = path.join(API_DIR, id + ".mjs"); return fs.existsSync(f) ? (await import(pathToFileURL(f).href)).default : null; };
const groups = []; let g = null;
for (const el of document.querySelector(".doc-nav").children) {
  if (el.tagName === "P") groups.push((g = { name: el.textContent.trim(), ids: [] }));
  else if (el.tagName === "A" && g) g.ids.push([el.getAttribute("href").slice(1), el.textContent.trim()]);
}
const clean = (html) => { const ls = html.replace(/=""/g, "").split("\n"); while (ls.length && !ls[0].trim()) ls.shift(); while (ls.length && !ls.at(-1).trim()) ls.pop(); const ind = Math.min(...ls.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length)); return ls.map((l) => l.slice(ind)).join("\n"); };
const index = [];
for (const grp of groups) for (const [id, navName] of grp.ids) {
  const s = document.getElementById(id); if (!s) continue;
  const h2 = s.querySelector("h2"), small = h2?.querySelector("small"), title = h2 ? [...h2.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim() : navName;
  const enSpec = small?.textContent.trim() || "", [en, specRef] = enSpec.split(" · ").length > 1 && /号/.test(enSpec) ? [enSpec.replace(/ · \d+ 号.*$/, ""), (enSpec.match(/\d+ 号.*$/) || [""])[0]] : [enSpec, ""];
  const demos = []; let cap = "";
  for (const el of s.children) { if (el.tagName === "H3") cap = el.textContent.trim(); else if (el.classList?.contains("demo")) { demos.push({ caption: cap, html: clean(el.innerHTML) }); cap = ""; } }
  const api = (API[id] || []).map(([title, head, rows]) => ({ title, head, rows }));
  const c = {
    id, name: title, nav: navName, en, group: grp.name, specRef,
    summary: strip(s.querySelector(":scope > p")?.innerHTML || ""),
    acceptance: [...s.querySelectorAll(":scope > .rules > li")].map((li) => strip(li.innerHTML)),
    api, usage: USAGE[id] || null, example: EXAMPLES[id] || null, demos,
    // 下面几项是手写的（spec/components/_extra.json），阶段 3 换成新 API 时一起校订
    states: [], variants: [], sizes: [], interactions: [], motion: [], a11y: [], mobile: [],
    ...(extra[id] || {}),
  };
  const hand = await apiOf(id);
  if (hand) Object.assign(c, { contract: 1, ...hand, id });
  w(`components/${id}.json`, JSON.stringify(c, null, 2) + "\n");
  index.push({ id, name: title, en, group: grp.name, summary: c.summary, contract: c.contract ? 1 : 0 });
}
w("components/index.json", JSON.stringify(index, null, 2) + "\n");
const FORMAT = fs.existsSync(path.join(API_DIR, "README.md")) ? fs.readFileSync(path.join(API_DIR, "README.md"), "utf8").trim() + "\n\n" : "";
w("components/README.md", "# 组件清单\n\n每个组件一份契约（同名 .json）：说明、验收要点、标记、参数、用法、演示源码；状态、变体、尺寸、交互、动效、无障碍、移动端行为见各文件。"
  + `已经填了手写 API 契约的（\`contract: 1\`，下表"契约"一列打勾）：${index.filter((x) => x.contract).map((x) => "`" + x.id + "`").join("、") || "还没有"}。\n\n` + FORMAT
  + groups.map((gr) => `## ${gr.name}\n\n| id | 组件 | 契约 | 说明 |\n| --- | --- | --- | --- |\n` + index.filter((x) => x.group === gr.name).map((x) => `| \`${x.id}\` | ${x.name}（${x.en}） | ${x.contract ? "✓" : ""} | ${x.summary.slice(0, 80)}${x.summary.length > 80 ? "…" : ""} |`).join("\n")).join("\n\n") + "\n");

if (!ONLY_COMPONENTS) {
// ———— 3. 动效 ————
// 曲线和时长档位：展示页"动效"一节（kit.js 的 CURVES、DURS）是唯一定义；这里照抄成数据
const kitSrc = fs.readFileSync(path.join(ROOT, fs.existsSync(path.join(ROOT, "demo/main.js")) ? "demo/main.js" : "kit.js"), "utf8");
const grab = (name) => { const m = new RegExp(`const ${name} = (\\[[\\s\\S]*?\\]);\\n`).exec(kitSrc); return m ? Function(`return ${m[1]}`)() : null; };
const CURVES = grab("CURVES"), DURS = grab("DURS"), SPRING = grab("SPRING");
const curves = CURVES.map(([name, p, use]) => ({ name, token: "motion.easing." + name.replace(/^ease\./, "").replace("linear", "linear"), css: p === "spring" ? `linear(${SPRING.join(", ")})` : name === "linear" ? "linear" : `cubic-bezier(${p.join(", ")})`, use }));
const durations = DURS.map(([tier, examples, ms]) => ({ tier, examples, ms }));
// 实际用到的：样式表里的 transition / animation，脚本里的 .animate(…, { duration, easing })
const inv = { css: [], js: [] };
// 样式表、脚本在组件库里（packages/satin-ui/css、src），file 记相对仓库根的路径
const LIB = "packages/satin-ui", inLib = (dir, re) => fs.readdirSync(path.join(ROOT, LIB, dir)).filter((x) => re.test(x)).map((x) => `${LIB}/${dir}/${x}`);
for (const f of inLib("css", /\.css$/)) {
  postcss.parse(fs.readFileSync(path.join(ROOT, f), "utf8")).walkDecls(/^(transition|animation)(-duration|-timing-function)?$/, (d) => inv.css.push({ file: f, selector: d.parent.selector?.replace(/\s+/g, " ").slice(0, 120), prop: d.prop, value: d.value.replace(/\s+/g, " ") }));
}
for (const f of inLib("src", /\.js$/)) {
  const src = fs.readFileSync(path.join(ROOT, f), "utf8");
  for (const m of src.matchAll(/\.animate\(([\s\S]{0,400}?)\{\s*duration:\s*([^,}]+)(?:,\s*easing:\s*([^,}]+))?/g)) inv.js.push({ file: f, duration: m[2].trim(), easing: (m[3] || "").trim() });
}
const easingCount = {}; for (const x of inv.css) for (const m of x.value.matchAll(/var\(--(?:sn-)?(ease-[\w-]+)\)|cubic-bezier\([^)]+\)|\blinear\b|\bease(-in|-out|-in-out)?\b/g)) easingCount[m[0]] = (easingCount[m[0]] || 0) + 1;
w("motion/curves.json", JSON.stringify(curves, null, 2) + "\n");
w("motion/durations.json", JSON.stringify(durations, null, 2) + "\n");
w("motion/inventory.json", JSON.stringify({ easingUsage: easingCount, ...inv }, null, 1) + "\n");
w("motion/README.md", `# 动效规格\n\n只动 transform、opacity、filter；曲线和时长只用下面这几档（令牌：spec/tokens/base.tokens.json 的 motion.easing）。\n\n## 曲线\n\n| 名字 | CSS | 用在哪 |\n| --- | --- | --- |\n${curves.map((c) => `| \`${c.name}\` | \`${c.css}\` | ${c.use} |`).join("\n")}\n\n## 时长\n\n| 档位 | 例子 | 时长 |\n| --- | --- | --- |\n${durations.map((d) => `| ${d.tier} | ${d.examples} | ${d.ms} |`).join("\n")}\n\n## 实际用量\n\n样式表里的过渡 / 动画 ${inv.css.length} 处，脚本里的 WAAPI ${inv.js.length} 处（清单见 inventory.json）。曲线用量：\n\n${Object.entries(easingCount).sort((a, b) => b[1] - a[1]).map(([k, n]) => `- \`${k}\`：${n}`).join("\n")}\n\n## 验收\n\n逐帧记录（rAF 每帧取关键元素的位置和透明度）：帧间隔 p95 ≤ 17ms、最长 ≤ 34ms、没有 > 50ms 的帧。录屏只用来看画面。\n`);

// ———— 4. 去 AI 味规则（spec/rules/anti-ai.json 手写）→ Markdown ————
const RULES_JSON = JSON.parse(fs.readFileSync(path.join(SPEC, "rules/anti-ai.json"), "utf8")), rules = RULES_JSON.rules, ROOTS = RULES_JSON.roots || [];
w("rules/anti-ai.md", `# 去 AI 味规则\n\n${rules.length} 条，按七个根源分组。static、dom 的检查器能自动查（\`skills/satin/scripts/check.mjs\`，规则 id 一一对应：static = 扫源码，dom = 在浏览器里量）；visual 的要人工看截图、录屏。\n\n`
  + "## AI 味七问\n\n" + ROOTS.map((x, i) => `${i + 1}. **${x.name}**（\`${x.id}\`）：${x.ask}`).join("\n") + "\n\n"
  + rules.map((r, i) => { const ro = ROOTS.find((x) => x.id === r.root); return `${ro && r.root !== rules[i - 1]?.root ? `## ${ROOTS.indexOf(ro) + 1}. ${ro.name}\n\n${ro.def}自检：${ro.ask}\n\n例子：${ro.eg}\n\n` : ""}${ro ? "###" : "##"} ${r.title}（\`${r.id}\`，${r.severity === "error" ? "必须" : "建议"}）\n\n${r.why}\n\n- 这样做：${r.do}\n- 不要：${r.dont}\n- 判据（${r.check.kind}）：${r.check.how}\n- 修法：${r.fix}\n`; }).join("\n"));

console.log(`规范：设计规范 ${GUIDES.length} 章、组件 ${index.length} 个、曲线 ${curves.length} 条、时长 ${durations.length} 档、过渡清单 ${inv.css.length}+${inv.js.length} 处`);
} else console.log(`组件契约：${index.length} 个，填了手写 API 契约的 ${index.filter((x) => x.contract).length} 个（${index.filter((x) => x.contract).map((x) => x.id).join("、")}）`);
void START;
