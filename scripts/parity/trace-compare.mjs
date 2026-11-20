// 比较两次逐帧轨迹（trace.mjs 的结果）。每个区块逐个动作比：
// · 动画：类型、目标（按角色路径）、属性、关键帧、时长、延迟、曲线、次数、方向、填充完全一样；起始帧差 ≤ 1
// · DOM 变化：属性新值（类名去前缀、变量名去前缀）、增删节点、文字，一一对上；内联 style 只比写了哪些属性和这个动作结束时的值
// · 逐帧状态：被改动 / 在动画的元素，每个变化时刻的位置、尺寸（≤ 0.5px）、透明度（≤ 0.01）、transform（平移 ≤ 0.5px，缩放旋转 ≤ 0.005），
//   允许前后差 1 帧；运动持续的帧数差 ≤ 1
// · 结束时的 DOM 快照、页面报错
// 用法：node scripts/parity/trace-compare.mjs A目录 B目录 [--max 12]
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { arg } from "./lib.mjs";

const [A, B] = process.argv.slice(2).filter((x) => !x.startsWith("--")).slice(0, 2).map((p) => path.resolve(p));
const MAX = +arg("max", 12), OUTF = arg("out", "");
const load = (f) => JSON.parse(zlib.gunzipSync(fs.readFileSync(f)));
const FRAME = 17.5;

