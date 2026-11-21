// 一段演示（标记 + 可选的脚本 + 可选的演示用样式）→ 四种写法：HTML、React、Vue、自定义元素。
// 文档页每个组件演示、每个配方的代码区用它（切换写法）；scripts/examples/gallery.mjs 也用它把 61 块生成进 9 个框架示例，
// 构建、截图和设计稿逐块比——所以文档里给的代码就是示例里真正跑过、截过图的代码。
// 输入是 DOM 节点（浏览器里的 template.content，或者 linkedom 解析出来的），不依赖页面。
// 空白：HTML 里元素之间的空白在行内排版时是一个空格；JSX 会删掉跨行的空白、Vue 也会。所以只在"两边都是行内元素、父元素不是 flex / grid"
// 的地方保留一个空格（JSX 写 {" "}，Vue 写在同一行）。浏览器里传 inline(el) 按计算样式判断；没传就按标签猜。

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const BOOL = new Set(["disabled", "checked", "selected", "readonly", "required", "multiple", "hidden", "open", "autofocus", "novalidate", "inert", "muted", "controls", "loop", "autoplay", "playsinline", "default", "reversed", "allowfullscreen", "formnovalidate", "async", "defer", "nomodule", "itemscope"]);
const REACT_ATTR = {
  class: "className", for: "htmlFor", tabindex: "tabIndex", readonly: "readOnly", maxlength: "maxLength", minlength: "minLength", colspan: "colSpan", rowspan: "rowSpan",
  contenteditable: "contentEditable", autocomplete: "autoComplete", autofocus: "autoFocus", spellcheck: "spellCheck", enterkeyhint: "enterKeyHint", inputmode: "inputMode",
  crossorigin: "crossOrigin", srcset: "srcSet", playsinline: "playsInline", novalidate: "noValidate", datetime: "dateTime", allowfullscreen: "allowFullScreen",
  popovertarget: "popoverTarget", popovertargetaction: "popoverTargetAction", accesskey: "accessKey", "accept-charset": "acceptCharset", "http-equiv": "httpEquiv",
  formaction: "formAction", formnovalidate: "formNoValidate", referrerpolicy: "referrerPolicy", usemap: "useMap", frameborder: "frameBorder", hreflang: "hrefLang",
  charset: "charSet", fetchpriority: "fetchPriority", "xlink:href": "xlinkHref", "xml:space": "xmlSpace", "xmlns:xlink": "xmlnsXlink", "xml:lang": "xmlLang",
};
const INLINE_TAGS = new Set(["a", "abbr", "b", "bdi", "bdo", "br", "button", "cite", "code", "data", "dfn", "em", "i", "img", "input", "kbd", "label", "mark", "q", "s", "samp", "select", "small", "span", "strong", "sub", "sup", "svg", "textarea", "time", "u", "var", "wbr"]);
const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
// 标记里的组件元素 <sn-xxx> 在 React、Vue 里换成现成的组件（satin-ui/react、satin-ui/vue）；vk：受控的那一项（React 里写 defaultXxx 当初始值，不锁死）
export const ELEMS = {
  "sn-segmented": { react: "Segmented", vue: "SnSegmented", vk: "value" }, "sn-slider": { react: "Slider", vue: "SnSlider", vk: "value" },
  "sn-select": { react: "Select", vue: "SnSelect", vk: "value" }, "sn-otp": { react: "Otp", vue: "SnOtp", vk: "code" }, "sn-tabs": { react: "Tabs", vue: "SnTabs", vk: "value" },
  "sn-pager": { react: "Pager", vue: "SnPager", vk: "page" }, "sn-collapse": { react: "Collapse", vue: "SnCollapse", vk: "open" }, "sn-tag-input": { react: "TagInput", vue: "SnTagInput", vk: "tags" },
  "sn-stepper": { react: "Stepper", vue: "SnStepper", vk: "value" }, "sn-number-flow": { react: "NumberFlow", vue: "SnNumberFlow", vk: "" },
};
const parseAttr = (v) => { try { const x = JSON.parse(v); return typeof x === "string" ? null : x; } catch { return null; } };
const pascal = (s) => camel("-" + s).replace(/[^A-Za-z0-9]/g, "");
const escHTML = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;");
const escAttr = (t) => t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/ /g, "&nbsp;");

