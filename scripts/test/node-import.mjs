// 在 Node 里 import 每个入口：不能报错（导入时没有副作用：不碰 document / window / localStorage，不挂监听）。
// 用法：node scripts/test/node-import.mjs   （CI 里也跑）
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "../..");
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "packages/satin-ui/package.json"), "utf8"));
// 入口：package.json 的 exports 里的 JS（import 条件），再加 src 下每个模块
const entries = new Set();
const walk = (v) => { if (typeof v === "string") { if (/\.m?js$/.test(v) && !v.includes("*")) entries.add(path.join(ROOT, "packages/satin-ui", v)); } else if (v && typeof v === "object") for (const x of Object.values(v)) walk(x); };
walk(pkg.exports);
// theme-boot.js 是放在 <head> 里同步执行的小脚本（第一帧之前写主题）：在浏览器里有副作用是本意，在 Node 里导入也要什么都不做、不报错（服务端代码误引不能崩）
for (const f of fs.readdirSync(path.join(ROOT, "packages/satin-ui/src"))) if (/\.js$/.test(f) && !/worker/.test(f) ) entries.add(path.join(ROOT, "packages/satin-ui/src", f));
// Node 里没有 document / window / localStorage / addEventListener……：导入时碰到就会抛 ReferenceError，正好当场报出来
let bad = 0;
for (const e of [...entries].sort()) {
  try { await import(pathToFileURL(e).href); console.log(`  ✓ ${path.relative(ROOT, e)}`); }
  catch (err) { bad++; console.log(`  ✗ ${path.relative(ROOT, e)}：${String(err.message).split("\n")[0]}`); }
}
console.log(`Node 里导入：${entries.size} 个入口，${bad ? bad + " 个报错" : "全部通过"}`);
process.exitCode = bad ? 1 : 0;