const num = (s) => (String(s).match(/-?\d+(\.\d+)?(e-?\d+)?/g) || []).map(Number);
const near = (a, b, tol) => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
// 状态串：x|y|w|h|opacity|transform|vis|translate|scale
function sameState(a, b) {
  if (a === b) return true; if (a == null || b == null) return false;
  const pa = a.split("|"), pb = b.split("|");
  if (pa[0].startsWith("~") || pb[0].startsWith("~")) return pa[0] === pb[0];
  if (!near(pa.slice(0, 4).map(Number), pb.slice(0, 4).map(Number), 0.5)) return false;
  if (Math.abs(+pa[4] - +pb[4]) > 0.0100001) return false;
  if (pa[6] !== pb[6]) return false;
  for (const i of [5, 7, 8]) {
    if ((pa[i] || "") === (pb[i] || "")) continue;
    const na = num(pa[i] || ""), nb = num(pb[i] || "");
    if (na.length !== nb.length) return false;
    // matrix(a,b,c,d,e,f)：前 4 个是缩放旋转，后 2 个是平移
    const tolOf = (k) => (/matrix/.test(pa[i]) ? (k < (na.length === 16 ? 12 : 4) ? 0.005 : 0.5) : 0.5);
    if (!na.every((v, k) => Math.abs(v - nb[k]) <= tolOf(k))) return false;
  }
  return true;
}
// v 的每个数值分量都落在 win 里各个值的同一分量的 [最小, 最大] 之间（加容差）；可见性在窗口里出现过就算
function inRange(v, win) {
  const split = (x) => { const p = x.split("|"); return { box: p.slice(0, 4).map(Number), op: +p[4], tf: [num(p[5] || ""), num(p[7] || ""), num(p[8] || "")], vis: p[6], raw: p }; };
  const a = split(v), ws = win.map(split);
  if (!ws.some((w) => w.vis === a.vis)) return false;
  const ok = (val, arr, tol) => val >= Math.min(...arr) - tol && val <= Math.max(...arr) + tol;
  for (let i = 0; i < 4; i++) if (!ok(a.box[i], ws.map((w) => w.box[i]), 0.5)) return false;
  if (!ok(a.op, ws.map((w) => w.op), 0.0100001)) return false;
  for (let j = 0; j < 3; j++) {
    const same = ws.filter((w) => w.tf[j].length === a.tf[j].length); if (!a.tf[j].length && ws.some((w) => !w.tf[j].length)) continue;
    if (!same.length) { if (a.tf[j].length) return false; continue; }
    for (let k = 0; k < a.tf[j].length; k++) if (!ok(a.tf[j][k], same.map((w) => w.tf[j][k]), a.tf[j].length >= 6 && k < a.tf[j].length - (a.tf[j].length === 16 ? 4 : 2) ? 0.005 : 0.5)) return false;
  }
  return true;
}
// 一个动作里每个元素的状态序列：[[t, 值], ...]（只在变化时记）
function series(act) {
  const m = new Map();
  for (const f of act.frames) for (const [p, v] of Object.entries(f.s)) { if (!m.has(p)) m.set(p, []); m.get(p).push([f.t, v]); }
  return m;
}
// 对齐点：这个动作引起的第一处变化（DOM 变化、新动画、元素状态变化，取最早的那一帧）。Playwright 发事件的延迟每次不一样，按这个对齐
const anchorOf = (act) => { const c = [act.muts.length ? act.muts[0][0] : 1e9, ...act.anims.map((x) => x.frame), act.frames.findIndex((f) => Object.keys(f.s).length)].filter((i) => i >= 0); const i = Math.min(...c); return act.frames[i] ? act.frames[i].t : 0; };
const valueAt = (s, t) => { let v = null; for (const [tt, vv] of s) { if (tt <= t + 0.01) v = vv; else break; } return v; };
// CSS 过渡 / 动画、WAAPI 驱动的元素：动画本身（关键帧、时长、曲线、起点）已经逐项比过，中间帧只取决于它们；
// 但浏览器给这类动画定起点有亚帧抖动（合成线程异步开始），中间帧的值两边差一点点 → 这类元素只比起止状态。JS 每帧写的照样逐帧比
function cmpSeries(sa, sb, ta, tb, out, label, animated = new Set()) {
  for (const p of new Set([...sa.keys(), ...sb.keys()])) {
    const a = sa.get(p) || [], b = sb.get(p) || [];
    if (animated.has(p) && a.length && b.length) { if (!sameState(a[a.length - 1][1], b[b.length - 1][1])) out.push(`${label} ${p}: 结束状态 ${a[a.length - 1][1]} → ${b[b.length - 1][1]}`); continue; }
    if (!a.length || !b.length) { const only = a.length ? a : b; if (only.length > 1 || !sameState(valueAt(a, 1e9), valueAt(b, 1e9))) out.push(`${label} ${p}: 只有${a.length ? "A" : "B"}在动（${only.length} 次变化）`); continue; }
    // "允许差 1 帧"：B 在 t 时刻的每个数值，落在 A 在 [t-1.5 帧, t+1.5 帧] 里扫过的范围内（加容差）；反过来也查
    const check = (x, y, tx, ty, who) => {
      for (const [t, v] of x) {
        const tt = t - tx + ty, lo = tt - FRAME * 1.5, hi = tt + FRAME * 1.5;
        const win = y.filter(([t2]) => t2 >= lo && t2 <= hi).map(([, v2]) => v2), prev = valueAt(y, lo); if (prev != null) win.push(prev);
        if (!win.length) return `${label} ${p}: ${who} 在 ${Math.round(t - tx)}ms 的 ${v} 对不上（另一边这时还没有值）`;
        if (win.some((w) => sameState(v, w))) continue;
        if (inRange(v, win)) continue;
        return `${label} ${p}: ${who} 在 ${Math.round(t - tx)}ms 的 ${v} 对不上（另一边 ${valueAt(y, tt)}）`;
      }
      return null;
    };
    const e1 = check(b, a, tb, ta, "B") || check(a, b, ta, tb, "A"); if (e1) { out.push(e1); continue; }
    // 运动持续的帧数
    const span = (s, t) => Math.round((s[s.length - 1][0] - s[0][0]) / (1000 / 60));
    if (a.length > 2 && Math.abs(span(a) - span(b)) > 1) out.push(`${label} ${p}: 运动帧数 ${span(a)} → ${span(b)}`);
    if (!sameState(a[a.length - 1][1], b[b.length - 1][1])) out.push(`${label} ${p}: 结束状态 ${a[a.length - 1][1]} → ${b[b.length - 1][1]}`);
  }
}
// 被打断后反向播的过渡，时长按已走的比例缩短（不是整数毫秒），起点也是打断那一刻的中间值：这两样随打断时刻变，按"近似"比
const interrupted = (x) => typeof x.dur === "number" && Math.abs(x.dur - Math.round(x.dur)) > 1e-6;
const animSig = (x) => [x.kind, x.target, x.pseudo, x.name, interrupted(x) ? "~" : x.dur, x.delay, x.endDelay, x.easing, x.iter, x.dir, x.fill, x.comp].join("|");
const kfNear = (a, b, tol) => a.length === b.length && a.every((f, i) => { const g = b[i]; return Object.keys(f).length === Object.keys(g).length && Object.keys(f).every((kk) => f[kk] === g[kk] || (num(f[kk]).length && near(num(f[kk]), num(g[kk]), tol))); });
function cmpAnims(a, b, out, label, ta, tb) {
  const used = new Set();
  for (const x of a) {
    let j = b.findIndex((y, k) => !used.has(k) && animSig(y) === animSig(x) && JSON.stringify(y.kf) === JSON.stringify(x.kf));
    let fuzzy = false;
    if (j < 0) { j = b.findIndex((y, k) => !used.has(k) && animSig(y) === animSig(x) && kfNear(y.kf, x.kf, interrupted(x) ? 64 : 0.5)); fuzzy = j >= 0; }
    if (j < 0) { out.push(`${label} 动画只在 A：${x.kind} ${x.target}${x.pseudo} ${x.name} ${x.dur}ms ${x.easing} ${JSON.stringify(x.kf).slice(0, 160)}`); continue; }
    used.add(j); const y = b[j];
    if (interrupted(x) && Math.abs(x.dur - y.dur) > 34) out.push(`${label} 被打断的过渡时长 ${Math.round(x.dur)} → ${Math.round(y.dur)}：${x.target} ${x.name}`);
    if (x.t != null && y.t != null && Math.abs((y.t - tb) - (x.t - ta)) > FRAME * 1.5) out.push(`${label} 动画起点 ${Math.round(x.t - ta)}ms → ${Math.round(y.t - tb)}ms：${x.target} ${x.name}`);
    if (fuzzy) out.push(`~${label} 动画关键帧有小数差：${x.target} ${x.name}`);
  }
  b.forEach((y, k) => { if (!used.has(k)) out.push(`${label} 动画只在 B：${y.kind} ${y.target}${y.pseudo} ${y.name} ${y.dur}ms ${y.easing} ${JSON.stringify(y.kf).slice(0, 160)}`); });
}
const styleProps = (v) => (v || "").split(";").map((x) => x.split(":")[0].trim()).filter(Boolean).sort().join(",");
function cmpMuts(a, b, out, label) {
  const norm = (list) => {
    const keys = [], lastStyle = new Map();
    for (const m of list) {
      if (m[1] === "a" && m[3] === "style") { keys.push(`s|${m[2]}|${styleProps(m[4])}`); lastStyle.set(m[2], m[4]); }
      else keys.push(m.slice(1).join("|"));
    }
    return { keys, lastStyle };
  };
  const na = norm(a), nb = norm(b);
  const count = (arr) => { const m = new Map(); for (const k of arr) m.set(k, (m.get(k) || 0) + 1); return m; };
  const ca = count(na.keys), cb = count(nb.keys);
  // 同一个元素同一组 style 属性写了几次（逐帧写的动画）：次数差 ≤ 2 算对得上（帧数允许差 1）
  for (const k of new Set([...ca.keys(), ...cb.keys()])) {
    const x = ca.get(k) || 0, y = cb.get(k) || 0; if (x === y) continue;
    if (k.startsWith("s|") && x && y && Math.abs(x - y) <= 2) continue;
    // 同一处属性反复切换（滚动条显隐、加载占位闪动）几十次：次数差 1（窗口两头差一帧）算对得上
    if (x >= 3 && y >= 3 && Math.abs(x - y) <= 1) continue;
    out.push(`${label} DOM 变化 ${k.slice(0, 200)}：${x} 次 → ${y} 次`);
  }
  for (const p of new Set([...na.lastStyle.keys(), ...nb.lastStyle.keys()])) {
    const x = na.lastStyle.get(p), y = nb.lastStyle.get(p); if (x === y) continue;
    if (x != null && y != null && styleProps(x) === styleProps(y) && near(num(x), num(y), 0.5)) continue;
    out.push(`${label} ${p} 最后的内联样式：${String(x).slice(0, 140)} → ${String(y).slice(0, 140)}`);
  }
}

