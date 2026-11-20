// 规则清单：spec/rules/anti-ai.json（仓库里）或技能自带的 rules.json（拷到别处时用）。id、标题、级别、修法都以它为准
import fs from "node:fs";
import path from "node:path";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const CANDIDATES = [process.env.SATIN_RULES, path.resolve(HERE, "../../../../spec/rules/anti-ai.json"), path.join(HERE, "rules.snapshot.json")].filter(Boolean);
let cache = null;
export function rules() {
  if (cache) return cache;
  for (const f of CANDIDATES) if (fs.existsSync(f)) { const list = JSON.parse(fs.readFileSync(f, "utf8")).rules; cache = Object.fromEntries(list.map((r) => [r.id, r])); cache.__source = f; return cache; }
  throw new Error("找不到规则清单 anti-ai.json");
}
export const severity = (id) => rules()[id]?.severity || "warn";
export const title = (id) => rules()[id]?.title || id;
// 一条违规：{ rule, severity, where（文件:行 或 选择器）, problem, fix }
export const finding = (rule, where, problem, fix) => ({ rule, severity: severity(rule), where, problem, fix: fix || rules()[rule]?.fix || "" });

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(HERE, "rules.mjs") && process.argv.includes("--snapshot")) {
  const src = CANDIDATES.find((f) => fs.existsSync(f) && !f.endsWith("rules.snapshot.json"));
  fs.writeFileSync(path.join(HERE, "rules.snapshot.json"), fs.readFileSync(src, "utf8"));
  console.log("规则快照 ← " + src);
}
