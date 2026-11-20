// 效果对比工具的公共部分：起浏览器、建上下文（固定随机数和时间、外部图片和音视频走本地缓存）、等落定、量区块列表。
// 和现有巡检脚本一样用本机 Chrome（PLAYWRIGHT 环境变量指向 playwright 包，默认用 TaleFrame 的）。
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
export const pw = (() => { for (const m of [process.env.PLAYWRIGHT, "playwright", "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright"]) { if (!m) continue; try { return require(m); } catch {} } throw new Error("找不到 Playwright：pnpm install（仓库根目录的 devDependencies 里有）"); })();
export const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, "../..");
export const STORE = path.join(ROOT, ".parity");
const CACHE = path.join(STORE, "cache");
fs.mkdirSync(CACHE, { recursive: true });

export const arg = (k, d) => { const i = process.argv.indexOf("--" + k); if (i < 0) return d; const v = process.argv[i + 1]; return v && !v.startsWith("--") ? v : true; };
export const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
export const SIZES = { desktop: [1440, 900], tablet: [768, 1024], phone: [390, 844] };
// 两边：基线（只读备份）和改造后
export const SIDES = { base: { url: "http://127.0.0.1:5193", prefix: "" }, cur: { url: "http://127.0.0.1:5192", prefix: process.env.PARITY_PREFIX ?? "sn-" } };

// soft：静态截图用软件栅格化（GPU 栅格化在动画刚停时会先用低质量缩放的图，什么时候换成高质量不确定 → 基线对基线有像素差）。
// 逐帧轨迹、帧间隔那一遍照常用 GPU
export async function launch({ soft = false } = {}) {
  return pw.chromium.launch({ channel: "chrome", headless: true, ignoreDefaultArgs: ["--hide-scrollbars"], args: ["--disable-features=OverlayScrollbar", "--autoplay-policy=no-user-gesture-required", "--font-render-hinting=none", "--disable-lcd-text", "--force-color-profile=srgb", ...(soft ? ["--disable-gpu", "--disable-gpu-rasterization", "--disable-gpu-compositing", "--run-all-compositor-stages-before-draw", "--disable-checker-imaging", "--disable-image-animation-resync", "--disable-threaded-animation", "--disable-partial-raster"] : [])] });
}

// 外部资源（Unsplash 图片、mixkit 音视频）第一次从网上取、存到 .parity/cache，以后都从缓存给：两边拿到的字节完全一样
async function cached(route) {
  const req = route.request(), url = req.url(), key = crypto.createHash("sha1").update(url).digest("hex"), f = path.join(CACHE, key);
  if (!fs.existsSync(f + ".json")) {
    try {
      // 不带 Range 取整份（音视频第一次请求带 Range，原样转发只会存下一截）
      const h0 = { ...req.headers() }; delete h0.range;
      const res = await route.fetch({ headers: h0, timeout: 60000 }), body = await res.body(), h = res.headers();
      if (res.status() !== 200) return route.fulfill({ status: res.status(), body });
      fs.writeFileSync(f, body); fs.writeFileSync(f + ".json", JSON.stringify({ url, status: 200, type: h["content-type"] || "application/octet-stream" }));
    } catch (e) { return route.abort(); }
  }
  const meta = JSON.parse(fs.readFileSync(f + ".json", "utf8")), body = fs.readFileSync(f);
  const headers = { "content-type": meta.type, "access-control-allow-origin": "*", "cache-control": "no-cache", "accept-ranges": "bytes" };
  // 音视频按 Range 给一段（206），和真实服务器一样
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers().range || "");
  if (m) {
    const start = m[1] ? +m[1] : Math.max(0, body.length - +m[2]), end = m[1] && m[2] ? Math.min(+m[2], body.length - 1) : body.length - 1;
    return route.fulfill({ status: 206, headers: { ...headers, "content-range": `bytes ${start}-${end}/${body.length}` }, body: body.subarray(start, end + 1) });
  }
  return route.fulfill({ status: 200, headers, body });
}

