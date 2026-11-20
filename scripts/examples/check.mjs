// 各框架示例的验收：同一批组件（examples/shared/sink.js）在纯 HTML、React、Vue、Svelte、Solid、Preact、Angular、
// Next.js（服务端渲染）、Nuxt（服务端渲染）里渲染：
// 1. 截图逐像素和纯 HTML 版比（浅 / 深 × 桌面 / 手机），差一个像素都算不一致
// 2. 页面报错、控制台报错（含水合不一致）、前缀漏改探针都要 0
// 3. Next.js、Nuxt：服务端直出的 HTML 里要有组件的完整标记；关掉 JS 时（浅色）第一帧和水合以后的截图一样
// 4. 纯 HTML 版的每个组件和设计稿（index.html）里同一状态的那个组件比：结构、属性、文字、尺寸、计算样式逐项一样
// 用法：先 python3 serve.py 5192 . ；node scripts/examples/build.mjs 构建；node scripts/examples/check.mjs [--only react,vue] [--out .parity/examples]
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { launch, newContext, watchErrors, arg, ensureDir, ROOT, sleep } from "../parity/lib.mjs";

const OUT = ensureDir(path.resolve(ROOT, arg("out", ".parity/examples")));
const S = "http://127.0.0.1:5192/examples";
const ALL = {
  html: `${S}/html/index.html`,
  react: `${S}/react/dist/index.html`, vue: `${S}/vue/dist/index.html`, svelte: `${S}/svelte/dist/index.html`,
  solid: `${S}/solid/dist/index.html`, preact: `${S}/preact/dist/index.html`, angular: `${S}/angular/dist/browser/index.html`,
  next: "http://127.0.0.1:5301/", nuxt: "http://127.0.0.1:5302/",
};
const only = arg("only", "") ? new Set(["html", ...String(arg("only")).split(",")]) : null;
const NAMES = Object.keys(ALL).filter((k) => !only || only.has(k));
const COMBOS = [["light", "desktop"], ["dark", "desktop"], ["light", "phone"], ["dark", "phone"]];

