// 录像（给人看的，验收以逐帧轨迹为准）：同一组交互在改造前（5193）和改造后（5192）各录一遍，拼成左右并排的视频。
// 每个交互一段：打开嵌入模式的区块 → 按脚本操作 → 停 1 秒。录像本身会制造长帧，所以不拿它判帧率。
// 用法：node scripts/parity/record.mjs [--only dialog,select] [--out .parity/video]   （要先起 5192、5193 两个服务；ffmpeg 在 /opt/homebrew/bin/ffmpeg）
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pw, arg, ensureDir, ROOT, SIDES, sleep } from "./lib.mjs";

const OUT = ensureDir(path.resolve(ROOT, arg("out", ".parity/video")));
const FFMPEG = "/opt/homebrew/bin/ffmpeg";
const W = 1280, H = 800;
// 交互脚本：用文字和标签找元素（两边类名不同，文字一样）
const CLIPS = [
  { id: "dialog", go: "dialog", steps: async (p) => { await p.getByText("新建项目", { exact: true }).first().click(); await sleep(900); await p.keyboard.press("Escape"); await sleep(800); } },
  { id: "select", go: "select", steps: async (p) => { const t = p.locator("[data-select] button").first(); await t.click(); await sleep(700); await p.keyboard.press("ArrowDown"); await sleep(250); await p.keyboard.press("Enter"); await sleep(700); } },
  { id: "segmented", go: "segmented", steps: async (p) => { const bs = p.locator("[data-seg] button"); for (const i of [1, 2, 0]) { await bs.nth(i).click(); await sleep(500); } } },
  { id: "toast", go: "toast", steps: async (p) => { await p.locator("section button").first().click(); await sleep(2500); } },
  { id: "drawer", go: "drawer", steps: async (p) => { await p.locator("[data-drawer]").first().click(); await sleep(900); await p.keyboard.press("Escape"); await sleep(800); } },
  { id: "table", go: "table", steps: async (p) => { const s = p.getByRole("button", { name: "镜头" }).first(); await s.click(); await sleep(900); await s.click(); await sleep(900); } },
  { id: "sidebar", go: "sidebar", steps: async (p) => { await p.locator("[data-collapse]").first().click(); await sleep(900); await p.locator("[data-collapse]").first().click(); await sleep(900); } },
  { id: "chat", go: "chat", steps: async (p) => { const ta = p.locator("textarea").first(); await ta.click(); await ta.type("第三场改成雨夜", { delay: 40 }); await p.keyboard.press("Meta+Enter"); await sleep(4000); } },
];
const only = arg("only", "") ? new Set(String(arg("only")).split(",")) : null;
const browser = await pw.chromium.launch({ channel: "chrome", headless: true });
for (const c of CLIPS) {
  if (only && !only.has(c.id)) continue;
  const files = [];
  for (const side of ["base", "cur"]) {
    const dir = ensureDir(path.join(OUT, "_raw", c.id, side));
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, recordVideo: { dir, size: { width: W, height: H } }, locale: "zh-CN", colorScheme: "light" });
    await ctx.addInitScript(() => { try { localStorage.setItem("satin-theme", "light"); } catch {} });
    const page = await ctx.newPage();
    await page.goto(`${SIDES[side].url}/index.html?embed=${c.go}`, { waitUntil: "load" }); await sleep(1200);
    try { await c.steps(page); } catch (e) { console.log(`  ${c.id} ${side}：${e.message.split("\n")[0]}`); }
    await sleep(600); const v = page.video(); await ctx.close(); files.push(await v.path());
  }
  const out = path.join(OUT, `${c.id}.mp4`);
  // 左：改造前，右：改造后；上面标一行字
  const r = spawnSync(FFMPEG, ["-y", "-loglevel", "error", "-i", files[0], "-i", files[1], "-filter_complex",
    `[0:v]drawtext=text='before':x=16:y=12:fontsize=22:fontcolor=black[a];[1:v]drawtext=text='after':x=16:y=12:fontsize=22:fontcolor=black[b];[a][b]hstack=inputs=2,scale=1920:-2[v]`,
    "-map", "[v]", "-r", "30", "-pix_fmt", "yuv420p", out], { encoding: "utf8" });
  console.log(`  ${r.status === 0 ? "✓" : "✗"} ${c.id} → ${path.relative(ROOT, out)}${r.status ? "  " + r.stderr.slice(0, 200) : ""}`);
}
await browser.close();
