// 每个组件"挂载 → 更新 → 销毁"循环 100 次：活着的监听、观察器、定时器、DOM 节点数要回到起点，内存（强制 GC 以后）不涨。
// 用法：先起服务（python3 serve.py 5192 .），node scripts/test/lifecycle.mjs [--n 100]
import { launch, newContext, arg, SIDES } from "../parity/lib.mjs";
const N = +arg("n", 100);
// 组件、初始选项、更新用的选项、怎么准备元素：
//   不写 → 空容器（按 html() 渲染进去，框架里就这么用）；{ markup: 选择器 } → 从设计稿取那块标记放进去（没有 html()、要在现成标记上接的）；
//   { el: "<标记>" } → 直接给一段标记
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
  ["createComposer", { placeholder: "描述你想要的画面" }, {}],
  ["createCount", {}, {}],
  ["createEmail", {}, {}],
  ["createPassword", { label: "密码" }, {}],
  ["createSearch", {}, {}],
  ["createTable", { columns: [{ key: "name", title: "项目", sortable: true }, { key: "n", title: "镜头", align: "right" }], rows: [{ id: 1, name: "雨夜", n: 3 }, { id: 2, name: "长夜", n: 5 }], rowKey: "id", selectable: true }, { rows: [{ id: 1, name: "雨夜", n: 4 }] }],
  ["createPlayer", { label: "成片" }, {}],
  ["createAudio", { title: "配乐" }, {}],
  ["createLongText", {}, {}, { markup: "[data-ta]" }],
  ["createUpload", {}, {}, { markup: "#drop" }],
  ["createReorder", {}, {}, { markup: "#dragList" }],
  ["createProgressCard", {}, {}, { markup: "#pcard" }],
  ["createPicker", {}, {}, { markup: '[data-pk="date"]' }],
  ["createSidebar", {}, {}, { markup: "#app" }],
  ["createScrollArea", { fade: "y" }, { fade: "none" }, { el: '<div style="height:120px"><div style="height:600px">内容</div></div>' }],
  ["createInfiniteList", { total: 500, pageSize: 40, rowHeight: 40, loadPage: "rows", renderRow: "row" }, {}, { el: '<div class="sn-vl" style="height:240px"><div class="sn-vl-space"></div></div>' }],
  // 重组件（各自的入口）
  ["createChat", { title: "助手", placeholder: "说点什么" }, { status: "在线" }, { size: "height:420px" }],
  ["createMarkdown", { source: "# 标题\n\n正文 **加粗**，`代码`。\n\n```js\nconst a = 1;\n```\n\n| 列 | 值 |\n|---|---|\n| a | 1 |" }, { source: "## 换了\n\n- 一\n- 二" }],
  ["createFlow", { nodes: [{ id: "a", x: 40, y: 40, t: "原文", ic: "file-text", d: "第三集" }, { id: "b", x: 320, y: 40, t: "分镜", ic: "clapperboard", k: "board", d: "12 镜" }], edges: [["a", "b"]] }, {}, { size: "height:360px" }],
  ["createDataGrid", { rows: 2000, seed: 3 }, {}, { size: "height:420px" }],
  ["createCanvasGrid", { rows: 20000, seed: 3 }, {}, { size: "height:420px" }],
  ["createThemePanel", {}, {}],
  // 自定义元素（Svelte、Angular、Solid、Preact、纯 HTML 都走这条路）：插进页面自动创建、改属性 update、拿出来自动销毁
  ["<sn-segmented>", { items: ["网格", "列表"], value: "网格" }, { value: "列表" }, { element: "sn-segmented" }],
  ["<sn-select>", { items: ["16:9", "9:16"], value: "16:9" }, { value: "9:16" }, { element: "sn-select" }],
  ["<sn-tabs>", { tabs: [{ label: "概览", content: "a" }, { label: "镜头", content: "b" }], value: 0 }, { value: 1 }, { element: "sn-tabs" }],
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
for (const [name, init, next, how = {}] of CASES) {
  const e0 = errs.length;
  const run = (n) => page.evaluate(async ({ name, init, next, how, n }) => {
    const host = document.getElementById("host"), left = [];
    // 无限列表：取数、画行的函数传不进来，在页面里补上
    const fix = (o) => o.loadPage === "rows" ? { ...o, loadPage: (p, size) => Promise.resolve(Array.from({ length: size }, (_, k) => ({ id: p * size + k, t: "第 " + (p * size + k) + " 行" }))), renderRow: (r) => `<div>${r.t}</div>` } : o;
    for (let i = 0; i < n; i++) {
      // 准备元素：空容器 / 设计稿里那块标记 / 给定的标记（框架里卸载时整块拿掉，这里也是）
      const box = document.createElement("div"); if (how.size) box.style.cssText = how.size; host.append(box);
      if (how.element) {
        const tag = document.createElement(how.element); for (const [k, v] of Object.entries(init)) tag.setAttribute(k, typeof v === "string" ? v : JSON.stringify(v));
        box.append(tag); await new Promise((r) => requestAnimationFrame(r));
        if (!tag.instance) left.push("没有自动创建");
        for (const [k, v] of Object.entries(next)) tag.setAttribute(k, typeof v === "string" ? v : JSON.stringify(v));
        await new Promise((r) => requestAnimationFrame(r)); box.remove(); await Promise.resolve();
        if (tag.instance) left.push("移出页面后没有销毁");
        continue;
      }
      if (how.markup) box.innerHTML = window.markup(how.markup); else if (how.el) box.innerHTML = how.el;
      const el = how.markup || how.el ? box.firstElementChild : box;
      const inst = window.C[name](el, fix(init)); inst.update(fix(next)); await new Promise((r) => requestAnimationFrame(r)); inst.destroy();
      // 在现成标记上接的：销毁后元素上不能留着实例（_xxx），不然同一个元素再接一次拿到的是已经销毁的旧实例
      if (how.markup || how.el) { const ks = Object.keys(el).filter((k) => k.startsWith("_") && el[k]); if (ks.length) left.push(ks.join(",")); }
      box.remove();
    }
    return { count: window.__count(), left: host.childNodes.length, stale: [...new Set(left)] };
  }, { name, init, next, how, n });
  // 内存：先跑 N 次让 V8 的各种缓存（代码、内联缓存）稳定下来，再跑 N 次看第二轮涨了多少——真泄漏会跟着次数线性涨
  const warm = await run(N); const c0 = (await page.evaluate(() => window.__count())); const h0 = await heap(); const dt0 = await detached();
  const r = await run(N); const h1 = await heap(); const dt1 = await detached();
  const grow = Math.round((h1 - h0) / 1024), d = { listeners: r.count.listeners - c0.listeners, observers: r.count.observers - c0.observers, intervals: r.count.intervals - c0.intervals, workers: r.count.workers - c0.workers, nodes: r.count.nodes - c0.nodes };
  // 判据：监听、观察器、定时器、节点回到起点；第二轮以后脱离文档还活着的节点不增加（不随次数涨）；内存只作参考（V8 缓存会有几十到几百 KB 的波动）
  const ok = !d.listeners && !d.observers && !d.intervals && !d.workers && !d.nodes && !r.left && !r.stale.length && dt1 - dt0 <= 2;
  if (errs.length > e0) { console.log(`  ${name} 跑的时候页面报错：`, errs.slice(e0, e0 + 3)); }
  if (!ok || errs.length > e0) bad++;
  console.log(`${ok ? "✓" : "✗"} ${name.padEnd(18)} ${N} 次后：监听 ${d.listeners >= 0 ? "+" : ""}${d.listeners}，观察器 ${d.observers}，定时器 ${d.intervals}，后台线程 ${d.workers}，节点 ${d.nodes}，宿主里剩 ${r.left}${r.stale.length ? "，销毁后元素上还留着 " + r.stale.join(" / ") : ""}，脱离文档的节点 ${dt0} → ${dt1}，内存 ${grow >= 0 ? "+" : ""}${grow}KB`);
  void warm;
}
if (errs.length) { bad++; console.log("页面报错：", errs.slice(0, 5)); }
await browser.close();
console.log(bad ? `生命周期：${bad} 个有问题` : `生命周期：${CASES.length} 个组件全部干净`);
process.exitCode = bad ? 1 : 0;