// 服务端渲染的两个示例要起自己的服务（构建产物），结束时停掉
const procs = [];
async function serve(name, cmd, args, cwd, env, url) {
  if (!NAMES.includes(name)) return;
  const p = spawn(cmd, args, { cwd, env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"] });
  let log = ""; p.stdout.on("data", (d) => (log += d)); p.stderr.on("data", (d) => (log += d)); procs.push(p);
  for (let i = 0; i < 120; i++) { try { const r = await fetch(url); if (r.status < 500) return; } catch {} await sleep(250); }
  throw new Error(`${name} 服务没起来：\n${log.slice(-2000)}`);
}
const stopAll = () => { for (const p of procs) try { p.kill("SIGTERM"); } catch {} };
process.on("exit", stopAll);

const report = { shots: [], errors: {}, ssr: {}, design: [] };
const fail = [];
try {
  await serve("next", "npx", ["next", "start", "-p", "5301"], path.join(ROOT, "examples/next"), {}, ALL.next);
  await serve("nuxt", "node", [".output/server/index.mjs"], path.join(ROOT, "examples/nuxt"), { PORT: "5302", HOST: "127.0.0.1" }, ALL.nuxt);

  // 3a. 服务端直出的 HTML：不跑 JS 也要有组件的标记
  const MARKS = ["sn-btn sn-primary", "sn-seg", "sn-slider", "sn-select", "sn-tabs", "sn-acc", "sn-stepper", "sn-steps", "sn-chip", "sn-check", "sn-switch"];
  for (const n of ["next", "nuxt"].filter((n) => NAMES.includes(n))) {
    const html = await (await fetch(ALL[n])).text(), miss = MARKS.filter((m) => !html.includes(`class="${m}`) && !html.includes(` ${m}"`) && !html.includes(` ${m} `));
    report.ssr[n] = { bytes: html.length, missing: miss };
    if (miss.length) fail.push(`${n} 服务端直出的 HTML 里缺：${miss.join("、")}`);
  }

  const browser = await launch({ soft: true });
  const shoot = async (name, theme, size, js = true) => {
    const ctx = await newContext(browser, { side: "cur", theme, size, still: true });
    if (!js) { await ctx.close(); return shootNoJS(name, theme, size); }
    const page = await ctx.newPage(), errs = [];
    watchErrors(page, errs);
    page.on("console", (m) => { if (m.type() === "warning" && /hydrat|mismatch/i.test(m.text())) errs.push("console.warn: " + m.text().slice(0, 300)); });
    await page.goto(ALL[name], { waitUntil: "load" });
    await page.waitForFunction(() => { const m = document.querySelector("main.sink"); return m && m.querySelector(".sn-seg") && m.querySelector(".sn-stepper") && [...m.querySelectorAll("*")].every((e) => !e.localName.startsWith("sn-") || e.firstElementChild); }, null, { timeout: 15000 });
    await page.evaluate(() => window.__parity.settle(400, 6000));
    const audit = await page.evaluate(() => window.__parity.auditLog || []);
    for (const a of audit) errs.push(`前缀漏改 ${a.api} ${a.tok} @ ${a.at}`);
    const f = path.join(OUT, `${name}-${theme}-${size}.png`);
    await page.screenshot({ path: f, fullPage: true, animations: "disabled", caret: "hide" });
    await ctx.close();
    return { f, errs };
  };
  // 不跑 JS：服务端给的标记就是第一帧（主题只有浅色：深色靠 theme-boot 这段脚本）
  const shootNoJS = async (name, theme, size) => {
    const [w, h] = size === "phone" ? [390, 844] : [1440, 900];
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, javaScriptEnabled: false, locale: "zh-CN", colorScheme: theme });
    const page = await ctx.newPage(); await page.goto(ALL[name], { waitUntil: "load" }); await page.evaluate?.(() => 0).catch(() => {});
    await sleep(600);
    const f = path.join(OUT, `${name}-nojs-${theme}-${size}.png`);
    await page.screenshot({ path: f, fullPage: true, animations: "disabled", caret: "hide" });
    await ctx.close();
    return { f, errs: [] };
  };
  const diff = (a, b, out) => {
    const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
    if (A.width !== B.width || A.height !== B.height) return { px: -1, size: `${A.width}×${A.height} vs ${B.width}×${B.height}` };
    const D = new PNG({ width: A.width, height: A.height }), px = pixelmatch(A.data, B.data, D.data, A.width, A.height, { threshold: 0 });
    if (px) fs.writeFileSync(out, PNG.sync.write(D));
    return { px };
  };

  for (const [theme, size] of COMBOS) {
    const ref = await shoot("html", theme, size);
    report.errors[`html-${theme}-${size}`] = ref.errs; if (ref.errs.length) fail.push(`html ${theme}/${size} 有报错：${ref.errs[0]}`);
    for (const name of NAMES.filter((n) => n !== "html")) {
      const r = await shoot(name, theme, size), d = diff(ref.f, r.f, path.join(OUT, `diff-${name}-${theme}-${size}.png`));
      report.shots.push({ name, theme, size, ...d }); report.errors[`${name}-${theme}-${size}`] = r.errs;
      console.log(`  ${d.px === 0 ? "✓" : "✗"} ${name.padEnd(8)} ${theme}/${size}  ${d.px === 0 ? "和纯 HTML 版逐像素一致" : d.px < 0 ? "尺寸不同 " + d.size : d.px + " 个像素不同"}${r.errs.length ? "  报错 " + r.errs.length + "：" + r.errs[0] : ""}`);
      if (d.px !== 0) fail.push(`${name} ${theme}/${size} 截图和纯 HTML 版不一致（${d.px < 0 ? d.size : d.px + " 像素"}）`);
      if (r.errs.length) fail.push(`${name} ${theme}/${size} 有报错：${r.errs[0]}`);
      // 3b. 服务端渲染的第一帧（不跑 JS）= 水合以后
      if ((name === "next" || name === "nuxt") && theme === "light") {
        const nj = await shoot(name, theme, size, false), d2 = diff(r.f, nj.f, path.join(OUT, `diff-${name}-nojs-${theme}-${size}.png`));
        report.shots.push({ name: name + "-nojs", theme, size, ...d2 });
        console.log(`  ${d2.px === 0 ? "✓" : "✗"} ${(name + " 不跑JS").padEnd(8)} ${theme}/${size}  ${d2.px === 0 ? "服务端第一帧和水合以后逐像素一致" : d2.px < 0 ? "尺寸不同 " + d2.size : d2.px + " 个像素不同"}`);
        if (d2.px !== 0) fail.push(`${name} 不跑 JS 的第一帧和水合以后不一致（${d2.px < 0 ? d2.size : d2.px + " 像素"}）`);
      }
    }
  }

  // 4. 纯 HTML 版的组件 ↔ 设计稿里同一状态的组件
  const ROOTS = [".line > .sn-btn", ".sn-field", ".sn-check", ".sn-switch", ".sn-seg", ".sn-slider", ".sn-select", ".sn-tabs", ".line > .sn-pbar, .line > .sn-pring", ".sn-steps", ".sn-acc", ".sn-stepper", ".sn-chip"];
  for (const [theme, size] of [["light", "desktop"], ["dark", "desktop"]]) {
    const ctx = await newContext(browser, { side: "cur", theme, size, still: true });
    const ex = await ctx.newPage(); await ex.goto(ALL.html, { waitUntil: "load" }); await ex.waitForFunction(() => document.documentElement.dataset.ready === "1"); await ex.evaluate(() => window.__parity.settle(400, 6000));
    const sigs = await ex.evaluate((sel) => sel.flatMap((s) => [...document.querySelectorAll("main.sink " + s.split(", ").join(", main.sink "))].map((el) => ({ sel: s, sig: window.__parity.sigOf(el), tree: window.__parity.subtree(el) }))), ROOTS);
    const dp = await ctx.newPage(); await dp.goto("http://127.0.0.1:5192/index.html", { waitUntil: "load" }); await dp.evaluate(() => window.__parity.settle(600, 15000));
    for (const s of sigs) {
      const cands = await dp.evaluate((sig) => window.__parity.findLike(sig), s.sig);
      let best = null;
      for (const c of cands) { const d = treeDiff(s.tree, c); if (!best || d.length < best.length) best = d; if (!d.length) break; }
      const row = { theme, sel: s.sel, text: s.sig.text.slice(0, 24), candidates: cands.length, diffs: best ? best.slice(0, 8) : null };
      report.design.push(row);
      console.log(`  ${best && !best.length ? "✓" : cands.length ? "✗" : "·"} 设计稿 ${theme} ${s.sel.padEnd(22)} ${row.text.padEnd(14)} ${!cands.length ? "设计稿里没有同一状态的这个组件" : best.length ? best.length + " 处不同：" + best[0] : "结构、尺寸、样式一致"}`);
      if (best && best.length) fail.push(`设计稿对比 ${theme} ${s.sel}「${row.text}」：${best[0]}`);
    }
    await ctx.close();
  }
  await browser.close();
} finally { stopAll(); }

