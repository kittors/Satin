// 录像自查（官网文档）：和用户一样的环境（滚动条常显、1440×900），每页 × 每个演示 × 每个触发器录一段“打开 → 停 → 关上”，
// 从画面里自动挑可疑的，拼成对照图给人看。和 docs-audit.mjs 互补：那边量 DOM（位置、透明度、撒点），这边看真正画出来的像素。
//
// 挑什么（每段录像比较像素，都在浏览器的画布里算）：
// · 关上后没回原样：第一帧（动作前）和最后一帧（关上 0.6s 后）在演示框以外的地方（目录、顶栏、正文）对不上——页面跳了、滚了、留了东西
// · 闪白：中间某一帧比开头、结尾都亮一截（遮罩淡出时底下一片白）
// · 不该动的地方动了：左边目录那一条，每帧和第一帧比（先按亮度归一，遮罩变暗不算），结构变了 = 整页左右跳 / 上下跳
// 用法（先起服务）：node scripts/visual-review.mjs [--pages chat,image] [--width 1440] [--max-triggers 8]
// 结果：/tmp/satin-review/ 下每个可疑动作一张对照图（8 帧）+ report.txt
import { createRequire } from "node:module";
import fs from "node:fs";

const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright");
const { execFileSync } = require("node:child_process");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); if (i < 0) return d; const v = process.argv[i + 1]; return v && !v.startsWith("--") ? v : true; };
const BASE = "http://127.0.0.1:5192/site/next-docs.html", W = +arg("width", 1440), H = W < 600 ? 844 : 900, MAXT = +arg("max-triggers", 8), ONLY = arg("pages", "");
const OUT = arg("out", "/tmp/satin-review"); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const flags = []; let nAct = 0;

