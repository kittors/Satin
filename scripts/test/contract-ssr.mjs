// 契约示例：React、Vue 的写法渲染出来的标记和纯 HTML 写法（接上以后：<sn-enhance> 拆掉、data-i 换成图标）是不是同一份。
// 不开浏览器：React 用 react-dom/server，Vue 用 @vue/compiler-sfc 编译 + vue/server-renderer；纯 HTML 在 linkedom 里跑 injectIcons。
// 只比结构和属性（空白、属性顺序、注释、Vue 的片段标记不算）；交互后的样子由 gallery-check 截图逐像素比。
// 用法：node scripts/test/contract-ssr.mjs [--only button,dialog] [--show]
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

const ROOT = path.resolve(import.meta.dirname, "../..");
const require = createRequire(path.join(ROOT, "package.json"));
const i = process.argv.indexOf("--only"), ONLY = i > 0 ? new Set(process.argv[i + 1].split(",")) : null, SHOW = process.argv.includes("--show");
const { parseHTML } = require("linkedom");
const React = require("react"), { renderToStaticMarkup } = require("react-dom/server");
const sfc = require("vue/compiler-sfc");
const PKG = path.join(ROOT, "packages/satin-ui");
// 临时文件放在仓库里（.parity 不进版本库）：打包出来的 import "react" / "vue" 从仓库的 node_modules 找
const TMP = path.join(ROOT, ".parity/contract-ssr"); fs.rmSync(TMP, { recursive: true, force: true }); fs.mkdirSync(TMP, { recursive: true });

