// 全量框架示例：设计稿 61 块的每个演示 × 7 种写法（site/frameworks.js 登记的框架），写进 examples/<框架>/。
// 代码和官网文档页是同一个生成器（site/variants.js）：在文档页里等每个演示载好，按真实排版判断空白，再取出 7 种写法。
// 官网的代码块读的就是这里写出来的文件；构建、截图和设计稿逐块比对见 scripts/examples/gallery-check.mjs。
// 用法（先起服务：python3 serve.py 5192 .）：node scripts/examples/gallery.mjs [--only button,select] [--no-entries]
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { FRAMEWORKS } from "../../site/frameworks.js";
import { RECIPES } from "../../site/pages-more.js";

const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright");
const ROOT = path.resolve(import.meta.dirname, "../..");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); if (i < 0) return d; const v = process.argv[i + 1]; return v && !v.startsWith("--") ? v : true; };
const BASE = arg("base", "http://127.0.0.1:5192"), ONLY = arg("only", ""), ENTRIES = !arg("no-entries", false);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const write = (f, s) => { fs.mkdirSync(path.dirname(f), { recursive: true }); if (!fs.existsSync(f) || fs.readFileSync(f, "utf8") !== s) fs.writeFileSync(f, s); };

// 设计稿目录里的 61 块（顺序、分组、名字）
const idx = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const nav = idx.slice(idx.indexOf('class="doc-nav"'), idx.indexOf("</nav>", idx.indexOf('class="doc-nav"')));
const SECTIONS = []; let group = "";
for (const m of nav.matchAll(/<p>([^<]+)<\/p>|<a href="#([a-z0-9-]+)"[^>]*>([^<]+)<\/a>/g)) { if (m[1]) group = m[1].trim(); else SECTIONS.push({ id: m[2], name: m[3].trim(), group }); }
const FOUNDATION = "基础";
// 基础几块（颜色、排版……）是展示令牌的，没有组件页：标记直接取设计稿里生成好的；动效曲线那块带一段点击动画的接线
const FOUNDATION_JS = { motion: 'for (const c of document.querySelectorAll(".curve")) c.addEventListener("click", () => {\n  const lane = c.querySelector(".lane"), ball = c.querySelector(".ball"), on = !c.classList.contains("sn-on");\n  c.classList.toggle("sn-on", on);\n  ball.style.transition = `transform 800ms ${c.dataset.ease}`;\n  ball.style.transform = on ? `translateX(${lane.clientWidth - 12}px)` : "none";\n});' };