const browser = await pw.chromium.launch({ channel: "chrome", ignoreDefaultArgs: ["--hide-scrollbars"], args: [`--window-size=${W},${H}`, "--autoplay-policy=no-user-gesture-required", "--disable-features=OverlayScrollbar"] });
try {
  const ctx = await browser.newContext({ viewport: { width: W, height: H } });
  const page = await ctx.newPage(); ctx.on("page", (p) => { if (p !== page) p.close().catch(() => {}); });
  page.on("dialog", (d) => d.dismiss().catch(() => {}));
  // 算像素的页面：JPEG 画到画布上量
  const calc = await ctx.newPage(); await calc.goto("about:blank");
  const stats = (frames, ex) => calc.evaluate(async ({ frames, ex, W }) => {
    const load = (s) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = "data:image/jpeg;base64," + s; });
    const imgs = await Promise.all(frames.map(load)), w = imgs[0].width, h = imgs[0].height, k = w / W;
    const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d", { willReadFrequently: true });
    const px = imgs.map((im) => { g.drawImage(im, 0, 0); return g.getImageData(0, 0, w, h).data; });
    const lum = (d, x0, y0, x1, y1, step = 3) => { let s = 0, n = 0; for (let y = y0; y < y1; y += step) for (let x = x0; x < x1; x += step) { const i = (y * w + x) * 4; s += d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11; n++; } return s / n; };
    const inEx = (x, y) => x >= ex.l * k && x <= ex.r * k && y >= ex.t * k && y <= ex.b * k; // 演示框（会变的地方）不比
    // 关上后没回原样：首尾两帧在演示框以外的平均像素差
    const a = px[0], z = px[px.length - 1]; let s = 0, n = 0;
    for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) { if (inEx(x, y)) continue; const i = (y * w + x) * 4; s += Math.abs(a[i] - z[i]) + Math.abs(a[i + 1] - z[i + 1]) + Math.abs(a[i + 2] - z[i + 2]); n++; }
    const endDiff = s / n / 3;
    // 闪白：整帧平均亮度
    const L = px.map((d) => lum(d, 0, 0, w, h, 6)), flash = Math.max(0, ...L.map((v) => v - Math.max(L[0], L.at(-1))));
    // 左边目录那一条：亮度归一后和第一帧比（遮罩只让它整体变暗，不算）
    const sx1 = Math.round(250 * k), sy0 = Math.round(70 * k), sy1 = h - 10;
    const norm = (d) => { const m = lum(d, 10, sy0, sx1, sy1, 4) || 1; const out = []; for (let y = sy0; y < sy1; y += 4) for (let x = 10; x < sx1; x += 4) { const i = (y * w + x) * 4; out.push((d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11) / m); } return out; };
    const base = norm(px[0]); let side = 0, sideAt = 0;
    px.forEach((d, j) => { const v = norm(d); let e = 0; for (let i = 0; i < v.length; i++) e += Math.abs(v[i] - base[i]); e /= v.length; if (e > side) { side = e; sideAt = j; } });
    return { endDiff: +endDiff.toFixed(2), flash: +flash.toFixed(1), side: +side.toFixed(3), sideAt, n: frames.length };
  }, { frames, ex, W });

  const cdp = await ctx.newCDPSession(page); let rec = null;
  cdp.on("Page.screencastFrame", (f) => { rec?.push({ t: f.metadata.timestamp, d: f.data }); cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });
  const start = async () => { rec = []; await cdp.send("Page.startScreencast", { format: "jpeg", quality: 60, maxWidth: W, maxHeight: H }); await page.waitForTimeout(120); };
  const stop = async () => { await cdp.send("Page.stopScreencast"); const r = rec; rec = null; return r; };
  const sheet = (frames, name) => {
    const dir = `${OUT}/.tmp`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
    for (let j = 0; j < 8; j++) fs.writeFileSync(`${dir}/${j}.jpg`, Buffer.from(frames[Math.round(j * (frames.length - 1) / 7)].d, "base64"));
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", `${dir}/%d.jpg`, "-vf", "scale=480:-1,tile=4x2:padding=6:color=white", "-frames:v", "1", `${OUT}/${name}.jpg`]);
    fs.rmSync(dir, { recursive: true, force: true });
  };
  await page.goto(`${BASE}#/intro`); await page.waitForTimeout(1500);
  let pages = await page.evaluate(() => [...document.querySelectorAll("[data-side] a[href^='#/c/'], [data-side] a[href^='#/guide/']")].map((a) => ({ h: a.getAttribute("href"), t: a.textContent.trim() })));
  if (ONLY) { const want = String(ONLY).split(","); pages = pages.filter((p) => want.some((w) => p.h.endsWith("/" + w))); }
  const OPEN = '[data-pop], [data-menubtn], [aria-haspopup], [data-dlg], [data-pk], [data-ctx], [data-ctx-box], .select > .trigger, .pk-trigger, [data-toast], [data-nf-add], .bubble.img .ph, .im.loaded, .md-img.blk img, [data-tip]';
  for (const [pi, pg] of pages.entries()) {
    console.log(`[${pi + 1}/${pages.length}] ${pg.h}`);
    // 换页本身也录一段：从上一页点过来
    await start(); await page.evaluate((h) => document.querySelector(`[data-side] a[href="${h}"]`)?.click(), pg.h); await page.waitForTimeout(900); const sw = await stop();
    if (sw.length > 3) { const st = await stats([sw[0].d, sw.at(-1).d].concat(sw.slice(1, -1).map((x) => x.d)).slice(0, 40), { l: 0, t: 0, r: 0, b: 0 }); nAct++; if (st.flash > 25) { flags.push(`${pg.h} 换页：中间闪白 ${st.flash}`); sheet(sw, `${String(flags.length).padStart(3, "0")}-换页-${pg.h.replace(/[#/]/g, "_")}`); } }
    const nf = await page.evaluate(() => document.querySelectorAll(".dx .d-frame iframe").length);
    for (let k = 0; k < nf; k++) {
      const info = await page.evaluate(async ([k, OPEN, max]) => {
        const f = [...document.querySelectorAll(".dx .d-frame iframe")][k], dx = f.closest(".dx"); dx.scrollIntoView({ block: "center", behavior: "instant" });
        for (let i = 0; i < 80 && !f.parentElement.classList.contains("ready"); i++) await new Promise((r) => setTimeout(r, 50));
        const d = f.contentDocument, sec = d?.getElementById(new URL(f.src).searchParams.get("embed")); if (!sec) return null;
        const ok = (el) => { const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return false; const hit = d.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2); return !!hit && (hit === el || el.contains(hit)); };
        const list = [...new Set(sec.querySelectorAll(OPEN))].filter(ok).slice(0, max);
        return { at: dx.dataset.demo + "#" + (dx.dataset.n ?? "-"), n: list.length, labels: list.map((el) => (el.getAttribute("aria-label") || el.dataset.tip || el.textContent || el.className).toString().trim().replace(/\s+/g, " ").slice(0, 12)) };
      }, [k, OPEN, MAXT]);
      if (!info) continue;
      for (let i = 0; i < info.n; i++) {
        // 重载这个演示（状态干净），把第 i 个触发器滚到视口中间，记下演示框的位置（这块不比）
        const aim = await page.evaluate(async ([k, i, OPEN, max]) => {
          const f = [...document.querySelectorAll(".dx .d-frame iframe")][k]; const old = f.contentDocument; f.contentWindow.location.reload();
          for (let j = 0; j < 120; j++) { await new Promise((r) => setTimeout(r, 40)); const d = f.contentDocument; if (d && d !== old && d.__dx && d.readyState !== "loading") break; }
          await new Promise((r) => setTimeout(r, 250));
          const d = f.contentDocument, sec = d.getElementById(new URL(f.src).searchParams.get("embed"));
          const ok = (el) => { const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return false; const hit = d.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2); return !!hit && (hit === el || el.contains(hit)); };
          const el = [...new Set(sec.querySelectorAll(OPEN))].filter(ok).slice(0, max)[i]; if (!el) return null;
          let r = el.getBoundingClientRect(), fr = f.getBoundingClientRect(); scrollBy({ top: fr.top + (r.top + r.bottom) / 2 - innerHeight * .45, behavior: "instant" });
          await new Promise((r2) => requestAnimationFrame(() => requestAnimationFrame(r2)));
          r = el.getBoundingClientRect(); fr = f.getBoundingClientRect(); const box = f.closest(".dx").getBoundingClientRect();
          return { x: fr.left + (r.left + r.right) / 2, y: fr.top + (r.top + r.bottom) / 2, hover: el.hasAttribute("data-tip") && !el.matches("[data-pop], [data-menubtn], [aria-haspopup], [data-dlg]"), right: el.matches("[data-ctx], [data-ctx-box]"), ex: { l: box.left - 4, t: box.top - 4, r: box.right + 4, b: box.bottom + 4 } };
        }, [k, i, OPEN, MAXT]);
        if (!aim) continue;
        nAct++; const label = `${pg.h} ${info.at} “${info.labels[i]}” ${aim.hover ? "悬停" : aim.right ? "右键" : "点击"}`;
        await page.mouse.move(aim.x > 60 ? 30 : W - 30, 30); await page.waitForTimeout(300);
        await start();
        if (aim.hover) await page.mouse.move(aim.x, aim.y, { steps: 5 }); else await page.mouse.click(aim.x, aim.y, { button: aim.right ? "right" : "left" });
        await page.waitForTimeout(aim.hover ? 900 : 700);
        await page.keyboard.press("Escape"); await page.waitForTimeout(100); await page.mouse.move(aim.x > 60 ? 30 : W - 30, 30); await page.waitForTimeout(650);
        const fr = await stop(); if (fr.length < 4) continue;
        // 均匀取 40 帧以内算（首尾两帧必带）
        const pick = fr.length <= 40 ? fr : Array.from({ length: 40 }, (_, j) => fr[Math.round(j * (fr.length - 1) / 39)]);
        const st = await stats(pick.map((x) => x.d), aim.ex);
        const why = [];
        if (st.endDiff > 1.2) why.push(`关上后页面没回原样（演示框外平均差 ${st.endDiff}）`);
        if (st.flash > 25) why.push(`中间闪白（比首尾亮 ${st.flash}）`);
        if (st.side > .08) why.push(`左边目录动了（结构差 ${st.side}，第 ${st.sideAt} 帧）`);
        if (why.length) { flags.push(`${label}：${why.join("；")}`); sheet(fr, `${String(flags.length).padStart(3, "0")}-${pg.h.replace(/[#/]/g, "_")}-${k}-${i}`); console.log("  ✗", flags.at(-1)); }
      }
    }
  }
  const txt = `录了 ${nAct} 段（${pages.length} 页），可疑 ${flags.length} 段：\n` + flags.map((f, i) => `${String(i + 1).padStart(3, "0")} ${f}`).join("\n");
  fs.writeFileSync(`${OUT}/report.txt`, txt); console.log("\n" + txt);
} finally { await browser.close(); }
