// 评测的"不开浏览器"那一半：每一份构建一下（React / Vue）、跑检查器的源码模式，按规则统计；浏览器那一半（截图、报错、页面检查）在 score.mjs。
// 用法：node scripts/eval/static-score.mjs --batch b1   → 打印汇总，写 /tmp/satin-eval/<批次>/_static.json
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "../..");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : d; };
const BATCH = arg("batch", "b1"), BASE = path.join("/tmp/satin-eval", BATCH), CHECK = path.join(ROOT, "skills/satin/scripts/check.mjs");
const out = [];
for (const model of fs.readdirSync(BASE).filter((d) => !d.startsWith("_"))) for (const cond of ["without", "with"]) for (const fw of ["react", "vue", "html"]) {
  const d0 = path.join(BASE, model, cond, fw); if (!fs.existsSync(d0)) continue;
  for (const task of fs.readdirSync(d0)) {
    const dir = path.join(d0, task); if (!fs.existsSync(path.join(dir, "_done.json"))) continue;
    const done = JSON.parse(fs.readFileSync(path.join(dir, "_done.json"), "utf8"));
    let build = { ok: fs.existsSync(path.join(dir, "index.html")) };
    if (fw !== "html") { const b = spawnSync("npx", ["vite", "build", "--logLevel", "error"], { cwd: dir, encoding: "utf8", timeout: 180000 }); build = { ok: b.status === 0, log: ((b.stdout || "") + (b.stderr || "")).split("\n").filter((l) => /error|Error/.test(l)).slice(0, 3).join(" | ") }; }
    const srcs = fw === "html" ? fs.readdirSync(dir).filter((f) => /\.(html|css|js|mjs)$/.test(f)).map((f) => path.join(dir, f)) : [path.join(dir, "src"), path.join(dir, "index.html")];
    const st = spawnSync("node", [CHECK, "static", ...srcs, "--json"], { cwd: dir, encoding: "utf8", maxBuffer: 1 << 26 });
    let counts = null; try { counts = JSON.parse(st.stdout).counts; } catch {}
    // 用了 Satin 没有（有技能的一组看它用对了没有）
    const code = srcs.flatMap((s) => (fs.existsSync(s) ? (fs.statSync(s).isDirectory() ? fs.readdirSync(s).map((f) => path.join(s, f)) : [s]) : [])).filter((f) => fs.statSync(f).isFile()).map((f) => fs.readFileSync(f, "utf8")).join("\n");
    const usesSatin = /satin-ui/.test(code), cls = (code.match(/\bsn-[a-z0-9-]+/g) || []).length;
    out.push({ model, cond, fw, task, min: +(done.ms / 60000).toFixed(1), timeout: !!done.timeout, build, counts, usesSatin, snClasses: cls });
  }
}
fs.writeFileSync(path.join(BASE, "_static.json"), JSON.stringify(out, null, 2));
const by = (c) => out.filter((r) => r.cond === c);
const avg = (xs) => (xs.length ? (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1) : "—");
for (const c of ["without", "with"]) {
  const R = by(c); if (!R.length) continue;
  const rules = {}; for (const r of R) for (const [k, v] of Object.entries(r.counts?.byRule || {})) rules[k] = (rules[k] || 0) + v;
  console.log(`${c === "with" ? "有技能" : "没有技能"}：${R.length} 份；构建通过 ${R.filter((r) => r.build.ok).length}；超时 ${R.filter((r) => r.timeout).length}；源码 error 平均 ${avg(R.map((r) => r.counts?.error ?? 0))}、warn 平均 ${avg(R.map((r) => r.counts?.warn ?? 0))}；error 为 0 的 ${R.filter((r) => r.counts?.error === 0).length} 份；平均用时 ${avg(R.map((r) => r.min))} 分钟`);
  console.log("   规则：" + Object.entries(rules).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join("，"));
}
for (const r of out.filter((r) => !r.build.ok || r.timeout)) console.log(`  ✗ ${r.cond} ${r.fw} ${r.task}：${r.timeout ? "超时 " : ""}${r.build.ok ? "" : "构建失败 " + (r.build.log || "")}`);
