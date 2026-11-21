// 把评测打分（/tmp/satin-eval/<批次>/_scores.json）和人工看图的分（eval/manual-scores.json）汇总成 eval/results.md 里的一节。
// 用法：node scripts/eval/report.mjs --batch b1 [--title "第 1 轮：技能 v1"] [--append]
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : d; };
const BATCH = arg("batch", "b1"), TITLE = arg("title", BATCH);
const scores = JSON.parse(fs.readFileSync(path.join("/tmp/satin-eval", BATCH, "_scores.json"), "utf8"));
const MF = path.join(ROOT, "eval/manual-scores.json");
const manual = fs.existsSync(MF) ? JSON.parse(fs.readFileSync(MF, "utf8")) : {};
const TASKS = JSON.parse(fs.readFileSync(path.join(ROOT, "eval/tasks.json"), "utf8")).tasks;
const key = (s) => `${BATCH}/${s.model}/${s.cond}/${s.fw}/${s.task}`;
const n = (v) => (typeof v === "number" && v >= 0 ? v : null);
const avg = (xs) => { const v = xs.filter((x) => x != null); return v.length ? (v.reduce((a, b) => a + b, 0) / v.length) : null; };
const f1 = (v) => (v == null ? "—" : (Math.round(v * 10) / 10).toString());
const pct = (a, b) => (b ? Math.round((a / b) * 100) + "%" : "—");

let md = `\n## ${TITLE}\n\n`;
const models = [...new Set(scores.map((s) => s.model))];
for (const model of models) {
  const S = scores.filter((s) => s.model === model);
  // 有 CLI 那一组（先 satin init 起项目）就多一列
  const hasCli = S.some((s) => s.cond === "cli"), conds = hasCli ? ["without", "with", "cli"] : ["without", "with"];
  md += `### ${model.replace(/_/g, "/")}\n\n| 指标 | 没有技能 | 有 Satin 技能 |${hasCli ? " 用 CLI 起项目 |" : ""}\n|---|---|---|${hasCli ? "---|" : ""}\n`;
  const by = (cond) => S.filter((s) => s.cond === cond);
  const row = (label, fn) => (md += `| ${label} | ${conds.map((c) => fn(by(c))).join(" | ")} |\n`);
  row("份数", (x) => String(x.length));
  row("跑完（没超时）", (x) => pct(x.filter((s) => !s.done?.timeout).length, x.length));
  row("构建 / 打开成功", (x) => pct(x.filter((s) => s.build?.ok).length, x.length));
  row("0 报错（载入 + 交互）", (x) => pct(x.filter((s) => s.build?.ok && !s.errors.length && !s.interact.length).length, x.length));
  row("平均报错条数", (x) => f1(avg(x.map((s) => (s.build?.ok ? s.errors.length + s.interact.length : null)))));
  row("检查器 · 源码 error（平均）", (x) => f1(avg(x.map((s) => n(s.check?.static?.error)))));
  row("检查器 · 页面 error（平均）", (x) => f1(avg(x.map((s) => n(s.check?.dom?.error)))));
  row("检查器 · 页面 warn（平均）", (x) => f1(avg(x.map((s) => n(s.check?.dom?.warn)))));
  row("检查器 error 为 0 的份数", (x) => pct(x.filter((s) => s.build?.ok && n(s.check?.static?.error) === 0 && n(s.check?.dom?.error) === 0).length, x.length));
  row("人工看图（1–5，浅 / 深 / 手机）", (x) => f1(avg(x.map((s) => manual[key(s)]?.score ?? null))));
  row("平均用时（分钟）", (x) => f1(avg(x.map((s) => (s.done?.ms ? s.done.ms / 60000 : null)))));
  md += `\n| 需求 | 框架 | 没有技能：构建 / 报错 / 检查器 src·页面 / 看图 | 有技能：构建 / 报错 / 检查器 src·页面 / 看图 |\n|---|---|---|---|\n`;
  const cell = (s) => (!s ? "没做" : `${s.build?.ok ? "✓" : "✗"} / ${s.build?.ok ? s.errors.length + s.interact.length : "—"} / ${s.check?.static?.error ?? "—"}·${s.check?.dom?.error ?? "—"} / ${manual[key(s)]?.score ?? "—"}`);
  for (const t of TASKS) for (const fw of ["react", "vue", "html"]) {
    const a = S.find((s) => s.task === t.id && s.fw === fw && s.cond === "without"), b = S.find((s) => s.task === t.id && s.fw === fw && s.cond === "with");
    if (!a && !b) continue;
    md += `| ${t.title} | ${fw} | ${cell(a)} | ${cell(b)} |\n`;
  }
  const notes = S.map((s) => manual[key(s)]?.note && `- ${s.cond === "with" ? "有技能" : s.cond === "cli" ? "CLI 起项目" : "没有技能"} · ${s.fw} · ${s.task}：${manual[key(s)].note}`).filter(Boolean);
  if (notes.length) md += `\n看图记录：\n${notes.join("\n")}\n`;
  md += "\n";
}
const out = path.join(ROOT, "eval/results.md");
if (process.argv.includes("--append") && fs.existsSync(out)) fs.appendFileSync(out, md);
else fs.writeFileSync(out, (fs.existsSync(out) ? fs.readFileSync(out, "utf8").split("\n## ")[0].trimEnd() + "\n" : "# AI 评测结果\n") + md);
console.log(`写进 ${path.relative(ROOT, out)}：${TITLE}`);
