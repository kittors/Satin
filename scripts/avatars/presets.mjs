// 预设头像生成器：12 人 × 完整版（32px 及以上）/ 简化版（16–24px），线条加柔和填色、脸提亮。
// 输出 packages/satin-ui/src/avatar-presets.js（别手改那个文件，改这里再跑 node scripts/avatars/presets.mjs）
// 画法：形状由后往前叠放，靠前的形状用填充色挡住后面的线，交接处天然准确；对称形状只写左半边，右半边由程序镜像
// 放大：路径按原比例写，viewBox 取 "2.6 2 18.8 18.8"（相当于放大 1.277 倍），所以数字短、12 人共用的头和身体字符串完全一样
// 颜色：只写浅色兜底，深色那组在 final/vars.css；头像是图片，深色下人物不反色，只有圆底换深色
import { writeFileSync } from "node:fs";
import path from "node:path";
const OUT = path.resolve(import.meta.dirname, "../../packages/satin-ui/src/avatar-presets.js");

// ── 路径工具（只接受大写绝对命令；参数个数不对直接报错） ─────────────
const n = (v) => { const s = String(+(+v).toFixed(2)); return s.replace(/^0\./, ".").replace(/^-0\./, "-."); };
const pts = (...a) => a.map(n).join(" ").replace(/ -/g, "-");
const ARGS = { M: 2, L: 2, C: 6, Q: 4, A: 7, Z: 0 };
const segs = (str) => { const out = []; const re = /([A-Za-z])([^A-Za-z]*)/g; let m;
  while ((m = re.exec(str))) { const c = m[1], v = (m[2].match(/-?\d*\.?\d+/g) || []).map(Number);
    if (!(c in ARGS) || v.length !== ARGS[c]) throw new Error(`路径命令不支持或参数个数不对：${c}${m[2]}`);
    out.push({ c, v }); } return out; };
const fmt = (list) => list.map((s) => s.c + (s.v.length ? pts(...s.v) : "")).join("");
const toAbs = (list) => { const out = []; let cur = [0, 0];
  for (const s of list) { if (s.c === "M") { cur = s.v.slice(0, 2); out.push({ c: "M", v: cur.slice() }); }
    else if (s.c !== "Z") { out.push({ c: s.c, v: s.v.slice(), from: cur.slice() }); cur = s.v.slice(-2); } } return out; };
const mirrorX = (list) => list.map((s) => { const v = s.v.slice();
  if (s.c === "A") { v[4] = 1 - v[4]; v[5] = 24 - v[5]; } else for (let i = 0; i < v.length; i += 2) v[i] = 24 - v[i];
  return { ...s, v, from: s.from ? [24 - s.from[0], s.from[1]] : undefined }; });
const reverse = (list) => list.filter((s) => s.c !== "M").reverse().map((s) => { const to = s.from;
  if (s.c === "C") return { c: "C", v: [s.v[2], s.v[3], s.v[0], s.v[1], ...to] };
  if (s.c === "Q") return { c: "Q", v: [s.v[0], s.v[1], ...to] };
  if (s.c === "A") return { c: "A", v: [s.v[0], s.v[1], s.v[2], s.v[3], 1 - s.v[4], ...to] };
  return { c: "L", v: to }; });
const sym = (leftHalf) => { const L = toAbs(segs(leftHalf)); return fmt(L) + fmt(reverse(mirrorX(L))) + "Z"; };   // 对称闭合形状
const pair = (left) => fmt(segs(left)) + fmt(mirrorX(toAbs(segs(left))));                                   // 对称的两份
const one = (d) => fmt(segs(d));                                                                               // 只做校验和压缩
const circ = (cx, cy, r) => `M${pts(cx - r, cy)}A${pts(r, r)} 0 1 0 ${pts(cx + r, cy)}A${pts(r, r)} 0 1 0 ${pts(cx - r, cy)}`;
const rrect = (x, y, w, h, r) => `M${pts(x + r, y)}L${pts(x + w - r, y)}A${pts(r, r)} 0 0 1 ${pts(x + w, y + r)}L${pts(x + w, y + h - r)}A${pts(r, r)} 0 0 1 ${pts(x + w - r, y + h)}L${pts(x + r, y + h)}A${pts(r, r)} 0 0 1 ${pts(x, y + h - r)}L${pts(x, y + r)}A${pts(r, r)} 0 0 1 ${pts(x + r, y)}Z`;
const polar = (cx, cy, R, deg) => [cx + R * Math.cos(deg * Math.PI / 180), cy - R * Math.sin(deg * Math.PI / 180)];

