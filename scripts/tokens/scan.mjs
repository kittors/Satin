// 扫出现有样式表里的全局令牌：:root、:root,[data-theme="light"]、[data-theme="dark"]、[data-density=…]、[data-radius=…] 这几类选择器上声明的 CSS 变量
// 返回 [{ file, selector, name, value, order }]（按样式表在页面里的引入顺序、声明顺序）
import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";

export const TOKEN_SELECTOR = /^(:root|:root, ?\[data-theme="light"\]|\[data-theme="(light|dark)"\]|\[data-density="[\w-]+"\]|\[data-radius="[\w-]+"\]|:root:not\(\[data-radius\]\), ?\[data-radius="pill"\])$/;
export function scan(root, files) {
  const out = []; let order = 0;
  for (const f of files) {
    const css = fs.readFileSync(path.join(root, f), "utf8");
    postcss.parse(css).walkRules((r) => {
      if (r.parent.type !== "root") return; // @media / @supports 里的不算全局令牌
      const sel = r.selector.replace(/\s+/g, " ").trim();
      if (!TOKEN_SELECTOR.test(sel)) return;
      r.walkDecls((d) => { if (d.prop.startsWith("--")) out.push({ file: f, selector: sel.replace(/, ?/g, ", "), name: d.prop, value: d.value.replace(/\s+/g, " ").trim(), order: order++ }); });
    });
  }
  return out;
}
// 展示页 index.html 里样式表的引入顺序
export function cssOrder(root) { return [...fs.readFileSync(path.join(root, "index.html"), "utf8").matchAll(/<link rel="stylesheet" href="([\w.-]+\.css)">/g)].map((m) => m[1]); }
if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.argv[2] || process.cwd(), list = scan(root, cssOrder(root));
  const bySel = {}; for (const t of list) (bySel[t.selector] ||= []).push(t);
  for (const [s, ts] of Object.entries(bySel)) console.log(s, ts.length, [...new Set(ts.map((t) => t.file))].join(","));
  const dup = new Map(); for (const t of list) { const k = t.selector + " " + t.name; dup.set(k, (dup.get(k) || 0) + 1); }
  console.log("重复声明：", [...dup].filter(([, n]) => n > 1).map(([k]) => k));
  if (process.argv.includes("--names")) for (const t of list) console.log(t.selector.padEnd(30), t.name.padEnd(24), t.value.slice(0, 90));
}
