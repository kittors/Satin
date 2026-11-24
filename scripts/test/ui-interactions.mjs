// 真实浏览器交互与视觉几何 E2E 门禁（防低级视觉回归与交互失效）：
// 覆盖：
//   1. 滑块轨道垂直对齐 + 100% 气泡单行横排 + 禁选字（防 .sn-rail / .sn-bubble CSS 污染）
//   2. Picker（单选/范围/时间）智能定位零顶栏/底边裁切 + 日期点选不隐身 + Clear 图标与右侧热区一击清空且不误弹面板
//   3. Popover 智能定位不遮挡触发按钮 + 完整无底边裁切
//   4. Tooltip 悬停防撞窗口上下边缘
//   5. 下拉菜单 / 日期面板 / 弹出面板统一双向微动效（退场 >= 150ms 且同步缩放位移）
//   6. OTP 验证码密码隐藏模式（type="password"）+ 眼睛显隐切换 + 6 位自动跳格
//   7. Dialog 弹窗标题栏流畅拖拽 + 双击标题栏复位 + 关闭重置
//   8. CSS 裸类隔离门禁：Markdown [!TIP] 不被 .sn-tip 隐藏，滑块 .sn-rail 窄屏不消失
// 用法：先起服务（python3 serve.py 5192 .），再跑 node scripts/test/ui-interactions.mjs
import { launch, arg } from "../parity/lib.mjs";