// ── 颜色（SVG 里只写浅色兜底） ─────────────────────────────
const PAL = { bg: "#e8e8ed", ink: "#424245", face: "#fafafa", black: "#3f3a37", brown: "#5b4637", gray: "#c9c6c1",
  blue: "#c7d0da", green: "#cdd5c8", pink: "#dccfcb", violet: "#d5d1df", beard: "#958e88" };
const V = (k) => `var(--sn-av-${k},${PAL[k]})`;

// ── 共用部件（原比例，24 视图；头圆 (12, 11.25) r5.5） ──────────────
const HEAD = circ(12, 11.25, 5.5);
const EARS = pair(circ(6.45, 12, 1.15));
const NECK = one("M10.8 15L10.8 19.2L13.2 19.2L13.2 15Z");
const BODY = sym("M12 18.85C10.9 18.85 10.2 17.55 9.5 17.55C6.6 17.55 3.2 20.4 3.2 25.5L12 25.5");   // 领口和肩线平滑相接
const BODY_S = sym("M12 15.6C7 15.6 3.4 19.4 3.4 25.5L12 25.5");                                      // 简化版：肩线顶藏在头后
const EYES = (r) => pair(circ(9.85, 11.6, r));
const SMILE = one("M10.95 14.1Q12 14.75 13.05 14.1");
// 卷发外轮廓：count 个向外鼓的圆弧（奇数个，头顶正中是一个卷），鬓角收进头圆，fringe 是发际线左半（从 (7,12) 到中线）
const curls = (count, R, r, cy, fringe) => { const st = 215 / count, half = Math.floor(count / 2), P = (deg) => polar(12, cy, R, deg);
  const a = st / 2 * Math.PI / 180, ch = R * Math.sin(a), h = r - Math.sqrt(r * r - ch * ch);
  let d = `M12 ${n(cy - R * Math.cos(a) - h)}A${pts(r, r)} 0 0 0 ${pts(...P(90 + st / 2))}`;
  for (let i = 1; i <= half; i++) d += `A${pts(r, r)} 0 0 0 ${pts(...P(90 + st / 2 + st * i))}`;
  return sym(d + "A.75 .75 0 0 0 7 12" + fringe); };
const ROUND_GLASSES = pair(circ(9.85, 11.6, 1.6)) + one("M11.45 11.3Q12 10.95 12.55 11.3") + pair("M8.25 11.45L6.6 10.95");
const SQUARE_GLASSES = pair(rrect(8.2, 10.35, 3.3, 2.5, .85)) + one("M11.5 11.2Q12 10.95 12.5 11.2") + pair("M8.2 11.2L6.6 10.95");