const browser = await pw.chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errs = []; page.on("pageerror", (e) => errs.push(e.message));
const demos = [];
const t0 = Date.now();
for (const sec of SECTIONS) {
  if (ONLY && !ONLY.split(",").includes(sec.id)) continue;
  if (sec.group === FOUNDATION) {
    // 基础：设计稿嵌入模式里这一块，每个演示的标记（脚本已经生成好的）+ 演示用样式，在页面里跑生成器
    await page.goto(`${BASE}/index.html?embed=${sec.id}`, { waitUntil: "load" }); await sleep(1500);
    const got = await page.evaluate(async ({ id, js }) => {
      const V = await import("/site/variants.js");
      const sheet = (await Promise.all(["kit-demo", "layout", "stress", "doc"].map((f) => fetch(`/demo/${f}.css`).then((r) => r.text())))).join("\n");
      const inline = (el) => /^inline/.test(getComputedStyle(el).display), flex = (el) => el.nodeType === 1 && /flex|grid/.test(getComputedStyle(el).display);
      return [...document.querySelectorAll(`#${id} > .demo`)].map((d, n) => {
        const clone = d.cloneNode(true); for (const x of clone.querySelectorAll("script")) x.remove();
        const css = V.demoCSS(sheet, d), slug = `${id}-${n}`;
        // 判断空白用活的节点（有计算样式）；标记用克隆（去掉脚本）
        const files = V.variants({ node: d, js, css, slug, htmlCode: V.toHTML(clone, { inline, flex }), inline, flex });
        return { id, n, slug, cap: d.previousElementSibling?.tagName === "H3" ? d.previousElementSibling.textContent.trim() : "", ready: true, files, extra: [] };
      });
    }, { id: sec.id, js: FOUNDATION_JS[sec.id] || "" });
    demos.push(...got.map((d) => ({ ...d, section: sec })));
    console.log(`${sec.id.padEnd(12)} 基础 ${got.length} 个演示`);
    continue;
  }
  await page.goto(`${BASE}/site/next-docs.html#/c/${sec.id}`, { waitUntil: "load" });
  // 同一个文档里换页（只改了 #）：等新这一页的演示框都换上来
  await page.waitForFunction((id) => { const bs = [...document.querySelectorAll(".dx")]; return typeof window.__satinDemoFiles === "function" && bs.length > 0 && bs.every((b) => b.dataset.demo === id); }, sec.id, { timeout: 20000 }).catch(() => {});
  // 每个演示框滚到视口里，等它载好（演示文档解析完、接上浮层处理）
  const n = await page.evaluate(() => document.querySelectorAll(".dx").length);
  for (let i = 0; i < n; i++) {
    await page.evaluate((i) => document.querySelectorAll(".dx")[i].scrollIntoView({ block: "center" }), i);
    await page.waitForFunction((i) => { const f = document.querySelectorAll(".dx")[i].querySelector("iframe"); try { return !!f.contentDocument?.__dx; } catch { return false; } }, i, { timeout: 20000 }).catch(() => {});
  }
  await sleep(800);
  // 同一个演示只留一份（同一页上同一个演示出现两次时）
  const got = (await page.evaluate(() => window.__satinDemoFiles())).filter((d, i, a) => a.findIndex((x) => x.slug === d.slug) === i);
  const bad = got.filter((d) => !d.ready).map((d) => d.slug);
  demos.push(...got.map((d) => ({ ...d, section: sec })));
  console.log(`${sec.id.padEnd(12)} ${got.length} 个演示${bad.length ? `（没等到载好：${bad.join(", ")}，按标签猜的空白）` : ""}`);
}
// ———— 组件契约里的示例（spec/components/<id>.json 的 examples：由浅入深，官网组件页一个示例一块）————
// 在纯 HTML 的演示页（play.html，空的）里把标记放进来量计算样式，再生成 7 种写法
const CONTRACT = [];
for (const f of fs.readdirSync(path.join(ROOT, "spec/components")).filter((x) => x.endsWith(".json"))) {
  const c = JSON.parse(fs.readFileSync(path.join(ROOT, "spec/components", f), "utf8"));
  if (!c.contract || !c.examples?.length) continue;
  if (ONLY && !ONLY.split(",").includes(c.id) && !ONLY.split(",").includes("contracts")) continue;
  CONTRACT.push(c);
}
if (CONTRACT.length) {
  await page.goto(`${BASE}/examples/html/play.html`, { waitUntil: "load" });
  for (const c of CONTRACT) {
    const got = await page.evaluate(async ({ c }) => {
      const V = await import("/site/variants.js");
      const inline = (el) => /^inline/.test(getComputedStyle(el).display), flex = (el) => el.nodeType === 1 && /flex|grid/.test(getComputedStyle(el).display);
      const box = document.querySelector(".play");
      return c.examples.map((e) => {
        const host = document.createElement("div"); host.innerHTML = e.html; box.append(host);
        const files = V.variants({ node: host, js: e.js || "", css: e.css || "", slug: e.slug, inline, flex });
        // 契约里给了某个框架的手写写法（React 的受控 value / onChange、Vue 的 v-model 这类惯用法）：用手写的
        for (const [fw, code0] of Object.entries(e.code || {})) {
          if (!files[fw]) continue;
          // "use client" 只加在拷进 Next.js 示例的那一份（见下面写文件的地方）；Vite 的 React 示例、官网上显示的代码不放这一行
          const code = code0.replace(/^\s*["']use client["'];?\n/, "");
          files[fw][0] = { ...files[fw][0], code: code.endsWith("\n") ? code : code + "\n" };
        }
        host.remove();
        return { id: c.id, n: -1, slug: e.slug, cap: e.title, ready: true, contract: true, files, extra: [] };
      });
    }, { c });
    const sec = SECTIONS.find((x) => x.id === c.id) || { id: c.id, name: c.name || c.id, group: c.group || "" };
    demos.push(...got.map((d) => ({ ...d, section: sec })));
    console.log(`${c.id.padEnd(12)} 契约示例 ${got.length} 个`);
  }
}

// ———— 页面配方：8 种整页（spec/recipes），预览载好以后按真实排版生成 7 种写法 ————
const recipes = [];
if (!ONLY || ONLY.split(",").includes("recipes")) {
  const ids = JSON.parse(fs.readFileSync(path.join(ROOT, "tests/recipes/index.json"), "utf8"));
  for (const id of ids) {
    await page.goto(`${BASE}/site/next-docs.html#/recipe/${id}`, { waitUntil: "load" });
    // 等预览 iframe 载好（按真实排版判断空白）：最多 30 秒
    let r = null;
    for (let i = 0; i < 60; i++) { r = await page.evaluate(() => window.__satinRecipeFiles?.()).catch(() => null); if (r?.id === id && r.ready) break; await sleep(500); }
    if (r) recipes.push(r);
    console.log(`配方 ${id.padEnd(12)} ${r?.ready ? "" : "（预览没载好，按标签猜的空白）"}`);
  }
}
await browser.close();

// ———— 写文件：每个框架每个演示一份组件文件（+ 演示用样式） ————
let nFiles = 0;
for (const fw of FRAMEWORKS) {
  for (const d of demos) {
    const files = d.files[fw.id]; if (!files) continue;
    const main = path.join(ROOT, fw.dir, fw.demo(d.slug)), dir = path.dirname(main);
    for (const f of files) { write(f === files[0] ? main : path.join(dir, f.name), f.code); nFiles++; }
  }
  // Next.js、Nuxt：和 React、Vue 同一套组件文件（环境不同，写法一样），拷一份进各自的示例
  for (const env of fw.envs || []) for (const d of demos) {
    const files = d.files[fw.id]; if (!files) continue;
    const sub = env.id === "next" ? "app/demos" : "app/demos", dir = path.join(ROOT, env.dir, sub);
    for (const f of files) { write(path.join(dir, f.name), env.id === "next" && f === files[0] && !/^["']use client["']/.test(f.code.trim()) ? `"use client";\n${f.code}` : f.code); nFiles++; }
  }
}
// 配方：每个框架 fw.recipe(id) 一份（+ 样式）；CLI 的 satin add 也读这一份（packages/satin-cli/templates/recipes/<id>/<写法>/）
const CLI_VARIANT = { html: "html", react: "react", vue: "vue", svelte: "svelte", angular: "angular", solid: "solid", preact: "preact" };
for (const r of recipes) for (const fw of FRAMEWORKS) {
  const files = r.files[fw.id]; if (!files) continue;
  const main = path.join(ROOT, fw.dir, fw.recipe(r.id)), dir = path.dirname(main);
  for (const f of files) { write(f === files[0] ? main : path.join(dir, f.name), f.code); nFiles++; }
  if (fw.id === "html") continue; // 纯 HTML 项目要的是一整张页面（CLI 自己从 tests/recipes 生成），不用这里的片段
  const cdir = path.join(ROOT, "packages/satin-cli/templates/recipes", r.id, CLI_VARIANT[fw.id]), title = RECIPES.find((x) => x.id === r.id)?.title || r.id;
  for (const f of files) write(path.join(cdir, f === files[0] ? path.basename(main) : f.name), f.code);
  write(path.join(cdir, "manifest.json"), JSON.stringify({ title, files: files.map((f, i) => (i === 0 ? path.basename(main) : f.name)), entry: path.basename(main) }, null, 1) + "\n");
}
// 清单：官网、入口页、比对脚本都按它走
const manifest = demos.map((d) => ({ slug: d.slug, id: d.id, n: d.n, name: d.section.name, group: d.section.group, cap: d.cap, css: !!d.files.react[1], ...(d.contract ? { contract: true } : {}) }));
if (!ONLY) write(path.join(ROOT, "examples/shared/demos.json"), JSON.stringify(manifest, null, 1) + "\n");
console.log(`演示 ${demos.length} 个，写了 ${nFiles} 个文件（${((Date.now() - t0) / 1000).toFixed(0)} 秒）${errs.length ? `；页面报错 ${errs.length} 条：${errs.slice(0, 3).join(" | ")}` : ""}`);
if (ENTRIES && !ONLY) { const { writeEntries } = await import("./gallery-entries.mjs"); writeEntries(manifest); }
