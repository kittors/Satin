// 官网关键交互录像（给人看的；帧率、位置以 scripts/site/accept.mjs 的逐帧记录为准，录像本身会制造长帧）：
//  1. 手机 390 · 深色：打开导航抽屉 → 展开一个组件类别 → 主题调整（第二层）→ 返回 → 关上；文档页的"本页目录"条
//  2. 手机 390 · 浅色：抽屉里切框架（React → Vue），代码块跟着换，页面不跳
//  3. 桌面 1440 · 浅色：组件页顶栏切框架 HTML → React → Vue；主题调整面板（原地打开，不换页）
// 用法（先起服务：python3 serve.py 5192 .）：node scripts/site/record.mjs [--out .parity/site-video]
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright");
const ROOT = path.resolve(import.meta.dirname, "../..");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : d; };
const OUT = path.resolve(ROOT, arg("out", ".parity/site-video")), B = "http://127.0.0.1:5192/site/";
const FFMPEG = "/opt/homebrew/bin/ffmpeg";
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await pw.chromium.launch({ channel: "chrome", headless: true });
const errs = [];

async function clip(id, { W, theme }, steps) {
  const phone = W < 768, H = phone ? 812 : 900, tmp = path.join(OUT, "_" + id);
  fs.rmSync(tmp, { recursive: true, force: true });
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, colorScheme: theme, hasTouch: phone, isMobile: phone, deviceScaleFactor: phone ? 2 : 1, recordVideo: { dir: tmp, size: { width: W, height: H } } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errs.push(`${id} pageerror ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errs.push(`${id} console ${m.text()}`); });
  try { await steps(page); } catch (e) { errs.push(`${id} 步骤失败：${e.message.split("\n")[0]}`); }
  await sleep(600);
  const v = page.video(); await ctx.close();
  const src = await v.path(), mp4 = path.join(OUT, id + ".mp4");
  const r = spawnSync(FFMPEG, ["-y", "-loglevel", "error", "-i", src, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "23", "-movflags", "+faststart", mp4]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(r.status === 0 ? `  ✓ ${id}.mp4` : `  ✗ ${id}：ffmpeg ${r.stderr}`);
}

await clip("phone-drawer", { W: 390, theme: "dark" }, async (p) => {
  await p.goto(B + "next-docs.html#/c/button", { waitUntil: "load" }); await sleep(1600);
  await p.click("[data-menu]"); await sleep(900);
  const h = p.locator(".s-mn-g:not(.sn-open) .s-mn-h").first(); if (await h.count()) { await h.click(); await sleep(900); }
  const th = p.locator("[data-md-theme]").first(); if (await th.count()) { await th.click(); await sleep(1000); await p.keyboard.press("Escape").catch(() => {}); await sleep(700); }
  const x = p.locator(".s-mdrawer [data-x]").first(); if (await x.isVisible().catch(() => false)) await x.click(); else await p.keyboard.press("Escape"); await sleep(900);
  const t = p.locator(".mtoc-btn").first(); if (await t.isVisible().catch(() => false)) { await t.click(); await sleep(900); await p.keyboard.press("Escape"); await sleep(600); }
});
await clip("phone-framework", { W: 390, theme: "light" }, async (p) => {
  await p.goto(B + "next-docs.html#/c/select?fw=react", { waitUntil: "load" }); await sleep(1600);
  await p.mouse.wheel(0, 700); await sleep(800);
  await p.click("[data-menu]"); await sleep(900);
  const b = p.locator(".s-mdrawer [data-fmenu]").first(); if (await b.count()) { await b.click(); await sleep(600); await p.locator('[data-fw="vue"]').last().click(); await sleep(700); }
  await p.keyboard.press("Escape"); await sleep(1000);
});
await clip("desktop-framework", { W: 1440, theme: "light" }, async (p) => {
  await p.goto(B + "next-docs.html#/c/select?fw=html", { waitUntil: "load" }); await sleep(1600);
  await p.mouse.wheel(0, 600); await sleep(800);
  for (const fw of ["react", "vue"]) { await p.locator("header [data-fmenu]").first().click(); await sleep(500); await p.locator(`[data-fw="${fw}"]`).first().click(); await sleep(1200); }
  const th = p.locator("header [data-custom-btn]").first(); if (await th.count()) { await th.click(); await sleep(1200); await p.keyboard.press("Escape"); await sleep(700); }
});
await browser.close();
for (const e of [...new Set(errs)]) console.log("    " + e);
console.log(errs.length ? `官网录像：${errs.length} 条报错 / 步骤失败` : `官网录像：3 段都录好了（${path.relative(ROOT, OUT)}）`);
