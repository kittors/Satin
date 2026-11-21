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
const report = { pixels: [], dom: [], missing: [], ok: 0, total: 0, domOk: 0, domTotal: 0, expected: [] };
// 预期差异（scripts/parity/expected.json，docs/differences.md 里写过原因的改进）：只放过登记的文件里登记的那一块——
// 截图给 box 就只不比框里的像素（框外照样逐像素比），DOM 给 paths（路径前缀）或 ids / classes（它自己或上级带这个 id、类名）就只不比这些元素上的差异；别的照样算不一致
const EXPECT = (() => { try { return JSON.parse(fs.readFileSync(new URL("./expected.json", import.meta.url), "utf8")); } catch { return []; } })();
const globRe = (pat) => new RegExp("^" + pat.split("*").map((x) => x.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join("[^/]*") + "$");
// 一个文件可能同时命中好几条登记（手机上的通知容器 + 横幅的文字）：全部算上
const expectAll = (kind, f) => { const out = []; for (const e of EXPECT) for (const it of e[kind] || []) if (globRe(it.match).test(f)) out.push({ ...it, id: e.id, reason: e.reason }); return out; };

for (const f of files(A, ".png")) {
  report.total++;
  const pb = path.join(B, f); if (!fs.existsSync(pb)) { report.missing.push(f); continue; }
  const a = fs.readFileSync(path.join(A, f)), b = fs.readFileSync(pb);
  if (a.equals(b)) { report.ok++; continue; }
  const ia = PNG.sync.read(a), ib = PNG.sync.read(b);
  if (ia.width !== ib.width || ia.height !== ib.height) {
    // 登记了 appended（新内容接在某个元素的末尾，比如对话一节新加的"新对话"演示，页面变高）：只比这个元素在改造前的底边以上那一段，逐像素
    const ap = expectAll("shots", f).find((e) => e.appended), snapB = ap && path.join(B, f.replace(/\.png$/, ".json.gz"));
    const el = snapB && fs.existsSync(snapB) ? JSON.parse(zlib.gunzipSync(fs.readFileSync(snapB)))[ap.appended] : null;
    if (ap && el && ia.width === ib.width && !String(el.rect[0]).startsWith("~")) {
      const lim = Math.min(Math.floor(el.rect[1] + el.rect[3]), ia.height, ib.height); let n = 0;
      for (let y = 0; y < lim; y++) for (let x = 0; x < ia.width; x++) { const i = (y * ia.width + x) * 4; if (ia.data[i] !== ib.data[i] || ia.data[i + 1] !== ib.data[i + 1] || ia.data[i + 2] !== ib.data[i + 2] || ia.data[i + 3] !== ib.data[i + 3]) n++; }
      if (!n) { report.expected.push({ f, id: ap.id, n: 0, note: `只比到 y=${lim}（下面是新加的内容）` }); report.ok++; continue; }
      report.pixels.push({ f, n, note: `原有部分（y < ${lim}）就有 ${n} 个像素不同` }); continue;
    }
    report.pixels.push({ f, size: `${ia.width}×${ia.height} → ${ib.width}×${ib.height}` }); continue;
  }
  const diff = new PNG({ width: ia.width, height: ia.height });
  const n = pixelmatch(ia.data, ib.data, diff.data, ia.width, ia.height, { threshold: 0, includeAA: true, alpha: 0.3 });
  if (n === 0) { report.ok++; continue; } // 编码不同、像素相同
  const exs = expectAll("shots", f);
  if (exs.length) {
    // 登记过的：框外还有不同的像素就照样算不一致；整张都登记了（没给 box）只认登记过的文件
    let outside = 0; const whole = exs.some((e) => !e.box), inBox = (x, y) => exs.some((e) => e.box && x >= e.box[0] && x <= e.box[2] && y >= e.box[1] && y <= e.box[3]);
    const ex = { id: [...new Set(exs.map((e) => e.id))].join("、") };
    if (!whole) for (let y = 0; y < ia.height; y++) for (let x = 0; x < ia.width; x++) { if (inBox(x, y)) continue; const i = (y * ia.width + x) * 4; if (ia.data[i] !== ib.data[i] || ia.data[i + 1] !== ib.data[i + 1] || ia.data[i + 2] !== ib.data[i + 2] || ia.data[i + 3] !== ib.data[i + 3]) outside++; }
    if (!outside) { report.expected.push({ f, id: ex.id, n }); report.ok++; continue; }
  }
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
  const diffs = [], exds = expectAll("dom", f); let skipped = 0;
  const exd = { id: [...new Set(exds.map((e) => e.id))].join("、"), paths: exds.flatMap((e) => e.paths || []), ids: exds.flatMap((e) => e.ids || []), classes: exds.flatMap((e) => e.classes || []) };
  // 登记过的元素（paths 路径前缀，或者 ids / classes：它自己或上级带这个 id、类名）上的差异不算
  const marked = (snap, p) => { const seg = p.split(">"); for (let i = seg.length; i > 0; i--) { const at = snap[seg.slice(0, i).join(">")]?.attrs; if (!at) continue; if (exd.ids.includes(at.id)) return true; if (exd.classes.some((c) => String(at.class || "").split(/\s+/).includes(c))) return true; } return false; };
  const skip = (p) => exds.length > 0 && (exd.paths.some((pre) => p.startsWith(pre)) || marked(sa, p) || marked(sb, p));
  const appended = exds.map((e) => e.appended).filter(Boolean); // 新内容接在这些元素末尾：新节点、它自己变高不算
  const isNew = (p) => appended.some((pre) => p.startsWith(pre + ">")) && !sb[p];
  for (const p of Object.keys(sa)) {
    const a = sa[p], b = sb[p];
    if (isNew(p)) { skipped++; continue; }
    // 新内容自己挂到 body 上的辅助节点（输入框自动长高用的量字节点这类）：只在新的一边有、挂在 body 下面的不算
    if (appended.length && !b && p.startsWith("html>body>") && !sb[p.split(">").slice(0, 3).join(">")] && !appended.some((pre) => p.startsWith(pre))) { skipped++; continue; }
    // 新内容接在页面中间、页面变高：挂在页面末尾的浮层实体（提示、弹层，平时停在文档底下）只是跟着往下挪——只差竖直位置的不算
    if (appended.length && b && !appended.some((pre) => p.startsWith(pre)) && a.tag === b.tag && a.text === b.text && Array.isArray(a.rect) && Array.isArray(b.rect) && !String(a.rect[0]).startsWith("~")
      && [0, 2, 3].every((i) => Math.abs(a.rect[i] - b.rect[i]) <= 0.02) && Math.abs(a.rect[1] - b.rect[1]) > 0.01) {
      const st = []; cmpObj(a.style, b.style, "", st); const at = []; cmpObj(a.attrs, b.attrs, "", at);
      if (!at.length && st.every((x) => /^(top|bottom):/.test(x))) { skipped++; continue; }
    }
    if (appended.includes(p) && b) { const keep = []; if (a.tag !== b.tag) keep.push(`${p}: 标签 ${a.tag} → ${b.tag}`); cmpObj(a.attrs, b.attrs, `${p} @`, keep); diffs.push(...keep); skipped++; continue; }
    if (skip(p)) { const one = []; if (!b) one.push(1); else { cmpObj(a.attrs, b.attrs, "", one); cmpObj(a.style, b.style, "", one); if (a.text !== b.text || String(a.rect) !== String(b.rect)) one.push(1); } skipped += one.length; continue; }
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
  for (const p of Object.keys(sb)) if (!sa[p]) { if (skip(p)) skipped++; else diffs.push(`${p}: 只在 B 里有（${sb[p].tag}）`); }
  if (skipped) report.expected.push({ f, id: exd.id, n: skipped });
  if (diffs.length) report.dom.push({ f, n: diffs.length, first: diffs.slice(0, MAX) }); else report.domOk++;
}

ensureDir(OUT); fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 1));
console.log(`截图：${report.ok}/${report.total} 一致；DOM 快照：${report.domOk}/${report.domTotal} 一致；缺 ${report.missing.length}`);
if (report.expected.length) console.log(`  其中预期差异（scripts/parity/expected.json 登记过、docs/differences.md 写了原因）：${[...new Set(report.expected.flatMap((e) => e.id.split("、")))].join("、")}，${report.expected.length} 个文件`);
if (!QUIET) {
  for (const p of report.pixels) console.log(`  ✗ 像素 ${p.f}  ${p.size || `${p.n} 个像素不同，范围 ${p.box}`}`);
  for (const d of report.dom) { console.log(`  ✗ DOM ${d.f}  ${d.n} 处`); for (const x of d.first.slice(0, 6)) console.log(`      ${x.slice(0, 260)}`); }
  for (const m of report.missing.slice(0, 20)) console.log(`  ✗ 缺 ${m}`);
}
process.exitCode = report.pixels.length || report.dom.length || report.missing.length ? 1 : 0;