const BASE = arg("base", "http://127.0.0.1:5192").replace(/\/$/, "");
const DOCS = `${BASE}/site/next-docs.html`;
const failures = [];
const ok = (name, detail = "") => console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ""}`);
const assert = (cond, name, detail = "") => {
  if (cond) ok(name, detail);
  else {
    failures.push(`${name}${detail ? `: ${detail}` : ""}`);
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
};

async function gotoDoc(page, hash) {
  await page.goto(`${DOCS}${hash}`, { waitUntil: "domcontentloaded", timeout: 25000 });
  await page.waitForFunction(() => {
    const h1 = document.querySelector(".d-h1");
    const pending = document.querySelector("[data-async]");
    return !!h1 && !pending;
  }, { timeout: 20000 });
  await page.waitForTimeout(450);
}

async function waitIframeReady(page, slug) {
  const sel = `iframe[src*="${slug}"], iframe[data-src*="${slug}"]`;
  const handle = await page.waitForSelector(sel, { timeout: 15000 });
  await handle.scrollIntoViewIfNeeded();
  await page.waitForFunction((el) => !!el.getAttribute("src") && el.getAttribute("src") !== "about:blank", handle, { timeout: 15000 });
  const frame = await handle.contentFrame();
  if (!frame) throw new Error(`找不到 iframe: ${slug}`);
  await frame.waitForFunction(() => document.readyState === "complete" && document.body.children.length > 0, { timeout: 15000 });
  await page.waitForTimeout(350);
  return { handle, frame };
}

// 获取 iframe 内某元素在宿主顶层视口中的真实绝对坐标
async function hostRectOf(page, iframeEl, frame, selector) {
  const fbox = await iframeEl.boundingBox();
  const r = await frame.locator(selector).first().evaluate((el) => {
    const q = el.getBoundingClientRect();
    return { left: q.left, top: q.top, right: q.right, bottom: q.bottom, width: q.width, height: q.height };
  });
  return {
    left: fbox.x + r.left,
    top: fbox.y + r.top,
    right: fbox.x + r.right,
    bottom: fbox.y + r.bottom,
    width: r.width,
    height: r.height,
  };
}

const browser = await launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(e.message));

try {
  console.log("\n[1/8] 滑块轨道对齐 + 100% 气泡单行横排 + 窄屏可见性");
  await gotoDoc(page, "#/c/slider");
  {
    const { handle, frame } = await waitIframeReady(page, "slider-basic");
    await handle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const slider = frame.locator(".sn-slider").first();
    const box = await slider.boundingBox();
    // 拖拽到最右侧（100%）
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width, box.y + box.height / 2, { steps: 6 });
    await page.waitForTimeout(120);
    const m = await slider.evaluate((el) => {
      const rail = el.querySelector(".sn-rail").getBoundingClientRect();
      const fill = el.querySelector(".sn-fillbar").getBoundingClientRect();
      const bub = el.querySelector(".sn-bubble").getBoundingClientRect();
      const cs = getComputedStyle(el.querySelector(".sn-bubble"));
      const rcs = getComputedStyle(el.querySelector(".sn-rail"));
      return {
        railCy: rail.top + rail.height / 2,
        fillCy: fill.top + fill.height / 2,
        railDisplay: rcs.display,
        bubH: bub.height,
        bubW: bub.width,
        bubText: el.querySelector(".sn-bubble").textContent.trim(),
        bubSelect: cs.userSelect,
        bubWs: cs.whiteSpace,
      };
    });
    await page.mouse.up();
    assert(Math.abs(m.railCy - m.fillCy) < 1, "滑块灰轨与进度条垂直中心对齐", `Δy=${Math.abs(m.railCy - m.fillCy).toFixed(2)}px`);
    assert(m.railDisplay !== "none", "滑块灰轨正常显示", `display=${m.railDisplay}`);
    assert(m.bubText === "100" && m.bubH < 28 && m.bubW >= 24 && m.bubWs === "nowrap", "100% 气泡单行横排不折断", `text=${m.bubText}, ${m.bubW.toFixed(1)}×${m.bubH.toFixed(1)}px, ws=${m.bubWs}`);
    assert(m.bubSelect === "none", "滑块气泡禁止误选中文字", `userSelect=${m.bubSelect}`);
  }

  console.log("\n[2/8] Picker 智能定位不裁切 + 日期不隐身 + Clear 热区一击清空不误弹");
  await gotoDoc(page, "#/c/picker");
  const navBottom = await page.evaluate(() => document.querySelector(".s-nav")?.getBoundingClientRect().bottom || 64);
  const vh = 900;
  for (const [slug, label] of [["picker-basic", "日期单选"], ["picker-range", "日期范围"], ["picker-time", "时间选择"]]) {
    const { handle, frame } = await waitIframeReady(page, slug);
    await handle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const trig = frame.locator(".sn-pk-trigger").first();
    await trig.click();
    await page.waitForTimeout(350);
    const panelRect = await hostRectOf(page, handle, frame, ".sn-pk-panel");
    assert(
      panelRect.top >= navBottom - 1 && panelRect.bottom <= vh + 1,
      `${label} 面板完整落在安全视口内`,
      `top=${Math.round(panelRect.top)} (nav=${Math.round(navBottom)}), bottom=${Math.round(panelRect.bottom)} (vh=${vh})`
    );

    // 选一个值，验证日期格子不会被 .sn-pop 隐身，且触发框有值
    if (slug === "picker-basic") {
      const cell = frame.locator(".sn-cal-grid .sn-d:not(.sn-out):not(.sn-dis)").nth(10);
      await cell.click();
      await page.waitForTimeout(50);
      const cellVis = await cell.evaluate((el) => ({ cls: el.className, op: getComputedStyle(el).opacity, pos: getComputedStyle(el).position }));
      assert(!cellVis.cls.includes("sn-pop") && cellVis.pos !== "fixed" && +cellVis.op > 0.8, "日期单选格子点击不触发 .sn-pop 隐身", `class=${cellVis.cls}, pos=${cellVis.pos}, op=${cellVis.op}`);
      await page.waitForTimeout(260);
    } else if (slug === "picker-range") {
      await frame.locator('.sn-pk-presets button[data-p="d7"]').click();
      await page.waitForTimeout(100);
      await frame.locator(".sn-pk-panel [data-ok]").click();
      await page.waitForTimeout(260);
    } else {
      await frame.locator(".sn-pk-panel [data-ok]").click();
      await page.waitForTimeout(260);
    }

    const hasBefore = await frame.locator(".sn-pk").first().evaluate((el) => el.classList.contains("sn-has"));
    assert(hasBefore, `${label} 选值后进入 .sn-has 状态`);

    // 悬停后点击右侧边缘热区（距离触发框右内边 12px 处，验证无需精确像素点中也能清空且绝不误弹面板）
    const tbox = await trig.boundingBox();
    await page.mouse.move(tbox.x + tbox.width - 12, tbox.y + tbox.height / 2);
    await page.waitForTimeout(120);
    await page.mouse.click(tbox.x + tbox.width - 12, tbox.y + tbox.height / 2);
    await page.waitForTimeout(260);
    const afterClear = await frame.locator(".sn-pk").first().evaluate((el) => ({
      has: el.classList.contains("sn-has"),
      open: el.classList.contains("sn-open"),
    }));
    assert(!afterClear.has && !afterClear.open, `${label} 点击清除区立即清空且面板保持关闭`, `has=${afterClear.has}, open=${afterClear.open}`);
  }

  console.log("\n[3/8] Popover 智能定位不遮挡触发按钮且无底边裁切");
  await gotoDoc(page, "#/c/popover");
  {
    const { handle, frame } = await waitIframeReady(page, "popover-basic");
    await handle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const trig = frame.locator("[data-pop]").first();
    await trig.click();
    await page.waitForTimeout(350);
    const trigRect = await hostRectOf(page, handle, frame, "[data-pop]");
    const popRect = await hostRectOf(page, handle, frame, ".sn-pop.sn-open");
    const noOverlap = popRect.top >= trigRect.bottom - 1 || popRect.bottom <= trigRect.top + 1;
    assert(noOverlap, "Popover 不遮挡触发按钮", `trig=[${Math.round(trigRect.top)}..${Math.round(trigRect.bottom)}], pop=[${Math.round(popRect.top)}..${Math.round(popRect.bottom)}]`);
    assert(popRect.top >= navBottom - 1 && popRect.bottom <= vh + 1, "Popover 完整落在视口内无裁切", `top=${Math.round(popRect.top)}, bottom=${Math.round(popRect.bottom)}`);
  }

  console.log("\n[4/8] Tooltip 文字提示智能翻转防撞窗口边缘");
  await gotoDoc(page, "#/c/tooltip");
  {
    const { handle, frame } = await waitIframeReady(page, "tooltip-truncate");
    await handle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const target = frame.locator("[data-tip-full]").first();
    const tbox = await target.boundingBox();
    await page.mouse.move(tbox.x + tbox.width / 2, tbox.y + tbox.height / 2);
    await page.waitForTimeout(750);
    const tipVis = await frame.locator("#sn-tip").evaluate((el) => el.classList.contains("sn-on"));
    assert(tipVis, "Tooltip 截断文字悬停成功唤起");
    if (tipVis) {
      const tipRect = await hostRectOf(page, handle, frame, "#sn-tip");
      const iframeBox = await handle.boundingBox();
      assert(
        tipRect.top >= navBottom - 1 && tipRect.bottom <= vh + 1 && tipRect.top >= iframeBox.y - 1 && tipRect.bottom <= iframeBox.y + iframeBox.height + 1,
        "Tooltip 完整可见不被顶栏或预览框边界裁切",
        `tip=[${Math.round(tipRect.top)}..${Math.round(tipRect.bottom)}], iframe=[${Math.round(iframeBox.y)}..${Math.round(iframeBox.y + iframeBox.height)}]`
      );
    }
  }

  console.log("\n[5/8] 下拉菜单 / 面板统一双向丝滑微动效");
  await gotoDoc(page, "#/c/select");
  {
    const { frame } = await waitIframeReady(page, "select-basic");
    const tr = await frame.locator(".sn-menu").first().evaluate((el) => {
      const cs = getComputedStyle(el);
      return { prop: cs.transitionProperty, dur: cs.transitionDuration };
    });
    const durs = tr.dur.split(",").map((s) => parseFloat(s) || 0);
    assert(
      tr.prop.includes("opacity") && tr.prop.includes("scale") && tr.prop.includes("translate") && durs[0] >= 0.14 && durs[1] >= 0.14,
      "Select 下拉菜单关闭态同步过渡 opacity + scale + translate (>=140ms)",
      `prop=${tr.prop}, dur=${tr.dur}`
    );
  }

  console.log("\n[6/8] OTP 验证码密码隐藏模式与显隐切换");
  await gotoDoc(page, "#/c/otp");
  {
    const { handle, frame } = await waitIframeReady(page, "otp-mask");
    await handle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const inputs = frame.locator(".sn-otp input");
    const initTypes = await inputs.evaluateAll((arr) => arr.map((i) => i.type));
    assert(initTypes.length === 6 && initTypes.every((t) => t === "password"), "OTP 掩码模式初始 6 格均为 password", `types=${initTypes.join(",")}`);
    await inputs.first().click();
    await page.keyboard.type("123456");
    await page.waitForTimeout(100);
    const val = await frame.locator(".sn-otp").first().evaluate((el) => el._otp?.value || "");
    assert(val === "123456", "OTP 掩码模式输入 6 位自动跳格值完整", `value=${val}`);
    const eyeBtn = frame.locator(".sn-otp-eye").first();
    await eyeBtn.click();
    await page.waitForTimeout(80);
    const revealedTypes = await inputs.evaluateAll((arr) => arr.map((i) => i.type));
    assert(revealedTypes.every((t) => t === "text"), "点击眼睛切换为明文 text");
    await eyeBtn.click();
    await page.waitForTimeout(80);
    const hiddenAgain = await inputs.evaluateAll((arr) => arr.map((i) => i.type));
    assert(hiddenAgain.every((t) => t === "password"), "再次点击眼睛恢复为密文 password");
  }

  console.log("\n[7/8] Dialog 弹窗标题栏拖动 + 双击复位 + 关闭重置");
  await gotoDoc(page, "#/c/dialog");
  {
    const { handle, frame } = await waitIframeReady(page, "dialog-basic");
    await handle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await frame.locator('[data-dlg]').first().click();
    await page.waitForTimeout(450);
    const dlg = frame.locator("dialog.sn-dlg[open]").first();
    const before = await dlg.boundingBox();
    const hd = frame.locator("dialog.sn-dlg[open] .sn-hd").first();
    const hdBox = await hd.boundingBox();
    const hdCursor = await hd.evaluate((el) => getComputedStyle(el).cursor);
    assert(hdCursor === "grab", "弹窗标题栏显示抓手光标", `cursor=${hdCursor}`);
    // 拖拽 (+90, +50)
    const sx = hdBox.x + hdBox.width / 2, sy = hdBox.y + hdBox.height / 2;
    await page.mouse.move(sx, sy);
    await page.mouse.down();
    await page.mouse.move(sx + 90, sy + 50, { steps: 6 });
    await page.mouse.up();
    await page.waitForTimeout(120);
    const dragged = await dlg.boundingBox();
    assert(
      Math.abs((dragged.x - before.x) - 90) < 6 && Math.abs((dragged.y - before.y) - 50) < 6,
      "按住标题栏拖动弹窗位移准确跟随",
      `Δx=${Math.round(dragged.x - before.x)}, Δy=${Math.round(dragged.y - before.y)}`
    );
    // 双击标题栏复位
    const hdAfter = await hd.boundingBox();
    await page.mouse.dblclick(hdAfter.x + hdAfter.width / 2, hdAfter.y + hdAfter.height / 2);
    await page.waitForTimeout(300);
    const resetBox = await dlg.boundingBox();
    assert(
      Math.abs(resetBox.x - before.x) < 4 && Math.abs(resetBox.y - before.y) < 4,
      "双击标题栏平滑复位回视口正中",
      `Δx=${Math.round(resetBox.x - before.x)}, Δy=${Math.round(resetBox.y - before.y)}`
    );
    // 拖开再关闭重开，验证自动复位
    await page.mouse.move(sx, sy);
    await page.mouse.down();
    await page.mouse.move(sx + 60, sy + 30, { steps: 4 });
    await page.mouse.up();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(350);
    await frame.locator('[data-dlg]').first().click();
    await page.waitForTimeout(450);
    const reopened = await dlg.boundingBox();
    assert(
      Math.abs(reopened.x - before.x) < 4 && Math.abs(reopened.y - before.y) < 4,
      "弹窗关闭后重开自动回到正中",
      `Δx=${Math.round(reopened.x - before.x)}, Δy=${Math.round(reopened.y - before.y)}`
    );
    await page.keyboard.press("Escape");
  }

  console.log("\n[8/8] CSS 裸类冲突隔离门禁（Markdown [!TIP] / 表格框选 .sn-rg / 窄屏滑块）");
  await page.setViewportSize({ width: 520, height: 800 });
  await gotoDoc(page, "#/c/slider");
  {
    const { frame } = await waitIframeReady(page, "slider-basic");
    const railDisp = await frame.locator(".sn-slider .sn-rail").first().evaluate((el) => getComputedStyle(el).display);
    assert(railDisp !== "none", "窄屏 (<640px) 下滑块轨道不被聊天刻度轨媒体查询隐藏", `display=${railDisp}`);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoDoc(page, "#/c/md");
  {
    const { frame } = await waitIframeReady(page, "md-basic");
    const iso = await frame.evaluate(() => {
      const box = document.querySelector(".sn-md") || document.body;
      const tipEl = document.createElement("div");
      tipEl.className = "sn-md-callout sn-tip";
      tipEl.textContent = "TIP 提示块";
      box.appendChild(tipEl);
      const tcs = getComputedStyle(tipEl);
      const resTip = { pos: tcs.position, op: tcs.opacity, h: tipEl.getBoundingClientRect().height };
      tipEl.remove();

      const cell = document.createElement("div");
      cell.className = "sn-g-cell sn-rg";
      cell.style.display = "inline-block";
      cell.textContent = "A1";
      document.body.appendChild(cell);
      const cw = cell.getBoundingClientRect().width;
      cell.remove();
      return { resTip, cw };
    });
    assert(
      iso.resTip.pos !== "fixed" && +iso.resTip.op === 1 && iso.resTip.h > 20,
      "Markdown [!TIP] 提示块不被 Tooltip .sn-tip 样式污染",
      `pos=${iso.resTip.pos}, op=${iso.resTip.op}, h=${Math.round(iso.resTip.h)}`
    );
    assert(iso.cw < 200, "数据表格框选 .sn-g-cell.sn-rg 不被地址选择器 .sn-rg 撑成 352px", `width=${Math.round(iso.cw)}px`);
  }

  assert(pageErrors.length === 0, "全流程 0 pageerror", pageErrors.join(" | "));
} finally {
  await browser.close();
}

console.log(`\n交互 E2E 完成：${failures.length === 0 ? "全部通过" : `${failures.length} 项失败`}`);
if (failures.length) process.exit(1);
