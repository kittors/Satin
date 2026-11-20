// 列出这一轮新加的中文键（和备份比）以及英文表里还缺的键
import fs from "node:fs"; import path from "node:path";
const [before, now] = process.argv.slice(2);
const load = async (f) => (fs.existsSync(f) ? (await import(path.resolve(f) + "?" + Date.now())).default : {});
for (const f of fs.readdirSync(path.join(now, "zh-CN"))) {
  const a = await load(path.join(before, "zh-CN", f)), b = await load(path.join(now, "zh-CN", f)), en = await load(path.join(now, "en", f));
  for (const [k, v] of Object.entries(b)) if (!(k in en)) console.log(JSON.stringify([f.replace(".js", ""), k, v, k in a ? "旧" : "新"]));
}
