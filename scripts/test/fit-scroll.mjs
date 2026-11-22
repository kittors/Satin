// 一行放不下就横着滑（fitScroll）：放不下时变成横滑，后来又放得下了要回到原来的排列（原来判定一次就不回头）。
// 1. 先宽后窄：分段控件、标签页变成横滑（包一层滚动区域、加 .sn-scroll）
// 2. 先窄后宽：回到原来的排列——类名、内联样式、父元素和一开始一模一样，wheel 监听撤干净；滑块、下划线对准选中项
// 3. 回差：临界宽度上下抖（±3px、±6px）不来回跳；容器宽出 24px 以上才回去
// 4. 焦点：切换时焦点在里面的按钮上，切完还在
// 5. 转屏（手机竖 → 横 → 竖）：一开始就放不下（先窄后宽）→ 横屏放得下回到正常 → 竖屏又横滑
// 6. 触屏点击区：分段控件、分页看得见的高度不变，点击区上下扩到 44（pointer: coarse 才扩，鼠标下不扩）
// 用法：先起服务（python3 serve.py 5192 .），node scripts/test/fit-scroll.mjs
import { launch, SIDES } from "../parity/lib.mjs";
const browser = await launch(), bad = [], log = [];
const URL = SIDES.cur.url + "/tests/fit-scroll.html";
const frames = (page, n = 3) => page.evaluate((k) => new Promise((ok) => { const f = () => (--k ? requestAnimationFrame(f) : ok()); requestAnimationFrame(f); }), n);
const state = (page, sel) => page.evaluate((s) => {
  const el = document.querySelector(s);
  return { scroll: el.classList.contains("sn-scroll"), wrapped: !!el.parentElement?.classList.contains("sn-sa"), parent: el.parentElement?.id || el.parentElement?.className, cls: el.className, style: el.getAttribute("style"), wheels: window.__wheels(el), sa: !!el._sa, w: el.offsetWidth, sw: el.scrollWidth };
}, sel);
const SEG = "#seg .sn-seg", TABS = "#tabs .sn-tab-list", SEG2 = "#seg2 .sn-seg";
const check = (ok, msg) => { if (!ok) bad.push(msg); };
const same = (a, b) => a.cls === b.cls && a.style === b.style && a.parent === b.parent && !a.wrapped && !a.sa;
// 滑块对准选中的那一格、下划线对准选中的标签（回到正常排列以后）
const aligned = (page) => page.evaluate(() => {
  const seg = document.querySelector("#seg .sn-seg"), th = seg.querySelector(".sn-thumb").getBoundingClientRect(), on = seg.querySelector('button[aria-selected="true"]').getBoundingClientRect();
  const tl = document.querySelector("#tabs .sn-tab-list"), ink = tl.querySelector(".sn-ink").getBoundingClientRect(), tab = tl.querySelector("button.sn-on").getBoundingClientRect();
  return { seg: Math.max(Math.abs(th.left - on.left), Math.abs(th.width - on.width)), tab: Math.max(Math.abs(ink.left - tab.left), Math.abs(ink.width - tab.width)) };
});

