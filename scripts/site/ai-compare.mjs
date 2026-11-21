// AI 味巡检改前 / 改后对比（主会话 11-22 要求：库改完以后按根源出一份"改前多少、改后多少"）
// 用法：node scripts/site/ai-compare.mjs <改前的 --out 目录> <改后的 --out 目录> [--md 写到哪个文件]
// 读两边的 ai.json（docs-audit 写的，每条带 root、name、page、where、el、detail），按七个根源 → 规则数条数，
// 再列出改后消失的（修好了）和新出现的（新问题）。同一处问题按"规则 + 页面 + 位置 + 元素"认
import fs from "node:fs";
import { AI_ROOTS } from "./ai-flavor.js";
const [A, B] = process.argv.slice(2).filter((x) => !x.startsWith("--"));
const mi = process.argv.indexOf("--md"), MD = mi > 0 ? process.argv[mi + 1] : "";
if (!A || !B) { console.log("用法：node scripts/site/ai-compare.mjs <改前目录> <改后目录> [--md 输出.md]"); process.exit(1); }
const load = (d) => JSON.parse(fs.readFileSync(`${d}/ai.json`, "utf8"));
const before = load(A), after = load(B), key = (x) => [x.name, x.page, x.where, (x.el || "").slice(0, 60)].join(" | ");
const count = (list) => { const m = {}; for (const x of list) { const r = x.root ?? 7; m[r] ??= { all: 0, by: {} }; m[r].all++; m[r].by[x.name] = (m[r].by[x.name] || 0) + 1; } return m; };
const cb = count(before), ca = count(after), kb = new Set(before.map(key)), ka = new Set(after.map(key));
const out = [`# AI 味巡检对比`, "", `改前：${A}（${before.length} 条）  改后：${B}（${after.length} 条）`, "", "| 根源 | 规则 | 改前 | 改后 |", "|---|---|---|---|"];
for (const [no, name] of Object.entries(AI_ROOTS)) {
  const b = cb[no], a = ca[no]; if (!b && !a) continue;
  out.push(`| ${no} ${name} | 合计 | ${b?.all ?? 0} | ${a?.all ?? 0} |`);
  for (const r of new Set([...Object.keys(b?.by || {}), ...Object.keys(a?.by || {})])) out.push(`|  | ${r} | ${b?.by[r] ?? 0} | ${a?.by[r] ?? 0} |`);
}
const fixed = before.filter((x) => !ka.has(key(x))), added = after.filter((x) => !kb.has(key(x)));
out.push("", `## 修好了（改后不再出现）：${fixed.length} 条`, ...fixed.slice(0, 200).map((x) => `- ${x.root} ${x.name}：${x.page} ${x.where} ${x.el || ""} — ${x.detail}`));
out.push("", `## 新出现的：${added.length} 条`, ...added.slice(0, 200).map((x) => `- ${x.root} ${x.name}：${x.page} ${x.where} ${x.el || ""} — ${x.detail}${x.shot ? `（${x.shot.split("/").pop()}）` : ""}`));
const text = out.join("\n");
if (MD) fs.writeFileSync(MD, text);
console.log(text);
