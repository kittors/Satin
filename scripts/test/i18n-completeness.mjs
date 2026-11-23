// 多语言完整性校验：保证 zh-CN 与 en 的模块文件、键名集合 100% 对齐，英文包无中文残留，且汇总文件未漏导任何模块。
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "../..");
const LOC = path.join(ROOT, "packages/satin-ui/src/locales");
const zhDir = path.join(LOC, "zh-CN");
const enDir = path.join(LOC, "en");

const zhFiles = fs.readdirSync(zhDir).filter((f) => f.endsWith(".js")).sort();
const enFiles = fs.readdirSync(enDir).filter((f) => f.endsWith(".js")).sort();

let bad = 0;
const fail = (msg) => { bad++; console.log("  ✗", msg); };

for (const f of zhFiles) if (!enFiles.includes(f)) fail(`en 缺少模块文件：${f}`);
for (const f of enFiles) if (!zhFiles.includes(f)) fail(`zh-CN 缺少模块文件：${f}`);

let totalKeys = 0;
const expectedKeys = new Set();

for (const f of zhFiles) {
  if (!enFiles.includes(f)) continue;
  const zh = (await import(pathToFileURL(path.join(zhDir, f)).href)).default;
  const en = (await import(pathToFileURL(path.join(enDir, f)).href)).default;
  const zks = Object.keys(zh);
  const eks = Object.keys(en);
  totalKeys += zks.length;
  for (const k of zks) expectedKeys.add(k);

  const missEn = zks.filter((k) => !(k in en));
  const extraEn = eks.filter((k) => !(k in zh));
  const cnInEn = eks.filter((k) => typeof en[k] === "string" && /[\u4e00-\u9fa5]/.test(en[k]));

  if (missEn.length) fail(`${f} 英文缺 ${missEn.length} 条：${missEn.slice(0, 6).join(", ")}`);
  if (extraEn.length) fail(`${f} 英文多 ${extraEn.length} 条：${extraEn.slice(0, 6).join(", ")}`);
  if (cnInEn.length) fail(`${f} 英文包残留中文：${cnInEn.slice(0, 6).join(", ")}`);
}

const zhAll = (await import(pathToFileURL(path.join(LOC, "zh-CN.js")).href)).default;
const enAll = (await import(pathToFileURL(path.join(LOC, "en.js")).href)).default;
for (const k of expectedKeys) {
  if (!(k in zhAll)) fail(`zh-CN.js 汇总漏导键：${k}`);
  if (!(k in enAll)) fail(`en.js 汇总漏导键：${k}`);
}

console.log(bad ? `多语言完整性：${bad} 处问题` : `多语言完整性：${zhFiles.length} 个模块、${totalKeys} 条中/英词条 100% 对齐`);
process.exitCode = bad ? 1 : 0;
