// 封装的受控 / 非受控测试（React StrictMode、Vue）：
// · 非受控（React 只给 defaultValue，Vue 只写 value）：用户改了值，父组件重新渲染（还换了 items 数组的引用）以后不被打回初始值
// · 受控的标签输入、折叠面板：父组件清空 / 换一组 / 展开某项，界面跟着变；用户操作时回调带新值
// · React 只读（给 value 不给 onChange）：点了会退回父组件给的值
// 全程不能有页面报错、控制台错误（React 开发模式的警告、Vue warn 也算）。
// 用法：先 python3 serve.py 5192 . ；node scripts/test/controlled.mjs [--only react|vue] [--headed]（浏览器任务，拿共用锁跑）
import fs from "node:fs";
import path from "node:path";
import * as esbuild from "esbuild";
import { pw, arg, ROOT } from "../parity/lib.mjs";

const OUT = path.join(ROOT, ".parity/controlled");
fs.mkdirSync(OUT, { recursive: true });
const FWS = (arg("only", "react,vue") || "react,vue").split(",");
for (const fw of FWS) {
  await esbuild.build({
    entryPoints: [path.join(ROOT, `tests/controlled/${fw}.js`)], outfile: path.join(OUT, `${fw}.js`), bundle: true, format: "esm", platform: "browser", sourcemap: "inline", logLevel: "warning",
    define: { "process.env.NODE_ENV": '"development"', __VUE_OPTIONS_API__: "true", __VUE_PROD_DEVTOOLS__: "false", __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true" },
  });
  fs.writeFileSync(path.join(OUT, `${fw}.html`), `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>受控 / 非受控测试 · ${fw}</title>
<link rel="icon" href="data:,"><link rel="stylesheet" href="/packages/satin-ui/css/satin.css"><link rel="stylesheet" href="/packages/satin-ui/css/page.css"></head>
<body><div id="app"></div><script type="module" src="./${fw}.js"></script></body></html>\n`);
}

const browser = await pw.chromium.launch({ channel: "chrome", headless: !process.argv.includes("--headed") });
let bad = 0;
for (const fw of FWS) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "zh-CN" });
  const page = await ctx.newPage(), errs = [];
  page.on("pageerror", (e) => errs.push("pageerror: " + e.message.slice(0, 300)));
  page.on("console", (m) => { if (m.type() === "error" || (m.type() === "warning" && /\[Vue warn\]/.test(m.text()))) errs.push(m.type() + ": " + m.text().slice(0, 300)); });
  page.on("response", (r) => { if (r.status() >= 400 && !/favicon\.ico$/.test(r.url())) errs.push(`${r.status()} ${r.url()}`); });
  await page.goto(`http://127.0.0.1:5192/.parity/controlled/${fw}.html`, { waitUntil: "load" });
  await page.waitForFunction(() => window.__ready);
  await page.waitForTimeout(400);
  const res = [];
  const step = async (name, fn) => { try { await fn(); res.push(["✓", name]); } catch (e) { res.push(["✗", name, e.message.split("\n")[0].slice(0, 200)]); } };
  const eq = (a, b, what) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${what}：应为 ${JSON.stringify(b)}，实际 ${JSON.stringify(a)}`); };
  const rerender = async () => { await page.click("#rerender"); await page.waitForTimeout(350); };
  const segVal = (id) => page.$eval(`#${id} [aria-selected=true]`, (b) => b.dataset.v);
  const chips = () => page.$$eval("#tags .sn-chip", (cs) => cs.map((c) => c.firstChild.textContent));
  const opened = () => page.$$eval("#acc .sn-acc-item", (its) => its.flatMap((it, i) => (it.classList.contains("sn-open") ? [i] : [])));
  const logHas = (s) => page.waitForFunction((x) => window.__log.includes(x), s, { timeout: 3000 });

  await step(`${fw} 非受控分段控件：选"列表"，父组件重新渲染（items 换了引用）以后还是"列表"`, async () => {
    await page.click("#seg button[data-v=列表]"); await page.waitForTimeout(450); eq(await segVal("seg"), "列表", "刚选完");
    await rerender(); eq(await segVal("seg"), "列表", "重新渲染以后");
    await rerender(); eq(await segVal("seg"), "列表", "再渲染一次");
  });
  await step(`${fw} 非受控步进：加一到 5，父组件重新渲染以后还是 5`, async () => {
    await page.click('#step .sn-st-btn[data-d="1"]'); await page.waitForTimeout(350);
    eq(await page.$eval("#step .sn-st-val", (v) => v.getAttribute("aria-valuenow")), "5", "加一以后");
    await rerender(); eq(await page.$eval("#step .sn-st-val", (v) => v.getAttribute("aria-valuenow")), "5", "重新渲染以后");
  });
  if (fw === "react") await step("react 只读分段控件（给 value 不给 onChange）：点\"列表\"会退回\"网格\"", async () => {
    await page.click("#seg-ro button[data-v=列表]"); await page.waitForTimeout(600); eq(await segVal("seg-ro"), "网格", "点完");
  });
  await step(`${fw} 受控标签输入：一开始两个；父组件清空就没了；输入回车，回调带新值`, async () => {
    eq(await chips(), ["雨夜", "车站"], "一开始");
    await page.click("#tags-clear"); await page.waitForTimeout(350); eq(await chips(), [], "清空以后");
    await page.click("#tags input"); await page.keyboard.type("悬疑"); await page.keyboard.press("Enter"); await logHas("tags:悬疑");
    eq(await chips(), ["悬疑"], "回车以后"); eq(JSON.parse(await page.textContent("#state")).tags, ["悬疑"], "父组件的值");
  });
  await step(`${fw} 受控标签输入：父组件换一组，显示新的一组（不触发回调）`, async () => {
    await page.evaluate(() => { window.__log.length = 0; });
    await page.click("#tags-set"); await page.waitForTimeout(400); eq(await chips(), ["悬疑", "长镜头"], "换完");
    eq(await page.evaluate(() => window.__log.filter((x) => x.startsWith("tags:"))), [], "程序改值发出的回调");
  });
  await step(`${fw} 受控折叠面板：父组件展开第三项就打开；点第二项，回调带 [0,1,2]`, async () => {
    eq(await opened(), [0], "一开始");
    await page.click("#acc-third"); await page.waitForTimeout(350); eq(await opened(), [0, 2], "父组件展开第三项以后");
    await page.click("#acc .sn-acc-item:nth-child(2) .sn-acc-hd"); await logHas("open:0,1,2");
    eq(await opened(), [0, 1, 2], "点第二项以后"); eq(JSON.parse(await page.textContent("#state")).open, [0, 1, 2], "父组件的值");
  });
  const fails = res.filter((r) => r[0] === "✗");
  console.log(`${fw}：${res.length - fails.length}/${res.length} 通过${errs.length ? `，报错 ${errs.length} 条` : ""}`);
  for (const r of res) console.log(`  ${r[0]} ${r[1]}${r[2] ? "：" + r[2] : ""}`);
  for (const e of [...new Set(errs)].slice(0, 12)) console.log("    " + e);
  bad += fails.length + (errs.length ? 1 : 0);
  await ctx.close();
}
await browser.close();
console.log(bad ? `受控 / 非受控测试：${bad} 项有问题` : "受控 / 非受控测试：全部通过");
process.exit(bad ? 1 : 0);
