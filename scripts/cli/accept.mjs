// satin-cli 完整验收（要排队跑：会装依赖、构建、开浏览器，别和别的构建、浏览器测试同时跑）：
// 9 种写法各 satin init 一次（在仓库里运行 → satin-ui 用本地打的包）→ pnpm 走共享缓存装依赖（--prefer-offline）→ 构建 →
// 起服务 → Playwright 深浅各截一张、在浅色里点一遍（填名称、换视图、点创建，看轻提示的字对不对）、深色里看 theme-boot 有没有跟着系统 →
// 检查器 0 error（源码模式 + 页面模式）→ 汇总。临时项目在 /tmp/satin-cli-accept/<写法>/，截图在 /tmp/satin-cli-accept/_shots/，
// 结果写到 /tmp/satin-cli-accept/report.json。每种跑完删掉 node_modules 和构建产物省磁盘（--keep 不删，排查用）。
// 用法（先确认没有别的重任务在跑）：node scripts/cli/accept.mjs [--only react,vue] [--keep]
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { spawn, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CLI = path.join(ROOT, "packages/satin-cli/bin/satin.js");
const OUT = "/tmp/satin-cli-accept", SHOTS = path.join(OUT, "_shots");
const PLAYWRIGHT = process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright";
const pw = createRequire(import.meta.url)(PLAYWRIGHT);
const { FRAMEWORKS, IDS } = await import(path.join(ROOT, "packages/satin-cli/src/frameworks.js"));
const arg = (k) => { const i = process.argv.indexOf("--" + k); return i < 0 ? null : process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : true; };
const ONLY = typeof arg("only") === "string" ? arg("only").split(",") : IDS, KEEP = !!arg("keep");
const ENV = { ...process.env, CI: "1", NEXT_TELEMETRY_DISABLED: "1", NUXT_TELEMETRY_DISABLED: "1", NG_CLI_ANALYTICS: "false", FORCE_COLOR: "0" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const tail = (s, n = 8) => String(s || "").trim().split("\n").slice(-n).join("\n");

fs.mkdirSync(SHOTS, { recursive: true });

// 资源：内存压力到"严重"（4）就停下来等（本机 16GB，规矩见 CLAUDE.md）
async function waitMemory() {
  for (let i = 0; i < 40; i++) {
    const lv = Number(spawnSync("sysctl", ["-n", "kern.memorystatus_vm_pressure_level"], { encoding: "utf8" }).stdout.trim() || 1);
    if (lv < 4) return;
    console.log(`  内存压力严重（${lv}），等 30 秒`); await sleep(30000);
  }
}
function sh(cmd, args, cwd, timeout = 600000) {
  const r = spawnSync(cmd, args, { cwd, env: ENV, encoding: "utf8", timeout, maxBuffer: 64 * 1024 * 1024 });
  return { ok: r.status === 0, out: (r.stdout || "") + (r.stderr || ""), code: r.status };
}
// 一个只发静态文件的小服务（Angular 构建出来的 dist/browser 用；找不到的路径回 index.html）
function staticServer(dir, port) {
  const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2" };
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname); if (p.endsWith("/")) p += "index.html";
    let f = path.join(dir, p); if (!f.startsWith(dir) || !fs.existsSync(f)) f = path.join(dir, "index.html");
    res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
  }).listen(port, "127.0.0.1");
  return { kill: () => srv.close() };
}
function startServer(fw, dir, port) {
  if (fw === "angular") return staticServer(fs.existsSync(path.join(dir, "dist/browser")) ? path.join(dir, "dist/browser") : path.join(dir, "dist"), port);
  const cmd = {
    html: ["node", ["serve.mjs", String(port)]],
    next: ["pnpm", ["exec", "next", "start", "-p", String(port), "-H", "127.0.0.1"]],
    nuxt: ["node", [".output/server/index.mjs"]],
  }[fw] || ["pnpm", ["exec", "vite", "preview", "--port", String(port), "--strictPort", "--host", "127.0.0.1"]];
  const child = spawn(cmd[0], cmd[1], { cwd: dir, env: { ...ENV, PORT: String(port), HOST: "127.0.0.1", NITRO_PORT: String(port), NITRO_HOST: "127.0.0.1" }, detached: true, stdio: "ignore" });
  return { kill: () => { try { process.kill(-child.pid, "SIGTERM"); } catch { /* 已经退出 */ } } };
}
async function waitUp(url, ms = 60000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { try { const r = await fetch(url); if (r.ok) return true; } catch { /* 还没起来 */ } await sleep(500); }
  return false;
}
function checker(dir, argv) {
  const r = spawnSync(process.execPath, [path.join(dir, ".claude/skills/satin/scripts/check.mjs"), ...argv, "--json"], { cwd: dir, env: { ...ENV, PLAYWRIGHT }, encoding: "utf8", timeout: 600000, maxBuffer: 64 * 1024 * 1024 });
  try { const j = JSON.parse(r.stdout); return { error: j.counts.error, warn: j.counts.warn, rules: j.counts.byRule }; } catch { return { error: -1, note: tail(r.stdout + r.stderr, 4) }; }
}

