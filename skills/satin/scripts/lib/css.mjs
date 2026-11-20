// 极简 CSS 解析：够检查器用就行——规则、合并后的选择器、声明、行号、外面套着的 @ 规则（@media / @keyframes……）。
// 不依赖 postcss：技能整个拷到别的项目里也能直接跑。支持嵌套（SCSS / LESS / 原生 CSS 嵌套里的 &）、// 行注释（SCSS / LESS）。
// 返回 { decls: [{ prop, value, important, line, selector, at: [..], keyframes: bool }], rules: [{ selector, at, line, decls }] }

// 把注释换成空格（换行留着，行号不变）
function stripComments(src, lineComments) {
  let out = "", i = 0, q = null;
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (q) { out += c; if (c === "\\") { out += n ?? ""; i += 2; continue; } if (c === q) q = null; i++; continue; }
    if (c === '"' || c === "'") { q = c; out += c; i++; continue; }
    if (c === "/" && n === "*") { const e = src.indexOf("*/", i + 2), end = e < 0 ? src.length : e + 2; out += src.slice(i, end).replace(/[^\n]/g, " "); i = end; continue; }
    // // 行注释：前面不能是 :（url 里的 http://）
    if (lineComments && c === "/" && n === "/" && src[i - 1] !== ":") { const e = src.indexOf("\n", i); const end = e < 0 ? src.length : e; out += " ".repeat(end - i); i = end; continue; }
    out += c; i++;
  }
  return out;
}
// 嵌套选择器合并：父 "a, b" + 子 "&:hover, .c" → "a:hover, b:hover, a .c, b .c"
function combine(parent, child) {
  if (!parent) return child;
  const ps = splitTop(parent), cs = splitTop(child), out = [];
  for (const c of cs) for (const p of ps) out.push(c.includes("&") ? c.replace(/&/g, p) : `${p} ${c}`);
  return out.join(", ");
}
// 按顶层逗号切（括号里的逗号不切）
export function splitTop(s) {
  const out = []; let d = 0, cur = "", q = null;
  for (const c of s) {
    if (q) { cur += c; if (c === q) q = null; continue; }
    if (c === '"' || c === "'") q = c;
    if (c === "(" || c === "[") d++; else if (c === ")" || c === "]") d--;
    if (c === "," && d === 0) { out.push(cur.trim()); cur = ""; } else cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

export function parseCSS(src, { line = 1, lineComments = false } = {}) {
  const s = stripComments(src, lineComments);
  const lineStarts = [0]; for (let i = 0; i < s.length; i++) if (s[i] === "\n") lineStarts.push(i + 1);
  const lineAt = (i) => { let lo = 0, hi = lineStarts.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (lineStarts[m] <= i) lo = m; else hi = m - 1; } return lo + line; };
  const root = { selector: "", at: [], keyframes: false, decls: [] }, stack = [root], rules = [], decls = [];
  let buf = "", start = -1, paren = 0, q = null;
  const flush = () => {
    const t = buf.trim(), top = stack[stack.length - 1];
    if (t && !t.startsWith("@")) {
      const m = /^([$@]?[-\w]+)\s*:\s*([\s\S]*)$/.exec(t);
      if (m) {
        let value = m[2].trim(), important = false;
        if (/!\s*important\s*$/i.test(value)) { important = true; value = value.replace(/!\s*important\s*$/i, "").trim(); }
        const d = { prop: m[1].toLowerCase().startsWith("--") ? m[1] : m[1].toLowerCase(), value, important, line: lineAt(start), selector: top.selector, at: top.at, keyframes: top.keyframes };
        decls.push(d); top.decls.push(d);
      }
    }
    buf = ""; start = -1;
  };
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { buf += c; if (c === "\\") { buf += s[i + 1] ?? ""; i++; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { if (start < 0) start = i; q = c; buf += c; continue; }
    if (c === "(") paren++; else if (c === ")") paren = Math.max(0, paren - 1);
    if (paren === 0 && c === "{") {
      const pre = buf.trim(), top = stack[stack.length - 1];
      const fr = pre.startsWith("@")
        ? { selector: top.selector, at: [...top.at, pre], keyframes: top.keyframes || /^@(-\w+-)?keyframes\b/i.test(pre), decls: [] }
        : { selector: top.keyframes ? top.selector : combine(top.selector, pre), at: top.at, keyframes: top.keyframes, decls: [], frame: top.keyframes ? pre : undefined };
      fr.line = lineAt(start < 0 ? i : start);
      stack.push(fr); rules.push(fr); buf = ""; start = -1; continue;
    }
    if (paren === 0 && (c === ";" || c === "}")) { flush(); if (c === "}" && stack.length > 1) stack.pop(); continue; }
    if (start < 0 && !/\s/.test(c)) start = i;
    buf += c;
  }
  flush();
  return { decls, rules };
}

// 一段 style="…" 里的声明
export function parseInline(style, line = 1) { return parseCSS(`x{${style}}`, { line }).decls.map((d) => ({ ...d, selector: "" })); }
