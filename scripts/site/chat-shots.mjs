// 对话文档页的"新对话"示例（契约示例 chat-new）截图：深浅 × 桌面 1440 / 手机 390 × 空状态 / 加了附件 / 回复以后。
// 每张截示例框的预览台；附件：往输入框上拖进一张图（drop 事件带 File，和用户拖文件一样；附件菜单里的几项要 attachments 预置才有，这个示例没给）；
// 回复：点发送按钮，等流式输出停下。顺带记页面和演示里的报错。
// 用法（5192 起着）：node scripts/site/chat-shots.mjs [--slug chat-new] [--out /tmp/site-chat-shots]
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i < 0 ? d : process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : true; };
const SLUG = arg("slug", "chat-new"), OUT = arg("out", "/tmp/site-chat-shots"), B = "http://127.0.0.1:5192/site/next-docs.html", sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const b = await pw.chromium.launch({ channel: "chrome", headless: true });
const errs = [], notes = [];
for (const theme of ["light", "dark"]) for (const [dev, w, h] of [["desktop", 1440, 900], ["phone", 390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: theme, ...(dev === "phone" ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
  await ctx.addInitScript((t) => { if (window.top !== window) return; try { localStorage.setItem("satin-theme", t); } catch {} }, theme);
  const p = await ctx.newPage(), tag = `${theme}-${dev}`;
  p.on("pageerror", (e) => errs.push(`${tag} 页面：${e.message.slice(0, 160)}`));
  p.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errs.push(`${tag} 控制台：${m.text().slice(0, 160)}`); });
  await p.goto(B + "#/c/chat", { waitUntil: "load" }); await sleep(2500);
  const box = p.locator(`.dx[data-play="${SLUG}"]`);
  if (!(await box.count())) { errs.push(`${tag}：页面上没有 ${SLUG} 示例`); await ctx.close(); continue; }
  await box.scrollIntoViewIfNeeded(); await sleep(300);
  await p.evaluate((slug) => { const el = document.querySelector(`.dx[data-play="${slug}"]`); scrollTo({ top: scrollY + el.getBoundingClientRect().top - 80, behavior: "instant" }); }, SLUG);
  await p.waitForFunction((slug) => document.querySelector(`.dx[data-play="${slug}"] .d-frame`)?.classList.contains("sn-ready"), SLUG, { timeout: 15000 }).catch(() => errs.push(`${tag}：示例没载好`));
  await sleep(1200);
  const stage = box.locator(".dx-stage"), fr = p.frameLocator(`.dx[data-play="${SLUG}"] iframe`);
  await stage.screenshot({ path: `${OUT}/${tag}-1-空状态.png` });
  // 加附件：在演示里画一张 320×200 的渐变图，当成文件拖到输入框上
  const added = await p.evaluate(async (slug) => {
    const d = document.querySelector(`.dx[data-play="${slug}"] iframe`).contentDocument, w = d.defaultView, box = d.querySelector(".sn-composer"); if (!box) return 0;
    const cv = Object.assign(d.createElement("canvas"), { width: 320, height: 200 }), g = cv.getContext("2d"), gr = g.createLinearGradient(0, 0, 320, 200);
    gr.addColorStop(0, "#30404c"); gr.addColorStop(1, "#c8a070"); g.fillStyle = gr; g.fillRect(0, 0, 320, 200);
    const blob = await new Promise((r) => cv.toBlob(r, "image/png")), dt = new w.DataTransfer(); dt.items.add(new w.File([blob], "参考图.png", { type: "image/png" }));
    for (const t of ["dragenter", "dragover", "drop"]) box.dispatchEvent(new w.DragEvent(t, { dataTransfer: dt, bubbles: true, cancelable: true }));
    await new Promise((r) => setTimeout(r, 900)); return d.querySelectorAll(".sn-cm-file").length;
  }, SLUG).catch(() => 0);
  if (!added) errs.push(`${tag}：附件没加上`);
  // 等附件"上传"完（.sn-cm-file 标上 sn-done，缩略图上的进度环收起）再拍
  await p.waitForFunction((slug) => { const d = document.querySelector(`.dx[data-play="${slug}"] iframe`).contentDocument; const f = d.querySelector(".sn-cm-file"); return !!f && f.classList.contains("sn-done"); }, SLUG, { timeout: 6000 }).catch(() => notes.push(`${tag}：附件 6 秒内没传完，按当时的样子拍`));
  await sleep(500); await p.mouse.move(4, 4);
  await stage.screenshot({ path: `${OUT}/${tag}-2-加了附件.png` });
  // 回复：输入框里写一句，回车发出去；等流式输出停下（发送按钮回来、不再是停止）
  const ta = fr.locator("textarea").first();
  if (await ta.count()) { await ta.click(); await ta.fill("把第三集拆成镜头"); await sleep(300); await fr.locator(".sn-cm-send").first().click(); } else errs.push(`${tag}：找不到输入框`);
  await sleep(1000);
  for (let i = 0; i < 40; i++) { const busy = await fr.locator(".sn-cm-send.sn-stop, .sn-cm-stop, [aria-label*='停止']").first().isVisible().catch(() => false); if (!busy) break; await sleep(250); }
  await sleep(1500); await p.mouse.move(4, 4); await sleep(400); // 指针挪开：别让发送按钮的悬停提示留在图里
  await stage.screenshot({ path: `${OUT}/${tag}-3-回复以后.png` });
  const m = await p.evaluate((slug) => { const f = document.querySelector(`.dx[data-play="${slug}"] iframe`), d = f.contentDocument; return { msgs: d.querySelectorAll(".sn-chat-vp .sn-msg").length, h: Math.round(f.getBoundingClientRect().height) }; }, SLUG).catch(() => ({}));
  notes.push(`${tag}：附件 ${added} 个；回复以后消息 ${m.msgs ?? "?"} 行；示例高 ${m.h ?? "?"}px`);
  if (!m.msgs) errs.push(`${tag}：发出去以后没有消息`);
  await ctx.close();
}
await b.close();
// 总览：每种设备一张，行 = 浅 / 深，列 = 空状态 / 加了附件 / 回复以后（-label 要字体，这台机器没有 Ghostscript，不写字）
for (const dev of ["desktop", "phone"]) {
  const files = ["light", "dark"].flatMap((t) => ["1-空状态", "2-加了附件", "3-回复以后"].map((s) => `${OUT}/${t}-${dev}-${s}.png`)).filter((f) => fs.existsSync(f));
  try { execFileSync("magick", ["montage", ...files, "-tile", "3x", "-geometry", (dev === "desktop" ? "760x760" : "360x760") + "+6+6", "-background", "#9a9a9a", `${OUT}/总览-${dev === "desktop" ? "桌面" : "手机"}.png`], { stdio: "ignore" }); } catch (e) { errs.push("拼图失败 " + e.message.slice(0, 80)); }
}
fs.writeFileSync(`${OUT}/report.txt`, [...notes, "", ...errs.map((e) => "✗ " + e)].join("\n"));
for (const n of notes) console.log("  " + n);
for (const e of errs) console.log("  ✗ " + e);
console.log(`对话截图：${errs.length ? errs.length + " 处问题" : "没有报错"}（${OUT}）`);
