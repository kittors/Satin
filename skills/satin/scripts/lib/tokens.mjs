// Satin 令牌：浅色 / 深色两套 --sn-* 的值，用来给"写死的颜色、间距、字号"找最接近的令牌。
// 取值来源（找到第一个就用）：环境变量 SATIN_TOKENS 指的 tokens.css → 仓库里的 packages/satin-ui/css/tokens.css →
// 项目里 node_modules/satin-ui/css/tokens.css → 技能自带的快照 tokens.snapshot.json（node lib/tokens.mjs --snapshot 重新生成）
import fs from "node:fs";
import path from "node:path";
import { parseCSS } from "./css.mjs";
import { parseColor, mix, over, deltaE, hex, hsl } from "./color.mjs";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const CANDIDATES = [process.env.SATIN_TOKENS, path.resolve(HERE, "../../../../packages/satin-ui/css/tokens.css"), path.resolve(process.cwd(), "node_modules/satin-ui/css/tokens.css")].filter(Boolean);
const SNAPSHOT = path.join(HERE, "tokens.snapshot.json");

// tokens.css → { light: {名: 值}, dark: {名: 值} }（:root 的值两套都有，[data-theme="dark"] 覆盖深色）
export function readTokensCSS(file) {
  const { decls } = parseCSS(fs.readFileSync(file, "utf8")), light = {}, dark = {};
  for (const d of decls) {
    if (!d.prop.startsWith("--sn-")) continue;
    const sel = d.selector.replace(/\s+/g, " ");
    if (/^:root$/.test(sel)) { light[d.prop] = d.value; dark[d.prop] ??= d.value; if (!(d.prop in dark)) dark[d.prop] = d.value; }
    if (/:root, ?\[data-theme="light"\]/.test(sel)) light[d.prop] = d.value;
    if (/^\[data-theme="dark"\]$/.test(sel)) dark[d.prop] = d.value;
  }
  // :root 上的值（主题无关的）深色那套也要有
  for (const d of decls) if (d.prop.startsWith("--sn-") && /^:root$/.test(d.selector.trim()) && !(d.prop in dark)) dark[d.prop] = d.value;
  return { light, dark };
}
let cache = null;
export function tokens() {
  if (cache) return cache;
  for (const f of CANDIDATES) if (fs.existsSync(f)) { try { return (cache = { ...readTokensCSS(f), source: f }); } catch {} }
  return (cache = { ...JSON.parse(fs.readFileSync(SNAPSHOT, "utf8")), source: SNAPSHOT });
}
// 一个令牌在某套主题下解析成具体颜色（展开 var()、color-mix(in srgb, …)）
export function resolveColor(name, theme, depth = 0) {
  const t = tokens()[theme], v = t[name]; if (v == null || depth > 8) return null;
  return evalColor(v, theme, depth);
}
function evalColor(v, theme, depth) {
  v = v.trim();
  let m = /^var\((--[\w-]+)(?:,\s*([^)]*))?\)$/.exec(v);
  if (m) return resolveColor(m[1], theme, depth + 1) ?? (m[2] ? evalColor(m[2], theme, depth + 1) : null);
  m = /^color-mix\(in srgb,\s*(.+?)\s+(\d+(?:\.\d+)?)%,\s*(.+)\)$/.exec(v);
  if (m) { const a = evalColor(m[1], theme, depth + 1), b = evalColor(m[3], theme, depth + 1); return a && b ? mix(a, b, +m[2] / 100) : null; }
  return parseColor(v);
}

// 给"写死的颜色"推荐的语义令牌，按属性分组（文字色只推荐文字令牌……）
const ROLE = {
  text: ["--sn-label", "--sn-label2", "--sn-label3", "--sn-label-off", "--sn-on-primary", "--sn-accent", "--sn-danger", "--sn-success", "--sn-warning"],
  bg: ["--sn-canvas", "--sn-raised", "--sn-overlay", "--sn-sunken", "--sn-fill-hover", "--sn-fill-active", "--sn-fill-subtle", "--sn-scrim", "--sn-field", "--sn-accent", "--sn-danger", "--sn-success", "--sn-warning"],
  line: ["--sn-line", "--sn-line-control", "--sn-line-control-hover", "--sn-focus", "--sn-card-line", "--sn-accent", "--sn-danger"],
};
const roleOf = (prop) => (/^(color|caret-color|-webkit-text-fill-color|text-decoration-color|fill|stroke)$/.test(prop) ? "text" : /^(border|outline|column-rule)/.test(prop) ? "line" : /^background/.test(prop) ? "bg" : null);
// 和浅色主题的令牌比（都叠在浅色窗口底色上再比，半透明的也能比）；返回 { name, light, dark, dE }
// 饱和的颜色（品牌色、状态色）：Satin 的中性令牌里找不到近的，就看它像不像危险 / 成功 / 警告；都不像就是主色（--sn-accent，可以在主题里换成品牌色）
const STATUS = ["--sn-danger", "--sn-success", "--sn-warning"];
export function nearestColor(rgba, prop) {
  if (hsl(rgba).s > .35 && rgba[3] > .2) {
    let best = null; for (const n of STATUS) { const c = resolveColor(n, "light"); const d = c ? deltaE(over(rgba, [255, 255, 255, 1]), c) : 1e9; if (!best || d < best.dE) best = { name: n, dE: d }; }
    if (best.dE > 30) best = { name: "--sn-accent", dE: 0, brand: true };
    const L = resolveColor(best.name, "light"), D = resolveColor(best.name, "dark");
    return { ...best, light: L && hex(L), dark: D && hex(D) };
  }
  const names = roleOf(prop) ? ROLE[roleOf(prop)] : [...new Set(Object.values(ROLE).flat())];
  const canvas = resolveColor("--sn-canvas", "light") || [245, 245, 247, 1], base = over(rgba, canvas);
  let best = null;
  for (const n of names) {
    const c = resolveColor(n, "light"); if (!c) continue;
    const d = deltaE(base, over(c, canvas));
    if (!best || d < best.dE) best = { name: n, dE: d };
  }
  if (!best) return null;
  const L = resolveColor(best.name, "light"), D = resolveColor(best.name, "dark");
  return { ...best, light: L && hex(L), dark: D && hex(D) };
}

