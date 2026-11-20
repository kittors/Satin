// 令牌比对：由 JSON 生成的 CSS 变量，和改造前样式表里的全局令牌逐个相等。
// 按"根元素上的组合"逐一算每个变量最后生效的声明值：主题（浅 / 深）× 密度（默认 / 紧凑 / 宽松）× 按钮圆角（默认 / 6 / 8 / 10 / 胶囊），共 30 种；
// 两边每种组合里每个变量的值（空白、数字写法归一后）都要一样，变量集合也要一样。
// 用法：node scripts/tokens/check.mjs [基线目录] [--prefix sn-]
import path from "node:path";
import postcss from "postcss";
import { scan, cssOrder, TOKEN_SELECTOR } from "./scan.mjs";
import { buildCSS } from "./build.mjs";

const BASE = path.resolve(process.argv.slice(2).find((a) => !a.startsWith("--") && a !== process.argv[process.argv.indexOf("--prefix") + 1]) || path.join(import.meta.dirname, "../../../Satin-baseline-20261120"));
const pi = process.argv.indexOf("--prefix"), PREFIX = pi > 0 ? process.argv[pi + 1] : "sn-";
const norm = (v, prefix = "") => v.replace(/\s+/g, " ").trim().replace(new RegExp(`--${prefix}`, "g"), "--").replace(/(^|[^\d.])0\.(\d)/g, "$1.$2").replace(/#[0-9a-f]{3,8}\b/gi, (h) => h.toLowerCase());
const matches = (sel, ctx) => sel.split(/, ?/).some((s) => s === ":root" || (!ctx.radius && s === ":root:not([data-radius])") || s === `[data-theme="${ctx.theme}"]` || (ctx.density && s === `[data-density="${ctx.density}"]`) || (ctx.radius && s === `[data-radius="${ctx.radius}"]`));
function effective(decls, ctx, prefix = "") { const m = new Map(); for (const d of decls) if (matches(d.selector, ctx)) m.set(d.name.replace(new RegExp(`^--${prefix}`), "--"), norm(d.value, prefix)); return m; }

const base = scan(BASE, cssOrder(BASE));
const gen = []; let order = 0;
// 跟系统深浅的那一块（@media (prefers-color-scheme: dark) :root:not([data-theme])）是深色块的原样拷贝：单独核对一致，不算进组合
const AUTO = [], DARK = [];
postcss.parse(buildCSS({ prefix: PREFIX })).walkRules((r) => {
  if (r.parent?.type === "atrule" && r.parent.name === "media") { r.walkDecls((d) => AUTO.push(d.prop + ":" + d.value)); return; }
  if (r.selector.trim() === '[data-theme="dark"]') r.walkDecls((d) => DARK.push(d.prop + ":" + d.value));
  const sel = r.selector.replace(/\s+/g, " ").trim(); if (!TOKEN_SELECTOR.test(sel)) throw new Error("生成了意外的选择器 " + sel);
  r.walkDecls((d) => { if (d.prop.startsWith("--")) gen.push({ selector: sel.replace(/, ?/g, ", "), name: d.prop, value: d.value, order: order++ }); });
});

let bad = 0, n = 0;
for (const theme of ["light", "dark"]) for (const density of [null, "compact", "comfortable"]) for (const radius of [null, "6", "8", "10", "pill"]) {
  const ctx = { theme, density, radius }, a = effective(base, ctx), b = effective(gen, ctx, PREFIX);
  // 有意的改动：没设 data-radius 时按钮圆角取胶囊的值（改造前默认 8px，和设计稿默认的胶囊不一样）。
  // 生成的选择器 :root:not([data-radius]) 权重比 :root 高，浏览器里也是它赢（这里按先后算，结果一样）
  if (!radius) a.set("--btn-r", effective(base, { ...ctx, radius: "pill" }).get("--btn-r"));
  for (const k of new Set([...a.keys(), ...b.keys()])) { n++; if (a.get(k) !== b.get(k)) { bad++; if (bad <= 20) console.log(`  ✗ ${theme}/${density || "-"}/${radius || "-"} ${k}: ${a.get(k)} → ${b.get(k)}`); } }
}
if (AUTO.join("\n") !== DARK.join("\n")) { bad++; console.log("  ✗ 跟系统深浅的那一块和深色块不一样"); }
console.log(`令牌比对：基线 ${base.length} 条声明、生成 ${gen.length} 条；30 种组合共 ${n} 次取值，${bad ? bad + " 处不同" : "全部一致"}（前缀 "${PREFIX}"）`);
process.exitCode = bad ? 1 : 0; // 生成的条数会多：局部主题要在深浅两个主题块里重复声明派生令牌（根元素上的取值不变）
