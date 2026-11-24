// 纯样式组件的契约示例（只有标记、没有脚本：卡片、空状态、标签、芯片……）：从一份框架无关的标记写出 7 种写法的 TypeScript 代码文件，
// 写进 spec/components/_api/code/<slug>/（html.html、react.tsx、vue.vue、svelte.svelte、angular.ts、solid.tsx、preact.tsx），写完可以再手改。
// 规则（照各框架的惯用法，不加 setup / enhance 样板，也不加初始化注释）：
//   · 图标 data-i="名字[:before|:after|:caret|:chk]"：React、Preact、Vue、Svelte 换成 <Icon name>（Satin 的图标组件）；Angular、Solid、纯 HTML 保留 data-i，外面包一层 <sn-enhance>
//   · React：class → className、for → htmlFor、tabindex → tabIndex 等，style 写成对象，空元素自闭合；Preact、Solid 用 class，style 写字符串
//   · 标记里换行的地方照样换行（JSX 会去掉"换行 + 缩进"这种空白：行内文字之间要留空格就写在同一行）
// 有交互（要用 React / Vue 封装、受控写法）的示例别用这个，手写。
// 用法：node scripts/spec/static-variants.mjs <slug> <标记文件 | ->   （- 从标准输入读）
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const ROOT = path.resolve(import.meta.dirname, "../..");
const require = createRequire(path.join(ROOT, "package.json"));
const { parseHTML } = require("linkedom");
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const REACT_ATTR = { class: "className", for: "htmlFor", tabindex: "tabIndex", readonly: "readOnly", maxlength: "maxLength", minlength: "minLength", autocomplete: "autoComplete", autofocus: "autoFocus", colspan: "colSpan", rowspan: "rowSpan", srcset: "srcSet", crossorigin: "crossOrigin", enterkeyhint: "enterKeyHint", inputmode: "inputMode", spellcheck: "spellCheck", contenteditable: "contentEditable", frameborder: "frameBorder", allowfullscreen: "allowFullScreen", playsinline: "playsInline", novalidate: "noValidate", "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin", "fill-rule": "fillRule", "clip-rule": "clipRule", viewbox: "viewBox" };
const BOOL = new Set(["disabled", "checked", "selected", "readonly", "required", "multiple", "hidden", "open", "autofocus", "novalidate", "playsinline", "muted", "loop", "autoplay", "controls"]);
const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const styleObj = (s) => "{{ " + s.split(";").map((d) => d.trim()).filter(Boolean).map((d) => { const i = d.indexOf(":"), k = d.slice(0, i).trim(), v = d.slice(i + 1).trim(); return `${k.startsWith("--") ? JSON.stringify(k) : camel(k)}: ${/^-?\d+(\.\d+)?$/.test(v) ? v : JSON.stringify(v)}`; }).join(", ") + " }}";
const jsxText = (t) => (/[{}<>]/.test(t) ? t.replace(/[{}<>]+/g, (m) => `{${JSON.stringify(m)}}`) : t);
const htmlText = (t) => t.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]);

// 一棵 DOM → 某种写法的标记。icons："component"（<Icon name>）或 "attr"（保留 data-i）
function serialize(node, fw, icons) {
  const jsx = fw === "react" || fw === "preact" || fw === "solid";
  const out = [];
  const iconTag = (name, cls) => `<Icon name="${name}"${cls ? ` ${fw === "react" ? "className" : "class"}="${cls}"` : ""} />`;
  const walk = (n) => {
    if (n.nodeType === 3) {
      const t = n.textContent;
      // 文字里的花括号：JSX、Svelte 是表达式，Angular 是 ICU 消息的开头，都要转义
      out.push(jsx ? jsxText(t) : fw === "svelte" ? htmlText(t).replace(/[{}]/g, (c) => `{'${c}'}`) : fw === "angular" ? htmlText(t).replace(/[{}]/g, (c) => `{{ '${c}' }}`) : htmlText(t));
      return;
    }
    if (n.nodeType === 8) return;
    if (n.nodeType !== 1) return;
    const tag = n.localName;
    let pre = "", post = "";
    const attrs = [];
    for (const a of n.attributes) {
      let k = a.name, v = a.value;
      if (k === "data-i" && icons === "component") {
        const [name, pos] = v.split(":");
        // 只有图标的空 span：整个换成 <Icon>
        if (tag === "span" && !n.className && !n.childNodes.length) { out.push(iconTag(name, pos && pos !== "before" && pos !== "chk" ? `sn-${pos}` : "")); return; }
        if (!pos || pos === "before") pre = iconTag(name);
        else if (pos === "chk") post = `<span ${fw === "react" ? "className" : "class"}="sn-chk">${iconTag(name)}</span>`;
        else post = iconTag(name, `sn-${pos}`);
        continue;
      }
      if (fw === "react") {
        if (k === "style") { attrs.push(`style=${styleObj(v)}`); continue; }
        k = REACT_ATTR[k] || k;
        if (BOOL.has(a.name) && (v === "" || v === a.name)) { attrs.push(k === "checked" ? "defaultChecked" : k); continue; }
        if (k === "value" && (tag === "input" || tag === "textarea")) { attrs.push(`defaultValue=${JSON.stringify(v)}`); continue; }
      } else if (jsx) {
        if (BOOL.has(k) && (v === "" || v === k)) { attrs.push(k); continue; }
      }
      attrs.push(v === "" && !jsx ? k : `${k}=${JSON.stringify(v)}`);
    }
    const open = `<${tag}${attrs.length ? " " + attrs.join(" ") : ""}`;
    if (VOID.has(tag)) { out.push(open + (jsx ? " />" : ">")); return; }
    out.push(open + ">" + pre);
    for (const c of n.childNodes) walk(c);
    out.push(post + `</${tag}>`);
  };
  for (const c of node.childNodes) walk(c);
  return out.join("");
}
const indent = (s, pad) => s.split("\n").map((l) => (l.trim() ? pad + l : l)).join("\n");
const dedent = (s) => { const ls = s.replace(/^\n+|\s+$/g, "").split("\n"); const m = Math.min(...ls.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length)); return ls.map((l) => l.slice(m)).join("\n"); };

