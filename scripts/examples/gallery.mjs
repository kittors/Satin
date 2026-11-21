// 全量框架示例：设计稿 61 块的每个演示 × 7 种写法（site/frameworks.js 登记的框架），写进 examples/<框架>/。
// 代码和官网文档页是同一个生成器（site/variants.js）：在文档页里等每个演示载好，按真实排版判断空白，再取出 7 种写法。
// 官网的代码块读的就是这里写出来的文件；构建、截图和设计稿逐块比对见 scripts/examples/gallery-check.mjs。
// 用法（先起服务：python3 serve.py 5192 .）：node scripts/examples/gallery.mjs [--only button,select] [--no-entries]
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { FRAMEWORKS } from "../../site/frameworks.js";

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
for (const m of nav.matchAll(/<p>([^<]+)<\/p>|<a href="#([a-z0-9-]+)">([^<]+)<\/a>/g)) { if (m[1]) group = m[1].trim(); else SECTIONS.push({ id: m[2], name: m[3].trim(), group }); }
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
  const got = await page.evaluate(() => window.__satinDemoFiles());
  const bad = got.filter((d) => !d.ready).map((d) => d.slug);
  demos.push(...got.map((d) => ({ ...d, section: sec })));
  console.log(`${sec.id.padEnd(12)} ${got.length} 个演示${bad.length ? `（没等到载好：${bad.join(", ")}，按标签猜的空白）` : ""}`);
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
    for (const f of files) { write(path.join(dir, f.name), f.code); nFiles++; }
  }
}
// 清单：官网、入口页、比对脚本都按它走
const manifest = demos.map((d) => ({ slug: d.slug, id: d.id, n: d.n, name: d.section.name, group: d.section.group, cap: d.cap, css: !!d.files.react[1] }));
if (!ONLY) write(path.join(ROOT, "examples/shared/demos.json"), JSON.stringify(manifest, null, 1) + "\n");
console.log(`演示 ${demos.length} 个，写了 ${nFiles} 个文件（${((Date.now() - t0) / 1000).toFixed(0)} 秒）${errs.length ? `；页面报错 ${errs.length} 条：${errs.slice(0, 3).join(" | ")}` : ""}`);
if (ENTRIES && !ONLY) { const { writeEntries } = await import("./gallery-entries.mjs"); writeEntries(manifest); }
