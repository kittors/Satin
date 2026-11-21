// 组件文档页跨写法用词检查（2026-11-21 主会话要求）：每种写法的页面里不出现别的框架的专有词。
// 8 种写法 + 两个环境：React、Vue、Svelte、Angular、Solid、Preact、纯 HTML，Next（按 React 算）、Nuxt（按 Vue 算）。
// 查页面正文（不含代码面板：代码本来就按写法给）；"列定义"（columns 里每一项的字段，各框架写法一样）、"纯 HTML 写法的类名、data 属性"（标记里的 #id）两节跳过。
// 规则：ReactNode、React.、JSX.Element 只许出现在 React / Next；v-model、v-bind、defineProps、插槽写法 #xxx 只许出现在 Vue / Nuxt；
//       Svelte 的 bind:、{#snippet}、{@render}、"片段" 只许出现在 Svelte；Angular 的 ngModel、[(…)]、[attr.] 只许出现在 Angular。
// 用法（5192 起着）：node scripts/site/api-terms.mjs [--ids table,dialog] [--fw react,vue] [--out /tmp/site-api-terms]
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i < 0 ? d : process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : true; };
const OUT = arg("out", "/tmp/site-api-terms"), ONLY = arg("ids", "") ? String(arg("ids")).split(",") : null;
const ALL = ["react", "vue", "svelte", "angular", "solid", "preact", "html", "next", "nuxt"], WS = arg("fw", "") ? String(arg("fw")).split(",") : ALL;
const B = "http://127.0.0.1:5192/site/next-docs.html", sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });
// 专有词 → 允许出现的写法
const RULES = [
  { re: /ReactNode|React\.[A-Z]\w*|JSX\.Element/g, ok: ["react", "next"], who: "React" },
  { re: /v-model|v-bind|defineProps|(?<![\w#{])#(?:default|footer|header|empty|row|cell|item|title|description|icon|actions?|[a-z][\w-]*)(?=[\s，。、；）)]|$)/g, ok: ["vue", "nuxt"], who: "Vue" },
  { re: /bind:\w+|\{#snippet|\{@render|片段/g, ok: ["svelte"], who: "Svelte" },
  { re: /ngModel|\[\([\w.]+\)\]|\[attr\./g, ok: ["angular"], who: "Angular" },
];
const b = await pw.chromium.launch({ channel: "chrome", headless: true });
const bad = [];
let ids = null;
for (const w of WS) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }), p = await ctx.newPage();
  await p.goto(`${B}#/components?fw=${w}`, { waitUntil: "load" }); await sleep(1500);
  if (!ids) { ids = await p.evaluate(() => [...new Set([...document.querySelectorAll("[data-side] a[href^='#/c/']")].map((a) => a.getAttribute("href").slice(4).split("?")[0]))]); if (ONLY) ids = ids.filter((x) => ONLY.includes(x)); }
  for (const id of ids) {
    await p.evaluate(([id, w]) => { location.hash = `#/c/${id}?fw=${w}`; }, [id, w]);
    await p.waitForFunction((id) => document.querySelector(".d-h1") && !document.querySelector("[data-async]") && (location.hash.startsWith("#/c/" + id)), id, { timeout: 10000 }).catch(() => {});
    await sleep(400);
    const text = await p.evaluate(() => {
      const main = document.querySelector(".d-main") || document.body, clone = main.cloneNode(true);
      // 不看代码面板、示例框；"列定义"一节（从它的 h3 到下一个 h3 / h2）也不看
      clone.querySelectorAll(".cx, pre, .dx-stage, .dx-code, .d-fw .cx, .s-devbox, script, style").forEach((e) => e.remove());
      // "列定义"（各框架写法一样）、"纯 HTML 写法的类名、data 属性"（本来就是标记里的 #id、.class）两节跳过
      const skip = [clone.querySelector("#api-columns"), ...[...clone.querySelectorAll("h3")].filter((x) => x.textContent.trim().startsWith("纯 HTML 写法的类名"))].filter(Boolean);
      for (const h of skip) { let n = h.nextElementSibling; while (n && !/^H[23]$/.test(n.tagName)) { const x = n.nextElementSibling; n.remove(); n = x; } h.remove(); }
      return clone.textContent;
    });
    for (const r of RULES) {
      if (r.ok.includes(w)) continue;
      const hits = [...new Set(text.match(r.re) || [])];
      if (hits.length) bad.push({ id, w, who: r.who, hits, ctx: hits.map((t) => { const i = text.indexOf(t); return text.slice(Math.max(0, i - 30), i + t.length + 20).replace(/\s+/g, " ").trim(); }).slice(0, 2) });
    }
    process.stdout.write(`\r${w.padEnd(8)} ${id.padEnd(14)} 已发现 ${bad.length} 处   `);
  }
  await ctx.close();
}
await b.close();
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(bad, null, 1));
console.log(`\n跨写法用词：${WS.length} 种写法 × ${ids?.length ?? 0} 页，${bad.length ? bad.length + " 处" : "0 处"}（${OUT}）`);
for (const x of bad.slice(0, 60)) console.log(`  ✗ ${x.id} · ${x.w} 页出现 ${x.who} 的写法：${x.hits.join("、")}　…${x.ctx[0]}…`);
