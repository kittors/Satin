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
import { PNG } from "pngjs";

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

    // 悬停后校验清除圆钮几何对齐：上=下=右等距同心圆（误差 <= 0.5px）且 × 图标位于圆正中心（误差 <= 0.5px）
    const tbox = await trig.boundingBox();
    await page.mouse.move(tbox.x + tbox.width - 12, tbox.y + tbox.height / 2);
    await page.waitForTimeout(260);
    const geom = await trig.evaluate((el) => {
      const tr = el.getBoundingClientRect();
      const b = el.querySelector(".sn-end > .sn-b").getBoundingClientRect();
      const ic = el.querySelector(".sn-end > .sn-b .sn-ic").getBoundingClientRect();
      return {
        topGap: b.top - tr.top,
        botGap: tr.bottom - b.bottom,
        rightGap: tr.right - b.right,
        icDx: (ic.left + ic.width / 2) - (b.left + b.width / 2),
        icDy: (ic.top + ic.height / 2) - (b.top + b.height / 2),
      };
    });
    assert(
      Math.abs(geom.topGap - geom.botGap) <= 0.6 && Math.abs(geom.topGap - geom.rightGap) <= 0.6,
      `${label} 清除圆钮与触发框上/下/右三边严格同心等距`,
      `top=${geom.topGap.toFixed(1)}px, bot=${geom.botGap.toFixed(1)}px, right=${geom.rightGap.toFixed(1)}px`
    );
    assert(
      Math.abs(geom.icDx) <= 0.6 && Math.abs(geom.icDy) <= 0.6,
      `${label} 清除 × 图标严格居中在圆钮中心`,
      `Δx=${geom.icDx.toFixed(2)}px, Δy=${geom.icDy.toFixed(2)}px`
    );
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

  console.log("\n[9/9] 单行表单控件（Input / Picker / Select / Button / OTP）真实渲染墨迹垂直居中门禁");
  {
    const inkPage = await browser.newPage({ viewport: { width: 960, height: 600 }, deviceScaleFactor: 2 });
    await inkPage.setContent(`<!doctype html><html lang="zh-CN"><head>
      <link rel="stylesheet" href="${BASE}/packages/satin-ui/css/page.css">
      <style>body{padding:24px;display:flex;flex-wrap:wrap;gap:16px;align-items:center;background:#fff}</style>
    </head><body>
      <input id="in-zh" class="sn-input" style="width:220px" value="选择开始和结束日期">
      <input id="in-sm" class="sn-input sn-sm" style="width:220px" value="选择开始和结束日期">
      <input id="in-lg" class="sn-input sn-lg" style="width:220px" value="选择开始和结束日期">
      <input id="in-xl" class="sn-input sn-xl" style="width:220px" value="选择开始和结束日期">
      <button id="pk-zh" class="sn-pk-trigger" style="width:220px"><span class="sn-val">选择开始和结束日期</span><span class="sn-end sn-swap"></span></button>
      <div class="sn-select" style="width:220px"><button id="sel-zh" class="sn-trigger"><span class="sn-val">选择开始和结束日期</span></button></div>
      <button id="btn-zh" class="sn-btn sn-secondary">选择开始和结束日期</button>
      <div class="sn-otp"><input id="otp-in" value="8"></div>
    </body></html>`, { waitUntil: "networkidle" });
    await inkPage.evaluate(() => document.fonts.ready);
    await inkPage.waitForTimeout(150);
    for (const [id, label] of [
      ["in-zh", "输入框 md 中文"], ["in-sm", "输入框 sm 中文"], ["in-lg", "输入框 lg 中文"], ["in-xl", "输入框 xl 中文"],
      ["pk-zh", "日期选择器触发框"], ["sel-zh", "下拉选择触发框"], ["btn-zh", "标准按钮"], ["otp-in", "验证码单格"],
    ]) {
      const buf = await inkPage.locator("#" + id).screenshot();
      const png = PNG.sync.read(buf);
      const { width: W, height: H, data } = png;
      const x0 = Math.max(4, Math.min(28, Math.floor(W * 0.15)));
      const x1 = Math.min(W - 5, Math.max(x0 + 6, Math.floor(W * 0.8)));
      let minY = H, maxY = -1;
      for (let y = 4; y <= H - 5; y++) {
        for (let x = x0; x <= x1; x++) {
          const i = (y * W + x) * 4;
          if (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2] < 210) {
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      const topPad = minY / 2, botPad = (H - 1 - maxY) / 2;
      const diff = ((minY + maxY) / 2 - (H - 1) / 2) / 2;
      assert(Math.abs(diff) <= 0.6, `${label} 真实墨迹垂直居中`, `top=${topPad.toFixed(2)}px, bot=${botPad.toFixed(2)}px, Δy=${diff >= 0 ? "+" : ""}${diff.toFixed(2)}px`);
    }
    await inkPage.close();
  }

  console.log("\n[10/10] 右键菜单区域尺寸饱满 + 真实右键唤起零裁切");
  await gotoDoc(page, "#/c/ctxmenu");
  {
    const { handle, frame } = await waitIframeReady(page, "ctxmenu-context");
    await handle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const zone = frame.locator(".sn-ctx-zone").first();
    const zbox = await zone.boundingBox();
    assert(zbox.width >= 320 && zbox.height >= 140, "右键演示区保持饱满可点击面积不被 flex 压扁", `${Math.round(zbox.width)}×${Math.round(zbox.height)}px`);
    await page.mouse.click(zbox.x + zbox.width / 2, zbox.y + zbox.height / 2, { button: "right" });
    await page.waitForTimeout(300);
    const menuOpen = await frame.locator(".sn-menu.sn-float.sn-open").count();
    assert(menuOpen > 0, "在演示区右键成功唤起浮动菜单");
    if (menuOpen > 0) {
      const mRect = await hostRectOf(page, handle, frame, ".sn-menu.sn-float.sn-open");
      assert(mRect.top >= navBottom - 1 && mRect.bottom <= vh + 1, "右键菜单完整落在视口内无裁切", `top=${Math.round(mRect.top)}, bottom=${Math.round(mRect.bottom)}`);
    }
    await page.keyboard.press("Escape");
  }

  console.log("\n[11/12] 树形控件：轻微激活态 + 展开收起微动效 + 异步懒加载 + 失败重试 + 万级虚拟树");
  await gotoDoc(page, "#/c/tree");
  {
    const { handle: hBasic, frame: fBasic } = await waitIframeReady(page, "tree-basic");
    await hBasic.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await fBasic.locator('.sn-tr[data-id="export"]').click();
    await page.waitForTimeout(120);
    const activeShadow = await fBasic.locator('.sn-tr[data-id="export"]').evaluate((el) => getComputedStyle(el).boxShadow);
    assert(activeShadow === "none", "鼠标单击树节点采用轻微激活态，不显示厚重焦点硬框", `boxShadow=${activeShadow}`);
    const beforeRows = await fBasic.locator(".sn-tr").count();
    await fBasic.locator('[data-tr-tw="script"]').click();
    await page.waitForTimeout(240);
    const collapsedRows = await fBasic.locator(".sn-tr").count();
    await fBasic.locator('[data-tr-tw="script"]').click();
    await page.waitForTimeout(240);
    const expandedRows = await fBasic.locator(".sn-tr").count();
    assert(collapsedRows < beforeRows && expandedRows === beforeRows, "树形节点收起与展开经微动效平滑切换子节点", `before=${beforeRows}, collapsed=${collapsedRows}, expanded=${expandedRows}`);

    const { handle: hLazy, frame: fLazy } = await waitIframeReady(page, "tree-lazy");
    await hLazy.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await fLazy.locator('[data-tr-tw="lz-ep1"]').click();
    await fLazy.locator('.sn-tr[data-id="lz-ep1-1"]').waitFor({ state: "visible", timeout: 4000 });
    assert((await fLazy.locator('.sn-tr[data-id="lz-ep1-1"]').count()) === 1, "树形懒加载展开后异步载入真实子节点");

    await fLazy.locator('[data-tr-tw="lz-retry"]').click();
    await fLazy.locator('[data-tr-retry="lz-retry"]').waitFor({ state: "visible", timeout: 4000 });
    assert((await fLazy.locator('[data-tr-retry="lz-retry"]').count()) === 1, "树形懒加载失败时原地展示重试按钮");
    await fLazy.locator('[data-tr-retry="lz-retry"]').click();
    await fLazy.locator('.sn-tr[data-id="lz-retry-1"]').waitFor({ state: "visible", timeout: 4000 });
    assert((await fLazy.locator('.sn-tr[data-id="lz-retry-1"]').count()) === 1, "点击重试后成功载入远程子节点");

    const { handle: hVirt, frame: fVirt } = await waitIframeReady(page, "tree-virtual");
    await hVirt.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const statText = await fVirt.locator("[data-tr-stat]").textContent();
    const domRows = await fVirt.locator(".sn-tr").count();
    const hasTreeSa = await fVirt.locator(".sn-tree-vp.sn-sa > .sn-sa-vp").count();
    assert(hasTreeSa === 1, "树形控件完整复用 Satin ScrollArea 悬浮滚动条");
    assert(statText.includes("10100"), "万级虚拟树完整索引 10,100 个节点", `stat=${statText}`);
    assert(domRows > 5 && domRows < 60, "万级虚拟树仅挂载视口窗口 DOM 行", `rendered=${domRows}`);
    await fVirt.locator(".sn-tree-vp > .sn-sa-vp").evaluate((el) => { el.scrollTop = 120000; });
    await page.waitForTimeout(150);
    const afterScrollDom = await fVirt.locator(".sn-tr").count();
    const scrolledLabels = await fVirt.locator(".sn-tr .sn-tr-lbl").allTextContents();
    assert(afterScrollDom > 5 && afterScrollDom < 60 && scrolledLabels.some((t) => /03[6-9]|04\d/.test(t)), "万级虚拟树大跨度滚动即时定位不露白", `sample=${scrolledLabels[0] || ""}`);
    await fVirt.locator("[data-tr-q]").fill("050-05");
    await page.waitForTimeout(150);
    const hits = await fVirt.locator(".sn-tr mark").count();
    assert(hits >= 1, "万级虚拟树实时搜索精准命中并高亮 <mark>", `hits=${hits}`);
  }

  console.log("\n[12/12] 文件管理与拟物文件夹：精巧高密多格式 + ScrollArea 复用 + 零多余横线 + 逐帧微动效 + 全交互闭环");
  await gotoDoc(page, "#/c/files");
  {
    const { handle, frame } = await waitIframeReady(page, "files-basic");
    await handle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // 1. 复用 ScrollArea + 去 AI 味零多余间隔线 + 卡片精巧尺寸 + 全格式真实内容预览
    const hasFxSa = await frame.locator("[data-fx-body].sn-sa > .sn-sa-vp").count();
    assert(hasFxSa === 1, "文件管理器完整复用 Satin ScrollArea 悬浮细滚动条");
    const noExtraBorders = await frame.evaluate(() => {
      const bar = getComputedStyle(document.querySelector(".sn-fex-bar")).borderBottomWidth;
      const foot = getComputedStyle(document.querySelector(".sn-fex-foot")).borderTopWidth;
      return bar === "0px" && foot === "0px";
    });
    assert(noExtraBorders, "工具栏与底栏零多余横线间隔（去 AI 味规范）");

    const tileW = (await frame.locator('[data-fx-id="f-shots"]').boundingBox()).width;
    assert(tileW <= 140, "卡片模式尺寸收紧精致紧凑（一行可排 5~6 项）", `tileWidth=${Math.round(tileW)}px`);

    const formatsOk = await frame.evaluate(() => {
      const has = (k) => !!document.querySelector(`.sn-fex-tile[data-kind="${k}"]`);
      const vidImg = !!document.querySelector('[data-kind="video"] .sn-fcard-frame img') && !!document.querySelector('[data-kind="video"] .sn-fcard-play');
      const picImg = !!document.querySelector('[data-kind="image"] .sn-fcard-frame img');
      const txtExcerpt = (document.querySelector('[data-kind="txt"] .sn-fcard-excerpt')?.textContent || "").trim().length > 8;
      return has("pdf") && has("word") && has("ppt") && has("vue") && has("tsx") && vidImg && picImg && txtExcerpt;
    });
    assert(formatsOk, "完整呈现 PDF / Word / PPT / Vue / TSX / TXT小字 / 图片小图 / 视频首帧");

    const initShotsSheets = await frame.locator('[data-fx-id="f-shots"] .sn-fdr-sheet').count();
    const initInboxSheets = await frame.locator('[data-fx-id="f-inbox"] .sn-fdr-sheet').count();
    assert(initShotsSheets === 3 && initInboxSheets === 0, "拟物文件夹夹层微缩纸张真实反映子内容（满 3 张 / 空 0 张）", `shots=${initShotsSheets}, inbox=${initInboxSheets}`);

    // 2. 真实鼠标拖拽图片卡片触发周边卡片 FLIP 避让重排（验证 <img> 不劫持拖拽 + 通透无白壳代理 + 无灰框空槽 + 过中缝即提前避让）
    const imgTile = frame.locator('[data-fx-id="d-still"]');
    const pptTile = frame.locator('[data-fx-id="d-ppt"]');
    const ibox = await imgTile.boundingBox();
    const pbox = await pptTile.boundingBox();
    await page.mouse.move(ibox.x + ibox.width / 2, ibox.y + ibox.height / 2);
    await page.mouse.down();
    await page.mouse.move(pbox.x + pbox.width * 0.28, pbox.y + pbox.height / 2, { steps: 10 });
    await page.waitForTimeout(240);
    const dragInfo = await frame.evaluate(() => {
      const pInner = document.querySelector(".sn-fex-proxy .sn-fex-proxy-inner");
      const slot = document.querySelector('[data-fx-id="d-still"].sn-fex-slot');
      const ids = [...document.querySelectorAll(".sn-fex-grid > [data-fx-id]")].map((el) => el.dataset.fxId);
      return {
        hasProxy: !!pInner,
        hasSlot: !!slot,
        proxyTransparent: pInner ? getComputedStyle(pInner).backgroundColor === "rgba(0, 0, 0, 0)" && getComputedStyle(pInner).boxShadow === "none" : false,
        slotClean: slot ? getComputedStyle(slot).backgroundColor === "rgba(0, 0, 0, 0)" && getComputedStyle(slot).boxShadow === "none" : false,
        avoided: ids.indexOf("d-ppt") < ids.indexOf("d-still"),
      };
    });
    assert(dragInfo.hasProxy && dragInfo.hasSlot && dragInfo.proxyTransparent && dragInfo.slotClean && dragInfo.avoided, "图片卡片通透无白壳实体拖拽、原位干净无灰槽且刚越过相邻交界线即平滑避让重排", JSON.stringify(dragInfo));
    await page.mouse.up();
    await page.waitForTimeout(260);

    // 2.5 真实鼠标拖拽 PDF 文件卡片到空拟物文件夹并逐帧采样 rAF 流畅度与掀盖姿态
    const srcTile = frame.locator('[data-fx-id="d-pdf"]');
    const dstTile = frame.locator('[data-fx-id="f-inbox"]');
    const sbox = await srcTile.boundingBox();
    const dbox = await dstTile.boundingBox();
    await frame.evaluate(() => {
      window.__fxFrames = [];
      window.__fxStop = false;
      let last = performance.now();
      const tick = (now) => {
        window.__fxFrames.push(now - last);
        last = now;
        if (!window.__fxStop) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await page.mouse.move(sbox.x + sbox.width / 2, sbox.y + sbox.height / 2);
    await page.mouse.down();
    await page.mouse.move(dbox.x + dbox.width / 2, dbox.y + dbox.height / 2, { steps: 14 });
    await page.waitForTimeout(160);
    const hasProxy = await frame.locator(".sn-fex-proxy").count();
    const isDropOpen = await dstTile.evaluate((el) => el.classList.contains("sn-drop-target"));
    const frontMat = await frame.locator('[data-fx-id="f-inbox"] .sn-fdr-front').evaluate((el) => getComputedStyle(el).transform);
    assert(hasProxy === 1 && isDropOpen && frontMat !== "none", "拖拽悬停拟物文件夹时真实本体代理跟手且前盖 3D 掀开", `proxy=${hasProxy}, dropTarget=${isDropOpen}, matrix=${frontMat.slice(0, 24)}`);
    await page.mouse.up();
    await page.waitForTimeout(340);
    const frameStats = await frame.evaluate(() => {
      window.__fxStop = true;
      const dts = window.__fxFrames.slice(1).sort((a, b) => a - b);
      const p95 = dts[Math.min(dts.length - 1, Math.floor(dts.length * 0.95))] || 0;
      const max = dts[dts.length - 1] || 0;
      return { n: dts.length, p95: +p95.toFixed(1), max: +max.toFixed(1) };
    });
    assert(frameStats.n >= 10 && frameStats.p95 <= 24, "拖拽与拟物掀盖吸入微动效逐帧流畅低延迟", `frames=${frameStats.n}, p95=${frameStats.p95}ms, max=${frameStats.max}ms`);

    const afterInboxSheets = await frame.locator('[data-fx-id="f-inbox"] .sn-fdr-sheet').count();
    const afterInboxKind = await frame.locator('[data-fx-id="f-inbox"] .sn-fdr-sheet').first().getAttribute("data-child-kind");
    const afterInboxCount = await frame.locator('[data-fx-id="f-inbox"] .sn-fdr').getAttribute("data-count");
    const pdfInRoot = await frame.locator('[data-fx-id="d-pdf"]').count();
    assert(afterInboxSheets === 1 && afterInboxKind === "pdf" && afterInboxCount === "1" && pdfInRoot === 0, "松手放入后拟物文件夹夹层实时长出对应 PDF 微缩纸片且计数 +1", `sheets=${afterInboxSheets}, kind=${afterInboxKind}, count=${afterInboxCount}`);

    // 3. 双击拟物文件夹进入内部并确认文件就在其中
    const dbox2 = await frame.locator('[data-fx-id="f-inbox"]').boundingBox();
    await page.mouse.dblclick(dbox2.x + dbox2.width / 2, dbox2.y + dbox2.height / 2);
    await page.waitForTimeout(220);
    const crumbs = await frame.locator(".sn-fex-crumb").allTextContents();
    const movedInside = await frame.locator('[data-fx-id="d-pdf"]').count();
    assert(crumbs.length === 2 && crumbs[1].includes("待整理素材") && movedInside === 1, "双击拟物文件夹成功进入子目录并可见刚拖入的 PDF", `crumbs=${crumbs.join(" / ")}, inside=${movedInside}`);

    // 点击根目录面包屑返回
    await frame.locator('.sn-fex-crumb[data-crumb-idx="0"]').click();
    await page.waitForTimeout(180);
    assert((await frame.locator(".sn-fex-crumb").count()) === 1, "点击根目录面包屑顺利返回顶层");

    // 4. 空白处右键新建文件夹（含底部向上翻转菜单高度防压扁检查） + 行内重命名 + 删除 + Toast 撤销恢复
    const bodyBox = await frame.locator("[data-fx-body]").boundingBox();
    await page.mouse.click(bodyBox.x + bodyBox.width - 24, bodyBox.y + bodyBox.height - 24, { button: "right" });
    await page.waitForTimeout(240);
    const menuInfo = await frame.locator(".sn-menu.sn-float.sn-open").first().evaluate((el) => ({
      h: el.getBoundingClientRect().height,
      noXOverflow: el.scrollWidth <= el.clientWidth + 1,
      hasBlur: el.classList.contains("sn-blur"),
    }));
    const newFolderItem = frame.locator('.sn-menu.sn-float.sn-open .sn-item[data-act="new-folder"]');
    assert((await newFolderItem.count()) === 1 && menuInfo.h >= 140 && menuInfo.noXOverflow && menuInfo.hasBlur, "右键菜单支持高斯模糊、向上翻转不被压扁、零横向溢出且含「新建文件夹」", JSON.stringify(menuInfo));
    await newFolderItem.click();
    await page.waitForTimeout(240);
    const renInput = frame.locator("[data-fx-rename-input]");
    assert((await renInput.count()) === 1, "新建文件夹自动进入行内重命名输入");
    await renInput.fill("超长测试文件夹名称12345678901234567890");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(200);
    const createdTile = frame.locator(".sn-fex-tile", { hasText: "超长测试文件夹名称" });
    assert((await createdTile.count()) === 1, "行内重命名提交后立即显示新拟物文件夹");

    const cbox = await createdTile.boundingBox();
    await page.mouse.click(cbox.x + cbox.width / 2, cbox.y + cbox.height / 2, { button: "right" });
    await page.waitForTimeout(240);
    // 右键文件夹色卡实时换色
    const colorSwatch = frame.locator('.sn-menu.sn-float.sn-open [data-fx-color="violet"]');
    assert((await colorSwatch.count()) === 1, "文件夹右键菜单内置自定义色卡圆点");
    await colorSwatch.click();
    await page.waitForTimeout(220);
    const tintedFolder = await createdTile.locator(".sn-fdr.sn-fdr-tinted").count();
    assert(tintedFolder === 1, "点击右键色卡圆点即时更新文件夹自定义配色");

    // 再次右键悬停「移动到 ›」子菜单：验证超长名零横向溢出 + 删除 + Toast 撤销恢复
    const cbox2 = await createdTile.boundingBox();
    await page.mouse.click(cbox2.x + cbox2.width / 2, cbox2.y + cbox2.height / 2, { button: "right" });
    await page.waitForTimeout(240);
    const moveTrigger = frame.locator('.sn-menu.sn-float.sn-open .sn-item[data-sub]');
    await moveTrigger.hover();
    await page.waitForTimeout(360);
    const subInfo = await frame.locator(".sn-menu.sn-float.sn-sub.sn-open").evaluateAll((els) => els.map((el) => ({
      noX: el.scrollWidth <= el.clientWidth + 1,
      blur: el.classList.contains("sn-blur"),
    })));
    assert(subInfo.length === 1 && subInfo[0].noX && subInfo[0].blur, "二级「移动到 ›」子菜单继承高斯模糊且超长名优雅省略零横向溢出", JSON.stringify(subInfo));
    await frame.locator('.sn-menu.sn-float.sn-open .sn-item[data-act="del"]').click();
    await page.waitForTimeout(360);
    assert((await frame.locator(".sn-fex-tile", { hasText: "超长测试文件夹名称" }).count()) === 0, "右键删除经退场与 FLIP 补位微动效后移除目标文件夹");
    const undoBtn = frame.locator(".sn-toast .sn-act").first();
    if ((await undoBtn.count()) > 0) {
      await undoBtn.click();
      await page.waitForTimeout(280);
    }
    assert((await frame.locator(".sn-fex-tile", { hasText: "超长测试文件夹名称" }).count()) === 1, "点击 Toast 撤销按钮弹性恢复刚删除的文件夹");

    // 4.5 普通单击绝不触发复选框勾选；点击复选框才进入多选态 + 悬浮批量操作胶囊 + 批量删除与撤销
    await frame.locator('[data-fx-id="f-shots"]').click();
    await page.waitForTimeout(100);
    const singleChkOn = await frame.locator(".sn-fex-chk.sn-on").count();
    const singleBatch = await frame.locator(".sn-fex-batch.sn-open").count();
    assert(singleChkOn === 0 && singleBatch === 0, "普通单击卡片仅轻微激活聚焦，绝不误触发复选打勾或弹出批量胶囊", `chkOn=${singleChkOn}, batch=${singleBatch}`);

    await frame.locator('[data-fx-id="d-vue"]').hover();
    await page.waitForTimeout(100);
    await frame.locator('[data-fx-chk="d-vue"]').click();
    await page.waitForTimeout(120);
    await frame.locator('[data-fx-chk="d-tsx"]').click();
    await page.waitForTimeout(220);
    const batchOpen = await frame.locator(".sn-fex-batch.sn-open").count();
    const batchNum = await frame.locator("[data-fx-bnum]").textContent();
    assert(batchOpen === 1 && batchNum === "2", "勾选多项自动浮起多选批量操作胶囊并精准计数", `open=${batchOpen}, num=${batchNum}`);
    await frame.locator('[data-fx-bact="del"]').click();
    await page.waitForTimeout(360);
    assert((await frame.locator('[data-fx-id="d-vue"]').count()) === 0 && (await frame.locator('[data-fx-id="d-tsx"]').count()) === 0, "悬浮批量胶囊一键批量删除生效");
    const undoBtn2 = frame.locator(".sn-toast .sn-act").first();
    if ((await undoBtn2.count()) > 0) {
      await undoBtn2.click();
      await page.waitForTimeout(280);
    }
    assert((await frame.locator('[data-fx-id="d-vue"]').count()) === 1 && (await frame.locator('[data-fx-id="d-tsx"]').count()) === 1, "撤销批量删除完整弹性恢复两张文件卡片");
    await frame.locator('[data-fx-bact="clear"]').click();
    await page.waitForTimeout(160);

    // 5. 切换三视图：卡片 → 列表 → 树形列表（并原地展开刚拖入的文件夹）
    await frame.locator('[data-fx-seg] button[data-v="list"]').click();
    await page.waitForTimeout(220);
    assert((await frame.locator(".sn-fex-list-rows .sn-fex-row").count()) >= 11, "切换至列表视图正确展示全部行与表头");
    await frame.locator('[data-fx-seg] button[data-v="tree"]').click();
    await page.waitForTimeout(220);
    assert((await frame.locator(".sn-fex-tree").count()) === 1, "切换至树形列表视图正常渲染");
    await frame.locator('[data-fx-tw="f-inbox"]').click();
    await page.waitForTimeout(260);
    const arrowRot = await frame.locator('.sn-fex-row[data-fx-id="f-inbox"] .sn-tr-tw .sn-ic').evaluate((el) => getComputedStyle(el).rotate);
    assert((await frame.locator('.sn-fex-tree [data-fx-id="d-pdf"]').count()) === 1 && parseFloat(arrowRot) >= 89, "树形列表原地展开文件夹、箭头平滑旋转 90° 并直接看到拖入的 PDF", `rotate=${arrowRot}`);
  }

  assert(pageErrors.length === 0, "全流程 0 pageerror", pageErrors.join(" | "));
} finally {
  await browser.close();
}

console.log(`\n交互 E2E 完成：${failures.length === 0 ? "全部通过" : `${failures.length} 项失败`}`);
if (failures.length) process.exit(1);
