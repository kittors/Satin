// 点下去到画面开始动隔了几帧（真实时钟，不用帧时钟）：改造前（5193）和改造后（5192）各点 N 次，比中位数和最大值。
// 用来分辨逐帧轨迹里"起跑晚一两帧"是页面真的慢了，还是帧时钟接管合成线程动画的时机（等动画不再 pending 才接管）带来的噪声。
// 用法：node scripts/parity/latency.mjs [--n 12] [--cases motion,select,segmented]
import { launch, newContext, embedURL, arg, sleep } from "./lib.mjs";

const N = +arg("n", 12);
// 每个用例：区块、点哪个元素（两边类名不同，按改造前的类名写，改造后自动加 sn-）、看哪个元素的什么属性开始变
const CASES = {
  motion: { sec: "motion", click: ".curve", watch: ".curve .ball", prop: "transform", raw: true }, // 演示自己的类名，两边都没有前缀
  select: { sec: "select", click: ".select > button", watch: ".select > .menu", prop: "opacity", reset: "Escape" },
  segmented: { sec: "segmented", click: ".seg button:nth-of-type(2)", alt: ".seg button:nth-of-type(1)", watch: ".seg .thumb", prop: "transform" },
  // 滑块：按下就出数值气泡（淡入 + 放大），看按下到气泡开始变透明度隔几帧（逐帧轨迹里这一步改造前两遍之间就差一帧）
  slider: { sec: "slider", click: ".slider[data-slider]", watch: ".slider[data-slider] .bubble", prop: "opacity", ev: "pointerdown" }, // 按下就出，从按下开始数
};
const only = String(arg("cases", Object.keys(CASES).join(","))).split(",");
const browser = await launch();
const out = {};
for (const side of ["base", "cur"]) {
  const pre = side === "base" ? "" : "sn-", S = (sel) => sel.replace(/\.(?=[a-z])/g, "." + pre);
  for (const id of only) {
    const c = CASES[id]; if (!c) continue;
    const Q = c.raw ? (x) => x : S;
    const ctx = await newContext(browser, { side, theme: "light", size: "desktop" }), page = await ctx.newPage();
    await page.goto(embedURL(side, c.sec), { waitUntil: "load" }); await sleep(1200);
    const lat = [];
    for (let i = 0; i < N; i++) {
      const sel = c.alt && i % 2 ? Q(c.alt) : Q(c.click);
      // 页面里：记下现在的值，rAF 每帧看一次，变了就记是第几帧（点击发生在第 0 帧之前）
      // 从点击那一刻开始数（捕获阶段的一次性监听，在页面自己的点击处理之前），每个 rAF 看一次属性变了没有
      await page.evaluate(({ w, prop, ev }) => { const el = document.querySelector(w), v0 = getComputedStyle(el)[prop]; window.__lat = null; let n = 0; const tick = () => { n++; if (getComputedStyle(el)[prop] !== v0) { window.__lat = n; return; } if (n < 60) requestAnimationFrame(tick); }; document.addEventListener(ev, () => requestAnimationFrame(tick), { capture: true, once: true }); }, { w: Q(c.watch), prop: c.prop, ev: c.ev || "click" });
      await page.click(sel);
      await page.waitForFunction(() => window.__lat != null, null, { timeout: 3000 }).catch(() => {});
      lat.push(await page.evaluate(() => window.__lat));
      await sleep(c.prop === "transform" && id === "motion" ? 1000 : 500);
      if (c.reset) { await page.keyboard.press(c.reset); await sleep(400); }
    }
    const ok = lat.filter((x) => x != null).sort((a, b) => a - b);
    out[`${side}/${id}`] = { median: ok[Math.floor(ok.length / 2)] ?? null, max: ok.at(-1) ?? null, all: lat };
    await ctx.close();
  }
}
await browser.close();
for (const id of only) if (CASES[id]) console.log(`${id.padEnd(10)} 改造前 中位 ${out["base/" + id].median} 帧 / 最多 ${out["base/" + id].max}   改造后 中位 ${out["cur/" + id].median} 帧 / 最多 ${out["cur/" + id].max}   （${JSON.stringify(out["base/" + id].all)} | ${JSON.stringify(out["cur/" + id].all)}）`);