// 子树逐项比：结构、属性、文字、尺寸（位置只比相对根的）、计算样式。
// 根的宽度不一样（滑杆、标签页、折叠面板这类撑满容器的，示例页和设计稿的容器宽度不同）：只比高度、纵向位置和与宽度无关的样式
const WIDTHY = new Set(["width", "min-width", "max-width", "grid-template-columns", "transform", "translate", "left", "right", "background-position", "background-size", "flex-basis"]);
function treeDiff(a, b) {
  const out = [], B = new Map(b.map((n) => [n.rel, n]));
  if (a.length !== b.length) out.push(`节点数 ${a.length} ≠ ${b.length}`);
  const flex = a[0] && b[0] && a[0].box[2] !== b[0].box[2];
  for (const n of a) {
    const m = B.get(n.rel); if (!m) { out.push(`${n.rel} 设计稿里没有`); continue; }
    if (n.tag !== m.tag) out.push(`${n.rel} 标签 ${n.tag} ≠ ${m.tag}`);
    if (JSON.stringify(n.attrs) !== JSON.stringify(m.attrs)) out.push(`${n.rel} 属性 ${JSON.stringify(n.attrs).slice(0, 120)} ≠ ${JSON.stringify(m.attrs).slice(0, 120)}`);
    if (n.text !== m.text) out.push(`${n.rel} 文字「${n.text}」≠「${m.text}」`);
    const pick = (x) => (flex ? [x[1], x[3]] : x);
    if (JSON.stringify(pick(n.box)) !== JSON.stringify(pick(m.box))) out.push(`${n.rel} 位置尺寸 ${n.box} ≠ ${m.box}`);
    if (n.style && m.style) for (const k of Object.keys(n.style)) if (n.style[k] !== m.style[k] && !(flex && WIDTHY.has(k))) out.push(`${n.rel} ${k}: ${n.style[k]} ≠ ${m.style[k]}`);
    if (!n.style !== !m.style) out.push(`${n.rel} ${n.style ? "示例里画出来了、设计稿里没有" : "示例里没画出来"}`);
  }
  return out;
}

fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
console.log(fail.length ? `\n示例验收：${fail.length} 项不通过\n  ` + fail.slice(0, 30).join("\n  ") : "\n示例验收：全部通过（截图逐像素一致、0 报错、服务端渲染直出完整、和设计稿同一状态的组件一致）");
process.exitCode = fail.length ? 1 : 0;
