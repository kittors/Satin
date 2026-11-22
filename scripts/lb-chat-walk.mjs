// 对话页实录：照用户录屏的操作，在「聊天与 AI 对话」页一镜到底录下来（带鼠标指针和点击圈，滚轮翻对话、滚文档页），
// 每一步都逐帧量：演示内容动没动、图从哪儿飞出来 / 落回哪儿、有没有画到顶栏上、关上后回没回原样。
// （2026-11-21）组件页现在先放契约示例（.dx[data-play]，iframe 是 examples/html/play.html），这里测的是设计稿演示（index.html?embed=区块），只在 .dx:not([data-play]) 里找
// 用法（先起服务）：node scripts/lb-chat-walk.mjs [--theme dark] [--width 1440]
// 结果：/tmp/satin-walk/对话页实录-<主题>-<宽>.mp4、每一步的打开 / 关上拼图、report.txt
import { createRequire } from "node:module";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); if (i < 0) return d; const v = process.argv[i + 1]; return v && !v.startsWith("--") ? v : true; };
const W = +arg("width", 1440), H = +arg("height", 900), THEME = arg("theme", "light"), OUT = arg("out", "/tmp/satin-walk");
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(`${OUT}/frames`, { recursive: true });
const IMG = ".sn-bubble.sn-img:not(.sn-vid) .sn-ph", VID = ".sn-bubble.sn-img.sn-vid .sn-ph";