const report = {}; let okN = 0, total = 0;
for (const sub of fs.readdirSync(A).filter((d) => fs.statSync(path.join(A, d)).isDirectory())) {
  for (const f of fs.readdirSync(path.join(A, sub)).filter((x) => x.endsWith(".json.gz"))) {
    total++;
    const key = `${sub}/${f.replace(".json.gz", "")}`, out = [], fb = path.join(B, sub, f);
    if (!fs.existsSync(fb)) { report[key] = ["B 里没有"]; continue; }
    const a = load(path.join(A, sub, f)), b = load(fb);
    if (a.triggers.length !== b.triggers.length || a.triggers.some((t, i) => t.path !== b.triggers[i].path)) out.push(`触发器列表不同：${a.triggers.length} → ${b.triggers.length}`);
    const n = Math.min(a.actions.length, b.actions.length); if (a.actions.length !== b.actions.length) out.push(`动作数 ${a.actions.length} → ${b.actions.length}`);
    for (let i = 0; i < n; i++) {
      const x = a.actions[i], y = b.actions[i], label = `#${i} ${x.name} ${x.path.split(">").slice(-3).join(">")}`;
      if (x.name !== y.name || x.path !== y.path) { out.push(`${label}: 动作对不上（${y.name} ${y.path}）`); break; }
      if (x.name === "skip") continue;
      if ((x.err || "") !== (y.err || "")) out.push(`${label} 动作出错：${x.err} → ${y.err}`);
      cmpAnims(x.anims, y.anims, out, label, anchorOf(x), anchorOf(y));
      cmpMuts(x.muts, y.muts, out, label);
      const animated = new Set([...x.anims, ...y.anims].map((q) => q.target));
      // 只被 CSS / WAAPI 动画驱动、这个动作里没有被 JS 改过内联样式的元素
      for (const m of [...x.muts, ...y.muts]) if (m[1] === "a" && m[3] === "style") animated.delete(m[2]);
      cmpSeries(series(x), series(y), anchorOf(x), anchorOf(y), out, label, animated);
      if ((x.frames.at(-1)?.f || "") !== (y.frames.at(-1)?.f || "")) out.push(`${label} 焦点 ${x.frames.at(-1)?.f} → ${y.frames.at(-1)?.f}`);
    }
    for (const p of new Set([...Object.keys(a.final), ...Object.keys(b.final)])) {
      const x = a.final[p], y = b.final[p];
      if (!x || !y) { out.push(`结束快照 ${p}: 只在${x ? "A" : "B"}`); continue; }
      if (x.text !== y.text) out.push(`结束快照 ${p}: 文字 ${JSON.stringify(x.text).slice(0, 80)} → ${JSON.stringify(y.text).slice(0, 80)}`);
      if (JSON.stringify(x.attrs) !== JSON.stringify(y.attrs)) { const ks = new Set([...Object.keys(x.attrs), ...Object.keys(y.attrs)]); for (const k of ks) if (x.attrs[k] !== y.attrs[k] && !(k === "style" && near(num(x.attrs[k]), num(y.attrs[k]), 0.5) && styleProps(x.attrs[k]) === styleProps(y.attrs[k]))) out.push(`结束快照 ${p} @${k}: ${String(x.attrs[k]).slice(0, 100)} → ${String(y.attrs[k]).slice(0, 100)}`); }
      if (typeof x.rect[0] === "number" && typeof y.rect[0] === "number" && !near(x.rect, y.rect, 0.5)) out.push(`结束快照 ${p}: 位置 ${x.rect} → ${y.rect}`);
      if (String(x.scroll) !== String(y.scroll)) out.push(`结束快照 ${p}: 滚动 ${x.scroll} → ${y.scroll}`);
    }
    if (JSON.stringify(a.errors) !== JSON.stringify(b.errors)) out.push(`页面报错：${JSON.stringify(a.errors).slice(0, 200)} → ${JSON.stringify(b.errors).slice(0, 200)}`);
    const hard = out.filter((x) => !x.startsWith("~"));
    if (hard.length) report[key] = out; else okN++;
  }
}
console.log(`逐帧轨迹：${okN}/${total} 个区块一致`);
for (const [k, v] of Object.entries(report)) { const hard = v.filter((x) => !x.startsWith("~")); console.log(`  ✗ ${k}  ${hard.length} 处`); for (const x of hard.slice(0, MAX)) console.log(`      ${x.slice(0, 300)}`); }
if (OUTF) fs.writeFileSync(OUTF, JSON.stringify(report, null, 1));
process.exitCode = Object.keys(report).length ? 1 : 0;
