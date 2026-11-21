// 全量示例逐块比对：每个框架的全量入口页里每个演示截一张，和设计稿里同一个演示比（同样的种子随机数、固定时间，演示框统一宽度）。
// 两种比法：
//   · 纯 HTML 全量页 ↔ 设计稿：官网给的代码能不能做出和现场演示一样的东西（演示接线是设计稿自己的，带随机的几块会有差别，报告里单列）
//   · 每个框架 ↔ 纯 HTML 全量页：同一份代码换个框架写，画出来要逐像素一样（随机数顺序也一样）
// 先构建（node scripts/examples/build.mjs 或各示例 npx vite build / ng build / next build / nuxt build）、起服务（python3 serve.py 5192 .）。
// 用法：node scripts/examples/gallery-check.mjs [--fw react,vue] [--only button-0,select-0] [--theme light|dark] [--out /tmp/satin-gallery]
// Next.js、Nuxt：脚本自己起它们的生产服务（next start、node .output/server），比完关掉
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { launch, newContext, arg, sleep, ROOT, SIDES } from "../parity/lib.mjs";

const THEME = arg("theme", "light"), OUT = arg("out", `/tmp/satin-gallery/${THEME}`), ONLY = arg("only", "");
const FWS = String(arg("fw", "html,react,vue,svelte,angular,solid,preact,next,nuxt")).split(",");
const W = 880; // 演示框统一宽度（两边一样，内容按同样的宽度排）
fs.mkdirSync(OUT, { recursive: true });
const list = JSON.parse(fs.readFileSync(path.join(ROOT, "examples/shared/demos.json"), "utf8")).filter((d) => !ONLY || ONLY.split(",").includes(d.slug));
const U = SIDES.cur.url;
const URLS = {
  html: `${U}/examples/html/gallery.html`, react: `${U}/examples/react/dist/gallery.html`, vue: `${U}/examples/vue/dist/gallery.html`, svelte: `${U}/examples/svelte/dist/gallery.html`,
  solid: `${U}/examples/solid/dist/gallery.html`, preact: `${U}/examples/preact/dist/gallery.html`, angular: `${U}/examples/angular/dist/browser/index.html?gallery`,
  next: "http://127.0.0.1:3101/gallery", nuxt: "http://127.0.0.1:3102/gallery",
};
const servers = [];
async function serve(fw) {
  const dir = path.join(ROOT, "examples", fw), port = fw === "next" ? 3101 : 3102;
  const p = fw === "next" ? spawn("npx", ["next", "start", "-p", String(port)], { cwd: dir, stdio: "ignore" }) : spawn("node", [".output/server/index.mjs"], { cwd: dir, stdio: "ignore", env: { ...process.env, PORT: String(port), HOST: "127.0.0.1" } });
  servers.push(p);
  for (let i = 0; i < 120; i++) { try { const r = await fetch(`http://127.0.0.1:${port}/gallery`); if (r.ok) return true; } catch {} await sleep(500); }
  return false;
}
const FIX = `.demo { width: ${W}px !important; max-width: none !important; margin-left: 0 !important; margin-right: 0 !important; box-sizing: border-box; } .sn-toasts, .sn-notifs { display: none !important; }`;