// ── 12 人 ───────────────────────────────────────────────
// layers(small)：由后往前；fill 写颜色名（不写就是皮肤色 face），"none" 只描边，"ink" 实心点；bare 表示不描边；
// body:true 的层完整版放最上（挡住长发下摆）、简化版垫最底（被头挡住）
const B = (small, tone) => ({ d: small ? BODY_S : BODY, fill: tone, body: true });
const P = [
  { id: "a1", name: "短发侧分的年轻男生，刘海扫向一侧，露出耳朵", hair: "black", tone: "blue",
    layers: (s) => [!s && { d: NECK }, !s && { d: EARS }, { d: HEAD },
      { d: one("M6.5 10.9C5.95 8.3 6.85 5.3 10.2 4.55C13.5 3.85 17 5.2 17.7 8.4C17.85 9.15 17.72 9.85 17.43 10.35C16.95 10.38 16.6 10.05 16.4 9.55C16.15 8.85 15.75 8.05 15.25 7.45C14.95 7.1 14.6 7.1 14.35 7.4C12.9 9.05 10.3 9.75 7.6 9.98C7.05 10.05 6.7 10.4 6.5 10.9Z"), fill: "black" }, B(s, "blue")] },
  { id: "a2", name: "中分长直发的年轻女生，头发垂到肩后", hair: "brown", tone: "pink",
    layers: (s) => [!s && { d: NECK }, { d: HEAD },
      { d: sym("M12 6.3C10.4 7.7 8.3 8.4 7.35 9.9C6.75 10.9 6.7 12.6 7.05 14.2C7.3 15.4 7.85 16.4 8.2 17.5C8.5 18.6 8.55 19.9 8.15 20.8C7.4 21.6 5.95 21.6 5.2 20.85C4.5 17.4 4.5 13.5 5 10.5C5.6 6.6 8.4 4.35 12 4.35"), fill: "brown" }, B(s, "pink")] },
  { id: "a3", name: "烫着灰色短卷发、戴圆框眼镜的年长女士", hair: "gray", tone: "green",
    layers: (s) => [!s && { d: NECK }, { d: HEAD }, !s && { d: ROUND_GLASSES, fill: "none" },
      { d: curls(5, 5.8, 2.4, 10.75, s ? "C7.05 10.5 7.3 9.4 7.95 8.7C8.95 7.75 10.4 7.5 12 7.5" : "C7.05 10.6 7.25 9.15 7.95 8.2A1.75 1.75 0 0 1 10.15 7.5A2 2 0 0 1 12 6.26"), fill: "gray" }, B(s, "green")] },
  { id: "a4", name: "齐刘海波波头的年轻女生，发尾到下巴，戴一对小圆耳钉", hair: "black", tone: "violet",
    layers: (s) => [
      { d: sym("M12 4.4C8.55 4.4 5.7 6.65 5.3 9.4C5.02 11.35 5.05 13.9 5.75 15.55C6.3 16.85 7.75 17.1 8.75 16.3C9.3 15.85 9.65 15.2 9.8 14.4L12 13.2"), fill: "black" },   // 后发：圆顶、两侧到下巴、发尾内扣
      !s && { d: NECK }, !s && { d: EARS }, !s && { d: pair(circ(6.2, 13.25, .55)), sw: .5 }, { d: HEAD },
      { d: sym("M12 4.4C8.55 4.4 5.7 6.65 5.3 9.4C6 9.2 6.65 9 7.3 8.92C8.85 8.72 10.4 8.78 12 8.78"), fill: "black" }, B(s, "violet")] },   // 齐刘海：外沿和后发同一段
  { id: "a5", name: "平顶寸头的中年男士，额头宽", hair: "black", tone: "blue",
    layers: (s) => [!s && { d: NECK }, !s && { d: EARS }, { d: HEAD },
      { d: sym("M12 5.45C9 5.45 7.09 8.07 6.64 10.01A5.5 5.5 0 0 0 6.54 10.6C7.2 10.5 7.4 8.6 8.65 7.9C9.75 7.5 11 7.6 12 7.6"), fill: "black" }, B(s, "blue")] },   // 平顶寸头，贴头皮
  { id: "a6", name: "扎高马尾、头戴耳机的女学生", hair: "brown", tone: "green",
    layers: (s) => [
      { d: one("M14.4 5.6C16 4.1 18.7 4.3 19.2 6.6C19.55 8.3 19 10.2 18 11.3C18.2 9.8 17.9 8.3 16.9 7.6Z"), fill: "brown" },   // 马尾：从头顶右后方甩出
      !s && { d: NECK }, { d: HEAD },
      { d: sym("M12 5.15C8.9 5.15 6.6 7.35 6.52 10.3C7.1 9.3 7.7 8 9.1 7.55C10 7.3 11 7.25 12 7.25"), fill: "brown" },          // 头发向后梳
      s ? { d: one("M5.87 11.5A6.15 6.15 0 1 1 18.13 11.5"), fill: "none" } : { d: sym("M12 4.2A6.8 6.8 0 0 0 5.23 11.59L6.52 11.48A5.5 5.5 0 0 1 12 5.5"), fill: "violet" },   // 简化版头梁用单线                     // 耳机头梁
      { d: pair(rrect(4.9, 10.5, 2.1, 3.4, 1.05)), fill: "violet" }, B(s, "green")] },                                          // 耳罩（盖住耳朵）
  { id: "a7", name: "头顶丸子头、鬓边留两缕碎发的年轻女生", hair: "black", tone: "pink",
    layers: (s) => [{ d: circ(12, 4.55, 1.5), fill: "black" },   // 丸子：坐在头顶，下半被头发挡住
      !s && { d: NECK }, !s && { d: EARS }, { d: HEAD },
      !s && { d: pair("M7.5 8.75C6.95 9.9 7.75 11.05 7.55 12.35"), fill: "none", sw: .5 },                                         // 鬓边碎发：起点藏在头发下
      { d: sym("M12 5.4C8.95 5.4 6.6 7.5 6.55 10.4C7.2 9.4 7.8 8.15 9.2 7.65C10.1 7.35 11.05 7.3 12 7.3"), fill: "black" }, B(s, "pink")] },   // 头发向上梳
  { id: "a8", name: "戴毛线帽的年轻男生，帽檐下露出鬓角", hair: "black", tone: "violet",
    layers: (s) => [!s && { d: NECK }, !s && { d: EARS }, { d: HEAD },
      { d: pair("M6.8 9.5A5.5 5.5 0 0 0 6.52 10.85C7 10.7 7.3 10.35 7.45 9.5Z"), fill: "black" },                                  // 鬓角
      { d: sym("M12 3.9C8.4 3.9 6 6.3 5.85 9L12 9"), fill: "blue" },                                                           // 帽身
      { d: s ? rrect(5.55, 7.8, 12.9, 2.1, 1.05) : rrect(5.55, 8.15, 12.9, 1.8, .9), fill: "blue" },   // 简化版帽檐加高、上提，避开放大的眼睛                                                                     // 帽檐翻边
      !s && { d: one("M8.8 8.65L8.8 9.45M10.4 8.65L10.4 9.45M12 8.65L12 9.45M13.6 8.65L13.6 9.45M15.2 8.65L15.2 9.45"), fill: "none", sw: .45 }, B(s, "violet")] },   // 罗纹
  { id: "a9", name: "斜刘海短发、戴方框眼镜的中年男士", hair: "brown", tone: "green",
    layers: (s) => [!s && { d: NECK }, !s && { d: EARS }, { d: HEAD }, !s && { d: SQUARE_GLASSES, fill: "none" },
      { d: one("M17.5 10.9C17.85 8.1 16.6 5.3 12.8 5C9 4.75 6.6 7 6.4 9C6.35 9.6 6.4 10.1 6.52 10.55C6.95 10.45 7.3 10 7.45 9.4C7.6 8.6 7.85 7.6 8.3 7.05C8.5 6.75 8.85 6.75 9.05 7.05C10.8 8.7 13.6 9.45 16.4 9.75C16.95 9.8 17.3 10.3 17.5 10.9Z"), fill: "brown" }, B(s, "green")] },
  { id: "a10", name: "侧背头、留淡淡八字胡的中年男士", hair: "black", tone: "violet",
    layers: (s) => [!s && { d: NECK }, !s && { d: EARS }, { d: HEAD },
      { d: pair("M11.85 13.1C11 12.85 10.2 12.95 9.75 13.5C9.6 13.7 9.7 13.85 9.9 13.8C10.6 13.55 11.3 13.6 11.85 13.65Z"), fill: "beard", bare: true },   // 八字胡：两撇、人中处分开
      { d: one("M6.55 10.6C6.1 8 7.1 5 11.2 4.45C15 3.95 17.75 6.1 17.75 8.9C17.75 9.6 17.65 10.15 17.47 10.6C17.1 10.55 16.85 10.2 16.75 9.75C16.55 8.7 15.6 7.5 13.6 7.2C11.4 6.9 8.85 7.3 7.7 8.6C7.25 9.1 7.05 9.8 7.05 10.4C6.85 10.55 6.7 10.6 6.55 10.6Z"), fill: "black" }, B(s, "violet")] },   // 头发向后梳，额头全露，右侧分缝
  { id: "a11", name: "侧分齐耳短发、戴小圆环耳环的中年女士", hair: "brown", tone: "pink",
    layers: (s) => [
      { d: sym("M12 4.5C8.6 4.5 5.8 6.7 5.4 9.5C5.15 11.1 5.2 12.7 5.7 13.75C6.1 14.55 7 14.7 7.6 14.25C8 13.9 8.1 13.4 8 12.8L12 12"), fill: "brown" },   // 后发：到耳垂下方
      !s && { d: NECK }, !s && { d: EARS }, !s && { d: pair(circ(6.6, 13.95, .7)), fill: "none", stroke: "face", sw: .5 }, { d: HEAD },
      { d: one("M5.4 9.5C5.8 6.7 8.6 4.5 12 4.5C15.4 4.5 18.2 6.7 18.6 9.5C18 9.45 17.3 9.2 16.9 8.7C15.8 7.6 13.2 7.05 10.4 6.4C10 6 9.6 5.95 9.3 6.3C8.3 7.4 7.3 8.4 6.6 9.2C6.25 9.5 5.8 9.55 5.4 9.5Z"), fill: "brown" }, B(s, "pink")] },   // 前发：左侧分缝，不留刘海
  { id: "a12", name: "一头蓬松卷发的年轻男生", hair: "black", tone: "blue",
    layers: (s) => [!s && { d: NECK }, { d: HEAD },
      { d: s ? curls(5, 6.1, 2.5, 10.65, "C7.05 10.6 7.35 9.3 8.2 8.6C9.2 7.8 10.6 7.6 12 7.6") : curls(7, 6.2, 2, 10.6, "C7.05 10.6 7.35 9.3 8.2 8.6C9.2 7.8 10.6 7.6 12 7.6"), fill: "black" },
      !s && { d: one("M11.5 7.7C10.7 8.2 10.6 9.2 11.3 9.45"), fill: "none" }, B(s, "blue")] },   // 额前一个小卷
];

