// 全量示例的入口页：每个框架一页，按设计稿的顺序把 61 块的所有演示排出来（每个演示套一层 .demo，和设计稿里一样），
// 构建以后由 scripts/examples/gallery-check.mjs 逐个演示截图，和设计稿比。gallery.mjs 写完演示文件后调 writeEntries(清单)。
import fs from "node:fs";
import path from "node:path";
import { FRAMEWORKS, compName } from "../../site/frameworks.js";

const ROOT = path.resolve(import.meta.dirname, "../..");
const write = (f, s) => { fs.mkdirSync(path.dirname(f), { recursive: true }); if (!fs.existsSync(f) || fs.readFileSync(f, "utf8") !== s) fs.writeFileSync(f, s); };
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const NOTE = "<!-- 由 scripts/examples/gallery-entries.mjs 生成，别手改 -->";
const JNOTE = "// 由 scripts/examples/gallery-entries.mjs 生成，别手改：设计稿 61 块的全部演示排成一页（每个演示是 src/demos/ 里的一个组件）";

export function writeEntries(list) {
  // 分组：[{ id, name, demos: [清单项] }]
  const secs = []; for (const d of list) { let s = secs[secs.length - 1]; if (!s || s.id !== d.id) secs.push((s = { id: d.id, name: d.name, demos: [] })); s.demos.push(d); }
  // 共用的样式：演示框（设计稿的 .demo，从 demo/kit-demo.css 拷来）+ 这一页的排版
  const kit = fs.readFileSync(path.join(ROOT, "demo/kit-demo.css"), "utf8");
  write(path.join(ROOT, "examples/shared/gallery.css"), `/* 由 scripts/examples/gallery-entries.mjs 生成：设计稿的演示框样式（demo/kit-demo.css）+ 全量示例这一页的排版 */\n${kit}\n/* ———— 全量示例页 ———— */\n.gallery { max-width: 960px; margin: 0 auto; padding: 32px 24px 96px; }\n.gallery > section { margin-top: 48px; }\n.gallery > section > h2 { font: 600 calc(20px * var(--sn-font-scale, 1))/calc(28px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label); }\n`);

  const by = Object.fromEntries(FRAMEWORKS.map((f) => [f.id, f]));
  const imp = (fw, d, from) => `import ${compName(d.slug)} from "${from}/${path.basename(fw.demo(d.slug))}";`;
  const jsxBody = (cls = "className") => secs.map((s) => `      <section id="${s.id}">\n        <h2>${esc(s.name)}</h2>\n${s.demos.map((d) => `        <div ${cls}="demo" data-demo="${d.slug}"><${compName(d.slug)} /></div>`).join("\n")}\n      </section>`).join("\n");
  const htmlBody = (tag = (d) => `<${compName(d.slug)} />`) => secs.map((s) => `  <section id="${s.id}">\n    <h2>${esc(s.name)}</h2>\n${s.demos.map((d) => `    <div class="demo" data-demo="${d.slug}">${tag(d)}</div>`).join("\n")}\n  </section>`).join("\n");
  const page = (title, src) => `<!doctype html>\n${NOTE}\n<html lang="zh-CN">\n<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Satin · ${title} · 全量示例</title></head>\n<body><div id="app"></div><script type="module" src="${src}"></script></body>\n</html>\n`;

  // React
  { const fw = by.react, dir = path.join(ROOT, fw.dir);
    write(path.join(dir, "gallery.html"), page("React", "/src/gallery.jsx").replace('<div id="app">', '<div id="root">'));
    write(path.join(dir, "src/gallery.jsx"), `${JNOTE}\nimport { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport "satin-ui/css/page.css";\nimport "../../shared/gallery.css";\n${list.map((d) => imp(fw, d, "./demos")).join("\n")}\n\nfunction Gallery() {\n  return (\n    <main className="gallery">\n${jsxBody()}\n    </main>\n  );\n}\ncreateRoot(document.getElementById("root")).render(<StrictMode><Gallery /></StrictMode>);\n`); }
  // Vue
  { const fw = by.vue, dir = path.join(ROOT, fw.dir);
    write(path.join(dir, "gallery.html"), page("Vue", "/src/gallery.js"));
    write(path.join(dir, "src/gallery.js"), `${JNOTE}\nimport { createApp } from "vue";\nimport "satin-ui/css/page.css";\nimport "../../shared/gallery.css";\nimport Gallery from "./Gallery.vue";\ncreateApp(Gallery).mount("#app");\n`);
    write(path.join(dir, "src/Gallery.vue"), `${NOTE}\n<script setup>\n${list.map((d) => imp(fw, d, "./demos")).join("\n")}\n</script>\n\n<template>\n<main class="gallery">\n${htmlBody()}\n</main>\n</template>\n`); }
  // Svelte
  { const fw = by.svelte, dir = path.join(ROOT, fw.dir);
    write(path.join(dir, "gallery.html"), page("Svelte", "/src/gallery.js"));
    write(path.join(dir, "src/gallery.js"), `${JNOTE}\nimport { mount } from "svelte";\nimport "satin-ui/css/page.css";\nimport "../../shared/gallery.css";\nimport Gallery from "./Gallery.svelte";\nmount(Gallery, { target: document.getElementById("app") });\n`);
    write(path.join(dir, "src/Gallery.svelte"), `${NOTE}\n<script>\n${list.map((d) => "  " + imp(fw, d, "./demos")).join("\n")}\n</script>\n\n<main class="gallery">\n${htmlBody()}\n</main>\n`); }
  // Solid
  { const fw = by.solid, dir = path.join(ROOT, fw.dir);
    write(path.join(dir, "gallery.html"), page("Solid", "/src/gallery.jsx"));
    write(path.join(dir, "src/gallery.jsx"), `${JNOTE}\nimport { render } from "@solidjs/web";\nimport "satin-ui/css/page.css";\nimport "../../shared/gallery.css";\n${list.map((d) => imp(fw, d, "./demos")).join("\n")}\n\nfunction Gallery() {\n  return (\n    <main class="gallery">\n${jsxBody("class")}\n    </main>\n  );\n}\nrender(Gallery, document.getElementById("app"));\n`); }
  // Preact
  { const fw = by.preact, dir = path.join(ROOT, fw.dir);
    write(path.join(dir, "gallery.html"), page("Preact", "/src/gallery.jsx"));
    write(path.join(dir, "src/gallery.jsx"), `${JNOTE}\nimport { render } from "preact";\nimport "satin-ui/css/page.css";\nimport "../../shared/gallery.css";\n${list.map((d) => imp(fw, d, "./demos")).join("\n")}\n\nfunction Gallery() {\n  return (\n    <main class="gallery">\n${jsxBody("class")}\n    </main>\n  );\n}\nrender(<Gallery />, document.getElementById("app"));\n`); }
  // Angular：一个独立组件把全部演示组件引进来；main.ts 按地址里的 ?gallery 决定启动哪一个
  { const fw = by.angular, dir = path.join(ROOT, fw.dir);
    const names = list.map((d) => compName(d.slug) + "Component");
    write(path.join(dir, "src/gallery.ts"), `${JNOTE}\nimport { Component, ViewEncapsulation } from "@angular/core";\n${list.map((d, i) => `import { ${names[i]} } from "./demos/${d.slug}";`).join("\n")}\n\n@Component({\n  selector: "app-root",\n  imports: [${names.join(", ")}],\n  encapsulation: ViewEncapsulation.None,\n  styleUrl: "../../shared/gallery.css",\n  template: \`\n<main class="gallery">\n${htmlBody((d) => `<demo-${d.slug} />`).replace(/`/g, "\\`")}\n</main>\`,\n})\nexport class Gallery {}\n`); }
  // 纯 HTML：一页里按清单把每个演示的片段（demos/<slug>.html）取来放进去；片段里的模块脚本照原样跑（导入映射把 satin-ui 指到仓库里的包）
  { const fw = by.html, dir = path.join(ROOT, fw.dir), P = "../../packages/satin-ui";
    const map = { "satin-ui": `${P}/src/index.js`, "satin-ui/components": `${P}/src/components.js`, "satin-ui/elements": `${P}/elements/index.js`, "satin-ui/theme": `${P}/src/theme.js`, "satin-ui/icons": `${P}/src/icons.js`, "satin-ui/markdown": `${P}/src/markdown.js`, "satin-ui/chat": `${P}/src/chat.js`, "satin-ui/flow": `${P}/src/flow.js`, "satin-ui/grid": `${P}/src/grid.js`, "satin-ui/canvas-grid": `${P}/src/canvas-grid.js`, "satin-ui/lightbox": `${P}/src/lightbox.js`, "satin-ui/media": `${P}/src/media.js` };
    write(path.join(dir, "gallery.html"), `<!doctype html>\n${NOTE}\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n<title>Satin · 纯 HTML · 全量示例</title>\n<script src="${P}/src/theme-boot.js"></script>\n<link rel="stylesheet" href="${P}/css/page.css">\n<link rel="stylesheet" href="../shared/gallery.css">\n<script type="importmap">${JSON.stringify({ imports: map })}</script>\n</head>\n<body>\n<main class="gallery">\n${htmlBody(() => "")}\n</main>\n<script type="module">\n// 每个演示的片段：标记放进框里，模块脚本照原样跑（和复制到自己页面里一样）\nfor (const box of document.querySelectorAll("[data-demo]")) {\n  const html = await (await fetch("demos/" + box.dataset.demo + ".html")).text();\n  const tp = document.createElement("template"); tp.innerHTML = html;\n  const scripts = [...tp.content.querySelectorAll("script")]; for (const s of scripts) s.remove();\n  box.append(tp.content);\n  for (const s of scripts) { const x = document.createElement("script"); x.type = "module"; x.textContent = s.textContent; box.append(x); }\n}\ndocument.documentElement.dataset.ready = "1";\n</script>\n</body>\n</html>\n`); }
  // Next.js：服务端组件页面，演示是客户端组件（app/demos/ 里，和 React 的同一套文件）
  { const env = by.react.envs[0], dir = path.join(ROOT, env.dir);
    write(path.join(dir, "app/gallery/page.jsx"), `${JNOTE}\nimport "../../../shared/gallery.css";\n${list.map((d) => `import ${compName(d.slug)} from "../demos/${d.slug}.jsx";`).join("\n")}\n\nexport default function Gallery() {\n  return (\n    <main className="gallery">\n${jsxBody()}\n    </main>\n  );\n}\n`); }
  // Nuxt：页面路由 /gallery（app.vue 换成 <NuxtPage />，原来的示例搬到 pages/index.vue）
  { const env = by.vue.envs[0], dir = path.join(ROOT, env.dir);
    write(path.join(dir, "app/pages/gallery.vue"), `${NOTE}\n<script setup>\nimport "../../../shared/gallery.css";\n${list.map((d) => `import ${compName(d.slug)} from "../demos/${d.slug}.vue";`).join("\n")}\n</script>\n\n<template>\n<main class="gallery">\n${htmlBody()}\n</main>\n</template>\n`); }
  console.log(`入口页：${FRAMEWORKS.length} 个框架 + Next.js、Nuxt，${list.length} 个演示`);
}
