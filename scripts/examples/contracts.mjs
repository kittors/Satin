// 组件契约示例（spec/components/<id>.json 的 examples，7 种写法都是手写的，来自 spec/components/_api/code/<slug>/）直接写进各框架的示例目录，
// 不用开浏览器（全量示例的其余部分——设计稿里的演示、配方——要在页面里量计算样式，还是 gallery.mjs 生成）。
// 同时整理清单 examples/shared/demos.json（同一个 slug 只留一份、契约示例都在），按清单重写各框架的入口页。
// 用法：node scripts/examples/contracts.mjs [--only button,dialog]
import fs from "node:fs";
import path from "node:path";
import { FRAMEWORKS } from "../../site/frameworks.js";
import { writeEntries } from "./gallery-entries.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const i = process.argv.indexOf("--only"), ONLY = i > 0 ? new Set(process.argv[i + 1].split(",")) : null;
const write = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const SPEC = path.join(ROOT, "spec/components");
let nFiles = 0;
const contracted = [];
for (const f of fs.readdirSync(SPEC).filter((x) => x.endsWith(".json"))) {
  const c = JSON.parse(fs.readFileSync(path.join(SPEC, f), "utf8"));
  if (Array.isArray(c) || !c.contract || !c.examples?.length) continue;
  contracted.push(c);
  if (ONLY && !ONLY.has(c.id)) continue;
  for (const e of c.examples) {
    for (const fw of FRAMEWORKS) {
      const code0 = e.code?.[fw.id];
      if (!code0) { console.log(`  ✗ ${e.slug} 没有 ${fw.name} 的写法`); continue; }
      const code = code0.replace(/^\s*["']use client["'];?\n/, "").replace(/\s*$/, "\n");
      const main = path.join(ROOT, fw.dir, fw.demo(e.slug));
      write(main, code); nFiles++;
      // Next.js、Nuxt：和 React、Vue 同一份组件文件，拷进各自的示例；Next.js 那份标上 "use client"（用到 useState 这类钩子的是客户端组件）。
      // Vite 的 React 示例里不写这一行（官网上显示的是这一份，不放和 Vite 无关的样板）
      for (const env of fw.envs || []) { write(path.join(ROOT, env.dir, "app/demos", path.basename(main)), env.id === "next" ? `"use client";\n${code}` : code); nFiles++; }
    }
  }
  console.log(`${c.id.padEnd(10)} 契约示例 ${c.examples.length} 个`);
}
// 清单：同一个 slug 只留第一份；每个契约示例都要在（没有就补在这个组件的设计稿演示前面）
const MAN = path.join(ROOT, "examples/shared/demos.json");
let man = JSON.parse(fs.readFileSync(MAN, "utf8"));
const before = man.length;
man = man.filter((d, k) => man.findIndex((x) => x.slug === d.slug) === k);
for (const c of contracted) for (const e of c.examples) {
  if (man.some((d) => d.slug === e.slug)) continue;
  const at = man.findIndex((d) => d.id === c.id), entry = { slug: e.slug, id: c.id, n: -1, name: c.name || c.id, group: c.group || "", cap: e.title, css: false, contract: true };
  if (at < 0) man.push(entry); else man.splice(at, 0, entry);
}
write(MAN, JSON.stringify(man, null, 1) + "\n");
writeEntries(man);
console.log(`写了 ${nFiles} 个文件；清单 ${before} → ${man.length} 条（去重、补齐契约示例），各框架入口按清单重写`);