// ———— 桌面（鼠标）：框的宽度来回改 ————
{
  const ctx = await browser.newContext({ viewport: { width: 900, height: 700 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(e.message));
  await page.goto(URL); await page.waitForFunction(() => window.ready); await frames(page, 4);
  const setW = async (w) => { await page.evaluate((x) => { document.getElementById("box").style.width = x + "px"; }, w); await frames(page); };
  const s0 = await state(page, SEG), t0 = await state(page, TABS);
  check(!s0.scroll && !t0.scroll, `一开始（600 宽）分段控件 / 标签页就横滑了：${s0.scroll} / ${t0.scroll}`);
  // 1. 先宽后窄
  await setW(200);
  const s1 = await state(page, SEG), t1 = await state(page, TABS);
  check(s1.scroll && s1.wrapped && t1.scroll && t1.wrapped, `200 宽没变成横滑：分段 ${JSON.stringify(s1)}，标签 ${JSON.stringify(t1)}`);
  // 滚动区域自己挂 2 个 wheel 监听（滚轮转横向、滚到头停住）；记下第一次的个数，来回切以后不能变多
  const k = s1.wheels;
  check(k >= 1 && t1.wheels === k, `横滑时 wheel 监听：分段 ${s1.wheels}，标签 ${t1.wheels}`);
  log.push(`先宽后窄（600 → 200）：分段 ${s1.scroll ? "横滑" : "正常"}，标签 ${t1.scroll ? "横滑" : "正常"}`);
  // 2. 先窄后宽
  await setW(600);
  const s2 = await state(page, SEG), t2 = await state(page, TABS), al = await aligned(page);
  check(same(s2, s0) && same(t2, t0), `回到 600 宽没回到原来的排列：分段 ${JSON.stringify(s2)}（原来 ${JSON.stringify(s0)}），标签 ${JSON.stringify(t2)}（原来 ${JSON.stringify(t0)}）`);
  check(s2.wheels === 0 && t2.wheels === 0, `回到正常排列后 wheel 监听没撤干净：分段 ${s2.wheels}，标签 ${t2.wheels}`);
  check(al.seg <= 1 && al.tab <= 1, `回到正常排列后滑块 / 下划线没对准：偏 ${al.seg.toFixed(1)} / ${al.tab.toFixed(1)}px`);
  log.push(`先窄后宽（200 → 600）：分段 ${s2.scroll ? "横滑" : "正常"}，标签 ${t2.scroll ? "横滑" : "正常"}；类名、样式、父元素和一开始一样 ${same(s2, s0) && same(t2, t0)}；滑块偏 ${al.seg.toFixed(1)}px、下划线偏 ${al.tab.toFixed(1)}px`);
  // 来回切 5 遍：监听不越积越多
  for (let i = 0; i < 5; i++) { await setW(200); await setW(600); }
  const s3 = await state(page, SEG); await setW(200); const s4 = await state(page, SEG); await setW(600);
  check(s3.wheels === 0 && s4.wheels === k, `来回切 5 遍以后 wheel 监听：正常时 ${s3.wheels}、横滑时 ${s4.wheels}（应该 0 / ${k}）`);
  // 3. 回差：从宽往窄一次 1px，找到第一次变横滑的宽度 C（分段各格是 1fr，挤窄时窄的格子先让，C 比自然宽度小），在 C 上下抖
  await setW(420); let C = 0;
  for (let w = 420; w > 300; w--) { await setW(w); if ((await state(page, SEG)).scroll) { C = w; break; } }
  check(C > 0, "从 420 往窄一直到 300 都没变成横滑");
  let flips = 0, last = true;
  for (const d of [3, -3, 6, -3, 3, -6, 6, -3, 3, 6]) { await setW(C + d); const s = await state(page, SEG); if (s.scroll !== last) flips++; last = s.scroll; }
  check(flips === 0, `临界宽度 ${C}±6px 来回抖时切换了 ${flips} 次（应该一直横滑）`);
  await setW(C + 30);
  const h2 = await state(page, SEG);
  check(!h2.scroll && same(h2, s0), `宽出 30px（${C + 30}）还没回到正常排列`);
  await setW(C + 2); const h3 = await state(page, SEG); await setW(C - 2); const h4 = await state(page, SEG);
  check(!h3.scroll && h4.scroll, `回到正常以后：${C + 2} 放得下应该正常（${h3.scroll ? "横滑" : "正常"}），${C - 2} 放不下应该横滑（${h4.scroll ? "横滑" : "正常"}）`);
  log.push(`回差：${C}px 开始横滑；${C - 6}～${C + 6} 来回抖 10 次切换 ${flips} 次；${C + 30} 回到正常 ${!h2.scroll}；之后 ${C + 2} ${h3.scroll ? "横滑" : "正常"}、${C - 2} ${h4.scroll ? "横滑" : "正常"}`);
  // 4. 焦点
  await setW(600);
  await page.focus('#seg .sn-seg button[aria-selected="true"]');
  await setW(200);
  const f1 = await page.evaluate(() => document.activeElement?.matches('#seg .sn-seg button[aria-selected="true"]'));
  await setW(600);
  const f2 = await page.evaluate(() => document.activeElement?.matches('#seg .sn-seg button[aria-selected="true"]'));
  check(f1 && f2, `切换以后焦点丢了：变横滑后 ${f1}，回到正常后 ${f2}`);
  log.push(`焦点：变横滑后还在 ${f1}，回到正常后还在 ${f2}`);
  // 6（鼠标）：不扩点击区
  const mouseHit = await page.evaluate(() => { const b = document.querySelector("#seg2 .sn-seg button"); return getComputedStyle(b, "::after").content; });
  check(mouseHit === "none", `鼠标下分段控件也加了点击区伪元素：${mouseHit}`);
  if (errs.length) bad.push(`页面报错：${errs.join("；")}`);
  await ctx.close();
}

// ———— 手机：转屏；触屏点击区 ————
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(e.message));
  await page.goto(URL); await page.waitForFunction(() => window.ready); await frames(page, 4);
  const p1 = await state(page, SEG2);
  check(p1.scroll, `竖屏 390 宽：7 格的分段控件应该横滑（内容 ${p1.sw}px，框 ${p1.w}px）`);
  await page.setViewportSize({ width: 844, height: 390 }); await frames(page, 4);
  const p2 = await state(page, SEG2);
  check(!p2.scroll && !p2.wrapped && !p2.sa, `转到横屏 844 宽还卡在横滑：${JSON.stringify(p2)}`);
  await page.setViewportSize({ width: 390, height: 844 }); await frames(page, 4);
  const p3 = await state(page, SEG2);
  check(p3.scroll && p3.wheels === p1.wheels, `转回竖屏没再横滑，或者监听个数变了（一开始 ${p1.wheels}）：${JSON.stringify(p3)}`);
  log.push(`转屏：竖屏 ${p1.scroll ? "横滑" : "正常"} → 横屏 ${p2.scroll ? "横滑" : "正常"} → 竖屏 ${p3.scroll ? "横滑" : "正常"}`);
  // 6. 触屏点击区：看得见的高度不变；中心上下 21px 还点得到，23px 点不到（44 高）
  await page.setViewportSize({ width: 844, height: 390 }); await frames(page, 4);
  const hit = await page.evaluate(() => {
    const probe = (el) => { el.scrollIntoView({ block: "center", behavior: "instant" }); const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, at = (dy) => { const t = document.elementFromPoint(cx, cy + dy); return !!t && (t === el || el.contains(t)); }; return { h: Math.round(r.height), in21: at(-21) && at(21), out23: !at(-23) && !at(23) }; };
    return { seg: probe(document.querySelector("#seg2 .sn-seg button")), pg: probe(document.querySelector("#pager .sn-pg")), prev: probe(document.querySelector('#pager [data-pg="prev"]')), coarse: matchMedia("(pointer: coarse)").matches };
  });
  check(hit.coarse, "手机模式下 (pointer: coarse) 不成立");
  for (const [k, v, h] of [["分段控件", hit.seg, 28], ["页码", hit.pg, 32], ["上一页", hit.prev, 28]]) check(v.h === h && v.in21 && v.out23, `${k}：看得见的高 ${v.h}（应该 ${h}），中心上下 21px 点得到 ${v.in21}，23px 点不到 ${v.out23}`);
  log.push(`触屏点击区：分段 ${JSON.stringify(hit.seg)}，页码 ${JSON.stringify(hit.pg)}，上一页 ${JSON.stringify(hit.prev)}`);
  if (errs.length) bad.push(`页面报错（手机）：${errs.join("；")}`);
  await ctx.close();
}
await browser.close();
console.log(log.join("\n"));
console.log(bad.length ? `一行放不下就横着滑：✗ ${bad.length} 处\n  ${bad.join("\n  ")}` : "一行放不下就横着滑：✓ 全部通过");
process.exitCode = bad.length ? 1 : 0;
