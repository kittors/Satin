// 静态截图 + DOM / 计算样式快照。
// 用法：node scripts/parity/shots.mjs --side base|cur [--out 目录] [--only id,id] [--themes light,dark] [--sizes desktop,tablet,phone] [--what embed,page,site] [--no-styles]
// 结果：目录/embed/<主题>-<尺寸>/<区块>.png 和 .json.gz（快照）；page/… 整页分屏截图；site/… 官网各页分屏截图；errors.json
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { launch, newContext, watchErrors, sectionIds, embedURL, ensureDir, arg, sleep, SIDES, STORE } from "./lib.mjs";

const SIDE = arg("side", "base"), OUT = path.resolve(arg("out", path.join(STORE, SIDE, "shots")));
const THEMES = String(arg("themes", "light,dark")).split(","), SIZES_ = String(arg("sizes", "desktop,tablet,phone")).split(",");
const WHAT = String(arg("what", "embed,page,site")).split(","), ONLY = arg("only", ""), STYLES = !arg("no-styles", false);
const SITE_ONLY = arg("routes", "");
const errors = {};
// 基线的竞态：Markdown 里"能动的 HTML"预览 iframe 载完就报一次高度，外面的监听要是还没装上，这次就丢了，框一直是最小高度 48
// （看运气，基线对基线不一致）。截图前让这些 iframe 再报一次，两边都落在内容的真实高度上。改造后修掉这个竞态（见 docs/report.md）
async function nudgeLive(page) {
  let n = 0;
  for (const f of page.frames()) if (f !== page.mainFrame() && f.url() === "about:srcdoc") n += await f.evaluate(() => (typeof window.send === "function" ? (window.send(), 1) : 0)).catch(() => 0);
  return n;
}

