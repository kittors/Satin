// 框架里的泄漏测试：React（StrictMode）、Vue 的示例各有一张 leak.html——
// 反复切"路由"（示例页 ↔ 表格 + 弹窗 + 标签页 + 分页的页）、整页条件渲染挂上卸下，各 N 次。
// 先跑 N 轮热身，再跑 N 轮：第二批跑完卸下以后，活着的事件监听、观察器、定时器、后台线程要和第一批跑完时一样（tests/count-probe.js 计），
// 强制 GC 后堆快照里脱离文档还活着的节点不涨，堆涨不到 1 MB。
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
  // 404 的资源记下地址（控制台那条"Failed to load resource"不带地址）；浏览器自己要的 /favicon.ico 不算
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
  page.on("response", (r) => { if (r.status() >= 400 && !/\/favicon\.ico$/.test(r.url())) errs.push(`${r.status()} ${r.url()}`); });
  await page.goto(url, { waitUntil: "load" }); await page.waitForFunction(() => window.__ready);
  const cdp = await ctx.newCDPSession(page); await cdp.send("HeapProfiler.enable");
  const gc = async () => { for (let i = 0; i < 3; i++) await cdp.send("HeapProfiler.collectGarbage"); };
  const frames = (n = 3) => page.evaluate((n) => new Promise((ok) => { let k = 0; const f = () => (++k >= n ? ok() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
  // 真正"脱离文档还活着"的节点：堆快照里名字是 Detached HTMLxxxElement 的（原来数的是文档里的节点，漏了被闭包抓住的那些）
  const detached = async () => {
    await gc(); let chunks = []; const on = (e) => chunks.push(e.chunk); cdp.on("HeapProfiler.addHeapSnapshotChunk", on);
    await cdp.send("HeapProfiler.takeHeapSnapshot", { reportProgress: false, captureNumericValue: false }); cdp.off("HeapProfiler.addHeapSnapshotChunk", on);
    const snap = JSON.parse(chunks.join("")); chunks = null;
    const f = snap.snapshot.meta.node_fields, nf = f.length, iName = f.indexOf("name"), strs = snap.strings, nodes = snap.nodes;
    let n = 0; for (let i = 0; i < nodes.length; i += nf) if (strs[nodes[i + iName]].startsWith("Detached ")) n++;
    return n;
  };
  // 一轮：切到另一页、切回来、整页卸下、再挂上
  const cycle = async () => { await page.evaluate(() => window.__set("other")); await frames(); await page.evaluate(() => window.__set("sink")); await frames(); await page.evaluate(() => window.__set(null, false)); await frames(); await page.evaluate(() => window.__set(null, true)); await frames(); };
  // 先跑 N 轮让 V8 的代码缓存、优化编译稳定下来（这部分堆会涨几 MB，和泄漏无关），以此为起点再跑 N 轮：
  // 真泄漏会跟着轮数线性涨（监听、观察器、定时器、脱离文档的节点、堆都会继续涨）
  const settle = async () => { await page.evaluate(() => window.__set(null, false)); await frames(10); await gc(); };
  const measure = async () => ({ c: await page.evaluate(() => window.__count()), h: (await cdp.send("Runtime.getHeapUsage")).usedSize, n: await detached() });
  await page.evaluate(() => window.__set(null, true)); await frames();
  for (let i = 0; i < N; i++) await cycle();
  await settle(); const m0 = await measure(), c0 = m0.c, h0 = m0.h, n0 = m0.n;
  await page.evaluate(() => window.__set(null, true)); await frames();
  for (let i = 0; i < N; i++) await cycle();
  await settle(); const m1 = await measure(), c1 = m1.c, h1 = m1.h, n1 = m1.n;
  const leaks = Object.keys(c1).filter((k) => typeof c1[k] === "number" && c1[k] > c0[k]);
  const heapMB = (h1 - h0) / 1048576;
  const ok = !leaks.length && n1 <= n0 + 2 && heapMB < 1 && !errs.length;
  if (!ok) bad++;
  console.log(`  ${ok ? "✓" : "✗"} ${fw.padEnd(6)} ${N} 轮（切路由 + 条件渲染）：${Object.keys(c0).map((k) => `${k} ${c0[k]}→${c1[k]}`).join("，")}；脱离文档的节点 ${n0}→${n1}；第二批 ${N} 轮堆 ${heapMB >= 0 ? "+" : ""}${heapMB.toFixed(2)} MB${errs.length ? "；报错 " + errs[0].slice(0, 160) : ""}`);
  await ctx.close();
}
await browser.close();
console.log(bad ? `框架泄漏测试：${bad} 个不通过` : "框架泄漏测试：React（StrictMode）、Vue 都不泄漏");
process.exitCode = bad ? 1 : 0;
