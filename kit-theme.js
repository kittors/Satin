// 主题定制：主色（和成功 / 警告 / 危险三种状态色）、字体、字号比例——随时改，所有组件跟着变。
// 组件只认 CSS 变量（--accent / --on-primary / --success / --warning / --danger / --sans / --mono / --font-scale），这里只是把选择写到根元素上；
// 深浅两套主题各用各的值（主色在深色下自动提亮，保证在深底上看得清），选择存在 localStorage，刷新还在。
const root = document.documentElement, KEY = "satin-custom";

// 主色：默认"墨"——跟着主题的文字色走（黑白克制，Satin 的本色）；其余几种是给品牌色用的，深色下用更亮的那一版
export const ACCENTS = [
  { id: "ink", name: "墨", light: null, dark: null },
  { id: "blue", name: "蓝", light: "#0a66d9", dark: "#3d8bfd" },
  { id: "indigo", name: "靛", light: "#4f46e5", dark: "#8b85ff" },
  { id: "green", name: "绿", light: "#18794e", dark: "#3dd68c" },
  { id: "amber", name: "琥珀", light: "#b45309", dark: "#f5a524" },
  { id: "rose", name: "玫红", light: "#d6245b", dark: "#ff5c8a" },
];
// 字体：都是系统里就有的字体，不额外下载；中文跟着回退到苹方 / 宋体 / 圆体
export const FONTS = [
  { id: "system", name: "系统", sans: null },
  { id: "rounded", name: "圆体", sans: '"SF Pro Rounded", ui-rounded, "Yuanti SC", "PingFang SC", "Microsoft YaHei", sans-serif' },
  { id: "humanist", name: "人文", sans: '"Avenir Next", "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif' },
  { id: "serif", name: "衬线", sans: '"New York", ui-serif, "Songti SC", "Noto Serif SC", serif' },
];
export const SCALES = [{ id: "s", name: "小", v: .93 }, { id: "m", name: "标准", v: 1 }, { id: "l", name: "大", v: 1.07 }, { id: "xl", name: "特大", v: 1.14 }];
export const DEFAULTS = { accent: "ink", custom: "", font: "system", scale: "m", success: "", warning: "", danger: "" };

// 颜色小工具：十六进制 ↔ RGB、相对亮度、和白色 / 黑色按比例混
const rgb = (hex) => { const h = hex.replace("#", ""), n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h; return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16)); };
const hex = (c) => "#" + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
export const luminance = (h) => { const [r, g, b] = rgb(h).map((v) => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
const mix = (h, to, k) => { const a = rgb(h), b = rgb(to); return hex(a.map((v, i) => v + (b[i] - v) * k)); };
const contrast = (a, b) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
// 深色主题下太暗的颜色提亮到和深底对比度至少 4.5；浅色主题下太亮的压暗
function fit(h, dark) {
  const bg = dark ? "#1c1c1e" : "#ffffff"; let c = h;
  for (let k = 0; k < 12 && contrast(c, bg) < 4.5; k++) c = mix(c, dark ? "#ffffff" : "#000000", .12);
  return c;
}
export const onColor = (h) => (luminance(h) > .36 ? "#000000" : "#ffffff"); /* 主色上的字：亮的用黑字，暗的用白字 */

export function load() { try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return { ...DEFAULTS }; } }
let cur = load();
export const get = () => ({ ...cur });

// 一套选择在深色或浅色下要写的变量（没改的不写，用样式表里的默认值）
const VARS = ["--accent", "--on-primary", "--success", "--warning", "--danger", "--sans", "--font-scale"];
export function vars(t, dark) {
  const o = {}, a = ACCENTS.find((x) => x.id === t.accent), base = t.custom ? fit(t.custom, dark) : a && (dark ? a.dark : a.light);
  if (base) { o["--accent"] = base; o["--on-primary"] = onColor(base); }
  for (const k of ["success", "warning", "danger"]) if (t[k]) o["--" + k] = fit(t[k], dark);
  const f = FONTS.find((x) => x.id === t.font); if (f?.sans) o["--sans"] = f.sans;
  const s = SCALES.find((x) => x.id === t.scale); if (s && s.v !== 1) o["--font-scale"] = String(s.v);
  return o;
}
// 把当前选择写到某个文档的根元素上（官网里的演示 iframe 也用它同步）
export function paint(el = root, t = cur) {
  const o = vars(t, (el.dataset.theme || root.dataset.theme) === "dark");
  for (const k of VARS) if (o[k]) el.style.setProperty(k, o[k]); else el.style.removeProperty(k);
}
// 刷新不闪：两套主题下的变量各存一份，theme-boot.js 在第一帧之前先写上（模块脚本要等全部加载完才跑）
const remember = () => { try { localStorage.setItem(KEY + "-css", JSON.stringify({ light: vars(cur, false), dark: vars(cur, true) })); } catch {} };
const subs = new Set();
export const onChange = (f) => (subs.add(f), () => subs.delete(f));
export function set(patch) {
  cur = { ...cur, ...patch }; localStorage.setItem(KEY, JSON.stringify(cur)); remember(); paint();
  for (const f of subs) f(get());
}
export const reset = () => set({ ...DEFAULTS });
// 深浅主题切换后重新算（主色在深色下要用亮的那一版）
new MutationObserver(() => paint()).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
// 别的页面（官网、演示 iframe、另一个标签页）改了主题：这里读回来重新上色，订阅的人也通知到
addEventListener("storage", (e) => { if (e.key === KEY) { cur = load(); paint(); for (const f of subs) f(get()); } });
paint(); remember();
