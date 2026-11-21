// 附件："加附件 → 预览 → 删除"（提示词输入框、对话两块），每一步截图 + DOM 快照，和改造前比（compare.mjs）。
// 逐帧轨迹见 trace.mjs 里的场景（同样这几步）。2026-11-21 用户报：对话输入框加了附件以后只剩一排很小的 ×——
// 附件的类名是模板字符串拼的，改前缀时漏了（sn-tile / sn-bar），静态截图、自动触发器都没走到"加附件"这一步。
// 用法：node scripts/parity/attach.mjs --side base|cur [--out 目录] [--only prompt,chat] [--themes light,dark] [--sizes desktop,phone]
// 结果：目录/attach/<主题>-<尺寸>/<区块>-<步骤>.png 和 .json.gz；比：node scripts/parity/compare.mjs <cur>/attach <base>/attach --out …
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { launch, newContext, watchErrors, embedURL, ensureDir, arg, STORE } from "./lib.mjs";

const SIDE = arg("side", "base"), OUT = path.resolve(arg("out", path.join(STORE, SIDE, "shots")));
const IDS = String(arg("only", "prompt,chat")).split(","), THEMES = String(arg("themes", "light,dark")).split(","), SIZES = String(arg("sizes", "desktop,phone")).split(",");

// 每一步：做什么，做完等多久（上传是演示进度，一阵一阵走，最长 3 秒多）
// 菜单里的条目用元素自己的 click()：提示词输入框在页面最上面，附件菜单往上长、长到页面外面去了，鼠标点不着（两边一样）
const STEPS = [
  ["menu", async (s) => s.click("[data-cm-attach]"), 500],
  ["img", async (s) => s.pick('[data-add="img"]'), 4500],
  ["four", async (s) => { for (const k of ["vid", "aud", "doc"]) { await s.click("[data-cm-attach]"); await s.wait(300); await s.pick(`[data-add="${k}"]`); await s.wait(400); } }, 4500],
  ["hover", async (s) => s.hover('[data-kind="img"]'), 500],
  ["remove", async (s) => s.click(`[data-kind="img"] .${s.P}x`), 900],
  ["empty", async (s) => { for (const k of ["vid", "aud", "doc"]) { await s.click(`[data-kind="${k}"] .${s.P}x`); await s.wait(500); } }, 900],
];

const browser = await launch({ soft: !arg("gpu", false) });
const errors = {};
try {
  for (const theme of THEMES) for (const size of SIZES) {
    const tag = `${theme}-${size}`, dir = ensureDir(path.join(OUT, "attach", tag));
    // 帧时钟：上传进度、附件大小这些用到定时器和随机数的，两边按帧推进、走同样的顺序（真实时间下谁先跑不一定，随机数就对不上）
    const ctx = await newContext(browser, { side: SIDE, theme, size, still: true, frameClock: true }), page = await ctx.newPage();
    for (const id of IDS) {
      const errs = []; watchErrors(page, errs);
      await page.goto(embedURL(SIDE, id), { waitUntil: "load" });
      await page.evaluate(() => window.__parity.settle(800, 12000, 1500));
      if (await page.evaluate(() => window.__parity.dropAppended())) await page.evaluate(() => window.__parity.settle(400, 4000)); // 新加的演示先拿掉（见 inpage.js）
      await page.evaluate(() => window.__parity.clock?.(true));
      const frames = (ms) => page.evaluate((n) => window.__parity.waitFrames(n), Math.max(1, Math.round(ms / (1000 / 60))));
      const P = await page.evaluate(() => window.__parityPrefix || "");
      // 在这一块里找元素（两边类名前缀不同，选择器只用 data 属性；要用类名的拼上前缀）
      const box = async (sel) => { const el = page.locator(`#${id} ${sel}`).first(); await el.scrollIntoViewIfNeeded(); return el; };
      const at = async (sel) => { const r = await (await box(sel)).boundingBox(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; };
      // 每个动作做的时候停表（和 trace.mjs 一样）：鼠标点击要花的真实时间不一样，表要是一直走，上传进度、随机数用掉多少就对不上
      const still = async (fn) => { await page.evaluate(() => window.__parity.clock?.(false)); try { await fn(); } finally { await page.evaluate(() => window.__parity.clock?.(true)); } };
      const s = {
        P,
        wait: (ms) => frames(ms),
        // 先量好位置（表走着，元素该滚进来就滚进来），再停表用鼠标点：Playwright 的 click 要等元素"稳定"（按帧判断），停着表会一直等
        click: async (sel) => { const p = await at(sel); await still(() => page.mouse.click(p.x, p.y)); },
        pick: (sel) => still(() => page.locator(`#${id} ${sel}`).first().evaluate((el) => el.click())),
        hover: async (sel) => { const p = await at(sel); await still(() => page.mouse.move(p.x, p.y)); },
      };
      for (const [name, fn, wait] of STEPS) {
        try { await fn(s); } catch (e) { errs.push(`${name}：${String(e.message).split("\n")[0].slice(0, 160)}`); }
        await frames(wait);
        await page.evaluate(() => window.__parity.settle(400, 6000));
        await page.evaluate(() => window.__parity.freeze());
        // 截这一块里输入框那一片（含附件行、弹出的菜单），整块太高、和附件无关的地方不进来
        const cm = page.locator(`#${id} [data-composer]`).first();
        const r = await cm.boundingBox();
        const vp = page.viewportSize();
        const clip = r && { x: Math.max(0, r.x - 16), y: Math.max(0, r.y - 260), width: Math.min(vp.width - Math.max(0, r.x - 16), r.width + 32), height: r.height + 276 };
        await page.screenshot({ path: path.join(dir, `${id}-${name}.png`), clip: clip || undefined, animations: "disabled", caret: "hide" });
        const snap = await page.evaluate(({ id }) => window.__parity.snapshot(id, { styles: true }), { id });
        fs.writeFileSync(path.join(dir, `${id}-${name}.json.gz`), zlib.gzipSync(JSON.stringify(snap)));
      }
      for (const a of await page.evaluate(() => window.__parity.auditLog || [])) errs.push(`前缀漏改 ${a.api} ${a.tok} @ ${a.at}`);
      page.removeAllListeners("pageerror"); page.removeAllListeners("console"); page.removeAllListeners("requestfailed");
      if (errs.length) errors[`attach/${tag}/${id}`] = errs;
      process.stdout.write(`${tag} ${id.padEnd(8)} ${errs.length ? "✗ " + errs.join(" | ").slice(0, 200) : "✓"}\n`);
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(OUT, "attach", "errors.json"), JSON.stringify(errors, null, 1));
console.log(Object.keys(errors).length ? `附件：${Object.keys(errors).length} 组有报错` : "附件：全部走完");
