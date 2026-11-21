// 天生不确定的区块（基线自己跑几遍都不一样：Worker 加载快慢、媒体解码、浏览器缓冲、悬停的合成鼠标事件……）怎么判：
// 基线跑多遍，改造后的每一个动作都要和基线某一遍的同一个动作一致（用和 trace-compare.mjs 一样的逐帧比法、一样的容差），
// 结束快照、页面报错也要和某一遍一致。也就是说：改造后的表现必须是基线自己出现过的表现之一，没出现过的照样算差异。
// 用法：node scripts/parity/trace-any.mjs --base 目录1,目录2,… --cur 目录 [--only id,id] [--max 8] [--out 报告.json]
import fs from "node:fs";
import path from "node:path";
import { arg } from "./lib.mjs";
import { load, compareAction, compareFinal } from "./trace-lib.mjs";

const BASES = String(arg("base", "")).split(",").filter(Boolean).map((p) => path.resolve(p));
const CUR = path.resolve(arg("cur", "")), ONLY = arg("only", ""), MAX = +arg("max", 8), OUTF = arg("out", "");
if (BASES.length < 2 || !fs.existsSync(CUR)) { console.log("用法：--base 目录1,目录2,… --cur 目录"); process.exit(2); }
const hard = (list) => list.filter((x) => !x.startsWith("~"));
const report = {}; let okN = 0, total = 0;
for (const sub of fs.readdirSync(CUR).filter((d) => fs.statSync(path.join(CUR, d)).isDirectory())) {
  for (const f of fs.readdirSync(path.join(CUR, sub)).filter((x) => x.endsWith(".json.gz"))) {
    const id = f.replace(".json.gz", ""); if (ONLY && !ONLY.split(",").includes(id)) continue;
    const runs = BASES.map((b) => path.join(b, sub, f)).filter((p) => fs.existsSync(p)).map(load);
    if (runs.length < 2) continue;
    total++;
    const c = load(path.join(CUR, sub, f)), out = [];
    const sameTrig = (r) => r.triggers.length === c.triggers.length && r.triggers.every((t, i) => t.path === c.triggers[i].path);
    const cand = runs.filter((r) => sameTrig(r) && r.actions.length === c.actions.length);
    if (!cand.length) { out.push(`触发器 / 动作列表和基线哪一遍都不一样（改造后 ${c.triggers.length} 个触发器、${c.actions.length} 个动作）`); report[`${sub}/${id}`] = out; continue; }
    const used = new Map();
    for (let i = 0; i < c.actions.length; i++) {
      const y = c.actions[i], label = `#${i} ${y.name} ${y.path.split(">").slice(-3).join(">")}`;
      if (y.name === "skip") continue;
      let best = null;
      for (let j = 0; j < cand.length; j++) {
        const d = hard(compareAction(cand[j].actions[i], y, label));
        if (!d.length) { best = null; used.set(j, (used.get(j) || 0) + 1); break; }
        if (!best || d.length < best.length) best = d;
      }
      if (best) out.push(`${label}：和基线 ${cand.length} 遍里哪一遍都对不上，最接近的一遍差：${best.slice(0, 3).join("；").slice(0, 400)}`);
    }
    if (!cand.some((r) => !hard(compareFinal(r, c)).length)) out.push(`结束快照和基线哪一遍都不一样：${hard(compareFinal(cand[0], c)).slice(0, 3).join("；").slice(0, 300)}`);
    if (!cand.some((r) => JSON.stringify(r.errors) === JSON.stringify(c.errors))) out.push(`页面报错和基线哪一遍都不一样：${JSON.stringify(c.errors).slice(0, 200)}`);
    if (out.length) report[`${sub}/${id}`] = out; else okN++;
  }
}
console.log(`逐帧轨迹（和基线 ${BASES.length} 遍里某一遍一致）：${okN}/${total} 个区块通过`);
for (const [k, v] of Object.entries(report)) { console.log(`  ✗ ${k}  ${v.length} 处`); for (const x of v.slice(0, MAX)) console.log(`      ${x.slice(0, 400)}`); }
if (OUTF) fs.writeFileSync(OUTF, JSON.stringify(report, null, 1));
process.exitCode = Object.keys(report).length ? 1 : 0;