// ── 组装 ─────────────────────────────────────────────────
const VB = "2.6 2 18.8 18.8", SW = .7, SW_S = 1.2;   // 线宽按 viewBox 算：.7 / 1.2 相当于 24 视图里的 .89 / 1.53
const attr = (l) => { let a = ""; const st = [];
  if (l.fill === "none") a += ` fill="none"`; else if (l.fill === "ink") a += ` fill="currentColor"`; else if (l.fill) st.push(`fill:${V(l.fill)}`);
  if (l.stroke) st.push(`stroke:${V(l.stroke)}`);
  if (l.bare || l.fill === "ink") a += ` stroke="none"`;
  if (l.sw) a += ` stroke-width="${l.sw}"`;
  return a + (st.length ? ` style="${st.join(";")}"` : ""); };
const build = (p, small) => {
  let ls = p.layers(small).filter(Boolean);
  if (small) ls = [...ls.filter((l) => l.body), ...ls.filter((l) => !l.body)];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" fill="none" stroke="currentColor" stroke-width="${small ? SW_S : SW}" stroke-linecap="round" stroke-linejoin="round" style="color:${V("ink")}">`
    + `<rect width="24" height="24" stroke="none" style="fill:${V("bg")}"/>`
    + `<g style="fill:${V("face")}">${ls.map((l) => `<path d="${l.d}"${attr(l)}/>`).join("")}</g>`
    + (small ? "" : `<path d="${SMILE}"/>`)
    + `<path d="${EYES(small ? .8 : .6)}" fill="currentColor" stroke="none"/></svg>`;
};