// 默认的"是不是行内"：按标签猜；元素自己带 sn-btn、sn-tag 这类行内块的类名也算
export const guessInline = (el) => INLINE_TAGS.has(el.localName) || el.localName.includes("-");
export const guessFlex = (el) => /(^|\s)(sn-row|sn-stack|sn-cols|sn-group|sn-acts|sn-seg|sn-tab-list|sn-chips|row|stack|sn-page-hd|sn-panel-hd|sn-panel-ft|sn-bottom-bar)(\s|$)/.test(el.getAttribute?.("class") || "");

// 一个元素的子节点：去掉不影响排版的空白，留下的空白都折成一个空格。返回 [{ el } | { text }]
function kids(el, inline, flex) {
  const out = [], ns = [...el.childNodes].filter((n) => n.nodeType === 1 || n.nodeType === 3);
  const isFlex = flex(el);
  for (let i = 0; i < ns.length; i++) {
    const n = ns[i];
    if (n.nodeType === 1) { out.push({ el: n }); continue; }
    const t = n.textContent.replace(/[ \t\n\r\f]+/g, " ");
    if (t.trim()) { out.push({ text: t }); continue; }
    // 纯空白：两边都是行内元素、父元素不是 flex / grid 才算一个空格
    const prev = ns[i - 1], next = ns[i + 1];
    if (!isFlex && prev?.nodeType === 1 && next?.nodeType === 1 && inline(prev) && inline(next)) out.push({ text: " ", gap: true });
  }
  // 首尾的空白（块里开头、结尾）不影响排版
  if (out[0]?.text) out[0] = { ...out[0], text: out[0].text.replace(/^ /, "") };
  const last = out[out.length - 1]; if (last?.text) out[out.length - 1] = { ...last, text: last.text.replace(/ $/, "") };
  return out.filter((k) => k.el || k.text);
}
const mixed = (ks) => ks.some((k) => k.text && !k.gap);

