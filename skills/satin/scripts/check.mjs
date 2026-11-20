#!/usr/bin/env node
// Satin 去 AI 味检查器。规则见 spec/rules/anti-ai.json（技能里带了一份快照），每条都给"照着做就能改好"的修法。
//
// 用法：
//   node check.mjs static <目录或文件...>   扫源码：写死的颜色 / 间距 / 字号、渐变、彩色投影、动布局属性、曲线时长、AI 图标和 emoji、营销腔、假数据、去掉焦点框
//   node check.mjs dom <URL>               在浏览器里量页面（深浅 × 1440 / 768 / 390）：渐变、彩色投影、毛玻璃、卡片套卡片、KPI 大字卡、彩色徽章、
//                                          导航选中样式、装饰分隔线、遮挡、浮层被裁、按钮换行和横向溢出、对比度、触控尺寸；截图存到 --out（默认 /tmp/satin-check）
// 选项：--json 输出机器可读结果；--max N 每条规则最多列 N 处（默认 20）；--widths 1440,768,390；--themes light,dark；--no-floats 不点浮层
// 退出码：有"必须改"（error）的违规时为 1
import path from "node:path";
import { runStatic } from "./lib/static.mjs";
import { rules, title } from "./lib/rules.mjs";

const argv = process.argv.slice(2), mode = argv[0];
const opt = (k, d) => { const i = argv.indexOf("--" + k); if (i < 0) return d; const v = argv[i + 1]; return v && !v.startsWith("--") ? v : true; };
const targets = argv.slice(1).filter((a, i, all) => !a.startsWith("--") && !(i > 0 && all[i - 1].startsWith("--") && !["--json", "--no-floats"].includes(all[i - 1])));
if (!["static", "dom"].includes(mode) || !targets.length) {
  console.log("用法：node check.mjs static <目录或文件...>  |  node check.mjs dom <URL> [--out 目录]   （加 --json 输出 JSON）");
  process.exit(2);
}

let result;
if (mode === "static") result = { mode, ...runStatic(targets) };
else {
  const { runDom } = await import("./lib/dom.mjs");
  result = { mode, ...(await runDom(targets[0], { out: opt("out", "/tmp/satin-check"), widths: String(opt("widths", "1440,768,390")).split(",").map(Number), themes: String(opt("themes", "light,dark")).split(","), floats: !argv.includes("--no-floats") })) };
}
const F = result.findings, errors = F.filter((f) => f.severity === "error").length, warns = F.length - errors;
const byRule = {}; for (const f of F) (byRule[f.rule] ||= []).push(f);
result.counts = { error: errors, warn: warns, byRule: Object.fromEntries(Object.entries(byRule).map(([k, v]) => [k, v.length])) };

if (argv.includes("--json")) console.log(JSON.stringify(result, null, 1));
else {
  const max = +opt("max", 20), order = Object.keys(rules()).filter((k) => !k.startsWith("__"));
  console.log(`Satin 去 AI 味检查（${mode === "static" ? `源码 ${result.files} 个文件` : `页面 ${targets[0]}`}）\n`);
  for (const id of order) {
    const list = byRule[id]; if (!list) continue;
    console.log(`${list[0].severity === "error" ? "✗ 必须改" : "△ 建议改"}  ${title(id)}（${id}）${list.length} 处`);
    for (const f of list.slice(0, max)) console.log(`   ${f.where}  ${f.problem}\n      → ${f.fix}`);
    if (list.length > max) console.log(`   …还有 ${list.length - max} 处（--max 调大看全部，或 --json）`);
    console.log("");
  }
  for (const [id, list] of Object.entries(byRule)) if (!order.includes(id)) { console.log(`△ ${id} ${list.length} 处`); for (const f of list.slice(0, max)) console.log(`   ${f.where}  ${f.problem}\n      → ${f.fix}`); console.log(""); }
  if (result.shots?.length) console.log(`截图：${path.dirname(result.shots[0])}（${result.shots.length} 张，深浅 × 宽度）`);
  console.log(F.length ? `合计：必须改 ${errors} 处，建议改 ${warns} 处` : "没有发现问题");
}
process.exitCode = errors ? 1 : 0;
