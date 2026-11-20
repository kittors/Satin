// AI 评测打分：对 scripts/eval/run.mjs 做出来的每一份——
// 1. 构建（React / Vue：vite build；纯 HTML 不用）
// 2. 在浏览器里打开（本地静态服务）：浅 / 深 × 桌面 1440 / 手机 390 截整页图，记页面报错和控制台报错
// 3. 交互冒烟：依次点页面上的按钮（最多 20 个）、往第一个输入框里打字、按 Tab，记新出现的报错
// 4. 去 AI 味检查器：static（源码）+ dom（页面，深浅 × 三宽）
// 5. 每个需求出一张拼图（有 / 没有技能 × 框架，浅色桌面 + 深色手机），人工看图打分用
// 结果写进每份的 _score.json 和批次目录的 _scores.json；汇总表由 scripts/eval/report.mjs 写进 eval/results.md。
// 用法：node scripts/eval/score.mjs --batch b1 [--model clirelay/gpt-6-luna] [--only cond/fw/task] [--force]
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { spawnSync, spawn } from "node:child_process";
// 页面检查要访问本进程里起的静态服务：不能用 spawnSync（会卡住事件循环，服务回不了请求，检查器等到超时）
const spawnAsync = (cmd, args, { timeout = 300000, ...opts } = {}) => new Promise((resolve) => {
  const p = spawn(cmd, args, opts); let stdout = "", stderr = "";
  p.stdout.on("data", (d) => (stdout += d)); p.stderr.on("data", (d) => (stderr += d));
  const t = setTimeout(() => p.kill("SIGTERM"), timeout);
  p.on("close", (status) => { clearTimeout(t); resolve({ stdout, stderr, status }); });
});
import { createRequire } from "node:module";

const ROOT = path.resolve(import.meta.dirname, "../..");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : d; };
const BATCH = arg("batch", "b1"), FORCE = process.argv.includes("--force"), ONLY = arg("only"), DOM_ONLY = process.argv.includes("--dom-only");
const BASE = path.join("/tmp/satin-eval", BATCH);
const require = createRequire(import.meta.url);
const pw = (() => { for (const m of [process.env.PLAYWRIGHT, "playwright", "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright"]) { if (!m) continue; try { return require(m); } catch {} } throw new Error("找不到 Playwright：pnpm install（仓库根目录的 devDependencies 里有）"); })();
const CHECK = path.join(ROOT, "skills/satin/scripts/check.mjs");
const TASKS = JSON.parse(fs.readFileSync(path.join(ROOT, "eval/tasks.json"), "utf8")).tasks;

