// 每个组件"挂载 → 更新 → 销毁"循环 100 次：活着的监听、观察器、定时器、DOM 节点数要回到起点，内存（强制 GC 以后）不涨。
// 用法：先起服务（python3 serve.py 5192 .），node scripts/test/lifecycle.mjs [--n 100]
import { launch, newContext, arg, SIDES } from "../parity/lib.mjs";
const N = +arg("n", 100);
// 组件、初始选项、更新用的选项
const CASES = [
  ["createSegmented", { items: ["网格", "列表", "时间线"], value: "网格" }, { value: "列表" }],
  ["createSlider", { value: 30, max: 100 }, { value: 60 }],
  ["createSelect", { items: ["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"], value: "16:9 · 横屏" }, { value: "1:1 · 方形" }],
  ["createOtp", { length: 6 }, {}],
  ["createTabs", { tabs: [{ label: "概览", content: "项目概览" }, { label: "镜头", content: "镜头列表" }], value: 0 }, { value: 1 }],
  ["createPager", { total: 10, page: 1, count: 128 }, { page: 3 }],
  ["createCollapse", { items: [{ title: "导出的成片放在哪里？", content: "默认放在下载文件夹" }, { title: "能多人协作吗？", content: "可以" }], open: [0] }, {}],
  ["createTagInput", { tags: ["雨夜", "车站"] }, {}],
  ["createStepper", { value: 4, min: 1, max: 60, unit: "秒" }, { value: 8 }],
  ["createNumberFlow", { value: 1284 }, { value: 1302 }],
];
const browser = await launch();
const ctx = await newContext(browser, { side: "cur" }), page = await ctx.newPage();
const errs = []; page.on("pageerror", (e) => errs.push(e.message));
await page.goto(SIDES.cur.url + "/tests/lifecycle.html"); await page.waitForFunction(() => window.ready);
await page.evaluate(() => window.setupSatin());
const cdp = await ctx.newCDPSession(page); await cdp.send("HeapProfiler.enable");
const heap = async () => { for (let i = 0; i < 3; i++) await cdp.send("HeapProfiler.collectGarbage"); return (await cdp.send("Runtime.getHeapUsage")).usedSize; };
// 堆快照里还活着的"脱离文档的 DOM 节点"（Detached HTMLxxxElement）：组件销毁后还被闭包、全局表抓着的，就是泄漏
async function detached() {
  for (let i = 0; i < 3; i++) await cdp.send("HeapProfiler.collectGarbage");
  let chunks = []; const on = (e) => chunks.push(e.chunk); cdp.on("HeapProfiler.addHeapSnapshotChunk", on);
  await cdp.send("HeapProfiler.takeHeapSnapshot", { reportProgress: false, captureNumericValue: false }); cdp.off("HeapProfiler.addHeapSnapshotChunk", on);
  const snap = JSON.parse(chunks.join("")); chunks = null;
  const f = snap.snapshot.meta.node_fields, nf = f.length, iName = f.indexOf("name"), strings = snap.strings, nodes = snap.nodes;
  let n = 0; for (let i = 0; i < nodes.length; i += nf) if (strings[nodes[i + iName]].startsWith("Detached ")) n++;
  return n;
}
let bad = 0;
for (const [name, init, next] of CASES) {
  const run = (n) => page.evaluate(async ({ name, init, next, n }) => {
    const host = document.getElementById("host");
    for (let i = 0; i < n; i++) { const inst = window.C[name](host, init); inst.update(next); await new Promise((r) => requestAnimationFrame(r)); inst.destroy(); }
    return { count: window.__count(), left: host.childNodes.length };
  }, { name, init, next, n });
  // 内存：先跑 N 次让 V8 的各种缓存（代码、内联缓存）稳定下来，再跑 N 次看第二轮涨了多少——真泄漏会跟着次数线性涨
  const warm = await run(N); const c0 = (await page.evaluate(() => window.__count())); const h0 = await heap(); const dt0 = await detached();
  const r = await run(N); const h1 = await heap(); const dt1 = await detached();
  const grow = Math.round((h1 - h0) / 1024), d = { listeners: r.count.listeners - c0.listeners, observers: r.count.observers - c0.observers, intervals: r.count.intervals - c0.intervals, nodes: r.count.nodes - c0.nodes };
  // 判据：监听、观察器、定时器、节点回到起点；第二轮以后脱离文档还活着的节点不增加（不随次数涨）；内存只作参考（V8 缓存会有几十到几百 KB 的波动）
  const ok = !d.listeners && !d.observers && !d.intervals && !d.nodes && !r.left && dt1 - dt0 <= 2;
  if (!ok) bad++;
  console.log(`${ok ? "✓" : "✗"} ${name.padEnd(18)} ${N} 次后：监听 ${d.listeners >= 0 ? "+" : ""}${d.listeners}，观察器 ${d.observers}，定时器 ${d.intervals}，节点 ${d.nodes}，宿主里剩 ${r.left}，脱离文档的节点 ${dt0} → ${dt1}，内存 ${grow >= 0 ? "+" : ""}${grow}KB`);
  void warm;
}
if (errs.length) { bad++; console.log("页面报错：", errs.slice(0, 5)); }
await browser.close();
console.log(bad ? `生命周期：${bad} 个有问题` : `生命周期：${CASES.length} 个组件全部干净`);
process.exitCode = bad ? 1 : 0;
