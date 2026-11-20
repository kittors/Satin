// 检查器自测：坏样例（fixtures/bad）每条规则都要报出来；好样例（fixtures/good，只用 Satin 的类和令牌）0 个"必须改"。
// 用法：node check.test.mjs [--static-only] [--base http://127.0.0.1:5192]
// 页面检查要起浏览器、要本地服务（仓库根目录 python3 serve.py 5192 .）；服务不在、内存压力到 4（严重）就跳过页面那一半并说明
import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";
import { rules } from "./lib/rules.mjs";

const HERE = path.dirname(new URL(import.meta.url).pathname), ROOT = path.resolve(HERE, "../../..");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i < 0 ? d : process.argv[i + 1]; };
const BASE = arg("base", "http://127.0.0.1:5192"), rel = path.relative(ROOT, HERE);
const STATIC = ["color-token", "token-exists", "class-exists", "spacing-scale", "no-gradient", "no-colored-shadow", "motion-props", "easing-token", "no-ai-icons", "marketing-copy", "font-weight", "real-content", "focus-visible"];
const DOM = ["no-gradient", "no-colored-shadow", "glass-only-floating", "card-nesting", "kpi-wall", "status-color", "nav-selected", "no-decorative-divider", "no-overlap", "button-wrap", "both-themes", "touch-target", "float-clipped"];
let bad = 0;
const ok = (cond, msg) => { console.log(`${cond ? "✓" : "✗"} ${msg}`); if (!cond) bad++; };
const run = (...a) => { const r = spawnSync(process.execPath, [path.join(HERE, "check.mjs"), ...a, "--json"], { encoding: "utf8", maxBuffer: 64e6 }); return { code: r.status, json: JSON.parse(r.stdout || "{}"), err: r.stderr }; };

// ———— 静态 ————
const sb = run("static", path.join(HERE, "fixtures/bad")), sbRules = new Set(sb.json.findings.map((f) => f.rule));
for (const id of STATIC) ok(sbRules.has(id), `静态 · 坏样例报出 ${id}（${sb.json.counts.byRule[id] || 0} 处）`);
ok(sb.code === 1, "静态 · 坏样例退出码 1");
const sg = run("static", path.join(HERE, "fixtures/good"));
ok(sg.json.counts.error === 0, `静态 · 好样例 0 个必须改（实际 ${sg.json.counts.error}，建议改 ${sg.json.counts.warn}）`);
ok(sg.code === 0, "静态 · 好样例退出码 0");

// ———— 页面 ————
const all = new Set(sbRules);
let domRan = false;
if (!process.argv.includes("--static-only")) {
  const pressure = +execFileSync("sysctl", ["-n", "kern.memorystatus_vm_pressure_level"], { encoding: "utf8" }).trim();
  const up = await fetch(BASE + "/" + rel + "/fixtures/good/good.html").then((r) => r.ok, () => false);
  if (!up) console.log(`- 跳过页面检查：${BASE} 上没有服务（仓库根目录 python3 serve.py 5192 .）`);
  else if (pressure >= 4) console.log("- 跳过页面检查：内存压力严重（kern.memorystatus_vm_pressure_level = 4）");
  else {
    domRan = true;
    const db = run("dom", `${BASE}/${rel}/fixtures/bad/bad.html`, "--out", "/tmp/satin-check-test/bad"), dbRules = new Set(db.json.findings.map((f) => f.rule));
    for (const id of DOM) ok(dbRules.has(id), `页面 · 坏页面报出 ${id}（${db.json.counts.byRule[id] || 0} 处）`);
    for (const r of dbRules) all.add(r);
    const dg = run("dom", `${BASE}/${rel}/fixtures/good/good.html`, "--out", "/tmp/satin-check-test/good");
    ok(dg.json.counts.error === 0, `页面 · 好页面 0 个必须改（实际 ${dg.json.counts.error}，建议改 ${dg.json.counts.warn}${dg.json.counts.warn ? "：" + dg.json.findings.map((f) => f.rule).join("、") : ""}）`);
    ok(dg.json.shots?.length === 6, `页面 · 存了 6 张截图（深浅 × 1440 / 768 / 390）`);
  }
}
// 规则全覆盖：坏样例上 22 条规则每条都报过
const ids = Object.keys(rules()).filter((k) => !k.startsWith("__"));
if (domRan) ok(ids.every((id) => all.has(id)), `规则全覆盖：${ids.length} 条里报出 ${ids.filter((id) => all.has(id)).length} 条${ids.filter((id) => !all.has(id)).length ? "，缺 " + ids.filter((id) => !all.has(id)).join("、") : ""}`);
console.log(bad ? `\n检查器自测：${bad} 项没过` : "\n检查器自测：全部通过");
process.exitCode = bad ? 1 : 0;