// 间距刻度（04 号 §3）：16 以下每 2px 一档，往上逐级放大；1px 只用于细线对齐
export const SCALE = [0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 64, 80];
const SEMANTIC = { 4: "--sn-gap-tight", 8: "--sn-gap-inline", 12: "--sn-gap-stack", 16: "--sn-gap-group 或 --sn-pad-card", 24: "--sn-pad-panel", 32: "--sn-gap-section 或 --sn-pad-page" };
export const nearestScale = (px) => SCALE.reduce((a, b) => (Math.abs(b - px) < Math.abs(a - px) ? b : a));
export const spaceHint = (px) => { const n = nearestScale(Math.abs(px)); return `改成 ${px < 0 ? "-" : ""}${n}px（var(--sn-sp-${n})）${SEMANTIC[n] ? `，或者语义间距 var(${SEMANTIC[n].split(" 或 ")[0]})${SEMANTIC[n].includes(" 或 ") ? " / var(" + SEMANTIC[n].split(" 或 ")[1] + ")" : ""}` : ""}`; };

// 字号档（04 号 §2.2）：大小 → 排版类
export const TYPE = { 28: "sn-t-display", 22: "sn-t-title1", 17: "sn-t-title2", 15: "sn-t-title3", 14: "sn-t-body / sn-t-body-strong", 13: "sn-t-callout", 12: "sn-t-caption / sn-t-code", 11: "sn-t-micro" };
export const SIZES = Object.keys(TYPE).map(Number);
export const nearestSize = (px) => SIZES.reduce((a, b) => (Math.abs(b - px) < Math.abs(a - px) ? b : a));
export const sizeHint = (px) => { const n = nearestSize(px); return `改成 ${n}px，最好直接用排版类 ${TYPE[n]}（字号、行高、字重成套）`; };

// 曲线：名字 → 控制点（和 --sn-ease-* 一样）
export const EASES = { "--sn-ease-out": [0, 0, .58, 1], "--sn-ease-out-strong": [.22, 1, .36, 1], "--sn-ease-in": [.42, 0, 1, 1], "--sn-ease-in-out": [.42, 0, .58, 1], "--sn-ease-overshoot": [.34, 1.56, .64, 1], "--sn-ease-open": [.32, .72, 0, 1] };
const KEYWORD = { ease: [.25, .1, .25, 1], "ease-in": [.42, 0, 1, 1], "ease-out": [0, 0, .58, 1], "ease-in-out": [.42, 0, .58, 1] };
export function nearestEase(fn) {
  const m = /cubic-bezier\(([^)]*)\)/.exec(fn), p = m ? m[1].split(",").map(Number) : KEYWORD[fn.trim()];
  if (!p || p.length !== 4 || p.some(isNaN)) return "--sn-ease-out";
  let best = null; for (const [n, q] of Object.entries(EASES)) { const d = Math.hypot(...p.map((v, i) => v - q[i])); if (!best || d < best[1]) best = [n, d]; }
  return best[0];
}

// 生成快照：node lib/tokens.mjs --snapshot
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(HERE, "tokens.mjs") && process.argv.includes("--snapshot")) {
  const src = CANDIDATES.find((f) => fs.existsSync(f)); if (!src) { console.error("找不到 tokens.css"); process.exit(1); }
  const t = readTokensCSS(src); fs.writeFileSync(SNAPSHOT, JSON.stringify({ light: t.light, dark: t.dark }, null, 1) + "\n");
  console.log(`快照：浅色 ${Object.keys(t.light).length}、深色 ${Object.keys(t.dark).length} 个变量 → ${path.relative(process.cwd(), SNAPSHOT)}`);
}