const browser = await launch({ soft: !arg("gpu", false) });
const t0 = Date.now();
try {
  const ids = ONLY ? String(ONLY).split(",") : await sectionIds(browser, SIDE);
  for (const theme of THEMES) for (const size of SIZES_) {
    const tag = `${theme}-${size}`;
    if (WHAT.includes("embed")) {
      const dir = path.join(OUT, "embed", tag); if (!ONLY) fs.rmSync(dir, { recursive: true, force: true }); ensureDir(dir);
      const ctx = await newContext(browser, { side: SIDE, theme, size, still: true }), page = await ctx.newPage();
      for (const id of ids) {
        const errs = []; watchErrors(page, errs);
        await page.goto(embedURL(SIDE, id), { waitUntil: "load" });
        let st = await page.evaluate(() => window.__parity.settle(800, 12000, 1500));
        if (await nudgeLive(page)) st = await page.evaluate(() => window.__parity.settle(400, 4000));
        await page.evaluate(() => window.__parity.freeze());
        await page.screenshot({ path: path.join(dir, id + ".png"), fullPage: true, animations: "disabled", caret: "hide" });
        const snap = await page.evaluate(({ id, s }) => window.__parity.snapshot(id, { styles: s }), { id, s: STYLES });
        fs.writeFileSync(path.join(dir, id + ".json.gz"), zlib.gzipSync(JSON.stringify(snap)));
        const audit = await page.evaluate(() => window.__parity.auditLog || []);
        for (const a of audit) errs.push(`前缀漏改 ${a.api} ${a.tok} @ ${a.at}`);
        page.removeAllListeners("pageerror"); page.removeAllListeners("console"); page.removeAllListeners("requestfailed");
        if (errs.length) errors[`embed/${tag}/${id}`] = errs;
        process.stdout.write(`\r${tag} ${id.padEnd(12)} ${st.ms}ms${st.anims ? " anims:" + st.anims : ""}${errs.length ? " ✗" + errs.length : ""}        `);
      }
      await ctx.close();
    }
    if (WHAT.includes("page")) {
      const dir = path.join(OUT, "page", tag); fs.rmSync(dir, { recursive: true, force: true }); ensureDir(dir);
      const ctx = await newContext(browser, { side: SIDE, theme, size, still: true }), page = await ctx.newPage(), errs = []; watchErrors(page, errs);
      await page.goto(SIDES[SIDE].url + "/index.html", { waitUntil: "load" });
      await page.evaluate(() => window.__parity.settle(800, 20000));
      const H = await page.evaluate(() => document.documentElement.scrollHeight), vh = page.viewportSize().height;
      let n = 0;
      for (let y = 0; y < H; y += vh, n++) {
        await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y);
        await page.evaluate(() => window.__parity.settle(300, 6000)); await page.evaluate(() => window.__parity.freeze());
        await page.screenshot({ path: path.join(dir, `tile-${String(n).padStart(3, "0")}.png`), animations: "disabled", caret: "hide" });
      }
      if (errs.length) errors[`page/${tag}`] = errs;
      process.stdout.write(`\r${tag} 整页 ${n} 屏                      `);
      await ctx.close();
    }
    if (WHAT.includes("site")) {
      const dir = path.join(OUT, "site", tag); if (!SITE_ONLY) fs.rmSync(dir, { recursive: true, force: true }); ensureDir(dir);
      const ctx = await newContext(browser, { side: SIDE, theme, size, still: true }), page = await ctx.newPage();
      await page.goto(SIDES[SIDE].url + "/site/next-docs.html#/start", { waitUntil: "load" }); await sleep(1500);
      let routes = await page.evaluate(() => [...document.querySelectorAll("[data-side] a[href^='#/']")].map((a) => a.getAttribute("href")));
      routes = ["next.html", ...routes]; if (SITE_ONLY) routes = routes.filter((r) => String(SITE_ONLY).split(",").some((k) => r.includes(k)));
      for (const r of routes) {
        const errs = []; watchErrors(page, errs);
        const url = r.endsWith(".html") ? `${SIDES[SIDE].url}/site/${r}` : `${SIDES[SIDE].url}/site/next-docs.html${r}`;
        await page.goto("about:blank"); await page.goto(url, { waitUntil: "load" });
        await page.evaluate(() => window.__parity.settle(600, 12000));
        const H = await page.evaluate(() => document.documentElement.scrollHeight), vh = page.viewportSize().height, name = r.replace(/[#/:.]+/g, "_").replace(/^_+|_+$/g, "");
        let n = 0;
        for (let y = 0; y < H && n < 40; y += vh, n++) {
          await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y);
          // 滚到的演示框载好（.ready）再拍
          await page.evaluate(async () => { const t = performance.now(); for (;;) { const pend = [...document.querySelectorAll(".d-frame")].filter((f) => { const b = f.getBoundingClientRect(); return b.bottom > 0 && b.top < innerHeight && !f.classList.contains("ready"); }); if (!pend.length || performance.now() - t > 8000) break; await new Promise((ok) => setTimeout(ok, 50)); } });
          await page.evaluate(() => window.__parity.settle(400, 6000));
          await page.evaluate(() => { window.__parity.freeze(); for (const f of document.querySelectorAll("iframe")) try { f.contentWindow.__parity?.freeze(); } catch {} });
          await page.screenshot({ path: path.join(dir, `${name}-${String(n).padStart(2, "0")}.png`), animations: "disabled", caret: "hide" });
        }
        page.removeAllListeners("pageerror"); page.removeAllListeners("console"); page.removeAllListeners("requestfailed");
        if (errs.length) errors[`site/${tag}/${name}`] = errs;
        process.stdout.write(`\r${tag} 官网 ${name.padEnd(28)} ${n} 屏         `);
      }
      await ctx.close();
    }
  }
} finally {
  await browser.close();
  ensureDir(OUT); fs.writeFileSync(path.join(OUT, "errors.json"), JSON.stringify(errors, null, 1));
  console.log(`\n完成 ${Math.round((Date.now() - t0) / 1000)}s，报错 ${Object.keys(errors).length} 处 → ${OUT}`);
}
