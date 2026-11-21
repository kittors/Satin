// 官网样式的 DOM 命中检查：走遍官网各页面和各种状态（滚到底、深浅主题、窄屏、抽屉、搜索、框架下拉、悬停提示、播放……），
// site/site.css、site/next.css 的每个选择器至少要命中一个元素。命中不了的再试两种变体：
//   · 给某个类名加上 sn- 前缀（.moon → .sn-moon）能命中 = CSS 这边前缀漏改；
//   · 去掉某个类名的 sn- 前缀能命中 = JS / HTML 那边漏改。
// 顺带查：引用了不存在的 @keyframes、var(--x) 引用的变量哪儿都没声明过（变量名前缀漏改也会这样）。
// 伪类 :hover / :focus-visible / :active 和伪元素先去掉再查（不用真悬停）；[data-theme="dark"] 这类根上的主题条件换成 :root（深浅两套另外各真切一次）。
// 用法（5192 起着）：node scripts/site/selector-hits.mjs [--quick] [--out /tmp/satin-header-restore/selector-hits]
//   对基线：node scripts/site/selector-hits.mjs --root ../Satin-baseline-20261120 --base http://127.0.0.1:5193 --out /tmp/satin-header-restore/selector-hits-base
//   结果：终端汇总；out/report.json（每个没命中的选择器：文件:行、原文、变体命中情况、归类）、out/report.md
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i < 0 ? d : process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : true; };
const ROOT = path.resolve(arg("root", path.resolve(path.dirname(new URL(import.meta.url).pathname), "../.."))); // --root ../Satin-baseline-20261120 --base http://127.0.0.1:5193：拿基线跑一遍，两份"没命中"清单对照
const OUT = arg("out", "/tmp/satin-header-restore/selector-hits"), QUICK = !!arg("quick", false), BASE = arg("base", "http://127.0.0.1:5192");
fs.mkdirSync(OUT, { recursive: true });
const FILES = ["site/site.css", "site/next.css"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ———— 1. 解析样式表：每条样式规则的选择器（逗号拆开）和行号；@keyframes 名字；animation 引用的名字；var() 引用的变量 ————
function splitTop(s) { const out = []; let d = 0, cur = "", q = null; for (const c of s) { if (q) { cur += c; if (c === q) q = null; continue; } if (c === '"' || c === "'") { q = c; cur += c; continue; } if (c === "(" || c === "[") d++; if (c === ")" || c === "]") d--; if (c === "," && d === 0) { out.push(cur.trim()); cur = ""; continue; } cur += c; } if (cur.trim()) out.push(cur.trim()); return out; }
function parse(file) {
  const src = fs.readFileSync(path.join(ROOT, file), "utf8").replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
  const rules = [], keyframes = [], anims = [], vars = [], declared = new Set();
  let i = 0, line = 1, start = 0, startLine = 1;
  const stack = []; // "group" | "keyframes"
  const lineAt = (pos) => { let n = 1; for (let k = 0; k < pos; k++) if (src.charCodeAt(k) === 10) n++; return n; };
  while (i < src.length) {
    const c = src[i];
    if (c === "{") {
      const pre = src.slice(start, i).trim(), at = lineAt(start + (src.slice(start, i).length - src.slice(start, i).trimStart().length));
      if (pre.startsWith("@keyframes")) { keyframes.push(pre.split(/\s+/)[1]); stack.push("keyframes"); start = i + 1; i++; continue; }
      if (pre.startsWith("@")) { stack.push("group"); start = i + 1; i++; continue; }
      if (stack.at(-1) === "keyframes") { // 关键帧里的 from / 50% { … }：跳过
        const end = src.indexOf("}", i); start = end + 1; i = end + 1; continue;
      }
      const end = src.indexOf("}", i), body = src.slice(i + 1, end);
      for (const sel of splitTop(pre)) rules.push({ file, line: at, sel, body: body.trim().slice(0, 120) });
      for (const m of body.matchAll(/(--[\w-]+)\s*:/g)) declared.add(m[1]);
      for (const m of body.matchAll(/var\((--[\w-]+)\s*(,)?/g)) vars.push({ file, line: lineAt(i), name: m[1], fallback: !!m[2] });
      for (const m of body.matchAll(/animation(?:-name)?\s*:\s*([^;]+)/g)) for (const part of splitTop(m[1])) {
        const id = part.split(/\s+/).find((t) => /^[a-z_-][\w-]*$/i.test(t) && !/^(none|infinite|linear|ease|ease-in|ease-out|ease-in-out|both|forwards|backwards|alternate|alternate-reverse|reverse|normal|paused|running|step-start|step-end|initial|inherit|unset)$/.test(t) && !t.startsWith("var") && !t.startsWith("cubic"));
        if (id) anims.push({ file, line: lineAt(i), name: id });
      }
      start = end + 1; i = end + 1; continue;
    }
    if (c === "}") { stack.pop(); start = i + 1; }
    if (c === ";" && !stack.length) start = i + 1; // @import / @layer x; 这类
    i++;
  }
  return { rules, keyframes, anims, vars, declared };
}
const parsed = FILES.map(parse);
const RULES = parsed.flatMap((p) => p.rules), ANIMS = parsed.flatMap((p) => p.anims), VARS = parsed.flatMap((p) => p.vars);
// JS 里写死的选择器（$ / $$ / querySelector / closest / matches 的字符串参数）和 classList.contains / remove 查的类名，也一起查：
// 样式改了前缀、脚本里找元素的选择器没跟着改（比如 .na-shot.on），CSS 那边查不出来
const JS_FILES = [["site", ""], ["site/legacy", "legacy/"]].flatMap(([d, pre]) => (fs.existsSync(path.join(ROOT, d)) ? fs.readdirSync(path.join(ROOT, d)) : []).filter((f) => f.endsWith(".js") && f !== "examples.js").map((f) => `site/${pre}${f}`));
for (const file of JS_FILES) {
  const src = fs.readFileSync(path.join(ROOT, file), "utf8"), lines = src.split("\n");
  lines.forEach((ln, i) => {
    for (const m of ln.matchAll(/(?:\$\$?|querySelector(?:All)?|closest|matches)\(\s*(["'`])((?:(?!\1).)*?)\1\s*[,)]/g)) {
      const s = m[2]; if (!s || s.includes("${")) continue;
      for (const sel of splitTop(s)) RULES.push({ file, line: i + 1, sel, body: "（脚本里的选择器）", js: true });
    }
    for (const m of ln.matchAll(/classList\.(contains|remove)\(\s*((?:["'][\w-]+["']\s*,?\s*)+)\)/g)) for (const c of m[2].matchAll(/["']([\w-]+)["']/g)) RULES.push({ file, line: i + 1, sel: "." + c[1], body: `（classList.${m[1]}）`, js: true, cls: true });
  });
}

// ———— 2. 每个选择器要查的几种写法 ————
const DYN = "hover|active|focus|focus-visible|focus-within|visited|target|target-within|user-invalid|user-valid";
function strip(sel) {
  let s = sel;
  s = s.replace(new RegExp(`:not\\(\\s*:(?:${DYN})\\s*\\)`, "g"), "");
  s = s.replace(/::?(before|after|placeholder|selection|marker|backdrop|first-line|first-letter|file-selector-button|-webkit-[\w-]+|-moz-[\w-]+|view-transition[\w-]*(\([^)]*\))?)/g, "");
  s = s.replace(new RegExp(`:(?:${DYN})(?![\\w-])`, "g"), "");
  s = s.replace(/:root:not\(\[data-theme="?dark"?\]\)/g, ":root").replace(/\[data-theme="?(dark|light)"?\]/g, ":root").replace(/:root\s*:root/g, ":root");
  s = s.replace(/^(html)?\.sn-reduce-motion\b/, ":root");
  s = s.trim().replace(/\s*>\s*$/, "").replace(/(^|\s)(?=[>+~])/g, "$1");
  return s || null;
}
// 只在没有脚本时才生效的（.no-js）、只有伪元素的（::view-transition-old(root)），不查
const skipWhy = (sel) => (/^\.no-js\b/.test(sel) ? "只在没有脚本时生效（.no-js）" : /^::view-transition|^::-webkit-scrollbar|^::selection/.test(sel) ? "只有伪元素" : null);
function variants(s) {
  const out = []; const toks = [...s.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)];
  for (const m of toks) {
    const name = m[1], at = m.index;
    if (name.startsWith("sn-")) out.push({ kind: "去掉 sn-", tok: name, to: name.slice(3), sel: s.slice(0, at) + "." + name.slice(3) + s.slice(at + 1 + name.length) });
    else out.push({ kind: "加上 sn-", tok: name, to: "sn-" + name, sel: s.slice(0, at) + ".sn-" + name + s.slice(at + 1 + name.length) });
  }
  const plain = toks.filter((m) => !m[1].startsWith("sn-"));
  if (plain.length > 1) { let all = s; for (const m of [...plain].reverse()) all = all.slice(0, m.index) + ".sn-" + m[1] + all.slice(m.index + 1 + m[1].length); out.push({ kind: "全部加上 sn-", tok: plain.map((m) => m[1]).join(" "), sel: all }); }
  return out;
}
const items = RULES.map((r, id) => {
  const why = skipWhy(r.sel), s = why ? null : strip(r.sel);
  return { id, ...r, why: why || (s ? null : "去掉伪类、伪元素后是空的"), s, vs: s ? variants(s) : [], hit: false, vhit: {} };
});
const FORMS = new Map(); // 写法 → 命中过没有
for (const it of items) if (it.s) { FORMS.set(it.s, false); for (const v of it.vs) FORMS.set(v.sel, false); }
const keysNow = () => [...FORMS].filter(([, h]) => !h).map(([k]) => k);
if (arg("parse-only", false)) { // 只看解析结果（不开浏览器）
  console.log(`选择器 ${items.length} 条，写法 ${FORMS.size} 种；@keyframes ${[...new Set(parsed.flatMap((p) => p.keyframes))].join(" ")}；animation 引用 ${[...new Set(ANIMS.map((a) => a.name))].join(" ")}；var 引用 ${VARS.length} 处`);
  for (const it of items.filter((x) => x.why || x.s !== x.sel).slice(0, +arg("n", 40))) console.log(`${it.file}:${it.line}  ${it.sel}  →  ${it.why || it.s}`);
  process.exit(0);
}

// ———— 3. 页面里的采样：还没命中过的写法查一遍；顺带收所有声明过的变量、所有 @keyframes ————
const declaredVars = new Set(parsed.flatMap((p) => [...p.declared])), keyframeNames = new Set(parsed.flatMap((p) => p.keyframes));
const log = [];
let samples = 0;
async function sample(page, where) {
  const keys = keysNow();
  const res = await page.evaluate((keys) => {
    const hit = []; const bad = [];
    for (const k of keys) { try { if (document.querySelector(k)) hit.push(k); } catch { bad.push(k); } }
    const vars = new Set(), kf = new Set();
    const walk = (rules) => { for (const r of rules) { if (r.type === 7 /* keyframes */) kf.add(r.name); if (r.style) for (const p of r.style) if (p.startsWith("--")) vars.add(p); if (r.cssRules) walk(r.cssRules); } };
    for (const sh of document.styleSheets) { try { walk(sh.cssRules); } catch {} }
    for (const el of document.querySelectorAll("[style]")) for (const p of el.style) if (p.startsWith("--")) vars.add(p);
    for (const p of document.documentElement.style) if (p.startsWith("--")) vars.add(p);
    return { hit, bad, vars: [...vars], kf: [...kf] };
  }, keys).catch((e) => ({ hit: [], bad: [], vars: [], kf: [], err: String(e).slice(0, 200) }));
  for (const k of res.hit) FORMS.set(k, where);
  for (const v of res.vars) declaredVars.add(v);
  for (const k of res.kf) keyframeNames.add(k);
  if (res.err) log.push(`${where}: ${res.err}`);
  if (res.bad?.length) for (const b of res.bad) { FORMS.set(b, "（选择器不合法）"); }
  samples++;
}

// ———— 4. 走一遍：每个页面载入、逐屏滚到底；代表页面上做各种交互 ————
const browser = await pw.chromium.launch({ channel: "chrome", headless: true });
const errs = [];
async function open(url, { w = 1440, h = 900, theme = "light", mobile = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  await ctx.addInitScript((t) => { try { localStorage.setItem("satin-theme", t); } catch {} }, theme);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errs.push(`${url} [${w}/${theme}]: ${String(e.message).slice(0, 160)}`));
  await page.goto(url, { waitUntil: "load", timeout: 60000 }).catch((e) => errs.push(`${url}: ${e.message.slice(0, 120)}`));
  await page.evaluate(() => document.fonts?.ready).catch(() => {}); await sleep(700);
  return { ctx, page };
}
async function scrollThrough(page, where, step = 0.8) {
  const H = await page.evaluate(() => document.documentElement.scrollHeight).catch(() => 0), vh = page.viewportSize().height;
  for (let y = 0, n = 0; y < H && n < 30; y += vh * step, n++) { await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y); await sleep(160); await sample(page, `${where} 滚到 ${Math.round(y)}`); }
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" })); await sleep(200);
}
const tryDo = async (page, where, fn, wait = 350) => { try { await fn(); await sleep(wait); await sample(page, where); } catch (e) { log.push(`${where}: ${String(e.message || e).split("\n")[0].slice(0, 160)}`); } };
const S = BASE + "/site/";
// 旧版官网（2026-11-21 挪进 site/legacy/；基线还在 site/ 下）
const OLD = fs.existsSync(path.join(ROOT, "site/legacy/index.html")) ? "legacy/" : "";

// 文档页的全部路由（侧栏里的链接）
const routesOf = async (file) => { const { ctx, page } = await open(S + file); const r = await page.evaluate(() => [...new Set([...document.querySelectorAll("[data-side] a[href^='#/'], .d-side a[href^='#/']")].map((a) => a.getAttribute("href")))]); await ctx.close(); return r; };
const nextRoutes = await routesOf("next-docs.html#/start"), oldRoutes = await routesOf(OLD + "docs.html#/start");
const pick = (rs, keep) => rs.filter((r) => keep.some((k) => r === k || r.startsWith(k)));
const REP = ["#/start", "#/intro", "#/cli", "#/frameworks", "#/mobile", "#/ai", "#/eval", "#/components", "#/recipes", "#/c/button", "#/c/grid", "#/recipe/admin-table", "#/guide/principles", "#/theming", "#/changelog"];
const docRoutes = QUICK ? pick(nextRoutes, REP) : nextRoutes;
console.log(`选择器 ${items.length} 条（要查的写法 ${FORMS.size} 种）；新版文档页 ${nextRoutes.length} 页，旧版 ${oldRoutes.length} 页${QUICK ? "（--quick 只走代表页）" : ""}`);

// 4.1 首页（新版）宽屏：载入、滚动、各种交互；深色真切一次
for (const theme of ["light", "dark"]) {
  const { ctx, page } = await open(S + "next.html", { theme });
  await sample(page, `首页 ${theme} 载入`);
  await scrollThrough(page, `首页 ${theme}`);
  if (theme === "light") {
    await tryDo(page, "首页 滚下去后的浮岛", async () => { await page.mouse.wheel(0, 900); await sleep(900); });
    await tryDo(page, "首页 悬停提示", async () => { await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" })); await sleep(400); await page.hover("[data-search]"); await sleep(900); });
    await tryDo(page, "首页 搜索打开", async () => { await page.keyboard.press("Meta+k"); await sleep(400); await page.keyboard.type("按钮"); });
    await tryDo(page, "首页 搜索关上", async () => { await page.keyboard.press("Escape"); });
    await tryDo(page, "首页 深浅切换按钮点一下", async () => { await page.click("[data-mode-btn]"); await sleep(300); await sample(page, "首页 深浅切换中"); await page.click("[data-mode-btn]"); });
    // 首页里的几块能玩的演示：播放器、列表增删、主题区
    await tryDo(page, "首页 播放", async () => { const b = page.locator("[data-np-play]").first(); await b.scrollIntoViewIfNeeded(); await b.click(); await sleep(200); await sample(page, "首页 播放刚按下"); });
    await tryDo(page, "首页 列表删一项", async () => { const b = page.locator(".ar-list li button").first(); await b.scrollIntoViewIfNeeded(); await b.click(); await sleep(30); await sample(page, "首页 列表删一项（动画中）"); });
    await tryDo(page, "首页 细节区分段控件（帧条）", async () => { const b = page.locator("[data-fr-seg] button").nth(2); await b.scrollIntoViewIfNeeded(); await b.click(); await sleep(900); });
    await tryDo(page, "首页 帧间隔图悬停", async () => { const svg = page.locator("[data-fps-svg]"); await svg.scrollIntoViewIfNeeded(); const bb = await svg.boundingBox(); await page.mouse.move(bb.x + bb.width * 0.8, bb.y + bb.height / 2); await sleep(400); });
    await tryDo(page, "首页 列表删光", async () => { for (let i = 0; i < 12; i++) { const b = page.locator(".ar-list li:not(.leaving) button").first(); if (!(await b.count())) break; await b.click({ timeout: 1500 }).catch(() => {}); await sleep(420); } });
    await tryDo(page, "首页 主题区点一圈", async () => { const btns = page.locator("#theme button, #theme [role=tab], #theme .sn-sw"); const n = Math.min(await btns.count(), 24); for (let i = 0; i < n; i++) { await btns.nth(i).click({ timeout: 1500 }).catch(() => {}); await sleep(120); if (i % 4 === 3) await sample(page, `首页 主题区第 ${i} 个`); } });
  }
  await ctx.close();
}
// 4.2 首页、文档页窄屏：滚动后的顶栏、抽屉、抽屉里的类别折叠、主题第二层、框架列表
for (const [k, u] of [["首页", "next.html"], ["文档页", "next-docs.html#/c/button"], ["文档页 开始", "next-docs.html#/start"]]) for (const w of [390, 768]) {
  const { ctx, page } = await open(S + u, { w, h: 844, mobile: w < 500 });
  await sample(page, `${k} ${w} 载入`);
  await scrollThrough(page, `${k} ${w}`, 1.5);
  await tryDo(page, `${k} ${w} 滚下去`, async () => { await page.evaluate(() => scrollTo({ top: 600, behavior: "instant" })); await sleep(400); });
  await tryDo(page, `${k} ${w} 抽屉打开`, async () => { await page.click("[data-menu]"); await sleep(500); });
  await tryDo(page, `${k} ${w} 抽屉里的类别`, async () => { const g = page.locator(".s-mnav .s-mn-g button, .s-mnav [data-g] > button, .s-mnav .s-mn-c").first(); await g.click({ timeout: 2000 }); await sleep(40); await sample(page, `${k} ${w} 类别折叠动画中`); await sleep(500); await g.click({ timeout: 2000 }); await sleep(40); }, 40);
  await tryDo(page, `${k} ${w} 抽屉里的框架列表`, async () => { await page.click(".s-mnav [data-fw-disc], .s-mnav .s-fw-btn", { timeout: 2000 }); await sleep(400); });
  await tryDo(page, `${k} ${w} 抽屉主题第二层`, async () => { await page.click(".s-mnav [data-md-theme], .s-mnav .s-md-th-btn, .s-mnav [data-theme-adjust]", { timeout: 2000 }); await sleep(500); });
  await tryDo(page, `${k} ${w} 抽屉关上`, async () => { await page.keyboard.press("Escape"); await sleep(200); await page.keyboard.press("Escape"); });
  await tryDo(page, `${k} ${w} 搜索`, async () => { await page.click("[data-search] >> visible=true", { timeout: 2000 }); await sleep(400); });
  if (u.includes("docs")) await tryDo(page, `${k} ${w} 本页目录菜单`, async () => { await page.keyboard.press("Escape"); await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" })); await sleep(300); await page.click(".d-mtoc-btn", { timeout: 2000 }); await sleep(400); });
  await ctx.close();
}
// 1024 宽（≤ 1080：右边本页目录收成标题下面一条）：本页目录菜单
{
  const { ctx, page } = await open(S + "next-docs.html#/start", { w: 1024, h: 800 });
  await sample(page, "文档 1024 载入");
  await tryDo(page, "文档 1024 本页目录菜单", async () => { await page.click(".d-mtoc-btn", { timeout: 2000 }); await sleep(400); });
  await ctx.close();
}
// 4.3 新版文档页：每页载入、滚到底；代表页上框架下拉、代码块头的选择器、搜索、深色
for (const r of docRoutes) {
  const { ctx, page } = await open(S + "next-docs.html" + r);
  await sample(page, `文档 ${r}`);
  await scrollThrough(page, `文档 ${r}`, 1);
  if (["#/start", "#/c/button", "#/recipe/admin-table"].includes(r)) {
    await tryDo(page, `文档 ${r} 侧栏框架下拉`, async () => { await page.click(".d-side-fw .s-fw-btn"); await sleep(400); });
    await tryDo(page, `文档 ${r} 侧栏框架下拉选 Vue`, async () => { await page.click(".s-fw-menu [data-fw=vue] >> visible=true", { timeout: 2000 }); await sleep(500); });
    await tryDo(page, `文档 ${r} 代码块头的选择器`, async () => { const b = page.locator(".cx-fw .s-fw-btn").first(); await b.scrollIntoViewIfNeeded(); await b.click(); await sleep(400); });
    await tryDo(page, `文档 ${r} 代码块头选回 React`, async () => { await page.click(".s-fw-menu [data-fw=react] >> visible=true", { timeout: 2000 }); await sleep(400); });
    await tryDo(page, `文档 ${r} 悬停提示`, async () => { await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" })); await page.hover(".s-nav [data-mode-btn]"); await sleep(900); });
    await tryDo(page, `文档 ${r} 搜索`, async () => { await page.click(".s-nav .s-search"); await sleep(400); await page.keyboard.type("表格"); await sleep(300); });
    await tryDo(page, `文档 ${r} 搜索关上`, async () => { await page.keyboard.press("Escape"); });
    await tryDo(page, `文档 ${r} 主题调整面板`, async () => { await page.click(".s-nav [data-custom-btn]", { timeout: 2000 }); await sleep(500); await sample(page, `文档 ${r} 主题调整面板开着`); await page.mouse.click(700, 500); });
    await tryDo(page, `文档 ${r} 展开代码`, async () => { const m = page.locator(".cx-more:visible").first(); await m.scrollIntoViewIfNeeded({ timeout: 2000 }); await m.click({ timeout: 2000 }); await sleep(450); });
    await tryDo(page, `文档 ${r} 换页（过渡中）`, async () => { await page.evaluate(() => { location.hash = "#/guide/color"; }); await sleep(30); await sample(page, `文档 ${r} 换页刚开始`); await sleep(600); await page.evaluate((r) => { location.hash = r; }, r); });
    await tryDo(page, `文档 ${r} 深色`, async () => { await page.click(".s-nav [data-mode-btn]"); await sleep(700); });
  }
  await ctx.close();
}
// 4.4 旧版首页、旧版文档页（也用 site.css）
{
  for (const w of [1440, 390]) {
    const { ctx, page } = await open(S + OLD + "index.html", { w, h: w < 500 ? 844 : 900, mobile: w < 500 });
    await sample(page, `旧版首页 ${w}`); await scrollThrough(page, `旧版首页 ${w}`);
    if (w === 1440) {
      await tryDo(page, "旧版首页 播放", async () => { const b = page.locator("[data-np-play]").first(); await b.scrollIntoViewIfNeeded(); await b.click(); await sleep(200); });
      await tryDo(page, "旧版首页 视频暂停", async () => { const b = page.locator("[data-vc-btn]").first(); await b.scrollIntoViewIfNeeded(); await b.click(); });
      await tryDo(page, "旧版首页 聊天发一句", async () => { const f = page.locator("[data-chat-form] input").first(); await f.scrollIntoViewIfNeeded(); await f.fill("你好"); await f.press("Enter"); await sleep(100); await sample(page, "旧版首页 聊天刚发出"); await sleep(1600); });
      await tryDo(page, "旧版首页 列表删一项", async () => { const b = page.locator(".ar-list li button").first(); await b.scrollIntoViewIfNeeded(); await b.click(); await sleep(30); });
    }
    await ctx.close();
  }
  const rs = QUICK ? pick(oldRoutes, ["#/start", "#/c/button", "#/guide/principles"]) : oldRoutes;
  for (const r of rs) { const { ctx, page } = await open(S + OLD + "docs.html" + r); await sample(page, `旧版文档 ${r}`); await scrollThrough(page, `旧版文档 ${r}`, 1); await ctx.close(); }
  const { ctx, page } = await open(S + OLD + "docs.html#/c/button", { w: 390, h: 844, mobile: true });
  await sample(page, "旧版文档 390"); await tryDo(page, "旧版文档 390 目录打开", async () => { await page.click("[data-burger]"); await sleep(400); });
  await ctx.close();
}
await browser.close();

// ———— 5. 汇总 ————
const miss = [];
for (const it of items) {
  if (it.why) continue;
  it.hit = FORMS.get(it.s);
  if (it.hit) continue;
  const vh = it.vs.map((v) => ({ ...v, at: FORMS.get(v.sel) })).filter((v) => v.at);
  miss.push({ at: `${it.file}:${it.line}`, js: !!it.js, cls: !!it.cls, sel: it.sel, checked: it.s, body: it.body, variants: vh.map((v) => ({ kind: v.kind, tok: v.tok, sel: v.sel, where: v.at })), verdict: vh.length ? "前缀疑似漏改" : "哪儿都没命中" });
}
const skipped = items.filter((it) => it.why).map((it) => ({ at: `${it.file}:${it.line}`, sel: it.sel, why: it.why }));
const badAnims = ANIMS.filter((a) => !keyframeNames.has(a.name));
const badVars = VARS.filter((v) => !declaredVars.has(v.name));
const report = { when: new Date().toISOString(), samples, rules: items.length, checked: items.filter((x) => !x.why).length, hit: items.filter((x) => !x.why && x.hit).length, miss, skipped, badAnims, badVars: badVars.map((v) => ({ at: `${v.file}:${v.line}`, name: v.name, fallback: v.fallback })), errors: [...new Set(errs)], log };
fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 1));
const fmtV = (m) => `- \`${m.at}\` \`${m.sel}\` → ${m.variants.map((v) => `${v.kind} \`${v.tok}\`（\`${v.sel}\`，在"${v.where}"命中）`).join("；")}`;
const md = [`# 官网样式 DOM 命中检查（${report.when}）`, "", `采样 ${samples} 次；选择器 ${report.rules} 条，要查 ${report.checked} 条，命中 ${report.hit} 条，没命中 ${miss.length} 条；不查 ${skipped.length} 条。`, "",
  "## 前缀疑似漏改（原样命中不了、换个前缀就能命中）", "", "### 样式", "", ...miss.filter((m) => !m.js && m.verdict !== "哪儿都没命中").map(fmtV), "", "### 脚本（选择器、classList.contains / remove）", "", ...miss.filter((m) => m.js && m.verdict !== "哪儿都没命中").map(fmtV), "",
  "## 哪儿都没命中", "", "### 样式", "", ...miss.filter((m) => !m.js && m.verdict === "哪儿都没命中").map((m) => `- \`${m.at}\` \`${m.sel}\``), "", "### 脚本", "", ...miss.filter((m) => m.js && m.verdict === "哪儿都没命中").map((m) => `- \`${m.at}\` \`${m.sel}\` ${m.body}`), "",
  "## 引用了不存在的 @keyframes", "", ...badAnims.map((a) => `- \`${a.file}:${a.line}\` ${a.name}`), "",
  "## var() 引用的变量哪儿都没声明（带默认值的也列出来）", "", ...report.badVars.map((v) => `- \`${v.at}\` ${v.name}${v.fallback ? "（有默认值）" : ""}`), "",
  "## 不查的", "", ...skipped.map((s) => `- \`${s.at}\` \`${s.sel}\`：${s.why}`), "",
  "## 页面报错", "", ...report.errors.map((e) => `- ${e}`), "", "## 交互没做成的", "", ...log.map((l) => `- ${l}`)].join("\n");
fs.writeFileSync(path.join(OUT, "report.md"), md);
console.log(`采样 ${samples} 次；要查 ${report.checked} 条，命中 ${report.hit}，没命中 ${miss.length}（前缀疑似漏改 ${miss.filter((m) => m.verdict !== "哪儿都没命中").length}）；不存在的动画 ${badAnims.length}；没声明的变量 ${badVars.length}；页面报错 ${report.errors.length}；交互没做成 ${log.length}`);
for (const m of miss.filter((m) => m.verdict !== "哪儿都没命中")) console.log(`  漏改？ ${m.at}  ${m.sel}  →  ${m.variants.map((v) => v.sel).join(" | ")}`);
console.log(`→ ${OUT}/report.md`);