// 找出批次里所有做完的份：<批次>/<模型>/<有无技能>/<框架>/<需求>/_done.json
const runs = [];
for (const model of fs.existsSync(BASE) ? fs.readdirSync(BASE) : []) {
  if (arg("model") && model !== arg("model").replace(/[^\w.-]+/g, "_")) continue;
  for (const cond of ["with", "without"]) for (const fw of ["react", "vue", "html"]) for (const task of TASKS) {
    const dir = path.join(BASE, model, cond, fw, task.id);
    if (!fs.existsSync(path.join(dir, "_done.json"))) continue;
    if (ONLY && !`${cond}/${fw}/${task.id}`.includes(ONLY)) continue;
    runs.push({ model, cond, fw, task: task.id, dir });
  }
}
console.log(`打分 ${BATCH}：${runs.length} 份`);

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".json": "application/json", ".woff2": "font/woff2", ".ico": "image/x-icon" };
function serve(root) {
  return new Promise((ok) => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, "http://x").pathname); if (p.endsWith("/")) p += "index.html";
      const f = path.join(root, p); if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end("not found"); }
      res.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream", "cache-control": "no-store" }); fs.createReadStream(f).pipe(res);
    });
    srv.listen(0, "127.0.0.1", () => ok({ srv, url: `http://127.0.0.1:${srv.address().port}/` }));
  });
}
const SIZES = { desktop: [1440, 900], phone: [390, 844] };
const browser = await pw.chromium.launch({ channel: "chrome", headless: true });
const all = [];
for (const r of runs) {
  const out = path.join(r.dir, "_score.json");
  if (DOM_ONLY && fs.existsSync(out)) {
    // 只重跑页面检查：用已有的构建产物（React / Vue 的 dist）或源码目录（纯 HTML）
    const s = JSON.parse(fs.readFileSync(out, "utf8")), root = r.fw === "html" ? r.dir : path.join(r.dir, "dist");
    if (s.build?.ok !== false && fs.existsSync(path.join(root, "index.html"))) {
      const { srv, url } = await serve(root);
      const dm = await spawnAsync("node", [CHECK, "dom", url, "--json", "--widths", "1440,390", "--no-floats", "--out", path.join(r.dir, "_check")], { cwd: r.dir, timeout: 300000 });
      try { s.check.dom = JSON.parse(dm.stdout).counts; } catch { s.check.dom = { error: -1, note: (dm.stderr || "").slice(0, 200) }; }
      srv.close(); fs.writeFileSync(out, JSON.stringify(s, null, 2));
    }
    all.push(s); console.log(`  页面检查 ${r.cond.padEnd(7)} ${r.fw.padEnd(5)} ${r.task.padEnd(13)} ${s.check.dom?.error ?? "—"}/${s.check.dom?.warn ?? "—"}`);
    continue;
  }
  if (!FORCE && fs.existsSync(out)) { all.push(JSON.parse(fs.readFileSync(out, "utf8"))); continue; }
  const s = { ...r, done: JSON.parse(fs.readFileSync(path.join(r.dir, "_done.json"), "utf8")), build: null, errors: [], interact: [], shots: {}, check: {} };
  // 1. 构建
  let root = r.dir;
  if (r.fw !== "html") {
    const b = spawnSync("npx", ["vite", "build", "--logLevel", "error"], { cwd: r.dir, encoding: "utf8", timeout: 180000 });
    s.build = { ok: b.status === 0, log: ((b.stdout || "") + (b.stderr || "")).split("\n").filter((l) => /error|Error/.test(l)).slice(0, 8).join("\n") };
    root = path.join(r.dir, "dist");
  } else s.build = { ok: fs.existsSync(path.join(r.dir, "index.html")), log: "" };
  if (s.build.ok && fs.existsSync(path.join(root, "index.html"))) {
    const { srv, url } = await serve(root); s.url = url;
    const shotDir = path.join(r.dir, "_shots"); fs.mkdirSync(shotDir, { recursive: true });
    // 2. 截图 + 报错
    for (const theme of ["light", "dark"]) for (const [size, [w, h]] of Object.entries(SIZES)) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme, locale: "zh-CN", isMobile: size === "phone", hasTouch: size === "phone", deviceScaleFactor: 1 });
      const page = await ctx.newPage(), errs = [];
      page.on("pageerror", (e) => errs.push("pageerror: " + e.message.slice(0, 200)));
      page.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text().slice(0, 200)); });
      page.on("requestfailed", (q) => errs.push("requestfailed: " + q.url().replace(url, "/").slice(0, 120)));
      try { await page.goto(url, { waitUntil: "load", timeout: 20000 }); await page.waitForTimeout(1200); } catch (e) { errs.push("load: " + e.message.slice(0, 120)); }
      const f = path.join(shotDir, `${theme}-${size}.png`);
      const full = await page.evaluate(() => document.documentElement.scrollHeight).catch(() => h);
      await page.screenshot({ path: f, fullPage: full <= 4000, animations: "disabled" }).catch(() => {});
      s.shots[`${theme}-${size}`] = path.relative(r.dir, f);
      for (const e of errs) s.errors.push(`${theme}-${size} ${e}`);
      // 3. 交互冒烟（浅色桌面）
      if (theme === "light" && size === "desktop") {
        const before = errs.length;
        const n = await page.locator("button:visible").count().catch(() => 0);
        for (let i = 0; i < Math.min(n, 20); i++) { try { await page.locator("button:visible").nth(i).click({ timeout: 1500, trial: false }); await page.waitForTimeout(150); await page.keyboard.press("Escape"); } catch {} }
        try { const inp = page.locator("input[type=text]:visible, input:not([type]):visible, textarea:visible").first(); if (await inp.count()) { await inp.fill("测试一下"); } } catch {}
        for (let i = 0; i < 6; i++) await page.keyboard.press("Tab").catch(() => {});
        await page.waitForTimeout(400);
        s.interact = errs.slice(before).map((e) => "交互后 " + e);
        s.buttons = n;
      }
      await ctx.close();
    }
    // 4. 检查器
    // 纯 HTML：项目里自己写的文件（不含 .agents 里的技能、打分产物、依赖）——整个目录交给检查器会把技能自带的检查器源码也算进去
    const own = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.name.startsWith(".") || e.name.startsWith("_") || e.name === "node_modules" || e.name === "dist" ? [] : e.isDirectory() ? own(path.join(d, e.name)) : /\.(html|css|js|mjs|jsx|ts|tsx|vue)$/.test(e.name) ? [path.join(d, e.name)] : []);
    const srcs = r.fw === "html" ? own(r.dir) : [path.join(r.dir, "src"), path.join(r.dir, "index.html")];
    const st = spawnSync("node", [CHECK, "static", ...srcs, "--json"], { cwd: r.dir, encoding: "utf8", timeout: 120000, maxBuffer: 1 << 26 });
    try { const j = JSON.parse(st.stdout); s.check.static = j.counts; } catch { s.check.static = { error: -1, note: (st.stderr || "").slice(0, 200) }; }
    // 页面检查：桌面 1440、手机 390 × 深浅（平板宽度和点开浮层的检查评测时不跑，省时间）
    const dm = await spawnAsync("node", [CHECK, "dom", url, "--json", "--widths", "1440,390", "--no-floats", "--out", path.join(r.dir, "_check")], { cwd: r.dir, timeout: 300000 });
    try { const j = JSON.parse(dm.stdout); s.check.dom = j.counts; } catch { s.check.dom = { error: -1, note: (dm.stderr || "").slice(0, 200) }; }
    srv.close();
  }
  fs.writeFileSync(out, JSON.stringify(s, null, 2));
  all.push(s);
  console.log(`  ${s.build?.ok ? "✓" : "✗"} ${r.model} ${r.cond.padEnd(7)} ${r.fw.padEnd(5)} ${r.task.padEnd(13)} 报错 ${s.errors.length}+${s.interact.length}  检查器 静态 ${s.check.static?.error ?? "—"}/${s.check.static?.warn ?? "—"}  页面 ${s.check.dom?.error ?? "—"}/${s.check.dom?.warn ?? "—"}`);
}