// ── 输出模块：共用片段只存一份，每人只存头发和配饰；完整版、简化版共用的层只存一次（第 3 项 1 = 只在完整版、2 = 只在简化版） ──
const SH = { H: HEAD, E: EARS, N: NECK, B: BODY, b: BODY_S, M: SMILE, Y: EYES(.6), y: EYES(.8) };
const ref = (d) => { const k = Object.keys(SH).find((k) => SH[k] === d); return k ? "#" + k : d; };
const code = (l) => { const a = [l.fill || 0]; if (l.stroke || l.sw || l.bare) a.push(l.stroke || 0, l.sw || 0, l.bare ? 1 : 0); return a.length === 1 && !a[0] ? 0 : a; };
const same = (a, b) => a.d === b.d && attr(a) === attr(b);
const merged = P.map((p) => { const F = p.layers(false).filter((l) => l && !l.body), S = p.layers(true).filter((l) => l && !l.body), out = []; let j = 0;
  for (const f of F) { const k = S.findIndex((s, i) => i >= j && same(s, f)); if (k >= 0) { for (; j < k; j++) out.push([ref(S[j].d), code(S[j]), 2]); out.push([ref(f.d), code(f), 0]); j = k + 1; } else out.push([ref(f.d), code(f), 1]); }
  for (; j < S.length; j++) out.push([ref(S[j].d), code(S[j]), 2]);
  return [p.id, p.tone, out.map((l) => l[2] ? l : l[1] ? l.slice(0, 2) : [l[0]])]; });