// 纯 HTML：注释、脚本去掉，<sn-enhance> 拆掉，data-i 换成图标（和 <sn-enhance> 接上以后一样）
const { window, document } = parseHTML("<!doctype html><html><body></body></html>");
globalThis.document = document; globalThis.window = window; globalThis.HTMLElement = window.HTMLElement;
const { injectIcons } = await import(pathToFileURL(path.join(PKG, "src/core.js")).href);
function htmlOf(src) {
  const host = document.createElement("div");
  host.innerHTML = src.replace(/<!--[\s\S]*?-->/g, "").replace(/<script[\s\S]*?<\/script>/g, "");
  for (const e of [...host.querySelectorAll("sn-enhance")]) e.replaceWith(...e.childNodes);
  // 浮在 <body> 上的面板（弹出面板）：React、Vue 挂载以后才用 portal / Teleport 放进 <body>，服务端标记里没有，不比
  for (const e of [...host.querySelectorAll(".sn-pop.sn-popover, .sn-menu.sn-float")]) e.remove(); // 浮动菜单同理
  injectIcons(host);
  return host.innerHTML;
}
// 统一：去掉标签之间的空白、注释（Vue 的 <!--[--> 片段标记）、按属性名排序、类名排序
// 纯 HTML 写法接线用、框架写法里换成 onClick / ref 的属性：不比
// （弹窗里"放弃填写的内容？"那一条的 data-keep / data-discard 也是：框架写法里是 Dialog 的 guard + onClick）
const WIRING = new Set(["id", "data-dlg", "data-pop", "data-fmenu", "data-ctx", "data-drawer", "data-keep", "data-discard", "data-toggle", "data-chips", "data-all", "data-f", "data-x", "data-step", "data-dismiss", "data-copy"]);
function norm(html) {
  const host = document.createElement("div"); host.innerHTML = html.replace(/<!--[\s\S]*?-->/g, "");
  // React 19 给 <img> 自动加的预加载提示（<link rel="preload" as="image">）：不是组件的标记，不比
  for (const l of [...host.querySelectorAll('link[rel="preload"]')]) l.remove();
  // 封装组件外面那层 <div class="sn-host" style="display: contents">（不占布局）拆掉
  for (const w of [...host.querySelectorAll("div.sn-host")]) if (/display:\s*contents/.test(w.getAttribute("style") || "")) w.replaceWith(...w.childNodes);
  // 只写了 display: contents 的 <div>（滚动区域封装在视口外面套的那层，React 管的父子关系不受影响）：不占布局，也拆掉
  for (const w of [...host.querySelectorAll("div")]) if (w.attributes.length === 1 && /^display:\s*contents;?$/.test((w.getAttribute("style") || "").trim())) w.replaceWith(...w.childNodes);
  // <sn-enhance>（不占布局）拆掉；Vue 的 v-enhance 挂在最外面一个不带属性的 <div> 上：也拆掉（只拆最外面那一个）
  for (const w of [...host.querySelectorAll("sn-enhance")]) w.replaceWith(...w.childNodes);
  if (host.children.length === 1 && host.firstElementChild.tagName === "DIV" && !host.firstElementChild.attributes.length) host.firstElementChild.replaceWith(...host.firstElementChild.childNodes);
  const walk = (n) => {
    for (const c of [...n.childNodes]) {
      if (c.nodeType === 3) { if (!c.textContent.trim()) c.remove(); else c.textContent = c.textContent.replace(/\s+/g, " ").trim(); }
      else if (c.nodeType === 1) {
        // id 是纯 HTML 写法接线用的钩子（框架里用 ref），不比；引用 id 的属性（for、aria-labelledby……）只比有没有
        const REF = new Set(["for", "aria-labelledby", "aria-describedby", "aria-controls", "aria-owns", "list"]);
        // 属性名不分大小写（React 的 autoComplete）；data-x="true" 和 data-x="" 一样（库只看有没有）；受控输入框的空 value="" 不算
        const attrs = [...c.attributes].map((a) => [a.name.toLowerCase(), a.value]).filter(([k, v]) => !WIRING.has(k) && !(k === "value" && v === "" && /^(INPUT|TEXTAREA)$/.test(c.tagName)))
          .map(([k, v]) => [k, k === "class" ? v.split(/\s+/).filter(Boolean).sort().join(" ") : k === "style" ? v.split(";").map((d) => d.trim().replace(/\s*:\s*/, ":")).filter(Boolean).sort().join(";") : REF.has(k) ? "·" : k.startsWith("data-") && v === "true" ? "" : v]).sort((a, b) => a[0].localeCompare(b[0]));
        for (const a of [...c.attributes]) c.removeAttribute(a.name);
        for (const [k, v] of attrs) c.setAttribute(k, v);
        walk(c);
      }
    }
  };
  walk(host);
  return host.innerHTML;
}
const alias = { name: "alias", setup(b) { b.onResolve({ filter: /^satin-ui(\/.*)?$/ }, (a) => { const sub = a.path.slice("satin-ui".length) || ""; const map = { "": "src/index.js", "/react": "react/index.js", "/vue": "vue/index.js", "/components": "src/components.js" }; const rel = map[sub] ?? (sub.startsWith("/react/") || sub.startsWith("/vue/") ? sub.slice(1) + ".js" : "src" + sub + ".js"); return { path: path.join(PKG, rel) }; }); } };
async function reactOf(code, slug) {
  const f = path.join(TMP, slug + ".jsx"); fs.writeFileSync(f, code);
  const out = path.join(TMP, slug + ".react.mjs");
  await esbuild.build({ entryPoints: [f], outfile: out, bundle: true, format: "esm", platform: "node", jsx: "automatic", external: ["react", "react-dom", "react/jsx-runtime"], plugins: [alias], logLevel: "silent", nodePaths: [path.join(ROOT, "node_modules")] });
  const C = (await import(pathToFileURL(out).href + "?t=" + Date.now())).default;
  return renderToStaticMarkup(React.createElement(C));
}
async function vueOf(code, slug) {
  // 只有 <template> 的 SFC（纯样式组件）：补一个空的 <script setup> 再编译
  const src = /<script[\s>]/.test(code) ? code : `<script setup>\nconst __onlyTemplate = true;\n</script>\n${code}`;
  const { descriptor, errors } = sfc.parse(src, { filename: slug + ".vue" }); if (errors.length) throw new Error(errors[0].message);
  const script = sfc.compileScript(descriptor, { id: slug, inlineTemplate: true, templateOptions: { compilerOptions: { isCustomElement: (t) => t.startsWith("sn-") } } });
  const f = path.join(TMP, slug + ".vue.mjs"), entry = path.join(TMP, slug + ".vue.entry.mjs"), out = path.join(TMP, slug + ".vue.bundle.mjs");
  fs.writeFileSync(f, script.content);
  // 渲染也写在同一个包里：组件和 createSSRApp 用的是同一份 vue（Node 里 require 和 import 拿到的 vue 不是同一份）
  fs.writeFileSync(entry, `import C from "./${slug}.vue.mjs";\nimport { createSSRApp, h } from "vue";\nimport { renderToString } from "vue/server-renderer";\nexport default () => { const app = createSSRApp({ render: () => h(C) }); return renderToString(app); };\n`);
  await esbuild.build({ entryPoints: [entry], outfile: out, bundle: true, format: "esm", platform: "node", external: ["vue", "vue/server-renderer"], plugins: [alias], logLevel: "silent" });
  return (await import(pathToFileURL(out).href + "?t=" + Date.now())).default();
}
let bad = 0, n = 0; const skipped = [];
for (const f of fs.readdirSync(path.join(ROOT, "spec/components")).filter((x) => x.endsWith(".json"))) {
  const c = JSON.parse(fs.readFileSync(path.join(ROOT, "spec/components", f), "utf8"));
  if (Array.isArray(c) || !c.contract || !c.examples?.length || (ONLY && !ONLY.has(c.id))) continue;
  for (const e of c.examples) {
    if (!e.code?.html) continue;
    const bare = e.code.html.replace(/<!--[\s\S]*?-->/g, "").replace(/<script[\s\S]*?<\/script>/g, "");
    // 要跑脚本才有标记：用了自定义元素、整段只有空的 <div>、或者留了一个空的 <div></div> 等脚本往里挂组件
    if (/<sn-(?!enhance)[a-z-]+/.test(bare) || !/<(?!div|\/div)[a-z]/.test(bare) || (/<script/.test(e.code.html) && /<div[^>]*><\/div>/.test(bare.replace(/>\s+</g, "><")))) { skipped.push(e.slug); continue; }
    const want = norm(htmlOf(e.code.html));
    for (const fw of ["react", "vue"]) {
      if (!e.code[fw]) continue; n++;
      let got;
      try { got = norm(fw === "react" ? await reactOf(e.code[fw], e.slug) : await vueOf(e.code[fw], e.slug)); } catch (err) { bad++; console.log(`  ✗ ${e.slug} ${fw}：渲染出错 ${err.message.split("\n")[0]}`); continue; }
      if (got === want) { console.log(`  ✓ ${e.slug} ${fw}`); continue; }
      bad++;
      let k = 0; while (k < got.length && got[k] === want[k]) k++;
      console.log(`  ✗ ${e.slug} ${fw}：第 ${k} 个字符起不一样\n      HTML：…${want.slice(Math.max(0, k - 80), k + 160)}\n      ${fw.padEnd(4)}：…${got.slice(Math.max(0, k - 80), k + 160)}`);
      if (SHOW) console.log("      完整 HTML：" + want + "\n      完整 " + fw + "：" + got);
    }
  }
}
fs.rmSync(TMP, { recursive: true, force: true });
if (skipped.length) console.log(`  · 纯 HTML 写法要跑脚本或自定义元素才有标记、留给浏览器逐像素比的：${skipped.join("、")}`);
console.log(bad ? `契约示例标记：${bad}/${n} 份和纯 HTML 写法不一样` : `契约示例标记：${n} 份 React / Vue 写法和纯 HTML 写法一致`);
process.exit(bad ? 1 : 0);
