// 一次性：从改造前的样式表（只读备份）里抽出全局令牌，写成 W3C 设计令牌格式（DTCG）的 JSON：spec/tokens/*.tokens.json。
// 之后令牌以 JSON 为准，CSS 变量由 build.mjs 生成，check.mjs 逐个比对生成的值和改造前一模一样。
// 用法：node scripts/tokens/extract.mjs [基线目录]
import fs from "node:fs";
import path from "node:path";
import { scan, cssOrder } from "./scan.mjs";

const BASE = path.resolve(process.argv[2] || path.join(import.meta.dirname, "../../../Satin-baseline-20261120"));
const OUT = path.join(import.meta.dirname, "../../spec/tokens");
const list = scan(BASE, cssOrder(BASE));

// 变量名 → 令牌路径（语义名，和展示页"颜色"一节、04 号规范的叫法一致）
const NAMES = {
  "--sel-ring": "color.table.selectionRing", "--range-line": "color.table.rangeLine", "--guide-line": "color.table.guideLine", "--tree-line": "color.table.treeLine", "--lift-shadow": "shadow.lift",
  "--sans": "font.family.sans", "--mono": "font.family.mono", "--serif": "font.family.serif",
  "--ease-linear": "motion.easing.linear", "--ease-out": "motion.easing.out", "--ease-out-strong": "motion.easing.outStrong", "--ease-in": "motion.easing.in", "--ease-in-out": "motion.easing.inOut",
  "--ease-overshoot": "motion.easing.overshoot", "--ease-spring": "motion.easing.spring", "--ease-open": "motion.easing.open",
  "--r-xs": "radius.xs", "--r-sm": "radius.sm", "--r-md": "radius.md", "--r-lg": "radius.lg", "--r-xl": "radius.xl", "--r-full": "radius.full", "--btn-r": "radius.button",
  "--gap-tight": "space.gap.tight", "--gap-inline": "space.gap.inline", "--gap-stack": "space.gap.stack", "--gap-group": "space.gap.group", "--gap-section": "space.gap.section",
  "--pad-card": "space.pad.card", "--pad-panel": "space.pad.panel", "--pad-page": "space.pad.page",
  "--press": "motion.press.text", "--press-icon": "motion.press.icon",
  "--canvas": "color.bg.canvas", "--raised": "color.bg.raised", "--overlay": "color.bg.overlay", "--sunken": "color.bg.sunken",
  "--fill-hover": "color.fill.hover", "--fill-active": "color.fill.active", "--fill-hover-solid": "color.fill.hoverSolid", "--fill-active-solid": "color.fill.activeSolid", "--fill-subtle": "color.fill.subtle", "--scrim": "color.scrim",
  "--label": "color.text.primary", "--label2": "color.text.secondary", "--label3": "color.text.tertiary", "--label-off": "color.text.disabled", "--on-primary": "color.text.onAccent",
  "--line": "color.line.subtle", "--line-control": "color.line.control", "--line-control-hover": "color.line.controlHover", "--focus": "color.line.focus",
  "--accent": "color.accent", "--danger": "color.danger", "--danger-ring": "color.dangerRing", "--success": "color.success", "--warning": "color.warning",
  "--field": "color.field.bg", "--field-inset": "shadow.fieldInset", "--ring": "color.ring", "--card-line": "color.card.line", "--card-shadow": "shadow.card", "--e1": "shadow.e1", "--e2": "shadow.e2",
  "--tip-bg": "color.tooltip.bg", "--tip-fg": "color.tooltip.fg", "--tip-shadow": "shadow.tooltip",
  "--menu-bg": "color.menu.bg", "--menu-shadow": "shadow.menu", "--sk-shine": "color.skeleton.shine", "--sa-thumb": "color.scrollbar.thumb", "--sa-thumb-hover": "color.scrollbar.thumbHover",
  "--flow-dot": "color.flow.dot", "--edge-s": "flow.edge.saturation", "--edge-l": "flow.edge.lightness", "--edge-a": "flow.edge.alpha", "--beam-s": "flow.beam.saturation", "--beam-l": "flow.beam.lightness",
};
const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const pathOf = (name) => NAMES[name] || (/^--sp-\d+$/.test(name) ? "space." + name.slice(5) : /^--b-/.test(name) ? "color.button." + camel(name.slice(4)) : "misc." + camel(name.slice(2)));
const byVar = new Map(list.map((t) => [t.name, pathOf(t.name)]));