async function shoot(page, url, selOf, tag) {
  await page.goto(url, { waitUntil: "load" });
  await page.addStyleTag({ content: FIX });
  await page.waitForFunction(() => document.fonts?.status === "loaded", null, { timeout: 15000 }).catch(() => {});
  if (tag === "html") await page.waitForFunction(() => document.documentElement.dataset.ready === "1", null, { timeout: 30000 }).catch(() => {});
  await page.evaluate(() => window.__parity?.settle(600, 15000, 1500)).catch(() => {});
  await page.evaluate(() => window.__parity?.freeze()).catch(() => {});
  const out = {};
  for (const d of list) {
    const el = await page.$(selOf(d)); if (!el) { out[d.slug] = null; continue; }
    await el.scrollIntoViewIfNeeded().catch(() => {}); await sleep(30);
    const f = path.join(OUT, tag, d.slug + ".png"); fs.mkdirSync(path.dirname(f), { recursive: true });
    await el.screenshot({ path: f, animations: "disabled", caret: "hide" }).catch(() => (out[d.slug] = null));
    if (out[d.slug] !== null) out[d.slug] = f;
  }
  return out;
}
function diff(a, b, f) {
  if (!a || !b) return { err: !a ? "左边没截到" : "右边没截到" };
  const ia = PNG.sync.read(fs.readFileSync(a)), ib = PNG.sync.read(fs.readFileSync(b));
  if (ia.width !== ib.width || ia.height !== ib.height) return { size: `${ia.width}×${ia.height} ↔ ${ib.width}×${ib.height}` };
  const d = new PNG({ width: ia.width, height: ia.height }), n = pixelmatch(ia.data, ib.data, d.data, ia.width, ia.height, { threshold: 0, includeAA: true, alpha: 0.3 });
  if (n) fs.writeFileSync(f, PNG.sync.write(d));
  return { px: n, pct: +(n / (ia.width * ia.height) * 100).toFixed(3) };
}

const browser = await launch();
const report = { theme: THEME, width: W, demos: list.length, design: {}, fw: {} };
try {
  const ctx = await newContext(browser, { side: "cur", theme: THEME, size: "desktop", still: true });
  const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(e.message));
  // 设计稿：整页（每个演示是 #区块 > .demo 的第 n 个）
  const design = await shoot(page, `${U}/index.html`, (d) => `#${d.id} > .demo >> nth=${d.n}`, "design");
  const shots = {};
  for (const fw of FWS) {
    if ((fw === "next" || fw === "nuxt") && !(await serve(fw))) { report.fw[fw] = { err: "服务没起来（先构建）" }; continue; }
    const e0 = errs.length;
    shots[fw] = await shoot(page, URLS[fw], (d) => `[data-demo="${d.slug}"]`, fw);
    report.fw[fw] = { errors: errs.slice(e0, e0 + 5) };
  }
  // 纯 HTML ↔ 设计稿
  const dd = {}; let same = 0;
  for (const d of list) { const r = diff(shots.html?.[d.slug], design[d.slug], path.join(OUT, "_diff", `html-vs-design-${d.slug}.png`)); dd[d.slug] = r; if (r.px === 0) same++; }
  report.design = { same, total: list.length, bad: Object.fromEntries(Object.entries(dd).filter(([, r]) => r.px !== 0)) };
  // 每个框架 ↔ 纯 HTML
  for (const fw of FWS) {
    if (fw === "html" || !shots[fw]) continue;
    const bad = {}; let ok = 0;
    for (const d of list) { const r = diff(shots[fw][d.slug], shots.html?.[d.slug], path.join(OUT, "_diff", `${fw}-vs-html-${d.slug}.png`)); if (r.px === 0) ok++; else bad[d.slug] = r; }
    report.fw[fw] = { ...report.fw[fw], same: ok, total: list.length, bad };
  }
  report.designErrors = errs.slice(0, 5);
} finally {
  await browser.close();
  for (const p of servers) p.kill();
}
fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 1));
console.log(`全量示例比对（${THEME}，演示框 ${W}px，${list.length} 个演示）`);
console.log(`  纯 HTML ↔ 设计稿：${report.design.same}/${report.design.total} 逐像素一样`);
for (const [k, r] of Object.entries(report.design.bad || {}).slice(0, 30)) console.log(`      ✗ ${k}  ${r.err || r.size || r.pct + "%"}`);
for (const [fw, r] of Object.entries(report.fw)) {
  if (fw === "html") continue;
  console.log(`  ${fw.padEnd(8)} ↔ 纯 HTML：${r.err || `${r.same}/${r.total} 逐像素一样`}${r.errors?.length ? `；页面报错 ${r.errors.length} 条：${r.errors[0].slice(0, 120)}` : ""}`);
  for (const [k, x] of Object.entries(r.bad || {}).slice(0, 12)) console.log(`      ✗ ${k}  ${x.err || x.size || x.pct + "%"}`);
}
console.log(`截图、差异图、report.json 在 ${OUT}`);
