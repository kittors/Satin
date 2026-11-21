// 比较两次逐帧轨迹（trace.mjs 的结果）。每个区块逐个动作比：
// · 动画：类型、目标（按角色路径）、属性、关键帧、时长、延迟、曲线、次数、方向、填充完全一样；起始帧差 ≤ 1
// · DOM 变化：属性新值（类名去前缀、变量名去前缀）、增删节点、文字，一一对上；内联 style 只比写了哪些属性和这个动作结束时的值
// · 逐帧状态：被改动 / 在动画的元素，每个变化时刻的位置、尺寸（≤ 0.5px）、透明度（≤ 0.01）、transform（平移 ≤ 0.5px，缩放旋转 ≤ 0.005），
//   允许前后差 1 帧；运动持续的帧数差 ≤ 1
// · 结束时的 DOM 快照、页面报错
// 用法：node scripts/parity/trace-compare.mjs A目录 B目录 [--max 12]
import fs from "node:fs";
import path from "node:path";
import { arg } from "./lib.mjs";
import { load, compareAction, compareFinal } from "./trace-lib.mjs";

const [A, B] = process.argv.slice(2).filter((x) => !x.startsWith("--")).slice(0, 2).map((p) => path.resolve(p));
const MAX = +arg("max", 12), OUTF = arg("out", "");

const report = {}; let okN = 0, total = 0;
for (const sub of fs.readdirSync(A).filter((d) => fs.statSync(path.join(A, d)).isDirectory())) {
  for (const f of fs.readdirSync(path.join(A, sub)).filter((x) => x.endsWith(".json.gz"))) {
    total++;
    const key = `${sub}/${f.replace(".json.gz", "")}`, out = [], fb = path.join(B, sub, f);
    if (!fs.existsSync(fb)) { report[key] = ["B 里没有"]; continue; }
    const a = load(path.join(A, sub, f)), b = load(fb);
    if (a.triggers.length !== b.triggers.length || a.triggers.some((t, i) => t.path !== b.triggers[i].path)) out.push(`触发器列表不同：${a.triggers.length} → ${b.triggers.length}`);
    const n = Math.min(a.actions.length, b.actions.length); if (a.actions.length !== b.actions.length) out.push(`动作数 ${a.actions.length} → ${b.actions.length}`);
    for (let i = 0; i < n; i++) {
      const x = a.actions[i], y = b.actions[i], label = `#${i} ${x.name} ${x.path.split(">").slice(-3).join(">")}`;
      const d = compareAction(x, y, label, a.id ?? f.replace(".json.gz", "")); out.push(...d);
      if (d.some((s) => s.includes("动作对不上"))) break;
    }
    out.push(...compareFinal(a, b));
    if (JSON.stringify(a.errors) !== JSON.stringify(b.errors)) out.push(`页面报错：${JSON.stringify(a.errors).slice(0, 200)} → ${JSON.stringify(b.errors).slice(0, 200)}`);
    const hard = out.filter((x) => !x.startsWith("~"));
    if (hard.length) report[key] = out; else okN++;
  }
}
console.log(`逐帧轨迹：${okN}/${total} 个区块一致`);
for (const [k, v] of Object.entries(report)) { const hard = v.filter((x) => !x.startsWith("~")); console.log(`  ✗ ${k}  ${hard.length} 处`); for (const x of hard.slice(0, MAX)) console.log(`      ${x.slice(0, 300)}`); }
if (OUTF) fs.writeFileSync(OUTF, JSON.stringify(report, null, 1));
process.exitCode = Object.keys(report).length ? 1 : 0;