// 5. 拼图：每个需求一张（行：框架；列：没有技能 浅色桌面、没有技能 深色手机、有技能 浅色桌面、有技能 深色手机）
const sheets = path.join(BASE, "_sheets"); fs.mkdirSync(sheets, { recursive: true });
for (const model of [...new Set(all.map((s) => s.model))]) for (const task of TASKS) {
  const rows = ["react", "vue", "html"].map((fw) => ["without", "with"].map((cond) => all.find((s) => s.model === model && s.task === task.id && s.fw === fw && s.cond === cond)));
  if (!rows.flat().some(Boolean)) continue;
  const cell = (s, k) => (s && s.shots?.[k] ? `<img src="file://${path.join(s.dir, s.shots[k])}">` : `<div class="miss">${s ? (s.build?.ok ? "没截到" : "构建失败") : "没做"}</div>`);
  const html = `<html><head><style>body{margin:0;background:#888;font:14px -apple-system,sans-serif}table{border-collapse:collapse}td{padding:6px;vertical-align:top}th{color:#fff;padding:6px;text-align:left}img{display:block;object-fit:cover;object-position:top}td.d img{width:520px;height:420px}td.p img{width:180px;height:420px}.miss{width:180px;height:420px;display:grid;place-items:center;background:#ccc}</style></head><body><table><tr><th></th><th>没有技能 · 浅色桌面</th><th>深色手机</th><th>有技能 · 浅色桌面</th><th>深色手机</th></tr>${rows.map((pair, i) => `<tr><th>${["React", "Vue", "HTML"][i]}</th>${pair.map((s) => `<td class="d">${cell(s, "light-desktop")}</td><td class="p">${cell(s, "dark-phone")}</td>`).join("")}</tr>`).join("")}</table></body></html>`;
  const hf = path.join(sheets, `${model}-${task.id}.html`); fs.writeFileSync(hf, html);
  const ctx = await browser.newContext({ viewport: { width: 1500, height: 900 } }), page = await ctx.newPage();
  await page.goto("file://" + hf); await page.waitForTimeout(500);
  await page.screenshot({ path: hf.replace(/\.html$/, ".png"), fullPage: true }); await ctx.close();
}
await browser.close();
fs.writeFileSync(path.join(BASE, "_scores.json"), JSON.stringify(all, null, 2));
console.log(`写出 ${path.join(BASE, "_scores.json")}；拼图在 ${sheets}`);
