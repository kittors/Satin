// 官网的组件目录：直接读组件展示页（../index.html）。目录分组、每一块的标题、说明、要点、演示源码都从那里来，只维护一份。
let pending = null;
export const loadCatalog = () => (pending ??= fetch(new URL("../index.html", import.meta.url)).then((r) => r.text()).then(parse));

// 归到"规范"里讲的基础块（颜色、排版……），不放进组件列表
export const FOUNDATION = "基础";

function parse(html) {
  const doc = new DOMParser().parseFromString(html, "text/html"), groups = [];
  let g = null;
  for (const el of doc.querySelector(".doc-nav").children) {
    if (el.tagName === "P") groups.push((g = { name: el.textContent.trim(), items: [] }));
    else if (el.tagName === "A" && g) { const it = section(doc, el.getAttribute("href").slice(1), el.textContent.trim(), g.name); if (it) g.items.push(it); }
  }
  const all = groups.flatMap((x) => x.items);
  return { groups, all, byId: Object.fromEntries(all.map((i) => [i.id, i])), components: all.filter((i) => i.group !== FOUNDATION) };
}

function section(doc, id, name, group) {
  const s = doc.getElementById(id); if (!s) return null;
  const h2 = s.querySelector(":scope > h2"), small = h2?.querySelector("small");
  const title = h2 ? [...h2.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim() : name;
  const demos = []; let cap = "";
  for (const el of s.children) {
    if (el.tagName === "H3") cap = el.textContent.trim();
    else if (el.classList.contains("demo")) { demos.push({ cap, html: clean(el.innerHTML) }); cap = ""; }
  }
  return {
    id, name, group, title: title || name, en: small?.textContent.trim() || "",
    desc: s.querySelector(":scope > p")?.innerHTML.trim() || "",
    rules: [...s.querySelectorAll(":scope > .rules > li")].map((li) => li.innerHTML.trim()),
    demos,
  };
}

// 演示源码整理成能直接抄的样子：去掉公共缩进、空属性写回简写（checked="" → checked）
function clean(html) {
  const lines = html.replace(/=""/g, "").split("\n");
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  const ind = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length));
  return lines.map((l) => l.slice(ind)).join("\n");
}

// 简单的 HTML 着色：标签、属性名、属性值、注释（只给代码块用）
export function highlight(src) {
  const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return src.replace(/<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>|[^<]+/g, (m) => {
    if (m.startsWith("<!--")) return `<span class="k-cm">${esc(m)}</span>`;
    if (!m.startsWith("<")) return esc(m);
    // 属性一次扫过去：name="值" 或光秃秃的 name，引号里的字不会再被当成属性
    return m.replace(/^(<\/?)([a-zA-Z0-9-]+)([\s\S]*?)(\/?>)$/, (_, a, tag, attrs, z) =>
      `<span class="k-tg">${esc(a)}${tag}</span>`
      + attrs.replace(/([^\s=]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g, (__, n, v) => `<span class="k-at">${esc(n)}</span>` + (v ? `=<span class="k-st">${esc(v)}</span>` : ""))
      + `<span class="k-tg">${esc(z)}</span>`);
  });
}

// JS 片段着色：关键字、字符串、注释
export function highlightJS(src) {
  const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return src.replace(/(\/\/[^\n]*)|("[^"\n]*"|'[^'\n]*'|`[^`]*`)|\b(import|from|export|const|let|function|return|new|await|async|if|else|for|of)\b|([^"'`/\w]+|\w+|\/)/g,
    (m, cm, st, kw) => cm ? `<span class="k-cm">${esc(cm)}</span>` : st ? `<span class="k-st">${esc(st)}</span>` : kw ? `<span class="k-tg">${kw}</span>` : esc(m));
}