export function staticVariants(src, slug) {
  const { document } = parseHTML("<!doctype html><html><body></body></html>");
  const host = document.createElement("div"); host.innerHTML = dedent(src.replace(/<!--[\s\S]*?-->/g, ""));
  const hasIcon = !!host.querySelector("[data-i]");
  const comp = slug.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
  const wrapEnh = (s) => (hasIcon ? `<sn-enhance>\n${indent(s, "  ")}\n</sn-enhance>` : s);
  const html = wrapEnh(serialize(host, "html", "attr"));
  const react = serialize(host, "react", "component"), preact = serialize(host, "preact", "component"), solid = wrapEnh(serialize(host, "solid", "attr"));
  const vue = serialize(host, "vue", "component"), svelte = serialize(host, "svelte", "component");
  const ret = (s) => (s.includes("\n") ? `(\n${indent(s, "    ")}\n  )` : s);
  const multi = (s) => host.childElementCount > 1 || host.children.length === 0 ? `<>\n${indent(s, "  ")}\n</>` : s;
  return {
    html: html + "\n",
    react: `${hasIcon ? 'import { Icon } from "satin-ui/react";\n\n' : ""}export default function ${comp}() {\n  return ${ret(multi(react))};\n}\n`,
    preact: `${hasIcon ? 'import { Icon } from "satin-ui/react";\n\n' : ""}export default function ${comp}() {\n  return ${ret(multi(preact))};\n}\n`,
    solid: `export default function ${comp}() {\n  return ${ret(multi(solid))};\n}\n`,
    vue: `${hasIcon ? '<script setup lang="ts">\nimport { Icon } from "satin-ui/vue";\n</script>\n\n' : ""}<template>\n${indent(vue, "  ")}\n</template>\n`,
    svelte: `${hasIcon ? '<script lang="ts">\n  import Icon from "satin-ui/svelte/Icon.svelte";\n</script>\n\n' : ""}${svelte}\n`,
    angular: `import { Component${hasIcon ? ", CUSTOM_ELEMENTS_SCHEMA" : ""} } from "@angular/core";\n\n@Component({\n  selector: "demo-${slug}",${hasIcon ? "\n  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>" : ""}\n  template: \`\n${indent(wrapEnh(serialize(host, "angular", "attr")), "    ").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")}\n  \`,\n})\nexport class ${comp}Component {}\n`,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [slug, file] = process.argv.slice(2);
  if (!slug || !file) { console.log("用法：node scripts/spec/static-variants.mjs <slug> <标记文件 | ->"); process.exit(2); }
  const src = fs.readFileSync(file === "-" ? 0 : file, "utf8");
  const files = staticVariants(src, slug), dir = path.join(ROOT, "spec/components/_api/code", slug);
  fs.mkdirSync(dir, { recursive: true });
  const EXT = { html: "html", react: "tsx", vue: "vue", svelte: "svelte", angular: "ts", solid: "tsx", preact: "tsx" };
  for (const [fw, code] of Object.entries(files)) fs.writeFileSync(path.join(dir, `${fw}.${EXT[fw]}`), code);
  console.log(`写了 ${path.relative(ROOT, dir)}/ 下 7 个文件`);
}