const MOD = `// 预设头像：12 张圆润的头肩像（线条加柔和填色），没有照片时按 id 或名字稳定地挑一张，同一个名字永远是同一张。
// presetAvatar("林知远", 32) → { id, svg }；avatarSvg("a7", 24) 直接取某一张。24px 及以下给简化版（去掉脖子、耳朵、嘴和眼镜，线条加粗）。
// 颜色走 --sn-av-* 令牌（tokens.css，深浅两套），SVG 里只写浅色兜底；导入没有副作用。由 scripts/avatars/presets.mjs 生成，别手改。
const S = ${JSON.stringify(SH)};
const C = ${JSON.stringify(PAL)};
const P = ${JSON.stringify(merged)};
const V = (k) => \`var(--sn-av-\${k},\${C[k]})\`, D = (d) => (d[0] === "#" ? S[d.slice(1)] : d);
const A = (a) => { if (!a) return ""; const [f, k, w, b] = a, st = []; let s = "";
  if (f === "none") s += ' fill="none"'; else if (f === "ink") s += ' fill="currentColor"'; else if (f) st.push("fill:" + V(f));
  if (k) st.push("stroke:" + V(k)); if (b || f === "ink") s += ' stroke="none"'; if (w) s += \` stroke-width="\${w}"\`;
  return s + (st.length ? \` style="\${st.join(";")}"\` : ""); };
/** 12 张预设的 id：a1 … a12 */
export const AVATAR_IDS = P.map((p) => p[0]);
/** 取某一张预设的 SVG 字符串；size ≤ 24 给简化版 */
export function avatarSvg(id, size = 32) {
  const p = P.find((x) => x[0] === id) || P[0], small = +size <= 24, body = \`<path d="\${small ? S.b : S.B}" style="fill:\${V(p[1])}"/>\`;
  const ls = p[2].filter((l) => l[2] !== (small ? 1 : 2)).map((l) => \`<path d="\${D(l[0])}"\${A(l[1])}/>\`).join("");
  return \`<svg viewBox="${VB}" fill="none" stroke="currentColor" stroke-width="\${small ? ${SW_S} : ${SW}}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:\${V("ink")}">\`
    + \`<rect width="24" height="24" stroke="none" style="fill:\${V("bg")}"/><g style="fill:\${V("face")}">\${small ? body + ls : ls + body}</g>\`
    + (small ? "" : \`<path d="\${S.M}"/>\`) + \`<path d="\${small ? S.y : S.Y}" fill="currentColor" stroke="none"/></svg>\`;
}
/** 按 id 或名字稳定地挑一张（FNV-1a），同一个 seed 永远同一张：{ id, svg } */
export function presetAvatar(seed, size = 32) {
  let h = 0x811c9dc5; for (const ch of String(seed ?? "")) h = Math.imul(h ^ ch.codePointAt(0), 0x01000193);
  const id = P[(h >>> 0) % P.length][0];
  return { id, svg: avatarSvg(id, size) };
}
`;
writeFileSync(OUT, MOD);
console.log(`avatar-presets.js ${MOD.length} B`);
