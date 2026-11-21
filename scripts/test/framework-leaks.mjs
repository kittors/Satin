// 框架里的泄漏测试：React（StrictMode）、Vue 的示例各有一张 leak.html——
// 反复切"路由"（示例页 ↔ 表格 + 弹窗 + 标签页 + 分页的页）、整页条件渲染挂上卸下。每个框架分两遍：
//   1. 带计数探针（tests/count-probe.js）：先跑 N 轮热身，再跑 N 轮；两次卸下以后活着的事件监听、观察器、定时器、后台线程要一样多
//   2. 不带探针量堆：探针为了数监听，会一直抓着每个加过监听的对象（元素、动画……），带着它量堆，涨的大头是探针自己（实测 7–12 MB）。
//      这一遍连跑三批，每批 N 轮：脱离文档的节点（堆快照里 Detached 开头的）不涨；第三批比第二批涨的堆要小于 1 MB
//      （第一批里 V8 的代码缓存、优化编译、样式共享缓存这些还在长，不算）
// 用法：先 python3 serve.py 5192 . 、node scripts/examples/build.mjs --only react,vue；node scripts/test/framework-leaks.mjs [--n 40]
import path from "node:path";
import { pw, arg, ROOT } from "../parity/lib.mjs";

const N = +arg("n", 40);
const PAGES = { react: "http://127.0.0.1:5192/examples/react/dist/leak.html", vue: "http://127.0.0.1:5192/examples/vue/dist/leak.html" };
const browser = await pw.chromium.launch({ channel: "chrome", headless: true });
let bad = 0;

async function open(url, probe) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "zh-CN" });
  if (probe) await ctx.addInitScript({ path: path.join(ROOT, "tests/count-probe.js") });
  const page = await ctx.newPage(), errs = [];
  // 404 的资源记下地址（控制台那条"Failed to load resource"不带地址）；浏览器自己要的 /favicon.ico 不算
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
  page.on("response", (r) => { if (r.status() >= 400 && !/\/favicon\.ico$/.test(r.url())) errs.push(`${r.status()} ${r.url()}`); });
  await page.goto(url, { waitUntil: "load" }); await page.waitForFunction(() => window.__ready);
  const cdp = await ctx.newCDPSession(page); await cdp.send("HeapProfiler.enable");
  const gc = async () => { for (let i = 0; i < 3; i++) await cdp.send("HeapProfiler.collectGarbage"); };
  const frames = (n = 3) => page.evaluate((n) => new Promise((ok) => { let k = 0; const f = () => (++k >= n ? ok() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
  // 真正"脱离文档还活着"的节点：堆快照里名字是 Detached HTMLxxxElement 的
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
  const batch = async () => { await page.evaluate(() => window.__set(null, true)); await frames(); for (let i = 0; i < N; i++) await cycle(); await page.evaluate(() => window.__set(null, false)); await frames(10); await gc(); };
  return { ctx, page, cdp, errs, gc, detached, batch };
}

for (const [fw, url] of Object.entries(PAGES)) {
  // 1. 计数（带探针）
  const A = await open(url, true);
  await A.batch(); const c0 = await A.page.evaluate(() => window.__count());
  await A.batch(); const c1 = await A.page.evaluate(() => window.__count());
  const leaks = Object.keys(c1).filter((k) => typeof c1[k] === "number" && c1[k] > c0[k]);
  const errs = [...A.errs]; await A.ctx.close();
  // 2. 堆（不带探针）：三批
  const B = await open(url, false), hs = [], ns = [];
  for (let b = 0; b < 3; b++) { await B.batch(); hs.push((await B.cdp.send("Runtime.getHeapUsage")).usedSize); ns.push(await B.detached()); }
  errs.push(...B.errs); await B.ctx.close();
  const g2 = (hs[1] - hs[0]) / 1048576, g3 = (hs[2] - hs[1]) / 1048576;
  const ok = !leaks.length && ns[2] <= ns[0] + 2 && g3 < 1 && !errs.length;
  if (!ok) bad++;
  console.log(`  ${ok ? "✓" : "✗"} ${fw.padEnd(6)} 每批 ${N} 轮（切路由 + 条件渲染）：${Object.keys(c0).map((k) => `${k} ${c0[k]}→${c1[k]}`).join("，")}；脱离文档的节点 ${ns.join("→")}；堆第二批 ${g2 >= 0 ? "+" : ""}${g2.toFixed(2)} MB、第三批 ${g3 >= 0 ? "+" : ""}${g3.toFixed(2)} MB${errs.length ? "；报错 " + errs[0].slice(0, 160) : ""}`);
}
await browser.close();
console.log(bad ? `框架泄漏测试：${bad} 个不通过` : "框架泄漏测试：React（StrictMode）、Vue 都不泄漏");
process.exitCode = bad ? 1 : 0;