const report = [];
for (const [i, fw] of ONLY.entries()) {
  if (!FRAMEWORKS[fw]) { console.log(`跳过不认识的写法：${fw}`); continue; }
  await waitMemory();
  const def = FRAMEWORKS[fw], dir = path.join(OUT, fw), port = 5301 + i, url = `http://127.0.0.1:${port}/`, r = { fw, steps: {} };
  report.push(r);
  console.log(`\n=== ${fw}（${def.title}）`);
  if (path.dirname(dir) === OUT) fs.rmSync(dir, { recursive: true, force: true }); // 只删 /tmp/satin-cli-accept/<写法>
  // 1. 生成
  let s = sh(process.execPath, [CLI, "init", "--framework", fw, "--dir", dir, "--pm", "pnpm", "--yes", "--no-install"], ROOT);
  r.steps.init = s.ok; if (!s.ok) { r.error = "init：" + tail(s.out); console.log(r.error); continue; }
  // 2. 装依赖（共享缓存）
  const t0 = Date.now(); s = sh("pnpm", ["install", "--prefer-offline"], dir, 900000);
  r.steps.install = s.ok; r.installSec = Math.round((Date.now() - t0) / 1000);
  if (!s.ok) { r.error = "pnpm install --prefer-offline 失败（可能缓存里缺包，要联网装）：\n" + tail(s.out); console.log(r.error); cleanup(dir); continue; }
  // 3. 构建
  if (def.scripts.build) { s = sh("pnpm", ["run", "build"], dir, 900000); r.steps.build = s.ok; if (!s.ok) { r.error = "构建失败：\n" + tail(s.out, 15); console.log(r.error); cleanup(dir); continue; } }
  // 4. 起服务、开页面
  const srv = startServer(fw, dir, port);
  try {
    if (!(await waitUp(url))) { r.error = `服务没起来（${url}）`; console.log(r.error); continue; }
    const browser = await pw.chromium.launch({ channel: "chrome", headless: true });
    try {
      for (const theme of ["light", "dark"]) {
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: theme, deviceScaleFactor: 2 });
        const page = await ctx.newPage(), errs = [];
        page.on("pageerror", (e) => errs.push("pageerror " + e.message));
        page.on("console", (m) => { if (m.type() === "error" && !/favicon/.test(m.text())) errs.push("console " + m.text()); });
        page.on("response", (res) => { if (res.status() >= 400 && !/favicon/.test(res.url())) errs.push(res.status() + " " + res.url()); });
        await page.goto(url, { waitUntil: "load" });
        await page.waitForSelector("h1:has-text('新建项目')", { timeout: 15000 });
        await page.waitForSelector(".sn-seg button", { timeout: 15000 }); // 分段控件画出来了（自定义元素 / 组件接上了）
        await sleep(400);
        r[theme] = { theme: await page.evaluate(() => document.documentElement.dataset.theme) };
        await page.screenshot({ path: path.join(SHOTS, `${fw}-${theme}.png`), fullPage: true });
        if (theme === "light") {
          await page.fill("#p-name", "春季新品发布");
          await page.click(".sn-seg button:has-text('列表')");
          await page.click("button:has-text('创建项目')");
          const toast = await page.waitForSelector(".sn-toast", { timeout: 5000 }).then((el) => el.textContent()).catch(() => "");
          r.toast = toast.trim();
          r.steps.interact = /春季新品发布/.test(toast) && /列表/.test(toast);
        }
        r[theme].errors = errs;
        await ctx.close();
      }
      r.steps.darkFollowsSystem = r.dark?.theme === "dark" && r.light?.theme === "light";
      r.steps.noErrors = !r.light.errors.length && !r.dark.errors.length;
    } finally { await browser.close(); }
    // 5. 检查器：源码 + 页面
    r.static = checker(dir, ["static", ...def.src]);
    r.dom = checker(dir, ["dom", url, "--out", path.join(OUT, "_check", fw), "--widths", "1440,390", "--themes", "light,dark"]);
    r.steps.checker = r.static.error === 0 && r.dom.error === 0;
  } catch (e) { r.error = String(e?.message || e).split("\n")[0]; console.log(r.error); }
  finally { srv.kill(); cleanup(dir); }
  console.log(`  ${Object.entries(r.steps).map(([k, v]) => `${k} ${v ? "✓" : "✗"}`).join("  ")}`);
}

function cleanup(dir) {
  if (KEEP || path.dirname(dir) !== OUT) return;
  for (const d of ["node_modules", "dist", ".next", ".nuxt", ".output", ".angular"]) fs.rmSync(path.join(dir, d), { recursive: true, force: true });
}

const ok = (r) => !r.error && Object.values(r.steps).every(Boolean);
console.log("\n写法       init 安装 构建 页面 交互 深色 检查器（源码/页面 error）  备注");
for (const r of report) {
  const m = (k) => (r.steps[k] === undefined ? " - " : r.steps[k] ? " ✓ " : " ✗ ");
  console.log(`${r.fw.padEnd(10)} ${m("init")}  ${m("install")}  ${m("build")}  ${m("noErrors")}  ${m("interact")}  ${m("darkFollowsSystem")}  ${r.static ? `${r.static.error}/${r.dom?.error}` : "-"}  ${r.error ? r.error.split("\n")[0].slice(0, 80) : ""}`);
}
fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 1));
const bad = report.filter((r) => !ok(r)).length;
console.log(bad ? `\nCLI 验收：${bad}/${report.length} 种写法有问题（详情 ${OUT}/report.json，截图 ${SHOTS}）` : `\nCLI 验收：${report.length} 种写法全部通过（截图 ${SHOTS}）`);
process.exitCode = bad ? 1 : 0;
