// 框架封装的运行时测试：React（StrictMode，挂、撤、再挂）和 Vue 里挂上菜单、右键菜单、Popover、命令面板、看图、上传、侧栏、无限列表、
// 滚动区域、视频、音频、对话、Markdown、流程图、画布表格，用真的鼠标、键盘操作一遍，查结果；整块卸载以后 <body> 里不能留浮层，
// 再挂上一遍照样能用；全程不能有页面报错、控制台错误（React 开发模式的警告也算）。
// 用法：先 python3 serve.py 5192 . ；node scripts/test/wrappers.mjs [--only react|vue] [--headed]
import fs from "node:fs";
import path from "node:path";
import * as esbuild from "esbuild";
import { pw, arg, ROOT } from "../parity/lib.mjs";

const OUT = path.join(ROOT, ".parity/wrappers");
fs.mkdirSync(OUT, { recursive: true });
const FWS = (arg("only", "react,vue") || "react,vue").split(",");
for (const fw of FWS) {
  await esbuild.build({
    entryPoints: [path.join(ROOT, `tests/wrappers/${fw}.js`)], outfile: path.join(OUT, `${fw}.js`), bundle: true, format: "esm", platform: "browser", sourcemap: "inline", logLevel: "warning",
    define: { "process.env.NODE_ENV": '"development"', __VUE_OPTIONS_API__: "true", __VUE_PROD_DEVTOOLS__: "false", __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true" },
  });
  fs.writeFileSync(path.join(OUT, `${fw}.html`), `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>封装运行时测试 · ${fw}</title>
<link rel="stylesheet" href="/packages/satin-ui/css/satin.css"><link rel="stylesheet" href="/packages/satin-ui/css/page.css"></head>
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
  await page.goto(`http://127.0.0.1:5192/.parity/wrappers/${fw}.html`, { waitUntil: "load" });
  await page.waitForFunction(() => window.__ready);
  await page.waitForTimeout(300);
  const res = [];
  const logHas = (s, t = 3000) => page.waitForFunction((x) => window.__log.includes(x), s, { timeout: t });
  const step = async (name, fn) => { try { await fn(); res.push(["✓", name]); } catch (e) { res.push(["✗", name, e.message.split("\n")[0].slice(0, 200)]); } };
  const clearLog = () => page.evaluate(() => { window.__log.length = 0; });
  const openMenu = ".sn-menu.sn-float.sn-open:not(.sn-sub)";

  async function round(tag) {
    await step(`${tag} 菜单：点按钮弹出、点一项`, async () => {
      await clearLog(); await page.click("#menu-btn"); await page.waitForSelector(openMenu);
      await page.click(`${openMenu} .sn-item[data-key=copy]`); await logHas("menu:copy");
      await page.waitForSelector(openMenu, { state: "detached", timeout: 2000 }).catch(() => page.waitForFunction((s) => !document.querySelector(s), openMenu));
    });
    await step(`${tag} 菜单：键盘 ↓ 打开、↓↓ 回车`, async () => {
      await clearLog(); await page.focus("#menu-btn"); await page.keyboard.press("ArrowDown"); await page.waitForSelector(openMenu);
      await page.keyboard.press("ArrowDown"); await page.keyboard.press("Enter"); await logHas("menu:copy");
    });
    await step(`${tag} 菜单：子菜单（悬停"移动到"→ 点第二集）`, async () => {
      await clearLog(); await page.click("#menu-btn"); await page.waitForSelector(openMenu);
      await page.hover(`${openMenu} .sn-item[data-sub]`); await page.waitForSelector(".sn-menu.sn-float.sn-sub.sn-open");
      await page.click(".sn-menu.sn-float.sn-sub.sn-open .sn-item[data-key=ep2]"); await logHas("menu:ep2");
    });
    await step(`${tag} 右键菜单：右键弹出、点删除；不可用的那项点了没反应`, async () => {
      await clearLog(); await page.click("#ctx-zone", { button: "right" }); await page.waitForSelector(openMenu);
      await page.click(`${openMenu} .sn-item[data-key=share]`); await page.waitForTimeout(150);
      if (await page.evaluate(() => window.__log.length)) throw new Error("点了不可用的条目也触发了");
      await page.click(`${openMenu} .sn-item[data-key=del]`); await logHas("ctx:del");
    });
    await step(`${tag} Popover：点开、Esc 关上（受控状态跟着变）`, async () => {
      await clearLog(); await page.click("#pop-btn"); await page.waitForSelector(".sn-pop.sn-popover.sn-open"); await logHas("pop:true");
      if (!(await page.isVisible("#pop-body"))) throw new Error("面板里的内容没显示");
      await page.keyboard.press("Escape"); await logHas("pop:false"); await page.waitForSelector(".sn-pop.sn-popover.sn-open", { state: "detached" }).catch(async () => { if (await page.$(".sn-pop.sn-popover.sn-open")) throw new Error("Esc 以后还开着"); });
    });
    await step(`${tag} 命令面板：受控打开、输入、回车执行、关上回写`, async () => {
      await clearLog(); await page.click("#cmd-btn"); await page.waitForSelector("#cmdk-panel.sn-open"); await logHas("cmd:true");
      await page.keyboard.type("设置"); await page.keyboard.press("Enter"); await logHas("run:打开设置"); await logHas("cmd:false");
    });
    await step(`${tag} 命令面板：⌘K 快捷键`, async () => {
      await clearLog(); await page.keyboard.press("Meta+k"); await page.waitForSelector("#cmdk-panel.sn-open"); await page.keyboard.press("Escape"); await logHas("cmd:false");
    });
    await step(`${tag} 看图：点缩略图打开、Esc 关上（onClose / update:index）`, async () => {
      await clearLog(); await page.click("#thumb-1"); await page.waitForSelector(".sn-lb-stage"); await page.waitForTimeout(400);
      await page.keyboard.press("Escape"); await logHas("lb:close", 4000);
    });
    await step(`${tag} 上传：选两个文件（一个格式不对，当场标红）`, async () => {
      await page.setInputFiles(".sn-drop input[type=file]", [{ name: "原文.txt", mimeType: "text/plain", buffer: Buffer.from("你好") }, { name: "图.png", mimeType: "image/png", buffer: Buffer.alloc(10) }]);
      await page.waitForFunction(() => document.querySelectorAll(".sn-files .sn-file").length >= 2);
      const bad = await page.$$eval(".sn-files .sn-file", (rs) => rs.map((r) => r.classList.contains("sn-bad")));
      if (bad[0] || !bad[1]) throw new Error("标红不对：" + JSON.stringify(bad));
    });
    await step(`${tag} 侧栏：点"素材库"（选中移过去、onNavigate、受控值跟着变）`, async () => {
      await clearLog(); await page.click(".sn-side a[data-key=assets]"); await logHas("nav:assets");
      await page.waitForFunction(() => document.querySelector(".sn-side a.sn-on")?.dataset.key === "assets" && document.querySelector("#main-title")?.textContent === "assets");
    });
    await step(`${tag} 无限列表：第一页的行是框架渲染的，滚到底加载下一页`, async () => {
      await page.waitForFunction(() => document.querySelector("#vl .row-title")?.textContent === "第 1 条", null, { timeout: 4000 });
      for (let i = 0; i < 8; i++) { await page.$eval("#vl", (el) => { el.scrollTop = el.scrollHeight; }); await page.waitForTimeout(120); }
      await page.waitForFunction(() => [...document.querySelectorAll("#vl .row-title")].some((b) => /第 (6[1-9]|[7-9]\d|1\d\d) 条/.test(b.textContent)), null, { timeout: 4000 });
    });
    await step(`${tag} 滚动区域：视口外面包上了 .sn-sa（滚动条、渐隐），内容是框架渲染的`, async () => {
      const ok = await page.$eval("#sa", (el) => el.parentElement.classList.contains("sn-sa") && el.classList.contains("sn-sa-vp") && el.querySelectorAll("p").length === 30);
      if (!ok) throw new Error("结构不对");
    });
    await step(`${tag} 对话：输入、回车发送、流式回答出来`, async () => {
      await page.click(".sn-chat-foot textarea"); await page.keyboard.type("改第三场"); await page.keyboard.press("Enter");
      await page.waitForFunction(() => document.querySelector(".sn-chat")?.textContent.includes("收到：改第三场"), null, { timeout: 5000 });
    });
    await step(`${tag} Markdown、流程图、画布表格、视频、音频都渲染出来`, async () => {
      const r = await page.evaluate(() => ({ md: document.querySelector(".sn-md h1")?.textContent, flow: document.querySelectorAll(".sn-fnode").length, cv: !!document.querySelector("canvas"), player: !!document.querySelector(".sn-player"), audio: !!document.querySelector(".sn-audio-row") }));
      if (r.md !== "标题" || r.flow < 2 || !r.cv || !r.player || !r.audio) throw new Error(JSON.stringify(r));
    });
  }

  await round("挂上");
  await step("卸载：<body> 里不留浮层（菜单、Popover、命令面板、看图）", async () => {
    await page.evaluate(() => window.__toggle()); await page.waitForSelector("#off");
    await page.waitForTimeout(600);
    const left = await page.evaluate(() => ({ menus: document.querySelectorAll(".sn-menu.sn-float").length, pops: document.querySelectorAll(".sn-pop.sn-popover").length, cmdk: !!document.getElementById("cmdk-panel"), lb: !!document.querySelector(".sn-lb-stage") }));
    if (left.menus || left.pops || left.cmdk || left.lb) throw new Error("留下了：" + JSON.stringify(left));
  });
  let back = true;
  await step("再挂上：整块重新挂回去", async () => { await page.evaluate(() => window.__toggle()); await page.waitForSelector("#kit", { timeout: 8000 }); await page.waitForTimeout(400); }).then(() => { back = res.at(-1)[0] === "✓"; });
  if (back) await round("再挂上");
  const fails = res.filter((r) => r[0] === "✗");
  console.log(`${fw}：${res.length - fails.length}/${res.length} 通过${errs.length ? `，报错 ${errs.length} 条` : ""}`);
  for (const r of res) console.log(`  ${r[0]} ${r[1]}${r[2] ? "：" + r[2] : ""}`);
  for (const e of [...new Set(errs)].slice(0, 12)) console.log("    " + e);
  bad += fails.length + (errs.length ? 1 : 0);
  await ctx.close();
}
await browser.close();
console.log(bad ? `封装运行时测试：${bad} 项有问题` : "封装运行时测试：全部通过");
process.exit(bad ? 1 : 0);