// side: "base" | "cur"；theme: light | dark；size: desktop | tablet | phone（或 [w, h]）
export async function newContext(browser, { side, theme = "light", size = "desktop", dpr = 1, mobile = false, reduced = false, storage = {}, still = false, frameClock = false }) {
  const [width, height] = Array.isArray(size) ? size : SIZES[size];
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile, locale: "zh-CN", timezoneId: "Asia/Shanghai", colorScheme: theme, reducedMotion: reduced ? "reduce" : "no-preference", serviceWorkers: "block" });
  await ctx.addInitScript(({ prefix, theme, storage, still, frameClock }) => {
    window.__parityPrefix = prefix; if (still) window.__paritySlowIntervals = "pause"; if (frameClock) window.__parityFrameClock = 1;
    try { if (!sessionStorage.getItem("__parity")) { localStorage.clear(); localStorage.setItem("satin-theme", theme); for (const [k, v] of Object.entries(storage)) localStorage.setItem(k, v); sessionStorage.setItem("__parity", "1"); } } catch {}
  }, { prefix: SIDES[side].prefix, theme, storage, still, frameClock });
  // 改造后的一边：带上前缀漏改探针（类名、变量名清单来自前缀改写的报告）
  const repF = path.join(STORE, "prefix-report.json");
  if (side === "cur" && SIDES.cur.prefix && fs.existsSync(repF)) { const r = JSON.parse(fs.readFileSync(repF, "utf8")); await ctx.addInitScript((a) => { window.__parityAudit = a; }, { classes: r.classes, vars: r.vars }); }
  await ctx.addInitScript({ path: path.join(HERE, "inpage.js") });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, cached);
  // 帧时钟模式下 Worker 在主线程里跑：Worker 模块改写成用这个实例的假 self（见 inpage.js）
  if (frameClock) await ctx.route(/parity-worker=/, async (route) => {
    const u = new URL(route.request().url()), id = u.searchParams.get("parity-worker"); u.searchParams.delete("parity-worker");
    const res = await route.fetch({ url: u.href }), src = await res.text();
    const body = `const __self = globalThis.__parityWS[${JSON.stringify(id)}];\n` + src.replace(/\bself\./g, "__self.").replace(/^\s*(postMessage|onmessage)\b/gm, "__self.$1");
    return route.fulfill({ status: 200, headers: { "content-type": "text/javascript", "cache-control": "no-store" }, body });
  });
  return ctx;
}

// 页面上的报错一律记下来（两边都要 0）
export function watchErrors(page, list) {
  page.on("pageerror", (e) => list.push("pageerror: " + e.message + " @ " + String(e.stack || "").split("\n").slice(1, 4).map((x) => x.trim()).join(" ← ")));
  page.on("console", (m) => { if (m.type() === "error") list.push("console: " + m.text().slice(0, 300)); });
  // 音视频请求被浏览器自己掐断（读够了元数据就停）是正常行为，不算
  page.on("requestfailed", (r) => { const u = r.url(), why = r.failure()?.errorText || ""; if (/\.(mp3|mp4|webm|m4a)(\?|$)/.test(u) && /ERR_ABORTED/.test(why)) return; if (!/^data:/.test(u)) list.push("requestfailed: " + u.slice(0, 200) + " " + (r.failure()?.errorText || "")); });
}

// index.html 里所有区块的 id（按页面顺序）
export async function sectionIds(browser, side = "base") {
  const ctx = await newContext(browser, { side }), page = await ctx.newPage();
  await page.goto(SIDES[side].url + "/index.html?embed=color", { waitUntil: "load" });
  const ids = await page.evaluate(async () => { const r = await fetch("index.html"), t = await r.text(); return [...t.matchAll(/<section class="spec" id="([a-z0-9-]+)"/g)].map((m) => m[1]); });
  await ctx.close();
  return ids;
}

export const embedURL = (side, id) => `${SIDES[side].url}/index.html?embed=${id}`;
export function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); return d; }
