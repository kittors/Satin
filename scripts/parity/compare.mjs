// 比较两次静态采集：截图逐像素（0 差异才算过）、DOM 快照（标签、属性、文字、位置尺寸、计算样式）逐项。
// 用法：node scripts/parity/compare.mjs A目录 B目录 [--out 目录] [--max 20]
// 结果：终端汇总；out/report.json；有差异的截图在 out/diff/ 下各存一张差异图（红点是不同的像素）
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { arg, ensureDir } from "./lib.mjs";

const [A, B] = process.argv.slice(2).filter((x) => !x.startsWith("--")).slice(0, 2).map((p) => path.resolve(p));
const OUT = path.resolve(arg("out", path.join(path.dirname(B), "diff-" + path.basename(B)))), MAX = +arg("max", 20), QUIET = arg("quiet", false);
const files = (d, ext) => { const out = []; const rec = (p) => { for (const f of fs.readdirSync(p, { withFileTypes: true })) { const q = path.join(p, f.name); if (f.isDirectory()) rec(q); else if (q.endsWith(ext)) out.push(path.relative(d, q)); } }; if (fs.existsSync(d)) rec(d); return out.sort(); };
const report = { pixels: [], dom: [], missing: [], ok: 0, total: 0, domOk: 0, domTotal: 0 };

for (const f of files(A, ".png")) {
  report.total++;
  const pb = path.join(B, f); if (!fs.existsSync(pb)) { report.missing.push(f); continue; }
  const a = fs.readFileSync(path.join(A, f)), b = fs.readFileSync(pb);
  if (a.equals(b)) { report.ok++; continue; }
  const ia = PNG.sync.read(a), ib = PNG.sync.read(b);
  if (ia.width !== ib.width || ia.height !== ib.height) { report.pixels.push({ f, size: `${ia.width}×${ia.height} → ${ib.width}×${ib.height}` }); continue; }
  const diff = new PNG({ width: ia.width, height: ia.height });
  const n = pixelmatch(ia.data, ib.data, diff.data, ia.width, ia.height, { threshold: 0, includeAA: true, alpha: 0.3 });
  if (n === 0) { report.ok++; continue; } // 编码不同、像素相同
  // 差异的外框，方便定位
  let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
  for (let y = 0; y < ia.height; y++) for (let x = 0; x < ia.width; x++) { const i = (y * ia.width + x) * 4; if (ia.data[i] !== ib.data[i] || ia.data[i + 1] !== ib.data[i + 1] || ia.data[i + 2] !== ib.data[i + 2] || ia.data[i + 3] !== ib.data[i + 3]) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; } }
  const out = path.join(ensureDir(path.join(OUT, "diff", path.dirname(f))), path.basename(f));
  fs.writeFileSync(out, PNG.sync.write(diff));
  report.pixels.push({ f, n, box: [x0, y0, x1, y1] });
}

// DOM 快照：按路径对齐
const cmpObj = (pa, pb, pfx, list) => { for (const k of new Set([...Object.keys(pa || {}), ...Object.keys(pb || {})])) if ((pa || {})[k] !== (pb || {})[k]) list.push(`${pfx}${k}: ${JSON.stringify((pa || {})[k])} → ${JSON.stringify((pb || {})[k])}`); };
for (const f of files(A, ".json.gz")) {
  report.domTotal++;
  const pb = path.join(B, f); if (!fs.existsSync(pb)) { report.missing.push(f); continue; }
  const sa = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(A, f)))), sb = JSON.parse(zlib.gunzipSync(fs.readFileSync(pb)));
  const diffs = [];
  for (const p of Object.keys(sa)) {
    const a = sa[p], b = sb[p];
    if (!b) { diffs.push(`${p}: 只在 A 里有（${a.tag}）`); continue; }
    if (a.tag !== b.tag) diffs.push(`${p}: 标签 ${a.tag} → ${b.tag}`);
    if (a.text !== b.text) diffs.push(`${p}: 文字 ${JSON.stringify(a.text)} → ${JSON.stringify(b.text)}`);
    if (a.value !== b.value) diffs.push(`${p}: 值 ${JSON.stringify(a.value)} → ${JSON.stringify(b.value)}`);
    if (String(a.scroll) !== String(b.scroll)) diffs.push(`${p}: 滚动 ${a.scroll} → ${b.scroll}`);
    if (String(a.rect[0]).startsWith("~") || String(b.rect[0]).startsWith("~") ? String(a.rect) !== String(b.rect) : a.rect.some((v, i) => Math.abs(v - b.rect[i]) > 0.01)) diffs.push(`${p}: 位置尺寸 ${a.rect} → ${b.rect}`);
    cmpObj(a.attrs, b.attrs, `${p} @`, diffs);
    if (!!a.nobox !== !!b.nobox) diffs.push(`${p}: ${a.nobox ? "不画" : "画出来"} → ${b.nobox ? "不画" : "画出来"}`);
    else if (a.style || b.style) cmpObj(a.style, b.style, `${p} 样式 `, diffs);
    for (const ps of ["before", "after"]) if (a[ps] || b[ps]) { if (!a[ps] || !b[ps]) diffs.push(`${p}::${ps}: ${a[ps] ? "有" : "无"} → ${b[ps] ? "有" : "无"}`); else cmpObj(a[ps], b[ps], `${p}::${ps} `, diffs); }
  }
  for (const p of Object.keys(sb)) if (!sa[p]) diffs.push(`${p}: 只在 B 里有（${sb[p].tag}）`);
  if (diffs.length) report.dom.push({ f, n: diffs.length, first: diffs.slice(0, MAX) }); else report.domOk++;
}

ensureDir(OUT); fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 1));
console.log(`截图：${report.ok}/${report.total} 一致；DOM 快照：${report.domOk}/${report.domTotal} 一致；缺 ${report.missing.length}`);
if (!QUIET) {
  for (const p of report.pixels) console.log(`  ✗ 像素 ${p.f}  ${p.size || `${p.n} 个像素不同，范围 ${p.box}`}`);
  for (const d of report.dom) { console.log(`  ✗ DOM ${d.f}  ${d.n} 处`); for (const x of d.first.slice(0, 6)) console.log(`      ${x.slice(0, 260)}`); }
  for (const m of report.missing.slice(0, 20)) console.log(`  ✗ 缺 ${m}`);
}
process.exitCode = report.pixels.length || report.dom.length || report.missing.length ? 1 : 0;