// ———— React（JSX） ————
const styleObj = (css) => {
  const o = [];
  for (const decl of css.split(";")) {
    const i = decl.indexOf(":"); if (i < 0) continue;
    const k = decl.slice(0, i).trim(), v = decl.slice(i + 1).trim(); if (!k) continue;
    const key = k.startsWith("--") ? JSON.stringify(k) : /^-(webkit|moz|ms)-/.test(k) ? camel(k.replace(/^-(\w)/, (_, c) => c.toUpperCase())) : camel(k);
    o.push(`${key}: ${JSON.stringify(v)}`);
  }
  return `{{ ${o.join(", ")} }}`;
};
function jsxAttrs(el, inSvg) {
  const custom = el.localName.includes("-"), out = [];
  for (const { name, value } of el.attributes) {
    if (/^on/i.test(name)) continue; // 行内事件不搬（演示的标记里没有）
    let k = name, v = value;
    if (k === "style") { out.push(`style=${styleObj(v)}`); continue; }
    if (custom) k = k === "class" ? "className" : k; // 自定义元素：属性名原样（React 19 当属性写）
    else if (REACT_ATTR[k]) k = REACT_ATTR[k];
    else if (inSvg && !k.startsWith("data-") && !k.startsWith("aria-")) k = camel(k);
    if (!custom && (el.localName === "input" || el.localName === "textarea") && k === "value") k = "defaultValue";
    if (!custom && el.localName === "input" && k === "checked") k = "defaultChecked";
    if (el.localName === "option" && k === "selected") continue; // 选中项写到 <select defaultValue>
    if (BOOL.has(name) && (v === "" || v === name) && !custom && !name.startsWith("data-")) { out.push(k === "defaultChecked" ? "defaultChecked" : k); continue; }
    out.push(/["\n\\]/.test(v) ? `${k}={${JSON.stringify(v)}}` : `${k}="${v}"`);
  }
  if (el.localName === "select") { const sel = [...el.querySelectorAll("option")].find((o) => o.hasAttribute("selected")); if (sel) out.push(`defaultValue=${JSON.stringify(sel.getAttribute("value") ?? sel.textContent)}`); }
  return out.length ? " " + out.join(" ") : "";
}
const jsxText = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\{/g, '{"{"}').replace(/\}/g, '{"}"}').replace(/ /g, "&nbsp;");
export function toJSX(node, { inline = guessInline, flex = guessFlex, indent = "", used = null } = {}) {
  const el = (n, ind, inSvg) => {
    const E = ELEMS[n.localName];
    if (E && used) {
      used.add(E.react);
      const ps = [...n.attributes].filter((x) => x.name !== "style" && x.name !== "class").map(({ name, value }) => {
        const k = camel(name) === E.vk && E.vk ? "default" + E.vk[0].toUpperCase() + E.vk.slice(1) : camel(name), j = parseAttr(value);
        return j !== null ? `${k}={${JSON.stringify(j)}}` : /["\n\\]/.test(value) ? `${k}={${JSON.stringify(value)}}` : `${k}="${value}"`;
      });
      return `${ind}<${E.react}${ps.length ? " " + ps.join(" ") : ""} />`;
    }
    const svg = inSvg || n.localName === "svg", tag = n.localName, a = jsxAttrs(n, svg);
    if (tag === "textarea") { const v = n.textContent; return `${ind}<textarea${a}${v ? ` defaultValue=${JSON.stringify(v)}` : ""} />`; }
    if (VOID.has(tag)) return `${ind}<${tag}${a} />`;
    const ks = kids(n, inline, flex);
    if (!ks.length) return `${ind}<${tag}${a}></${tag}>`;
    if (mixed(ks) || ks.every((k) => k.text)) return `${ind}<${tag}${a}>${ks.map((k) => (k.el ? el(k.el, "", svg) : jsxText(k.text))).join("")}</${tag}>`;
    return `${ind}<${tag}${a}>\n${ks.map((k) => (k.el ? el(k.el, ind + "  ", svg) : `${ind}  {" "}`)).join("\n")}\n${ind}</${tag}>`;
  };
  const ks = kids(node, inline, flex);
  return ks.map((k) => (k.el ? el(k.el, indent, false) : `${indent}${k.gap ? '{" "}' : jsxText(k.text.trim())}`)).join("\n");
}

// ———— Vue 模板 / 原样 HTML（自定义元素那一页、HTML 那一页） ————
function htmlAttrs(el) { return [...el.attributes].map(({ name, value }) => (value === "" && BOOL.has(name) ? ` ${name}` : ` ${name}="${escAttr(value)}"`)).join(""); }
export function toHTML(node, { inline = guessInline, flex = guessFlex, indent = "", vue = false, used = null } = {}) {
  const text = (t) => (vue ? escHTML(t).replace(/\{\{/g, "{{ '{{' }}") : escHTML(t));
  const el = (n, ind) => {
    const E = vue && ELEMS[n.localName];
    if (E && used) {
      used.add(E.vue);
      const ps = [...n.attributes].filter((x) => x.name !== "style" && x.name !== "class").map(({ name, value }) => { const j = parseAttr(value); return j !== null ? `:${name}='${JSON.stringify(j).replace(/'/g, "&#39;")}'` : `${name}="${escAttr(value)}"`; });
      return `${ind}<${E.vue}${ps.length ? " " + ps.join(" ") : ""} />`;
    }
    const tag = n.localName, a = htmlAttrs(n);
    if (VOID.has(tag)) return `${ind}<${tag}${a}>`;
    if (tag === "pre" || tag === "textarea" || tag === "script" || tag === "style") return `${ind}<${tag}${a}>${tag === "pre" ? n.innerHTML : escHTML(n.textContent)}</${tag}>`;
    const ks = kids(n, inline, flex);
    if (!ks.length) return `${ind}<${tag}${a}></${tag}>`;
    if (mixed(ks) || ks.every((k) => k.text)) return `${ind}<${tag}${a}>${ks.map((k) => (k.el ? el(k.el, "") : text(k.text))).join("")}</${tag}>`;
    // 结构性的子元素一行一个；中间要留空格的两个放在同一行（Vue 会删掉跨行的空白）
    const lines = []; let line = "";
    ks.forEach((k, i) => {
      if (k.gap) { line += " "; return; }
      const s = el(k.el, ind + "  ");
      if (i > 0 && ks[i - 1].gap) line += s.trimStart(); else { if (line) lines.push(line); line = s; }
    });
    if (line) lines.push(line);
    return `${ind}<${tag}${a}>\n${lines.join("\n")}\n${ind}</${tag}>`;
  };
  return kids(node, inline, flex).map((k) => (k.el ? el(k.el, indent) : k.gap ? `${indent} ` : indent + text(k.text.trim()))).join("\n");
}

// ———— 脚本：把演示里的 JS 搬进组件 ————
// import 提到文件顶上；document.querySelector → root.querySelector（只在这一块里找）；setup()、injectIcons(document) 去掉（外面统一做）
export function splitJS(js = "") {
  const imports = [], body = [];
  for (const line of js.split("\n")) {
    if (/^import\s.+from\s+["'][^"']+["'];?\s*$/.test(line) || /^import\s+["'][^"']+["'];?\s*$/.test(line)) imports.push(line.trim());
    else body.push(line);
  }
  let b = body.join("\n").trim();
  b = b.replace(/^\s*setup\(\);?[^\n]*\n?/gm, "").replace(/^\s*injectIcons\(document\);?[^\n]*\n?/gm, "")
    .replace(/document\.querySelector(All)?\(/g, (_, all) => `root.querySelector${all || ""}(`).replace(/document\.getElementById\((["'])([^"']+)\1\)/g, (_, q, id) => `root.querySelector("#${id}")`);
  return { imports, body: b.trim() };
}
// 合并 import：同一个来源的具名导入并成一行
export function mergeImports(lines) {
  const named = new Map(), other = [];
  for (const l of lines) {
    const m = l.match(/^import\s+\{([^}]*)\}\s+from\s+(["'][^"']+["']);?$/);
    if (m) { const src = m[2].replace(/'/g, '"'); if (!named.has(src)) named.set(src, new Set()); for (const n of m[1].split(",").map((x) => x.trim()).filter(Boolean)) named.get(src).add(n); }
    else if (!other.includes(l)) other.push(l);
  }
  return [...[...named].map(([src, ns]) => `import { ${[...ns].join(", ")} } from ${src};`), ...other];
}
const ind = (s, pre) => s.split("\n").map((l) => (l ? pre + l : l)).join("\n");

const ELEM_OF_VUE = (vueName) => Object.values(ELEMS).find((e) => e.vue === vueName).react; // satin-ui/vue 的导出名和 React 的一样（Segmented），模板里叫 SnSegmented
// 主函数：{ node: 演示标记的父节点（取它的子节点）, js, css, name } → { html, react, vue, element }，每种都是 [{ name, lang, code }]
export function variants({ node, js = "", css = "", name = "Demo", htmlCode, inline, flex }) {
  const opt = { inline, flex };
  const markup = htmlCode ?? toHTML(node, opt);
  const { imports, body } = splitJS(js);
  const comp = pascal(name) + (/demo$/i.test(name) ? "" : "Demo");
  const cssFile = css ? [{ name: "demo.css", lang: "css", code: css }] : [];
  const hasBody = !!body;
  // React：一个组件，挂载时 setup()（引用计数）+ enhance(根元素, 自己的接线)，卸载时撤掉
  const rUsed = new Set(), jsx = toJSX(node, { ...opt, indent: "      ", used: rUsed });
  const rImports = mergeImports(['import { useEffect, useRef } from "react";', 'import { setup, enhance } from "satin-ui";', ...(rUsed.size ? [`import { ${[...rUsed].join(", ")} } from "satin-ui/react";`] : []), ...imports, ...(css ? ['import "./demo.css";'] : [])]);
  const react = `${rImports.join("\n")}\n\nexport default function ${comp}() {\n  const ref = useRef(null);\n  useEffect(() => {\n    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数\n    const off = enhance(ref.current${hasBody ? `, (root) => {\n${ind(body, "      ")}\n    }` : ""}); // 接上标记里的交互；返回撤销函数\n    return () => { off(); unsetup(); };\n  }, []);\n  return (\n    <div ref={ref}>\n${jsx}\n    </div>\n  );\n}`;
  // Vue：同样的生命周期
  const vUsed = new Set(), tpl = toHTML(node, { ...opt, indent: "    ", vue: true, used: vUsed });
  const vImports = mergeImports(['import { ref, onMounted, onBeforeUnmount } from "vue";', 'import { setup, enhance } from "satin-ui";', ...(vUsed.size ? [`import { ${[...vUsed].map((n) => `${ELEM_OF_VUE(n)} as ${n}`).join(", ")} } from "satin-ui/vue";`] : []), ...imports, ...(css ? ['import "./demo.css";'] : [])]);
  const vue = `<script setup>\n${vImports.join("\n")}\n\nconst root = ref(null);\nlet off = () => {};\nonMounted(() => {\n  const unsetup = setup();\n  const done = enhance(root.value${hasBody ? `, (root) => {\n${ind(body, "    ")}\n  }` : ""});\n  off = () => { done(); unsetup(); };\n});\nonBeforeUnmount(() => off());\n</script>\n\n<template>\n  <div ref="root">\n${tpl}\n  </div>\n</template>`;
  // 自定义元素：<sn-enhance> 包住标记，放进页面自动接上、移出页面自动撤掉；自己的接线写在脚本里
  const eScript = mergeImports(['import { defineElements } from "satin-ui/elements";', ...imports]);
  const element = `<sn-enhance>\n${ind(markup, "  ")}\n</sn-enhance>\n\n<script type="module">\n${ind([...eScript, "", "defineElements(); // 注册 <sn-enhance> 和 <sn-segmented>、<sn-select> 这些元素", ...(hasBody ? ["", `customElements.whenDefined("sn-enhance").then(() => {\n  const root = document.querySelector("sn-enhance");\n${ind(body, "  ")}\n});`] : [])].join("\n"), "  ")}\n</script>`;
  return {
    react: [{ name: comp + ".jsx", lang: "jsx", code: react }, ...cssFile],
    vue: [{ name: comp + ".vue", lang: "vue", code: vue }, ...cssFile],
    element: [{ name: "HTML", lang: "html", code: element }, ...cssFile],
  };
}

// 演示用的样式（展示页的 kit-demo.css 里给演示排版的类，库里没有）：标记里用到的、不带 sn- 前缀的类，把相关的规则挑出来
export function demoCSS(sheetText, node) {
  const used = new Set(); for (const el of [node, ...node.querySelectorAll("*")]) for (const c of el.classList || []) if (!c.startsWith("sn-")) used.add(c);
  if (!used.size) return "";
  const rules = [], re = /([^{}]+)\{([^{}]*)\}/g; let m;
  const flat = sheetText.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@media[^{]+\{((?:[^{}]*\{[^{}]*\})*)\s*\}/g, ""); // 先不管媒体查询里的
  while ((m = re.exec(flat))) {
    const sel = m[1].trim(); if (!sel || sel.startsWith("@")) continue;
    const parts = sel.split(",").map((s) => s.trim()).filter((s) => { const cls = s.match(/\.([\w-]+)/g) || []; return cls.length && cls.every((c) => c.startsWith(".sn-") || used.has(c.slice(1))) && cls.some((c) => used.has(c.slice(1))); });
    if (parts.length) rules.push(`${parts.join(", ")} { ${m[2].trim().replace(/\s*;\s*/g, "; ").replace(/;\s*$/, ";")} }`);
  }
  return rules.join("\n");
}
