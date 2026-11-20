// 框架里的泄漏测试：React（StrictMode）、Vue 的示例各有一张 leak.html——
// 反复切"路由"（示例页 ↔ 表格 + 弹窗 + 标签页 + 分页的页）、整页条件渲染挂上卸下，各 N 次。
// 卸下以后：活着的事件监听、观察器、定时器要回到第一次卸下时的数（tests/count-probe.js 计），强制 GC 后脱离文档的节点不涨、堆不明显涨。
// 用法：先 python3 serve.py 5192 . 、node scripts/examples/build.mjs --only react,vue；node scripts/test/framework-leaks.mjs [--n 50]
import path from "node:path";
import { pw, arg, ROOT } from "../parity/lib.mjs";

const N = +arg("n", 50);
const PAGES = { react: "http://127.0.0.1:5192/examples/react/dist/leak.html", vue: "http://127.0.0.1:5192/examples/vue/dist/leak.html" };
const browser = await pw.chromium.launch({ channel: "chrome", headless: true });
let bad = 0;
for (const [fw, url] of Object.entries(PAGES)) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "zh-CN" });
  await ctx.addInitScript({ path: path.join(ROOT, "tests/count-probe.js") });
  const page = await ctx.newPage(), errs = [];
  page.on("pageerror", (e) => errs.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  await page.goto(url, { waitUntil: "load" }); await page.waitForFunction(() => window.__ready);
  const cdp = await ctx.newCDPSession(page); await cdp.send("HeapProfiler.enable");
  const gc = async () => { for (let i = 0; i < 3; i++) await cdp.send("HeapProfiler.collectGarbage"); };
  const frames = (n = 3) => page.evaluate((n) => new Promise((ok) => { let k = 0; const f = () => (++k >= n ? ok() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
  const detached = async () => { await gc(); const r = await cdp.send("Runtime.evaluate", { expression: "document.querySelectorAll('*').length", returnByValue: true }); return r.result.value; };
  // 一轮：切到另一页、切回来、整页卸下、再挂上
  const cycle = async () => { await page.evaluate(() => window.__set("other")); await frames(); await page.evaluate(() => window.__set("sink")); await frames(); await page.evaluate(() => window.__set(null, false)); await frames(); await page.evaluate(() => window.__set(null, true)); await frames(); };
  await cycle(); await page.evaluate(() => window.__set(null, false)); await frames(10); await gc();
  const c0 = await page.evaluate(() => window.__count()), h0 = (await cdp.send("Runtime.getHeapUsage")).usedSize, n0 = await detached();
  await page.evaluate(() => window.__set(null, true)); await frames();
  for (let i = 0; i < N; i++) await cycle();
  await page.evaluate(() => window.__set(null, false)); await frames(10); await gc();
  const c1 = await page.evaluate(() => window.__count()), h1 = (await cdp.send("Runtime.getHeapUsage")).usedSize, n1 = await detached();
  const leaks = Object.keys(c1).filter((k) => typeof c1[k] === "number" && c1[k] > c0[k]);
  const heapMB = (h1 - h0) / 1048576;
  const ok = !leaks.length && heapMB < 2 && !errs.length;
  if (!ok) bad++;
  console.log(`  ${ok ? "✓" : "✗"} ${fw.padEnd(6)} ${N} 轮（切路由 + 条件渲染）：${Object.keys(c0).map((k) => `${k} ${c0[k]}→${c1[k]}`).join("，")}；节点 ${n0}→${n1}；堆 ${heapMB >= 0 ? "+" : ""}${heapMB.toFixed(2)} MB${errs.length ? "；报错 " + errs[0].slice(0, 160) : ""}`);
  await ctx.close();
}
await browser.close();
console.log(bad ? `框架泄漏测试：${bad} 个不通过` : "框架泄漏测试：React（StrictMode）、Vue 都不泄漏");
process.exitCode = bad ? 1 : 0;
