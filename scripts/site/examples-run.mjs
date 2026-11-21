// 全量示例单独运行检查：site/examples.js（和 usage.js 的 EX）里每个演示的代码，单独打开都不许报错、要画得出来。
// 改 examples.js / usage.js 以后都要跑。两种模式：
//   默认（改代码时，不等重新生成）：逐个组件页调 window.__satinDemoFiles()，拿生成器（scripts/examples/gallery.mjs）会写出的纯 HTML 写法，
//     放进 examples/html/play.html（同一个 import map、同一个 setup()），照 play.html 的做法插标记、跑模块脚本，记报错、看有没有画出来。
//   --built（库会话重新生成、构建以后）：7 种写法逐个打开——纯 HTML 每个演示开 play.html?demo=<slug>，其余开 examples/<框架>/dist/gallery.html，
//     记控制台报错（错误边界会把出错的演示名带上）和每个演示格子有没有画出来。
//   --poke（配合默认模式）：打开以后再把演示里看得见的按钮挨个点一下（每次点完按 Esc 关掉浮层；表单不提交、链接不跳），点出来的报错、失败的请求也算
// 用法（5192 起着）：node scripts/site/examples-run.mjs [--ids button,tooltip,…] [--poke] [--built] [--out /tmp/site-examples-run]
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i < 0 ? d : process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : true; };
const OUT = arg("out", "/tmp/site-examples-run"), B = "http://127.0.0.1:5192", ONLY = arg("ids", "") ? String(arg("ids")).split(",") : null, BUILT = !!arg("built", false), POKE = !!arg("poke", false);
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await pw.chromium.launch({ channel: "chrome", headless: true });
const bad = [], okList = [];
// 控制台的"Failed to load resource"不带地址：改成记失败的请求（带地址）；浏览器自己要的网站图标、演示里的外链图片视频不算
const OK_404 = (u) => /\/favicon\.ico$|mixkit|unsplash/.test(u);
const watch = (p, errs) => { p.on("pageerror", (e) => errs.push(String(e.message).slice(0, 200))); p.on("console", (m) => { if (m.type() === "error" && !/^Failed to load resource/.test(m.text())) errs.push("console " + m.text().slice(0, 240)); }); p.on("response", (r) => { if (r.status() >= 400 && !OK_404(r.url())) errs.push(`请求 ${r.status()} ${r.url().replace(B, "")}`); }); };
// 跑一段演示（纯 HTML 写法）：照 play.html 的做法
async function runSnippet(page, slug, html) {
  const errs = [];
  const onErr = (e) => errs.push(String(e.message || e).slice(0, 200)), onCon = (m) => { if (m.type() === "error" && !/^Failed to load resource/.test(m.text())) errs.push("console " + m.text().slice(0, 200)); }, onRes = (r) => { if (r.status() >= 400 && !OK_404(r.url())) errs.push(`请求 ${r.status()} ${r.url().replace(B, "")}`); };
  page.on("pageerror", onErr); page.on("console", onCon); page.on("response", onRes);
  await page.goto(`${B}/examples/html/play.html`, { waitUntil: "load" }); await sleep(300);
  await page.evaluate((html) => {
    const box = document.querySelector(".play"), tp = document.createElement("template"); tp.innerHTML = html;
    const scripts = [...tp.content.querySelectorAll("script")]; for (const s of scripts) s.remove();
    box.append(tp.content);
    for (const s of scripts) { const x = document.createElement("script"); x.type = "module"; x.textContent = s.textContent; box.append(x); }
  }, html);
  await sleep(1800);
  const drawn = await page.evaluate(() => { const box = document.querySelector(".play"), r = box.getBoundingClientRect(); const els = [...box.querySelectorAll("*")].filter((e) => e.tagName !== "SCRIPT" && e.getBoundingClientRect().height > 0); return { h: Math.round(r.height), n: els.length }; });
  if (POKE) {
    await page.evaluate(() => { document.addEventListener("submit", (e) => e.preventDefault(), true); document.addEventListener("click", (e) => { if (e.target.closest("a[href]")) e.preventDefault(); }, true); });
    const n = await page.evaluate(() => { const bs = [...document.querySelectorAll(".play button, .play [role=button]")].filter((x) => x.getBoundingClientRect().height > 0); bs.forEach((x, i) => (x.dataset.poke = i)); return bs.length; });
    for (let i = 0; i < Math.min(n, 24); i++) {
      const el = page.locator(`[data-poke="${i}"]`);
      if (!(await el.isVisible().catch(() => false))) continue;
      await el.click({ timeout: 1500, force: true }).catch(() => {}); await sleep(250);
      await page.keyboard.press("Escape").catch(() => {}); await sleep(120);
    }
    await sleep(1600); // 点出来的异步（转圈、模拟请求）走完
  }
  page.off("pageerror", onErr); page.off("console", onCon); page.off("response", onRes);
  return { slug, errs: [...new Set(errs)], drawn };
}
if (!BUILT) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }), docs = await ctx.newPage(), play = await ctx.newPage();
  await docs.goto(`${B}/site/next-docs.html#/components`, { waitUntil: "load" }); await sleep(2000);
  let ids = await docs.evaluate(() => [...new Set([...document.querySelectorAll("[data-side] a[href^='#/c/']")].map((a) => a.getAttribute("href").slice(4)))]);
  if (ONLY) ids = ids.filter((x) => ONLY.includes(x));
  for (const id of ids) {
    await docs.evaluate((id) => { location.hash = "#/c/" + id; }, id);
    await docs.waitForFunction((id) => { const bs = [...document.querySelectorAll(".dx[data-demo]")]; return typeof window.__satinDemoFiles === "function" && bs.length > 0 && bs.every((x) => x.dataset.demo === id) && !document.querySelector("[data-async]"); }, id, { timeout: 20000 }).catch(() => {});
    // 每个演示框滚到视口里等它载好（演示文档解析完）——和生成器一样，标记里脚本生成的部分要从演示文档里取
    const n = await docs.evaluate(() => document.querySelectorAll(".dx[data-demo]:not([data-play])").length);
    for (let i = 0; i < n; i++) {
      await docs.evaluate((i) => document.querySelectorAll(".dx[data-demo]:not([data-play])")[i].scrollIntoView({ block: "center" }), i);
      await docs.waitForFunction((i) => { const f = document.querySelectorAll(".dx[data-demo]:not([data-play])")[i].querySelector("iframe"); try { return !!f.contentDocument?.__dx; } catch { return false; } }, i, { timeout: 15000 }).catch(() => {});
    }
    await sleep(500);
    const got = (await docs.evaluate(() => window.__satinDemoFiles())).filter((d, i, a) => a.findIndex((x) => x.slug === d.slug) === i);
    for (const d of got) {
      const html = d.files?.html?.[0]?.code; if (!html) { bad.push({ slug: d.slug, why: "生成器拿不到纯 HTML 写法" }); continue; }
      // 点了才发的请求跑一遍发现不了：代码里（去掉注释）直接 fetch 网站上的绝对路径的，算依赖官网的接口——数据要写在示例里或者本地模拟
      const live = html.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
      if (/\bfetch\(\s*["'`]\/(?!\/)/.test(live)) bad.push({ slug: d.slug, why: "依赖官网的接口（fetch 网站上的路径），数据要写在示例里或者本地模拟" });
      const r = await runSnippet(play, d.slug, html);
      if (r.errs.length) bad.push({ slug: d.slug, why: "报错", errs: r.errs });
      else if (!r.drawn.n) bad.push({ slug: d.slug, why: "什么都没画出来" });
      else okList.push(d.slug);
      fs.writeFileSync(`${OUT}/${d.slug}.html`, html);
      process.stdout.write(`\r${d.slug.padEnd(16)} ${r.errs.length ? "✗ " + r.errs[0].slice(0, 60) : r.drawn.n ? "✓" : "✗ 空"}                         `);
    }
  }
  await ctx.close();
} else {
  // 纯 HTML：每个演示开 play.html?demo=
  const demos = JSON.parse(fs.readFileSync(new URL("../../examples/shared/demos.json", import.meta.url), "utf8")).filter((d) => !ONLY || ONLY.includes(d.id));
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  for (const d of demos) {
    const errs = [], page = await ctx.newPage(); watch(page, errs);
    await page.goto(`${B}/examples/html/play.html?demo=${d.slug}`, { waitUntil: "load" }); await sleep(1500);
    await page.close();
    if (errs.length) bad.push({ fw: "html", slug: d.slug, why: "报错", errs: [...new Set(errs)] }); else okList.push("html:" + d.slug);
    process.stdout.write(`\rhtml ${d.slug.padEnd(16)} ${errs.length ? "✗" : "✓"}          `);
  }
  // 其余写法：全量页（构建产物）
  for (const fw of ["react", "vue", "svelte", "angular", "solid", "preact"]) {
    const url = fw === "angular" ? `${B}/examples/angular/dist/browser/gallery.html` : `${B}/examples/${fw}/dist/gallery.html`;
    const errs = [], p2 = await ctx.newPage(); watch(p2, errs);
    const res = await p2.goto(url, { waitUntil: "load" }).catch((e) => ({ status: () => 0, e }));
    await sleep(4000);
    const cells = await p2.evaluate(() => [...document.querySelectorAll("[data-demo]")].map((c) => ({ slug: c.dataset.demo, h: Math.round(c.getBoundingClientRect().height), n: c.querySelectorAll("*").length, err: !!c.querySelector(".demo-err, .demo-error, [data-demo-error]") }))).catch(() => []);
    const empty = cells.filter((c) => !c.n || c.err || c.h < 8).map((c) => c.slug);
    if (!res || (res.status && res.status() >= 400)) bad.push({ fw, why: `全量页打不开 ${url}` });
    if (errs.length) bad.push({ fw, why: "全量页报错", errs: [...new Set(errs)].slice(0, 20) });
    if (empty.length) bad.push({ fw, why: `${empty.length} 个演示没画出来`, errs: empty });
    okList.push(`${fw}: ${cells.length - empty.length}/${cells.length} 个演示画出来`);
    process.stdout.write(`\r${fw.padEnd(8)} 全量页 ${cells.length} 个演示，没画出来 ${empty.length}，报错 ${errs.length}            `);
    await p2.close();
  }
  await ctx.close();
}
await b.close();
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify({ bad, ok: okList }, null, 1));
console.log(`\n${BUILT ? "构建产物" : "单独运行"}：通过 ${okList.length}，有问题 ${bad.length}（${OUT}）`);
for (const x of bad) console.log(`  ✗ ${x.fw ? x.fw + " " : ""}${x.slug || ""} ${x.why}${x.errs ? "：" + x.errs.slice(0, 3).join(" | ") : ""}`);
