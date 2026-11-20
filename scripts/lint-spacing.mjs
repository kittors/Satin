#!/usr/bin/env node
// 间距检查：padding、margin、gap 里的 px 值必须在间距刻度上。
// 刻度：0 2 4 6 8 10 12 14 16 20 24 28 32 40 48 64 80
//   16 以下每 2px 一档，只在控件内部用（图标和字之间、控件内边距）；再往上逐级放大，用在组件之间、区块之间。
// 例外：1px（细线对齐）；或者在这一行写 /* sp-ok: 原因 */（比如为了字在框里视觉居中的半像素微调）。
// 定位（top、left、inset……）和尺寸（width、height）不归它管。
// 用法：node scripts/lint-spacing.mjs          列出不在刻度上的值，有就以 1 退出
//       node scripts/lint-spacing.mjs --json   输出 JSON
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const SCALE = [0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 64, 80];
const allowed = (v) => v === 1 || SCALE.includes(v);
const nearest = (v) => SCALE.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));
const PROP = /(?<![-\w])((?:padding|margin)(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?|gap|row-gap|column-gap)\s*:\s*([^;}]+)/g;

const found = [];
for (const file of readdirSync(root).filter((f) => f.endsWith(".css")).sort()) {
  readFileSync(join(root, file), "utf8").split("\n").forEach((line, i) => {
    if (line.includes("sp-ok")) return;
    for (const m of line.matchAll(PROP)) {
      for (const n of m[2].matchAll(/(-?\d*\.?\d+)px/g)) {
        const v = Math.abs(parseFloat(n[1]));
        if (!allowed(v)) found.push({ file, line: i + 1, prop: m[1], value: v, nearest: nearest(v), text: m[0].trim() });
      }
    }
  });
}

if (process.argv.includes("--json")) console.log(JSON.stringify(found, null, 2));
else if (!found.length) console.log("间距都在刻度上。");
else {
  for (const f of found) console.log(`${f.file}:${f.line}  ${f.prop}: ${f.value}px  → 最近的刻度 ${f.nearest}px    ${f.text}`);
  console.log(`\n共 ${found.length} 处不在刻度上（刻度：${SCALE.join(" ")}）。`);
}
process.exitCode = found.length ? 1 : 0;