// 值 → $type 和 $value。纯引用写成别名 {路径}；带别名的表达式（color-mix、calc）保留 CSS 写法，里面的 var() 换成别名
const toAlias = (v) => v.replace(/var\((--[\w-]+)\)/g, (m, n) => (byVar.has(n) ? `{${byVar.get(n)}}` : m));
function typed(name, value) {
  const v = value.trim(), p = byVar.get(name);
  if (/^var\(--[\w-]+\)$/.test(v)) return { $type: p.startsWith("shadow") ? "shadow" : p.startsWith("space") || p.startsWith("radius") ? "dimension" : "color", $value: toAlias(v) };
  if (p.startsWith("font.family")) { const fs_ = v.split(/,\s*/); return { $type: "fontFamily", $value: fs_.map((f) => f.replace(/^"|"$/g, "")), $extensions: { "com.satin": { quoted: fs_.map((f) => f.startsWith('"')) } } }; }
  if (p.startsWith("motion.easing")) { const m = /^cubic-bezier\(([^)]+)\)$/.exec(v); if (m) return { $type: "cubicBezier", $value: m[1].split(/,\s*/).map(Number) }; return { $type: "cubicBezier", $value: v, $extensions: { "com.satin": { css: true } } }; }
  if (p.startsWith("shadow")) return { $type: "shadow", $value: toAlias(v), $extensions: { "com.satin": { css: true } } };
  if (/^-?[\d.]+px$/.test(v)) return { $type: "dimension", $value: v };
  if (/^-?[\d.]+%$/.test(v)) return { $type: "number", $value: v, $extensions: { "com.satin": { css: true } } };
  if (/^-?[\d.]+$/.test(v)) return { $type: "number", $value: +v };
  if (/^(#|rgba?\(|hsla?\(|color-mix\(|transparent)/.test(v)) return { $type: "color", $value: toAlias(v), ...(v.startsWith("#") || /^rgba?\([\d., ]+\)$/.test(v) ? {} : { $extensions: { "com.satin": { css: true } } }) };
  return { $value: toAlias(v), $extensions: { "com.satin": { css: true } } };
}
// 一个"模式"（一组选择器上的声明）写成一份令牌文件
const setPath = (obj, p, val) => { const ks = p.split("."); let o = obj; for (const k of ks.slice(0, -1)) o = o[k] ||= {}; o[ks.at(-1)] = val; };
const MODES = [
  { file: "base", selector: ":root", desc: "和主题无关的令牌：字体、缓动、圆角、间距刻度和语义间距、按下手感；以及浅色值写在 :root 上的几个组件令牌" },
  { file: "theme.light", selector: ':root, [data-theme="light"]', desc: "浅色主题（默认）", declarations: { "color-scheme": "light" } },
  { file: "theme.dark", selector: '[data-theme="dark"]', desc: "深色主题", declarations: { "color-scheme": "dark" } },
  { file: "density.compact", selector: '[data-density="compact"]', desc: "紧凑密度：语义间距整体降一档" },
  { file: "density.comfortable", selector: '[data-density="comfortable"]', desc: "宽松密度：语义间距整体升一档" },
  ...["6", "8", "10", "pill"].map((r) => ({ file: "radius." + r, selector: `[data-radius="${r}"]`, desc: `按钮圆角档：${r === "pill" ? "胶囊（默认）" : r + "px"}` })),
];
fs.mkdirSync(OUT, { recursive: true });
const manifest = { $description: "Satin 设计令牌（W3C DTCG 格式）。build.mjs 按 order 依次生成 CSS 变量块；令牌的 CSS 变量名在 $extensions.com.satin.var（生成时加前缀）。", prefix: "sn-", order: [] };
for (const m of MODES) {
  const doc = { $description: m.desc };
  for (const t of list.filter((x) => x.selector === m.selector)) {
    const tok = typed(t.name, t.value), ext = { ...(tok.$extensions?.["com.satin"] || {}), var: t.name, source: t.file };
    setPath(doc, byVar.get(t.name), { ...tok, $extensions: { "com.satin": ext } });
  }
  fs.writeFileSync(path.join(OUT, m.file + ".tokens.json"), JSON.stringify(doc, null, 2) + "\n");
  manifest.order.push({ file: m.file + ".tokens.json", selector: m.selector, ...(m.declarations ? { declarations: m.declarations } : {}) });
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`抽出 ${list.length} 条令牌声明 → ${path.relative(process.cwd(), OUT)}（${MODES.length} 份）`);
