// satin add <配方>：按当前项目的写法，把页面配方拷进项目。
// 配方模板在 templates/recipes/<配方 id>/<写法>/：能直接用的文件 + manifest.json（{ title, files, entry, usage? }）。
// 写法：html、react、vue、svelte、angular、solid、preact（Next 用 react 的、Nuxt 用 vue 的）
import fs from "node:fs";
import path from "node:path";
import { RECIPES } from "./paths.js";
import { readJSON, exists, write } from "./fsx.js";
import { project } from "./project.js";
import { FRAMEWORKS, IDS } from "./frameworks.js";
import { UsageError } from "./errors.js";

export function listRecipes() {
  if (!exists(RECIPES)) return [];
  const out = [];
  for (const id of fs.readdirSync(RECIPES).sort()) {
    const dir = path.join(RECIPES, id); if (!fs.statSync(dir).isDirectory()) continue;
    const variants = fs.readdirSync(dir).filter((v) => exists(path.join(dir, v, "manifest.json"))).sort();
    if (!variants.length) continue;
    out.push({ id, title: readJSON(path.join(dir, variants[0], "manifest.json"))?.title || id, variants });
  }
  return out;
}

// 拷到哪：纯 HTML 放项目根目录（每个配方是一张能直接打开的页面）；Next、Nuxt 放 app/recipes/<id>/；其余放 src/recipes/<id>/
export const targetDir = (fw, id) => (fw === "html" ? "." : fw === "next" || fw === "nuxt" ? `app/recipes/${id}` : `src/recipes/${id}`);
const compName = (id) => id.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join("") + "Recipe";

function usageHint(fw, id, m, rel) {
  if (m.usage?.[fw]) return m.usage[fw];
  const entry = `${rel}/${m.entry}`.replace(/^\.\//, ""), name = compName(id);
  switch (fw) {
    case "html": return `开发服务器起来以后打开 /${m.entry}`;
    case "next": return `打开 /${id}（已经建好 app/${id}/page.tsx）`;
    case "nuxt": return `在页面里引入：import ${name} from "~/recipes/${id}/${m.entry}"`;
    case "angular": return `在 src/app.ts 里引入 ${m.entry.replace(/\.ts$/, "")} 导出的组件，加进 @Component 的 imports`;
    default: return `在 App 里引入：import ${name} from "./${entry.replace(/^src\//, "")}"`;
  }
}

export async function add(args, log = console.log) {
  const f = args.flags, dir = path.resolve(typeof f.dir === "string" ? f.dir : "."), id = args._[0];
  const recipes = listRecipes();
  if (f.list || !id) {
    if (!recipes.length) { log("没有找到配方模板（templates/recipes 是空的）"); return f.list ? 0 : 2; }
    log("可用的页面配方（satin add <配方>）：");
    for (const r of recipes) log(`  ${r.id.padEnd(14)}${r.title}（写法：${r.variants.join("、")}）`);
    return f.list ? 0 : 2;
  }
  const r = recipes.find((x) => x.id === id);
  if (!r) throw new UsageError(`没有叫 ${id} 的配方。可用的：${recipes.map((x) => x.id).join("、") || "（没有）"}`);
  const fwFlag = typeof f.framework === "string" ? f.framework.toLowerCase() : null;
  if (fwFlag && !FRAMEWORKS[fwFlag]) throw new UsageError(`不认识的写法：${fwFlag}。可选：${IDS.join("、")}`);
  const p = project(dir, fwFlag);
  if (!p.fw) throw new UsageError(`看不出 ${dir} 是哪种写法的项目（package.json 里没有框架依赖，也没有 index.html）。在项目根目录运行，或者加 --framework 指定`);
  const variant = FRAMEWORKS[p.fw].variant, vdir = path.join(RECIPES, id, variant);
  if (!r.variants.includes(variant)) {
    log(`✗ 配方「${r.title}」还没有 ${variant} 写法（现在有：${r.variants.join("、")}）。`);
    log(`  可以先看技能里 references/recipes.md 的 HTML 骨架，照着改成 ${variant} 写法；或者用 --framework html 拷一份 HTML 版对照。`);
    return 1;
  }
  const m = readJSON(path.join(vdir, "manifest.json"));
  const rel = targetDir(p.fw, id), dest = path.join(dir, rel);
  const plan = m.files.map((file) => ({ from: path.join(vdir, file), to: path.join(dest, file) }));
  if (p.fw === "next") {
    const page = path.join(dir, "app", id, "page.tsx");
    const entryMod = m.entry.replace(/\.(tsx|ts|jsx|js)$/, "");
    plan.push({ to: page, content: `// satin add ${id} 建的路由：/${id}\nimport Recipe from "../recipes/${id}/${entryMod}";\n\nexport default function Page() {\n  return <Recipe />;\n}\n` });
  }
  const clash = plan.filter((x) => exists(x.to));
  if (clash.length && !f.force) throw new UsageError(`这些文件已经有了：${clash.map((x) => path.relative(dir, x.to)).join("、")}。要覆盖加 --force`);
  for (const x of plan) {
    if (x.content != null) write(x.to, x.content);
    else { fs.mkdirSync(path.dirname(x.to), { recursive: true }); fs.copyFileSync(x.from, x.to); }
  }
  log(`✓ 加好了配方「${r.title}」（${variant} 写法）：`);
  for (const x of plan) log(`  ${path.relative(dir, x.to)}`);
  log(`下一步：${usageHint(p.fw, id, m, rel)}`);
  return 0;
}