const browser = await pw.chromium.launch({ channel: "chrome", ignoreDefaultArgs: ["--hide-scrollbars"], args: [`--window-size=${W},${H}`, "--autoplay-policy=no-user-gesture-required", "--disable-features=OverlayScrollbar"] });
const report = [], fails = [], all = [];
try {
  const ctx = await browser.newContext({ viewport: { width: W, height: H } });
  await ctx.addInitScript((t) => { try { localStorage.setItem("satin-theme", t); } catch {} }, THEME);
  const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(e.message));
  const cdp = await ctx.newCDPSession(page);
  cdp.on("Page.screencastFrame", (f) => { const file = `${OUT}/frames/${String(all.length).padStart(5, "0")}.jpg`; fs.writeFileSync(file, Buffer.from(f.data, "base64")); all.push({ t: f.metadata.timestamp * 1000, file }); cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });
  await page.goto(`${BASE()}#/c/chat`); await page.waitForTimeout(2500);
  // 鼠标指针、点击圈、字幕（画在文档页最上层，不挡点击）
  await page.evaluate(() => {
    const cur = document.createElement("div"); cur.id = "wcur"; cur.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 2l14 9.5-6.2 1.3 3.6 6.6-2.6 1.4-3.6-6.6L3.4 18z" fill="#111" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>';
    cur.style.cssText = "position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;transform:translate(-3px,-2px);filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))";
    const cap = document.createElement("div"); cap.id = "wcap"; cap.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:2147483647;pointer-events:none;padding:8px 12px;border-radius:10px;background:rgba(20,20,22,.88);color:#fff;font:500 13px/1.4 -apple-system,'PingFang SC',sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.25)";
    document.body.append(cur, cap);
    window.__cur = (x, y) => { cur.style.left = x + "px"; cur.style.top = y + "px"; };
    window.__ring = (x, y) => { const r = document.createElement("div"); r.style.cssText = `position:fixed;left:${x - 14}px;top:${y - 14}px;width:28px;height:28px;border-radius:50%;border:2px solid rgba(255,90,60,.9);z-index:2147483646;pointer-events:none`; document.body.append(r); r.animate([{ transform: "scale(.4)", opacity: 1 }, { transform: "scale(1.3)", opacity: 0 }], { duration: 450, easing: "ease-out" }).onfinish = () => r.remove(); };
  });
  let mx = W / 2, my = H / 2;
  const say = (t) => page.evaluate((t) => { document.getElementById("wcap").textContent = t; }, t);
  const move = async (x, y, ms = 350) => { const n = Math.max(2, Math.round(ms / 16)); for (let i = 1; i <= n; i++) { const e = 1 - (1 - i / n) ** 3, px = mx + (x - mx) * e, py = my + (y - my) * e; await page.mouse.move(px, py); await page.evaluate(([a, b]) => window.__cur(a, b), [px, py]); } mx = x; my = y; };
  const click = async (x, y) => { if (Math.hypot(x - mx, y - my) > 1) await move(x, y); await page.evaluate(([a, b]) => window.__ring(a, b), [x, y]); await page.mouse.click(x, y); };
  const wheel = async (dy, x, y) => { await move(x, y, 250); const n = Math.max(1, Math.round(Math.abs(dy) / 80)); for (let i = 0; i < n; i++) { await page.mouse.wheel(0, dy / n); await page.waitForTimeout(28); } await page.waitForTimeout(260); };
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 80, maxWidth: W, maxHeight: H });
  if (process.env.LB_DEBUG) { page.on("console", (m) => { if (m.text().startsWith("[lb]")) console.log("   ", m.text()); }); await page.evaluate(() => { document.querySelector(".dx:not([data-play]) .d-frame iframe").contentWindow.__lbDebug = true; }); }

  // ———— 量 ————
  const geo = (sel) => page.evaluate(([sel]) => {
    const f = document.querySelector(".dx:not([data-play]) .d-frame iframe"), d = f.contentDocument, fr = f.getBoundingClientRect(), vp = d.querySelector(".sn-chat-vp"), el = [...d.querySelectorAll(sel)].sort((a, b) => Math.abs(a.getBoundingClientRect().top - 300) - Math.abs(b.getBoundingClientRect().top - 300))[0];
    const r = el?.getBoundingClientRect(), v = vp.getBoundingClientRect(), nav = document.querySelector(".s-nav").getBoundingClientRect().bottom;
    // 对话列表真正露出来的上下沿（输入框浮在列表底部上面）：沿缩略图那一列点
    let top = v.top, bot = v.bottom; if (r) { const x = (r.left + r.right) / 2; const inV = (y) => { const e = d.elementFromPoint(x, y); return !!e && vp.contains(e); }; let a = Math.ceil(v.top) + .5; while (a < v.bottom && !inV(a)) a++; let best = null, s0 = null; for (let y = a; y < v.bottom; y++) { const h = inV(y); if (h && s0 == null) s0 = y; if ((!h || y + 1 >= v.bottom) && s0 != null) { const e = h ? y : y - 1; if (!best || e - s0 > best[1] - best[0]) best = [s0, e]; s0 = null; } } if (best) { top = best[0]; bot = best[1]; } }
    return { fr: { l: fr.left, t: fr.top }, th: r ? { l: fr.left + r.left, t: fr.top + r.top, r: fr.left + r.right, b: fr.top + r.bottom } : null, vpT: fr.top + top, vpB: fr.top + bot, nav };
  }, [sel]);
  // 缩略图在屏幕上露出来的那块（文档页顶栏、窗口、对话列表、输入框都算上）
  const seen = (sel) => page.evaluate(([sel]) => {
    const f = document.querySelector(".dx:not([data-play]) .d-frame iframe"), d = f.contentDocument, fr = f.getBoundingClientRect();
    const el = [...d.querySelectorAll(sel)].find((e) => { const r = e.getBoundingClientRect(); return fr.top + r.bottom > 0 && fr.top + r.top < innerHeight && r.bottom > 0; }); if (!el) return null;
    d.querySelectorAll("[data-wt]").forEach((e) => e.removeAttribute("data-wt")); el.dataset.wt = "1";
    const r = el.getBoundingClientRect(); let q = { l: fr.left + r.left, t: fr.top + r.top, r: fr.left + r.right, b: fr.top + r.bottom };
    const own = (x, y) => { if (document.elementFromPoint(x, y) !== f) return false; const e = d.elementFromPoint(x - fr.left, y - fr.top); return !!e && (e === el || el.contains(e) || e.contains(el)); };
    const run = (a, z, hit) => { let best = null, s0 = null; for (let p = a; p <= z; p++) { const h = hit(p); if (h && s0 == null) s0 = p; if ((!h || p + 1 > z) && s0 != null) { const e = h ? p : p - 1; if (!best || e - s0 > best[1] - best[0]) best = [s0, e]; s0 = null; } } return best && [best[0] - .5, best[1] + .5]; };
    q = { l: Math.max(q.l, 0), t: Math.max(q.t, 0), r: Math.min(q.r, innerWidth), b: Math.min(q.b, innerHeight) };
    const span = (a, z) => [.25, .5, .75].map((k) => a + (z - a) * k), ys = [], xs = [];
    for (const x of span(q.l, q.r)) { const v = run(Math.ceil(q.t) + .5, Math.floor(q.b) - .5, (y) => own(x, y)); if (v) ys.push(v); }
    for (const y of ys.length ? span(Math.min(...ys.map((v) => v[0])), Math.max(...ys.map((v) => v[1]))) : []) { const v = run(Math.ceil(q.l) + .5, Math.floor(q.r) - .5, (x) => own(x, y)); if (v) xs.push(v); }
    q = ys.length && xs.length ? { l: Math.max(q.l, Math.min(...xs.map((v) => v[0]))), t: Math.max(q.t, Math.min(...ys.map((v) => v[0]))), r: Math.min(q.r, Math.max(...xs.map((v) => v[1]))), b: Math.min(q.b, Math.max(...ys.map((v) => v[1]))) } : { l: 0, t: 0, r: 0, b: 0 };
    return q.r - q.l >= 16 && q.b - q.t >= 16 ? q : null;
  }, [sel]);
  // 逐帧取样：演示里的参照文字（缩略图以外）、文档页目录、看图框露出来的那块、演示有没有画到顶栏上
  const startSample = () => page.evaluate(() => {
    const f = document.querySelector(".dx:not([data-play]) .d-frame iframe"), d = f.contentDocument, w = f.contentWindow, th = d.querySelector("[data-wt]"), sec = d.getElementById("chat"), fr0 = f.getBoundingClientRect();
    const nb = document.querySelector(".s-nav").getBoundingClientRect().bottom;
    const txt = [...sec.querySelectorAll("*")].filter((e) => !e.contains(th) && !th.contains(e) && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && !e.closest(".sn-tip, .sn-menu, [role=tooltip]")).map((e) => ({ e, r: e.getBoundingClientRect() }))
      .filter(({ r }) => r.width > 8 && r.height > 6 && fr0.top + r.top >= nb && fr0.top + r.bottom <= innerHeight && fr0.left + r.left >= 0).sort((a, b) => a.r.top - b.r.top);
    w.__refs = txt.length ? [txt[0], txt[txt.length >> 1], txt.at(-1)].map((x) => x.e) : [];
    const side = document.querySelector("[data-side] a");
    window.__S = []; window.__on = true;
    const tick = () => setTimeout(() => {
      const fr = f.getBoundingClientRect(), s = { t: performance.timeOrigin + performance.now(), g: f.classList.contains("global") ? 1 : 0 };
      s.refs = w.__refs.map((e) => { const r = e.getBoundingClientRect(); return [fr.left + r.left, fr.top + r.top]; });
      const sr = side.getBoundingClientRect(); s.side = [sr.left, sr.top]; s.thv = w.getComputedStyle(th).visibility;
      const box = d.querySelector(".sn-lb-stage .sn-lightbox");
      if (box) {
        const cs = w.getComputedStyle(box), m = new DOMMatrix(cs.transform === "none" ? undefined : cs.transform), bw = box.offsetWidth, bh = box.offsetHeight;
        let ins = [0, 0, 0, 0]; const mm = /inset\(([^)]*?)(?: round [^)]*)?\)/.exec(cs.clipPath); if (mm) { const v = mm[1].trim().split(/\s+/).map(parseFloat); ins = [v[0], v[1] ?? v[0], v[2] ?? v[0], v[3] ?? v[1] ?? v[0]]; }
        const l = Math.max(0, ins[3]), t = Math.max(0, ins[0]), r = bw - Math.max(0, ins[1]), b = bh - Math.max(0, ins[2]);
        const pts = [[l, t], [r, t], [r, b], [l, b]].map(([x, y]) => m.transformPoint(new DOMPoint(x, y))), ox = fr.left + box.offsetLeft, oy = fr.top + box.offsetTop;
        s.box = { l: ox + Math.min(...pts.map((p) => p.x)), t: oy + Math.min(...pts.map((p) => p.y)), r: ox + Math.max(...pts.map((p) => p.x)), b: oy + Math.max(...pts.map((p) => p.y)), o: cs.visibility === "visible" ? +cs.opacity : 0 };
        s.box.anim = box.getAnimations().map((a) => `${a.effect.getKeyframes().map((k) => Object.keys(k).filter((x) => !["offset", "easing", "composite", "computedOffset"].includes(x)).join("+")).join(">")}@${Math.round(a.currentTime)}`).join(",") + ` vis=${cs.visibility} img=${box.querySelector(".sn-lb-img")?.className}`;
      }
      if (s.g) { const pg = d.querySelector(".doc"), pr = d.body.getBoundingClientRect(); s.over = 0; for (let x = Math.max(4, pr.left + 4); x < Math.min(innerWidth - 4, pr.right - 4); x += 24) for (const y of [nb - 6, nb / 2]) if (d.elementsFromPoint(x, y).some((e) => pg.contains(e) && e !== pg)) s.over++; }
      window.__S.push(s); if (window.__on) requestAnimationFrame(tick);
    }, 0);
    requestAnimationFrame(tick);
  });
  const stopSample = () => page.evaluate(() => { window.__on = false; return window.__S; });
  const near = (q, e, tol = 2) => Math.max(Math.abs(q.l - e.l), Math.abs(q.t - e.t), Math.abs(q.r - e.r), Math.abs(q.b - e.b)) <= tol;
  const fmt = (q) => `${Math.round(q.l)},${Math.round(q.t)}–${Math.round(q.r)},${Math.round(q.b)}`;
  const sheet = (t0, name) => {
    const at = (t) => { let f = all[0]; for (const x of all) { if (x.t <= t) f = x; else break; } return f; };
    const dir = `${OUT}/.t`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
    for (let j = 0; j < 8; j++) fs.copyFileSync(at(t0 - 20 + j * 40).file, `${dir}/${j}.jpg`);
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", `${dir}/%d.jpg`, "-vf", "scale=720:-1,tile=4x2:padding=6:color=white", "-frames:v", "1", `${OUT}/${name}.jpg`]);
    fs.rmSync(dir, { recursive: true, force: true });
  };
  let step = 0;
  // 一步：点开缩略图露出来的那块中间 → 停 → 用指定方式关上；逐帧量
  const openClose = async (title, sel, how) => {
    step++; const id = String(step).padStart(2, "0"); await say(`${step}. ${title}`); await page.waitForTimeout(500);
    const s = await seen(sel); if (!s) { const l = `✗ ${id} ${title}：缩略图看不见`; report.push(l); fails.push(l); return; }
    await startSample();
    const cx = (s.l + s.r) / 2, cy = (s.t + s.b) / 2; await move(cx, cy, 450); await page.waitForTimeout(200);
    const tOpen = Date.now(); await click(cx, cy);
    if (how === "early") await page.waitForTimeout(130);
    else {
      await page.waitForTimeout(1300);
      if (how === "zoom") { await click(W / 2, H / 2 - 40); await page.waitForTimeout(900); }
    }
    let tClose = Date.now();
    if (how === "x") { const p = await page.evaluate(() => { const f = document.querySelector(".dx:not([data-play]) .d-frame iframe"), fr = f.getBoundingClientRect(), q = f.contentDocument.querySelector('.sn-lb-bar [data-lb="x"]')?.getBoundingClientRect(); return q ? [fr.left + q.left + q.width / 2, fr.top + q.top + q.height / 2] : null; }); if (p) { await move(p[0], p[1], 500); await page.waitForTimeout(250); tClose = Date.now(); await click(p[0], p[1]); } else { tClose = Date.now(); await page.keyboard.press("Escape"); } }
    else if (how === "backdrop") { await move(60, H / 2, 400); await page.waitForTimeout(150); tClose = Date.now(); await click(60, H / 2); }
    else { tClose = Date.now(); await page.keyboard.press("Escape"); }
    await page.waitForTimeout(1100);
    const S = await stopSample(), bad = [];
    const dev = (a, b) => Math.max(0, ...a.map((p, i) => Math.hypot(p[0] - b[i][0], p[1] - b[i][1]))), b0 = S[0];
    const mv = Math.max(...S.map((x) => dev(x.refs, b0.refs))), sd = Math.max(...S.map((x) => Math.hypot(x.side[0] - b0.side[0], x.side[1] - b0.side[1])));
    if (!b0.refs.length) bad.push("没找到参照文字"); if (mv > .5) bad.push(`演示内容动了 ${mv.toFixed(1)}px`); if (sd > .5) bad.push(`文档页动了 ${sd.toFixed(1)}px`);
    const over = S.filter((x) => x.over).length; if (over) bad.push(`演示画到顶栏上 ${over} 帧`);
    const vis = S.filter((x) => x.box && x.box.o > .01), op = vis.filter((x) => x.t < tClose), cl = vis.filter((x) => x.t >= tClose);
    if (!op.length) bad.push("看图没打开");
    else {
      if (op[0].box.o > .99 && !near(op[0].box, s)) bad.push(`起飞第一帧 ${fmt(op[0].box)}，缩略图露出来的是 ${fmt(s)}`); else if (op[0].box.o <= .99) bad.push("没从缩略图飞出来：前几帧 " + S.filter((x) => x.box).slice(0, 8).map((x) => `${fmt(x.box)} o${x.box.o.toFixed(2)} ${x.box.anim || ""}`).join(" | "));
      const last = cl.at(-1); if (last && last.box.o > .99 && !near(last.box, s)) bad.push(`落地最后一帧 ${fmt(last.box)}，缩略图露出来的是 ${fmt(s)}`); else if (last && last.box.o <= .99) bad.push("没飞回缩略图");
    }
    const lat = []; // 反应时间：按下 / 按键到图真正开始动
    const smooth = (F, label, t0) => {
      F = F.filter((x) => x.box.o > .99); const A = F.map((x) => (x.box.r - x.box.l) * (x.box.b - x.box.t)); if (A.length < 3) return;
      let a = 0; while (a < A.length - 1 && Math.abs(A[a + 1] - A[a]) < 1) a++; let z = A.length - 1; while (z > a && Math.abs(A[z] - A[z - 1]) < 1) z--;
      lat.push(`${label}反应 ${Math.round(F[Math.min(a + 1, F.length - 1)].t - t0)}ms`);
      const B = A.slice(a, z + 1); if (B.length < 3) return;
      const tot = Math.abs(B.at(-1) - B[0]) || 1, st = B.slice(1).map((v, i) => v - B[i]), sign = Math.sign(B.at(-1) - B[0]), mx = Math.max(...st.map(Math.abs)), hold = st.filter((d, i) => Math.abs(d) < tot * .002 && i > 0 && i < st.length - 1 && Math.abs(st[i - 1]) > tot * .02 && Math.abs(st[i + 1]) > tot * .02).length, back = st.filter((d) => Math.sign(d) === -sign && Math.abs(d) > tot * .002).length;
      if (mx / tot > .35 || hold || back) bad.push(`${label}不平滑：单帧最大 ${Math.round(mx / tot * 100)}%，中途停住 ${hold} 帧，回退 ${back} 帧（间隔 ${F.slice(a + 1, a + 14).map((x, i) => Math.round(x.t - F[a + i].t)).join(",")}）`);
    };
    if (how !== "early" && how !== "zoom") { smooth(op, "打开", tOpen); smooth(cl, "关上", tClose); }
    const end = S.at(-1); if (end.g) bad.push("关上后还铺满着"); if (end.thv !== "visible") bad.push("关上后缩略图还藏着");
    sheet(op[0]?.t ?? tOpen, `${id}-打开`); sheet(cl[0]?.t ?? tClose, `${id}-关上`);
    const l = `${bad.length ? "✗" : "✓"} ${id} ${title}（缩略图露出 ${fmt(s)}；内容最多动 ${mv.toFixed(1)}px；${lat.join("，")}；起飞 ${op[0] ? fmt(op[0].box) : "-"}；落地 ${cl.at(-1) ? fmt(cl.at(-1).box) : "-"}）${bad.length ? "\n    " + bad.join("\n    ") : ""}`;
    report.push(l); if (bad.length) fails.push(l); console.log(l);
  };
  // 把缩略图挪到某个位置：先滚对话（滚轮），再滚文档页（滚轮）
  const chatTo = async (sel, where) => {
    for (let k = 0; k < 4; k++) {
      const g = await geo(sel); if (!g.th) { await wheel(-500, g.fr.l + 300, Math.max(g.vpT + 60, 140)); continue; }
      const top = Math.max(g.vpT, g.nav), mid = (g.th.t + g.th.b) / 2, target = where === "mid" ? (top + g.vpB) / 2 : where === "top" ? top : g.vpB;
      if (Math.abs(mid - target) < 2) return; await wheel(mid - target, Math.max(g.fr.l + 60, (g.th.l + g.th.r) / 2), Math.min(Math.max((g.vpT + g.vpB) / 2, 120), H - 120));
    }
  };
  const pageTo = async (dy) => { if (Math.abs(dy) >= 1) await wheel(dy, W - 220, H / 2); };
  const demoTop = () => page.evaluate(() => document.querySelector(".dx:not([data-play]) .d-frame").getBoundingClientRect().top);
  const thumbMid = (sel) => geo(sel).then((g) => (g.th ? (g.th.t + g.th.b) / 2 : null));

  // ———— 和用户录屏一样：演示上沿滚到顶栏底下，对话里翻到视频，点开，点关闭按钮 ————
  await say("对话页：演示上半截滚进顶栏底下"); await move(W - 220, H / 2, 400);
  // 上面有多个契约示例框懒加载会撑高页面：连续滚直到"完整演示"真正停在顶栏上面 -40px
  for (let k = 0; k < 6; k++) {
    const dt = await demoTop();
    if (Math.abs(dt + 40) < 6) break;
    await pageTo(dt + 40);
    await page.waitForTimeout(300);
  }
  // 组件页现在先放契约示例，设计稿那块演示在下面，滚到了才开始载入：等它载好、对话里有消息了再开始翻
  await page.waitForFunction(() => { const f = document.querySelector(".dx:not([data-play]) .d-frame iframe"); try { return f.parentElement.classList.contains("sn-ready") && !!f.contentDocument.querySelector(".sn-chat-vp .sn-bubble"); } catch { return false; } }, null, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(800);
  await chatTo(VID, "mid");
  await openClose("看视频：演示上沿在窗口外，点关闭按钮", VID, "x");
  await chatTo(IMG, "mid"); await openClose("看图片：演示上沿在窗口外，按 Esc", IMG, "esc");
  await chatTo(IMG, "top"); await openClose("图片一半被对话框上沿裁掉", IMG, "esc");
  await chatTo(IMG, "bot"); await openClose("图片一半挡在输入框后面，点空白处关", IMG, "backdrop");
  await chatTo(VID, "bot"); await openClose("视频一半挡在输入框后面，点关闭按钮", VID, "x");
  await chatTo(IMG, "mid");
  await pageTo((await thumbMid(IMG)) - (await geo(IMG)).nav); await openClose("图片一半在顶栏底下", IMG, "esc");
  await openClose("放大以后再关", IMG, "zoom");
  await openClose("刚打开就关", IMG, "early");
  await pageTo((await thumbMid(IMG)) - H); await openClose("图片一半在窗口下沿外面", IMG, "esc");
  await pageTo((await thumbMid(IMG)) - H / 2); await openClose("演示在窗口正中", IMG, "esc");
  await say("完"); await page.waitForTimeout(600);
  await cdp.send("Page.stopScreencast");
  if (errs.length) { report.push("页面报错：" + errs.join(" | ")); fails.push("页面报错"); }
  // 一镜到底的录像
  const list = all.map((f, i) => `file '${f.file}'\nduration ${Math.max(.001, i < all.length - 1 ? (all[i + 1].t - f.t) / 1000 : .5).toFixed(4)}`).join("\n");
  fs.writeFileSync(`${OUT}/frames/list.txt`, list + `\nfile '${all.at(-1).file}'\n`);
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", `${OUT}/frames/list.txt`, "-vsync", "vfr", "-pix_fmt", "yuv420p", "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", `${OUT}/对话页实录-${THEME}-${W}.mp4`]);
  fs.rmSync(`${OUT}/frames`, { recursive: true, force: true });
} finally { await browser.close(); }
function BASE() { return "http://127.0.0.1:5192/site/next-docs.html"; }
const txt = `对话页实录（${THEME}，${W}×${H}，滚动条常显）：${report.filter((l) => l.startsWith("✓") || l.startsWith("✗")).length} 步，${fails.length ? fails.length + " 步有问题" : "全部通过"}\n` + report.join("\n");
fs.writeFileSync(`${OUT}/report.txt`, txt); console.log("\n" + txt);
process.exitCode = fails.length ? 1 : 0;
