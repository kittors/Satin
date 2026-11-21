// satin doctor：查项目配置。每一项不对都给一句"照着做就能改好"的修法。
// 查：satin-ui 写进依赖、装进 node_modules；样式引了没；theme-boot 放对了没（按写法查）；框架那一层接好了没；
// 技能在不在、是不是最新；AGENTS.md / CLAUDE.md 里有没有 Satin 那一段；package.json 有没有 check 脚本
import fs from "node:fs";
import path from "node:path";
import { read, readJSON, exists } from "./fsx.js";
import { project, firstOf } from "./project.js";
import { FRAMEWORKS } from "./frameworks.js";
import { installedSkills, skillHash } from "./skill.js";
import { hasBlock } from "./agents.js";
import { projectPm, addCmd, installCmd } from "./pm.js";

const VITE_FWS = ["react", "vue", "svelte", "solid", "preact"];
const ENTRY = ["src/main.js", "src/main.jsx", "src/main.ts", "src/main.tsx", "src/index.js", "src/index.jsx", "src/index.ts", "src/index.tsx"];
const has = (file, re) => { const s = file && read(file); return !!s && re.test(s); };
const anyHas = (files, re) => files.some((f) => has(f, re));

export function diagnose(dir, pmFlag) {
  const p = project(dir), pm = pmFlag || projectPm(dir), out = [];
  const add = (ok, title, fix) => out.push({ ok, title, fix: ok ? null : fix });
  const pkg = p.pkg, deps = { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}) };
  const at = (...rels) => firstOf(dir, rels);

  if (!p.fw) { add(false, "看出是哪种写法的项目", "在项目根目录运行（要有 package.json 或 index.html）；新项目用 satin init 建"); return { fw: null, pm, results: out }; }
  if (!pkg) add(false, "有 package.json", `在项目根目录运行；没有就 ${pm === "npm" ? "npm init -y" : `${pm} init`}，再 ${addCmd(pm, "satin-ui")}`);
  else {
    add(!!deps["satin-ui"], `satin-ui 写进了依赖${deps["satin-ui"] ? `（${deps["satin-ui"]}）` : ""}`, `运行 ${addCmd(pm, "satin-ui")}`);
    const v = readJSON(path.join(dir, "node_modules/satin-ui/package.json"))?.version;
    add(!!v, `satin-ui 装进了 node_modules${v ? `（${v}）` : ""}`, `运行 ${installCmd(pm)}`);
  }

  // 样式
  const fw = p.fw, CSS = /satin-ui\/css/;
  if (VITE_FWS.includes(fw)) add(anyHas(ENTRY.map((r) => path.join(dir, r)), CSS), "引了 Satin 的样式", `在入口文件（src/main.*）最上面加一行 import "satin-ui/css/page.css";`);
  else if (fw === "angular") add(has(at("src/styles.css", "src/styles.scss"), CSS) || has(at("angular.json"), CSS), "引了 Satin 的样式", `在 src/styles.css 里加 @import "satin-ui/css/page.css";`);
  else if (fw === "next") add(has(at("app/layout.jsx", "app/layout.js", "app/layout.tsx", "app/layout.ts", "src/app/layout.jsx", "src/app/layout.tsx", "src/app/layout.js"), CSS), "引了 Satin 的样式", `在 app/layout.jsx 里加 import "satin-ui/css/page.css";`);
  else if (fw === "nuxt") add(has(at("nuxt.config.ts", "nuxt.config.js", "nuxt.config.mjs"), CSS), "引了 Satin 的样式", `在 nuxt.config.ts 里加 css: ["satin-ui/css/page.css"]`);
  else if (fw === "html") add(anyHas(htmlFiles(dir), CSS), "引了 Satin 的样式", `在 <head> 里加 <link rel="stylesheet" href="/node_modules/satin-ui/css/page.css">`);

  // theme-boot：第一帧之前写好深浅主题、圆角（刷新不闪）
  const TB = "theme-boot 在第一帧之前跑（刷新不闪）";
  if (VITE_FWS.includes(fw)) { const vc = at("vite.config.js", "vite.config.mjs", "vite.config.ts", "vite.config.mts"); add(has(vc, /satin-ui\/vite/) && has(vc, /satin\s*\(\s*\)/), TB, `在 vite.config.js 里 import satin from "satin-ui/vite"，plugins 里加 satin()`); }
  else if (fw === "next") { const lay = at("app/layout.jsx", "app/layout.js", "app/layout.tsx", "app/layout.ts", "src/app/layout.jsx", "src/app/layout.tsx", "src/app/layout.js"); add(has(lay, /theme-boot-script/) && has(lay, /dangerouslySetInnerHTML/) && has(lay, /suppressHydrationWarning/), TB, `在 app/layout.jsx 里 import themeBoot from "satin-ui/theme-boot-script"，<head> 里放 <script dangerouslySetInnerHTML={{ __html: themeBoot }} />，<html> 加 suppressHydrationWarning`); }
  else if (fw === "nuxt") { const nc = at("nuxt.config.ts", "nuxt.config.js", "nuxt.config.mjs"); add(has(nc, /theme-boot-script/) && has(nc, /tagPosition/), TB, `在 nuxt.config.ts 里 import themeBoot from "satin-ui/theme-boot-script"，app.head.script 里加 { innerHTML: themeBoot, tagPosition: "head" }`); }
  else if (fw === "angular") add(has(at("angular.json"), /theme-boot\.js/) && headScriptFirst(read(at("src/index.html")), /<script[^>]+src="[^"]*theme-boot\.js"/), TB, `angular.json 的 assets 里加 { "glob": "theme-boot.js", "input": "node_modules/satin-ui/src", "output": "/" }，src/index.html 的 <head> 最前面加 <script src="theme-boot.js"></script>`);
  else if (fw === "html") add(headScriptFirst(read(path.join(dir, "index.html")), /<script[^>]+src="[^"]*theme-boot\.js"/), TB, `index.html 的 <head> 最前面（样式表之前）加 <script src="/node_modules/satin-ui/src/theme-boot.js"></script>`);

  // 框架那一层
  if (fw === "vue") add(anyHas(ENTRY.map((r) => path.join(dir, r)), /satin-ui\/vue/) && anyHas(ENTRY.map((r) => path.join(dir, r)), /\.use\(\s*Satin/), "Vue 组件注册了（app.use(Satin)）", `在 src/main.js 里 import Satin from "satin-ui/vue"，createApp(App).use(Satin)`);
  else if (fw === "nuxt") add(nuxtPlugins(dir).some((f) => has(f, /satin-ui\/vue/) && has(f, /vueApp\.use/)), "Vue 组件注册了（插件里 vueApp.use(Satin)）", `建 app/plugins/satin.ts：import Satin from "satin-ui/vue"; export default defineNuxtPlugin((nuxtApp) => { nuxtApp.vueApp.use(Satin); });`);
  else if (["svelte", "solid", "preact", "angular"].includes(fw)) { const files = ENTRY.map((r) => path.join(dir, r)); add(anyHas(files, /defineElements\s*\(/) && anyHas(files, /\bsetup\s*\(/), "装好了页面级行为、注册了自定义元素", `在入口文件里 import { setup } from "satin-ui"、import { defineElements } from "satin-ui/elements"，挂载之前调 setup(); defineElements();`); }
  else if (fw === "html") add(anyHas([...htmlFiles(dir), ...jsFiles(dir)], /defineElements\s*\(/), "装好了页面级行为、注册了自定义元素", `页面的模块脚本里调 setup(); defineElements(); enhance();（从 satin-ui、satin-ui/elements 引）`);
  else add(true, "React 组件第一次挂载时自动装好页面级行为，不用另配", "");

  // 技能、AGENTS.md / CLAUDE.md
  const skills = installedSkills(dir), want = skillHash();
  if (!skills.length) add(false, "装了 Satin 技能（.claude/skills/satin 或 .agents/skills/satin）", "运行 satin skill");
  for (const s of skills) {
    add(s.stamp?.hash === want, `${s.dir} 是最新的技能`, `运行 satin skill 更新（项目里的 ${s.stamp?.hash || "没有版本记录"}，命令行带的 ${want}）`);
    add(hasBlock(read(path.join(dir, s.doc))), `${s.doc} 里有 Satin 那一段（${s.name} 读）`, "运行 satin skill（只替换 Satin 那一段，你自己写的内容不动）");
  }
  // check 脚本
  if (pkg) {
    const name = ["check", "check:satin"].find((k) => /scripts\/check\.mjs/.test(pkg.scripts?.[k] || ""));
    const target = name && pkg.scripts[name].match(/node\s+(\S+check\.mjs)/)?.[1];
    add(!!name && !!target && exists(path.join(dir, target)), `package.json 里有检查脚本${name ? `（${name}）` : ""}`, "运行 satin skill，会补上 check 脚本");
  }
  return { fw, pm, results: out };
}

// <head> 里有这个 <script>，并且在第一个样式表之前
function headScriptFirst(html, re) {
  if (!html) return false;
  const head = html.slice(0, html.search(/<\/head>/i) >= 0 ? html.search(/<\/head>/i) : html.length);
  const s = head.search(re); if (s < 0) return false;
  const css = head.search(/<link[^>]+rel=["']?stylesheet/i);
  return css < 0 || s < css;
}
const htmlFiles = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith(".html")).map((f) => path.join(dir, f));
const jsFiles = (dir) => fs.readdirSync(dir).filter((f) => /\.m?js$/.test(f)).map((f) => path.join(dir, f));
const nuxtPlugins = (dir) => ["app/plugins", "plugins"].flatMap((d) => { const abs = path.join(dir, d); return exists(abs) ? fs.readdirSync(abs).map((f) => path.join(abs, f)) : []; });

export async function doctor(args, log = console.log) {
  const dir = path.resolve(typeof args.flags.dir === "string" ? args.flags.dir : ".");
  const { fw, results } = diagnose(dir, typeof args.flags.pm === "string" ? args.flags.pm : null);
  if (args.flags.json) { log(JSON.stringify({ dir, framework: fw, results }, null, 1)); return results.some((r) => !r.ok) ? 1 : 0; }
  log(`Satin 项目检查：${dir}${fw ? `（${FRAMEWORKS[fw].title}）` : ""}\n`);
  for (const r of results) { log(`${r.ok ? "✓" : "✗"} ${r.title}`); if (!r.ok) log(`   → ${r.fix}`); }
  const bad = results.filter((r) => !r.ok).length;
  log(bad ? `\n合计：${bad} 项要改` : "\n都对了");
  return bad ? 1 : 0;
}
