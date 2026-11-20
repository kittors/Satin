// 静态检查：扫源码（CSS / SCSS / LESS / HTML / Vue / Svelte / JSX / TSX / JS / TS），查能在源码里判断的规则：
// color-token、spacing-scale、no-gradient、no-colored-shadow、motion-props、easing-token、no-ai-icons、marketing-copy、font-weight、real-content、focus-visible。
// 也认 Tailwind 的工具类（低级模型常用）：bg-gradient-to-*、text-gray-500、p-[13px]、font-bold、transition-all……
import fs from "node:fs";
import path from "node:path";
import { parseCSS, parseInline, splitTop } from "./css.mjs";
import { findColors, neutral } from "./color.mjs";
import { nearestColor, SCALE, spaceHint, SIZES, sizeHint, nearestEase } from "./tokens.mjs";
import { finding } from "./rules.mjs";
// Satin 里存在的全部 --sn-* 变量（令牌 + 组件样式、脚本里用到的），由 scripts/test/sync.mjs 从库里收集成快照
const KNOWN = (() => { try { return new Set(JSON.parse(fs.readFileSync(new URL("./vars.snapshot.json", import.meta.url), "utf8"))); } catch { return null; } })();
let DEFINED = new Set(); // 这次扫到的文件里自己定义的 --sn-* 变量也算存在
// Satin 里存在的全部 sn- 类名（样式选择器 + 脚本里写的），同样由 sync.mjs 收集
const KNOWN_CLS = (() => { try { return new Set(JSON.parse(fs.readFileSync(new URL("./classes.snapshot.json", import.meta.url), "utf8"))); } catch { return null; } })();

const EXT = /\.(css|scss|sass|less|html?|vue|svelte|jsx|tsx|js|mjs|cjs|ts|astro)$/i;
const SKIP_DIR = /(^|\/)(\.[^./][^/]*|_check|_shots|node_modules|dist|build|\.next|\.nuxt|\.output|\.svelte-kit|\.angular|\.turbo|\.vercel|coverage|\.git|\.parity|out)(\/|$)/;
// Satin 自己的样式（令牌定义、组件样式）不查
const SKIP_FILE = /(^|\/)(packages\/satin-ui\/css|node_modules\/satin-ui)\/|\.min\.(js|css)$|\.d\.ts$/;

export function listFiles(inputs) {
  const out = [];
  const rec = (p) => {
    let st; try { st = fs.statSync(p); } catch { return; }
    if (st.isDirectory()) { if (SKIP_DIR.test(p + "/")) return; for (const f of fs.readdirSync(p)) rec(path.join(p, f)); return; }
    if (EXT.test(p) && !SKIP_FILE.test(p) && st.size < 1.5e6) out.push(p);
  };
  for (const i of inputs) rec(path.resolve(i));
  return out;
}

// ———— 提取：从各种文件里拿出 CSS、行内样式、class、界面文字、图标名、JS 动画关键帧 ————
const lineOf = (src, i) => src.slice(0, i).split("\n").length;
// JS：把注释换成空格（字符串、模板字符串、正则原样留着），并收集字符串和模板字符串（带行号）
function scanJS(src) {
  let masked = "", i = 0; const strings = [];
  const prevSig = () => { for (let k = masked.length - 1; k >= 0; k--) { const c = masked[k]; if (!/\s/.test(c)) return c; } return ""; };
  const prevWord = () => (/([A-Za-z_$][\w$]*)\s*$/.exec(masked) || [])[1] || "";
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (c === "/" && n === "/") { const e = src.indexOf("\n", i); const end = e < 0 ? src.length : e; masked += " ".repeat(end - i); i = end; continue; }
    if (c === "/" && n === "*") { const e = src.indexOf("*/", i + 2), end = e < 0 ? src.length : e + 2; masked += src.slice(i, end).replace(/[^\n]/g, " "); i = end; continue; }
    if (c === "'" || c === '"') {
      let j = i + 1; while (j < src.length && src[j] !== c && src[j] !== "\n") j += src[j] === "\\" ? 2 : 1;
      strings.push({ text: src.slice(i + 1, j), line: lineOf(src, i), start: i }); masked += src.slice(i, j + 1); i = j + 1; continue;
    }
    if (c === "`") {
      // 模板字符串：${…} 里面可能还有字符串，简单按大括号配平跳过
      let j = i + 1, text = "", depth = 0;
      while (j < src.length) {
        if (depth === 0 && src[j] === "`") break;
        if (src[j] === "\\") { text += src.slice(j, j + 2); j += 2; continue; }
        if (depth === 0 && src[j] === "$" && src[j + 1] === "{") { depth = 1; text += "\u0000"; j += 2; continue; }
        if (depth > 0) { if (src[j] === "{") depth++; else if (src[j] === "}") depth--; j++; continue; }
        text += src[j]; j++;
      }
      const tag = (/([\w$.]+)\s*$/.exec(src.slice(Math.max(0, i - 40), i)) || [])[1] || "";
      strings.push({ text, line: lineOf(src, i), start: i, template: true, tag }); masked += src.slice(i, j + 1); i = j + 1; continue;
    }
    // 正则字面量：前面是运算符、括号、逗号、关键字时 / 是正则
    if (c === "/" && masked[masked.length - 1] !== "<" && (/[(,=:[!&|?{};+\-*%<>~^]/.test(prevSig()) || prevSig() === "" || /^(return|typeof|case|in|of|delete|void|throw|new)$/.test(prevWord()))) {
      let j = i + 1, cls = false; while (j < src.length && src[j] !== "\n") { if (src[j] === "\\") { j += 2; continue; } if (src[j] === "[") cls = true; else if (src[j] === "]") cls = false; else if (src[j] === "/" && !cls) break; j++; }
      if (src[j] === "/") { j++; while (/[a-z]/i.test(src[j] || "")) j++; masked += src.slice(i, j); i = j; continue; }
    }
    masked += c; i++;
  }
  return { masked, strings };
}
// 一个标签的属性：name="…" / name='…' / name={"…"} / name={`…`}
const ATTR_RE = /([:@]?[\w.:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*"([^"]*)"\s*\}|\{\s*'([^']*)'\s*\}|\{\s*`([^`]*)`\s*\})/g;
function extractMarkup(src, file, units, baseLine = 1) {
  // <style>、<script> 先拿出来，原位置换成空白（行号不变）
  let rest = src.replace(/<style(\s[^>]*)?>([\s\S]*?)<\/style>/gi, (m, a = "", body, off) => { units.css.push({ text: body, line: baseLine + lineOf(src, off + m.indexOf(">") + 1) - 1, scss: /lang=["']?(scss|less|sass)/.test(a) }); return m.replace(/[^\n]/g, " "); });
  rest = rest.replace(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi, (m, a = "", body, off) => { if (!/type=["']?(application\/(ld\+)?json|text\/template)/.test(a)) extractJS(body, file, units, baseLine + lineOf(src, off + m.indexOf(">") + 1) - 1, true); return m.replace(/[^\n]/g, " "); });
  extractTags(rest, units, baseLine);
}
// 标签：行内样式、class、文字类属性、图标属性、SVG 颜色属性；标签之间的文字
function extractTags(src, units, baseLine = 1) {
  const TAG = /<([A-Za-z][\w.:-]*)((?:\s+(?:[^\s"'>={}]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|\{(?:[^{}]|\{[^{}]*\})*\}|[^\s"'>]+))?|\{[^{}]*\}))*)\s*\/?>/g;
  let m;
  while ((m = TAG.exec(src))) {
    const tag = m[1], attrs = m[2] || "", line = baseLine + lineOf(src, m.index) - 1;
    units.tags.push({ tag, line });
    if (tag === "a" && /(^|\s)(:?href|to)\s*=/.test(attrs) && !/(^|\s)(class|className|:class)\s*=/.test(attrs)) (units.bareLinks ||= []).push({ line });
    let a; ATTR_RE.lastIndex = 0;
    while ((a = ATTR_RE.exec(attrs))) {
      const name = a[1].replace(/^[:@]|^v-bind:/, ""), val = a[2] ?? a[3] ?? a[4] ?? a[5] ?? a[6] ?? "";
      if (/^style$/i.test(name)) units.inline.push({ text: val, line });
      else if (/^(class|classname|class:list)$/i.test(name)) units.classes.push({ text: val, line });
      else if (/^(placeholder|title|aria-label|alt|label|text|description|subtitle|data-tip|value)$/i.test(name) && !/^\s*[{[]/.test(val)) units.text.push({ text: val, line, kind: "attr" });
      if ((/^(data-i|data-icon|data-lucide|icon|iconname|icon-name|leading-icon|trailing-icon|prepend-icon|append-icon)$/i.test(name) || (/^name$/i.test(name) && /icon|^i$|^svg$|^ion-/i.test(tag))) && val) units.icons.push({ name: val.split(":")[0].trim(), line, how: `${name}="${val}"` });
      if (/^(fill|stroke|stop-color|color|flood-color|lighting-color)$/i.test(name)) units.attrColors.push({ prop: name.toLowerCase(), value: val, line, tag });
    }
    // JSX 行内样式对象：style={{ color: "#666", padding: 13 }}
    const so = /\bstyle\s*=\s*\{\{([\s\S]*?)\}\}/.exec(attrs);
    if (so) units.inline.push({ text: jsxStyleToCSS(so[1]), line });
    // 图标组件：<Sparkles />、<WandSparkles>、<BotIcon>
    if (AI_ICON_COMPONENT.test(tag)) units.icons.push({ name: tag, line, how: `<${tag}>` });
  }
  // 标签之间的文字（去掉 {{ }}、{ } 里的表达式）
  const TEXT = />([^<>]+)</g;
  while ((m = TEXT.exec(src))) {
    const t = m[1].replace(/\{\{[\s\S]*?\}\}/g, " ").replace(/\{[^{}]*\}/g, " ").trim();
    if (t && /[\p{L}\p{Extended_Pictographic}]/u.test(t)) units.text.push({ text: t, line: baseLine + lineOf(src, m.index) - 1, kind: "text" });
  }
}
// { color: "#666", paddingTop: 13 } → "color: #666; padding-top: 13px"
function jsxStyleToCSS(body) {
  const out = [];
  for (const m of body.matchAll(/([A-Za-z$_][\w$]*|"[^"]+"|'[^']+')\s*:\s*("[^"]*"|'[^']*'|`[^`]*`|-?[\d.]+)/g)) {
    const key = m[1].replace(/^["']|["']$/g, ""), prop = key.startsWith("--") ? key : key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()).replace(/^(webkit|moz|ms)-/, "-$1-");
    let v = m[2].replace(/^["'`]|["'`]$/g, "");
    if (/^-?[\d.]+$/.test(v) && !/^(opacity|z-index|flex|flex-grow|flex-shrink|order|font-weight|line-height|scale|zoom)$/.test(prop) && +v !== 0) v += "px";
    out.push(`${prop}: ${v}`);
  }
  return out.join("; ");
}
function extractJS(src, file, units, baseLine = 1, inHTML = false) {
  const { masked, strings } = scanJS(src);
  for (const s of strings) {
    const line = baseLine + s.line - 1;
    // CSS-in-JS：css`…`、styled.div`…`、keyframes`…`、createGlobalStyle`…`
    if (s.template && /(^|\.)(css|keyframes|createGlobalStyle|injectGlobal|global|styled(\.\w+)?)$|\)$/.test(s.tag) && /[:;{]/.test(s.text)) { units.css.push({ text: s.text.replace(/\u0000/g, "0"), line, cssInJs: true }); continue; }
    // 字符串里拼的 HTML（innerHTML = `<div style="…">`）
    if (/<[a-z][\w-]*[\s>]/i.test(s.text)) extractTags(s.text.replace(/\u0000/g, " "), units, line);
    else if (isUIText(s.text)) units.text.push({ text: s.text.replace(/\u0000/g, " "), line, kind: "string" });
    if (!s.template && CLASSY.test(s.text.trim()) && UTILITY.test(s.text)) units.classes.push({ text: s.text, line });
    if (AI_ICON_NAME.test(s.text.trim()) && s.text.trim().length < 24) units.icons.push({ name: s.text.trim(), line, how: `"${s.text.trim()}"` });
  }
  // JSX：标签、属性、标签之间的文字（在去掉注释的源码上找）
  if (!inHTML || /<[A-Z]/.test(masked)) extractTags(masked, units, baseLine);
  // 图标库的导入：import { Sparkles, Wand2 } from "lucide-react"
  for (const m of masked.matchAll(/import\s*\{([^}]*)\}\s*from\s*["']([^"']*(icon|lucide|heroicons|tabler|phosphor|feather|remix)[^"']*)["']/gi))
    for (const name of m[1].split(",").map((x) => x.trim().split(/\s+as\s+/)[0]).filter(Boolean)) if (AI_ICON_COMPONENT.test(name)) units.icons.push({ name, line: baseLine + lineOf(masked, m.index) - 1, how: `import { ${name} } from "${m[2]}"` });
  // WAAPI：el.animate([{ width: … }], …)
  for (const m of masked.matchAll(/\.animate\(\s*(\[[\s\S]*?\]|\{[\s\S]*?\})\s*,/g)) units.animate.push({ text: m[1], line: baseLine + lineOf(masked, m.index) - 1 });
}
// 像界面文字的字符串：有中文、有 emoji，或者是带空格的句子 / 感叹号结尾；排除代码样的
const isUIText = (t) => t && t.length < 400 && !/[{};=]|=>|\$\{|^\.?\/|^\w+:\/\/|^#[0-9a-f]{3,8}$/i.test(t) && (/[一-鿿\p{Extended_Pictographic}]/u.test(t) || /\b(lorem|ipsum|todo|xxx)\b/i.test(t) || (/[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(t) && /[!.?]\s*$|^[A-Z]/.test(t)));
// 像 class 列表的字符串（cn("p-4 text-gray-500", …) 这类）：全是工具类样式的词，至少有一个常见工具类前缀
const CLASSY = /^[\w:.\-[\]/#%()!]+(\s+[\w:.\-[\]/#%()!]+)*$/;
const UTILITY = /(^|\s)(?:[\w-]+:)*(bg-|text-|-?[pm][trblxyse]?-|gap-|space-[xy]-|shadow|drop-shadow|font-|rounded|border|ring-|transition|duration-|ease-|animate-|uppercase|tracking-|outline-none|from-|via-|to-)/;
const AI_ICON_NAME = /^(sparkles?|wand(-?2)?|wand-sparkles|magic(-wand)?|wand-magic(-sparkles)?|bot|robot|brain(-circuit)?|stars|sparkle)$/i;
const AI_ICON_COMPONENT = /^(Sparkles?|Sparkle|WandSparkles|Wand2?|MagicWand|WandMagic(Sparkles)?|Bot|BotIcon|Robot|RobotIcon|Brain|BrainCircuit|BrainIcon|Stars|SparklesIcon|StarsIcon)$/;

// ———— 声明检查 ————
const SPACE_PROP = /^(?:padding|margin)(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?$|^(?:gap|row-gap|column-gap|grid-gap|grid-row-gap|grid-column-gap)$/;
const LAYOUT_PROP = /^(width|height|min-width|max-width|min-height|max-height|top|left|right|bottom|inset(-[\w-]+)?|margin(-[\w-]+)?|padding(-[\w-]+)?|border-width|border-(top|right|bottom|left)-width|font-size|line-height|letter-spacing|flex|flex-basis|grid-template-(columns|rows))$/;
const SPIN_SEL = /spin|rotat|progress|indet|loading|loader|marquee|shimmer|skeleton|(^|[\s.-])sk([\s.-]|$)|ticker|pulse-ring/i;
const EASE_KW = /\b(ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end)\b|cubic-bezier\([^)]*\)|steps\([^)]*\)|linear\([^)]*\)/g;
const lengthPx = (tok) => { if (tok === "0") return 0; const m = /^(-?[\d.]+)(px|rem)$/.exec(tok); return m ? (m[2] === "rem" ? +m[1] * 16 : +m[1]) : null; };
const timeMs = (tok) => { const m = /^([\d.]+)(ms|s)$/.exec(tok); return m ? (m[2] === "s" ? +m[1] * 1000 : +m[1]) : null; };
const tokens = (v) => v.replace(/\([^()]*\)/g, (m) => m.replace(/\s+/g, "")).split(/\s+/).filter(Boolean);

function checkDecl(d, where, out, srcLine = "") {
  const { prop, value } = d, sel = d.selector || "", v = value.trim();
  if (KNOWN) for (const m of v.matchAll(/var\(\s*(--sn-[\w-]+)/g)) if (!KNOWN.has(m[1]) && !DEFINED.has(m[1])) out.push(finding("token-exists", where, `${m[1]} 不是 Satin 的令牌（写错了名字，这条样式不会生效）`));
  if (!v || /^(inherit|initial|unset|revert|none)$/i.test(v)) return;
  const isMask = /^(-webkit-)?mask/.test(prop);
  const gradient = /\b(repeating-)?(linear|radial|conic)-gradient\(/i.test(v);
  // no-eyebrow：全大写英文小标签（眉题）
  if (prop === "text-transform" && /\buppercase\b/.test(v)) out.push(finding("no-eyebrow", where, `text-transform: ${v}`, "中文界面不放全大写、加字距的英文小标签（眉题）；标题上面不放小字，层级靠字号和说明文字"));
  // no-gradient
  if (/^background(-image)?$/.test(prop) && gradient && !SPIN_SEL.test(sel)) out.push(finding("no-gradient", where, `${prop} 用了渐变：${v.slice(0, 80)}`));
  if (/^(-webkit-)?background-clip$/.test(prop) && /\btext\b/.test(v)) out.push(finding("no-gradient", where, "background-clip: text（渐变文字）"));
  if (prop === "-webkit-text-fill-color" && /transparent/.test(v)) out.push(finding("no-gradient", where, "-webkit-text-fill-color: transparent（渐变文字）"));
  // no-colored-shadow
  if (/^(box-shadow|text-shadow|filter|-webkit-filter|-webkit-box-shadow)$/.test(prop) && !/^none$/.test(v)) {
    const part = /filter/.test(prop) ? (v.match(/drop-shadow\((?:[^()]|\([^()]*\))*\)/g) || []).join(" ") : v;
    const colored = findColors(part).filter((c) => c.rgba && c.rgba[3] > 0 && !neutral(c.rgba));
    if (colored.length) out.push(finding("no-colored-shadow", where, `${prop} 是彩色的（${colored.map((c) => c.text).join("、")}）：发光、彩色投影`));
    else if (!/var\(--sn-/.test(part)) {
      const layers = /filter/.test(prop) ? (part.match(/drop-shadow\(((?:[^()]|\([^()]*\))*)\)/g) || []).map((x) => x.slice(12, -1)) : splitTop(part);
      for (const layer of layers) { const ls = tokens(layer.replace(/(rgba?|hsla?|color)\([^)]*\)/g, "")).map(lengthPx).filter((x) => x != null); if (ls.length >= 3 && ls[2] > 40) { out.push(finding("no-colored-shadow", where, `${prop} 模糊半径 ${ls[2]}px，又不是令牌：一大片光晕`)); break; } }
    }
  }
  // color-token（阴影、遮罩、渐变里的颜色由上面两条管；--sn-* 是在覆盖 Satin 的令牌，允许）
  if (!prop.startsWith("--sn-") && !/shadow|filter/.test(prop) && !isMask && !gradient && !/^(content|font-family|src|grid-template-areas)$/.test(prop)) {
    for (const c of findColors(v)) {
      if (c.rgba && c.rgba[3] === 0) continue;
      const near = c.rgba && nearestColor(c.rgba, prop);
      out.push(finding("color-token", where, `${prop} 写死了颜色 ${c.text}`, near ? (near.brand ? `品牌色用 var(--sn-accent)（主色在主题里换：theme.set({ accent: "blue" }) 或自定义颜色）；颜色只表达状态，装饰性的彩色去掉` : `换成 var(${near.name})（浅色 ${near.light}，深色 ${near.dark}）——深浅主题、换主色都会跟着变`) : undefined));
    }
  }
  // spacing-scale（这一行写了 sp-ok 注释的放过）
  if (SPACE_PROP.test(prop) && !/sp-ok/.test(srcLine) && !/calc\(|var\(/.test(v)) {
    for (const t of tokens(v)) { const px = lengthPx(t); if (px == null || px === 1 || px === -1) continue; if (!SCALE.includes(Math.abs(px))) out.push(finding("spacing-scale", where, `${prop}: ${t} 不在间距刻度上`, spaceHint(px))); }
  }
  // font-weight / 字号
  if (prop === "font-weight" && /^(\d+|bold|bolder|lighter)$/i.test(v) && !/^(400|500|600)$/.test(v)) out.push(finding("font-weight", where, `font-weight: ${v}`, "只用 400（正文）、500（强调）、600（标题）；标题直接用 sn-t-title1 / sn-t-title2 / sn-t-title3"));
  if (prop === "font") { const w = /(?:^|\s)(100|200|300|700|800|900|bold|bolder|lighter)(?=\s)/i.exec(" " + v + " "); if (w) out.push(finding("font-weight", where, `font 里的字重 ${w[1]}`, "只用 400、500、600")); }
  const fs_ = prop === "font-size" ? v : prop === "font" ? (/(?:^|\s)([\d.]+(?:px|rem))(?:\/|\s)/.exec(v) || [])[1] : null;
  if (fs_ && !/calc|var|clamp|%|em\b/.test(fs_)) { const px = lengthPx(fs_); if (px != null && px !== 0 && !SIZES.includes(Math.round(px * 100) / 100)) out.push(finding("font-weight", where, `字号 ${fs_} 不在排版档上（11 12 13 14 15 17 22 28）`, sizeHint(px))); }
  // motion-props：transition 里动布局属性 / all
  if (prop === "transition" || prop === "transition-property") {
    for (const item of splitTop(v)) {
      const toks = tokens(item), names = prop === "transition-property" ? toks : toks.filter((t) => !/^[\d.]+m?s$/.test(t) && !/^(ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end|allow-discrete|normal)$/.test(t) && !/^(cubic-bezier|steps|linear|var)\(/.test(t));
      const p = names[0] || "all";
      if (p === "all") out.push(finding("motion-props", where, `${prop}: ${prop === "transition" && !names[0] ? `${item.trim()}（没写属性，等于 all）` : "all"}`, "列出具体属性：transform、opacity，或者状态色 background-color、color、border-color、box-shadow"));
      else if (LAYOUT_PROP.test(p)) out.push(finding("motion-props", where, `过渡了布局属性 ${p}（每帧重排，会掉帧）`, "位移改 transform: translate()，大小改 transform: scale()，展开收起用 grid-template-rows 0fr→1fr 或 scale"));
    }
  }
  if (d.keyframes && LAYOUT_PROP.test(prop)) out.push(finding("motion-props", where, `@keyframes 里动了布局属性 ${prop}`, "关键帧只写 transform、opacity、filter"));
  // easing-token：曲线不是 --sn-ease-*，时长超过 500ms
  if (/^(transition|animation)(-timing-function)?$/.test(prop) && !/^none$/.test(v)) {
    const spinner = SPIN_SEL.test(sel) || SPIN_SEL.test(v) || /infinite/.test(v);
    for (const item of splitTop(v)) {
      if (/var\(--sn-ease-/.test(item)) continue;
      // 时长是 0（只是延迟切换）、或者过渡的是 visibility / display 这类离散属性：不需要曲线
      const times = tokens(item).map(timeMs).filter((x) => x != null);
      if ((times.length && times[0] === 0) || /^\s*(visibility|display|content-visibility|overlay)\b/.test(item)) continue;
      const eases = item.match(EASE_KW) || [];
      if (!eases.length && /^(transition|animation)$/.test(prop) && !/var\(/.test(item)) { if (!spinner) out.push(finding("easing-token", where, `${prop}: ${item.trim()} 没写曲线（默认是 ease）`, "出现用 var(--sn-ease-out)，消失用 var(--sn-ease-in)，留在屏上换位用 var(--sn-ease-in-out)")); continue; }
      for (const e of eases) {
        if (/^linear$/.test(e) && spinner) continue;
        if (/^steps|^step-/.test(e)) continue;
        out.push(finding("easing-token", where, `曲线 ${e} 不是 Satin 的曲线令牌`, `最接近 var(${nearestEase(e)})；出现用 --sn-ease-out、消失用 --sn-ease-in、换位用 --sn-ease-in-out、勾选和开关用 --sn-ease-overshoot`));
      }
      for (const t of tokens(item)) { const ms = timeMs(t); if (ms != null && ms > 500 && !spinner) out.push(finding("easing-token", where, `时长 ${t} 超过 500ms`, "悬停、按下 100–150ms；Toast、菜单 150–250ms；对话框、抽屉 250–350ms；整页切换不超过 500ms")); }
    }
  }
}
// 一条规则里的组合：大写 + 宽字距
function checkRule(r, where, out) {
  const get = (p) => r.decls.filter((d) => d.prop === p).pop()?.value;
  const tt = get("text-transform"), ls = get("letter-spacing");
  void tt; void ls; // 全大写 + 宽字距的小标签改由 checkDecl 里的 no-eyebrow 报（原来记在 font-weight 名下）
}

// ———— Tailwind 工具类 ————
const TW_COLORS = "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const TW_SIZE = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, "2xl": 24, "3xl": 30, "4xl": 36, "5xl": 48, "6xl": 60, "7xl": 72, "8xl": 96, "9xl": 128 };
function checkClasses(cls, where, out) {
  // 按空白、引号、逗号、花括号切（方括号里的任意值 p-[13px]、冒号前缀 hover: 留着）
  const list = cls.replace(/\$\{[^}]*\}|\{\{[^}]*\}\}/g, " ").split(/[\s"'`,{}]+|(?<![\w-])[()?](?![\w-])/).map((c) => c.replace(/^[()?!]+|[()?]+$/g, "")).filter((c) => c && !/^(true|false|null|undefined|&&|\|\|)$/.test(c));
  const has = (re) => list.find((c) => re.test(c.replace(/^([\w-]+:)+/, "")));
  if (KNOWN_CLS) { const bad = [...new Set(list.filter((c) => /^sn-[a-z0-9-]+$/.test(c) && !KNOWN_CLS.has(c)))]; if (bad.length) out.push(finding("class-exists", where, `Satin 没有这些类：${bad.slice(0, 6).join("、")}${bad.length > 6 ? "……" : ""}（没有样式，不会生效）`)); }
  let x;
  if ((x = has(/^bg-(gradient-to-|linear-|radial|conic)/))) out.push(finding("no-gradient", where, `渐变工具类 ${x}`));
  if ((x = has(/^bg-clip-text$/))) out.push(finding("no-gradient", where, "bg-clip-text（渐变文字）"));
  if ((x = has(new RegExp(`^(drop-)?shadow-(${TW_COLORS})-\\d`)))) out.push(finding("no-colored-shadow", where, `彩色投影 ${x}`));
  for (const c of list) {
    const base = c.replace(/^([\w-]+:)+/, "");
    const cm = new RegExp(`^(text|bg|border(-[trblxy])?|ring|outline|fill|stroke|from|via|to|divide|placeholder|accent|caret|decoration)-(${TW_COLORS}|black|white)(-\\d{2,3})?(\\/\\d+)?$`).exec(base);
    if (cm && !/^(from|via|to)$/.test(cm[1])) out.push(finding("color-token", where, `写死的颜色工具类 ${c}`, `${/^text|placeholder|caret|fill|stroke/.test(cm[1]) ? "文字用 var(--sn-label) / var(--sn-label2) / var(--sn-label3)" : /^bg/.test(cm[1]) ? "底色用 var(--sn-canvas) / var(--sn-raised) / var(--sn-sunken)" : "线用 var(--sn-line) / var(--sn-line-control)"}；状态用 --sn-danger / --sn-success / --sn-warning（写成 bg-[var(--sn-raised)] 这类，或者直接用 Satin 的组件类）`));
    if (/^(text|bg|border|fill|stroke)-\[(#|rgb|hsl)/.test(base)) out.push(finding("color-token", where, `写死的颜色 ${c}`));
    const sp = /^-?(p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y)-(\d+(?:\.\d+)?|\[(-?[\d.]+)(px|rem)\])$/.exec(base);
    if (sp) { const px = sp[3] != null ? (sp[4] === "rem" ? +sp[3] * 16 : +sp[3]) : +sp[2] * 4; if (px !== 1 && !SCALE.includes(px)) out.push(finding("spacing-scale", where, `${c} = ${px}px，不在间距刻度上`, spaceHint(px))); }
    if (/^font-(thin|extralight|light|bold|extrabold|black)$/.test(base)) out.push(finding("font-weight", where, `${c}`, "字重只用 font-normal（400）、font-medium（500）、font-semibold（600）"));
    const ts = /^text-(xs|sm|base|lg|xl|[2-9]xl|\[([\d.]+)(px|rem)\])$/.exec(base);
    if (ts) { const px = ts[2] ? (ts[3] === "rem" ? +ts[2] * 16 : +ts[2]) : TW_SIZE[ts[1]]; if (!SIZES.includes(px)) out.push(finding("font-weight", where, `${c} = ${px}px，不在排版档上`, sizeHint(px))); }
    if (base === "transition-all" || /^transition-\[(width|height|top|left|margin|padding)/.test(base)) out.push(finding("motion-props", where, `${c}`, "用 transition-transform / transition-opacity / transition-colors，不要 all"));
    if (/^ease-(in|out|in-out|linear)$/.test(base)) out.push(finding("easing-token", where, `${c} 不是 Satin 的曲线`, "用 ease-[var(--sn-ease-out)] 这类，或者 Satin 组件自带的动效"));
    const du = /^duration-(\d+)$/.exec(base); if (du && +du[1] > 500) out.push(finding("easing-token", where, `${c} 超过 500ms`));
    if (/^animate-(bounce|ping)$/.test(base)) out.push(finding("easing-token", where, `${c}：无限循环的弹跳、脉冲`, "去掉；需要提示就用一次性的过渡"));
    if (/^(fa-(magic|wand-magic(-sparkles)?|robot|wand-sparkles)|bi-stars|mdi-(robot|creation|auto-fix|magic-staff)|(i-)?lucide-(sparkles|wand|bot|brain)|ri-magic|ph-sparkle)/.test(base)) out.push(finding("no-ai-icons", where, `AI 套路图标 ${c}`));
  }
  if (has(/^uppercase$/) && has(/^tracking-(wide|wider|widest|\[)/)) out.push(finding("font-weight", where, "uppercase + 宽字距 的小标签", "去掉；分组标题用 sn-t-micro"));
  if (list.some((c) => /^(focus:)?outline-none$/.test(c)) && !list.some((c) => /^focus-visible:/.test(c))) out.push(finding("focus-visible", where, `${has(/outline-none/)} 去掉了焦点框，没给 focus-visible 的替代样式`, "加 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--sn-focus)]，或者只写 focus:outline-none 配 focus-visible:ring"));
}

// ———— 文字 ————
const MARKETING = /智能|一键|赋能|极致|革命性|颠覆|黑科技/;
const FAKE = /\b(lorem|ipsum|todo|fixme|xxx)\b|示例文本|测试数据|占位文字|用户\s*[A-D]\b|test\s*data/i;
const EMOJI = /\p{Emoji_Presentation}|\p{Extended_Pictographic}️/u;
function checkText(t, where, out) {
  const s = t.text.trim(); if (!s) return;
  if (EMOJI.test(s)) out.push(finding("no-ai-icons", where, `界面文案里有 emoji：${s.slice(0, 40)}`, "删掉 emoji；需要图标就用字面意思的线性图标（Satin 的 icon()），按钮以文字为主"));
  const mk = MARKETING.exec(s);
  if (mk || /！/.test(s) || (/[\p{L}\p{N}][!]$/u.test(s) && t.kind !== "string") || (/[\p{L}][!]$/u.test(s) && /\s/.test(s))) out.push(finding("marketing-copy", where, `营销腔：${s.slice(0, 40)}${mk ? `（"${mk[0]}"）` : "（感叹号）"}`));
  const fk = FAKE.exec(s); if (fk) out.push(finding("real-content", where, `假数据 / 占位文案：${s.slice(0, 40)}（"${fk[0]}"）`));
}

// ———— 焦点：:focus 上去掉 outline，又没有 :focus-visible 的替代 ————
function checkFocus(allRules, out) {
  const visible = allRules.filter((r) => /:focus-visible/.test(r.selector) && r.decls.some((d) => (/^outline(-width|-style)?$/.test(d.prop) && !/^(none|0(px)?)$/.test(d.value.trim())) || (d.prop === "box-shadow" && d.value.trim() !== "none")));
  for (const r of allRules) {
    if (!/:focus(?![-\w])/.test(r.selector) || /:not\(:focus-visible\)/.test(r.selector)) continue;
    if (!r.decls.some((d) => (d.prop === "outline" && /^(none|0(px)?)(\s|$)/.test(d.value.trim())) || (d.prop === "outline-style" && d.value.trim() === "none") || (d.prop === "outline-width" && /^0/.test(d.value.trim())))) continue;
    const bases = splitTop(r.selector).map((s) => s.replace(/:focus(?![-\w])/g, "").trim() || "*");
    const ok = bases.every((b) => visible.some((v) => splitTop(v.selector).some((s) => { const vb = s.replace(/:focus-visible/g, "").trim() || "*"; return vb === b || vb === "*" || b === "*"; })));
    if (!ok) out.push(finding("focus-visible", `${r.file}:${r.line}`, `${r.selector} 去掉了焦点框，没有对应的 :focus-visible 样式`, `改成 ${bases[0]}:focus:not(:focus-visible) { outline: none }，再加 ${bases[0]}:focus-visible { outline: 2px solid var(--sn-focus); outline-offset: 2px }`));
  }
}

export function runStatic(inputs, { root = process.cwd() } = {}) {
  const files = listFiles(inputs), out = [], allRules = [];
  // 先把这批文件里自己定义的 --sn-* 变量收起来（用在定义前面的也不报）
  DEFINED = new Set(); for (const file of files) for (const m of fs.readFileSync(file, "utf8").matchAll(/(--sn-[\w-]+)\s*:/g)) DEFINED.add(m[1]);
  for (const file of files) {
    const src = fs.readFileSync(file, "utf8"), rel = path.relative(root, file) || file, lines = src.split("\n");
    const units = { css: [], inline: [], classes: [], text: [], icons: [], tags: [], attrColors: [], animate: [] };
    if (/\.(css|scss|sass|less)$/i.test(file)) units.css.push({ text: src, line: 1, scss: /\.(scss|sass|less)$/i.test(file) });
    else if (/\.(html?|vue|svelte|astro)$/i.test(file)) extractMarkup(src, file, units);
    else extractJS(src, file, units);
    const at = (line) => `${rel}:${line}`;
    for (const u of units.css) {
      let parsed; try { parsed = parseCSS(u.text, { line: u.line, lineComments: u.scss || u.cssInJs }); } catch { continue; }
      for (const d of parsed.decls) checkDecl(d, at(d.line), out, lines[d.line - 1] || "");
      for (const r of parsed.rules) if (r.decls.length) { checkRule(r, at(r.line), out); allRules.push({ ...r, file: rel }); }
    }
    for (const u of units.inline) for (const d of parseInline(u.text, u.line)) checkDecl(d, at(u.line), out, lines[u.line - 1] || "");
    for (const c of units.attrColors) checkDecl({ prop: c.prop === "color" ? "color" : "fill", value: c.value, selector: c.tag }, at(c.line), out);
    for (const c of units.classes) checkClasses(c.text, at(c.line), out);
    for (const l of units.bareLinks || []) out.push(finding("link-style", at(l.line), "<a href> 没有 class：浏览器默认的蓝色、下划线", "文字链接用 class=\"sn-link\"；导航里的用侧栏 / 面包屑的标记；像按钮的用 class=\"sn-btn sn-ghost\""));
    for (const t of units.text) checkText(t, at(t.line), out);
    for (const i of units.icons) if (AI_ICON_NAME.test(i.name) || AI_ICON_COMPONENT.test(i.name)) out.push(finding("no-ai-icons", at(i.line), `AI 套路图标：${i.how}`, "换成字面意思的图标（生成用 play 或 plus，或者直接写\"生成\"两个字）；AI 功能不需要专门的图标"));
    for (const a of units.animate) for (const m of a.text.matchAll(/\b(width|height|top|left|right|bottom|margin\w*|padding\w*|inset\w*|fontSize|lineHeight)\s*:/g)) { out.push(finding("motion-props", at(a.line), `element.animate() 的关键帧动了布局属性 ${m[1]}`, "关键帧只写 transform、opacity、filter")); break; }
  }
  checkFocus(allRules, out);
  // 同一处同一条规则同一句话只报一次
  const seen = new Set();
  return { files: files.length, findings: out.filter((f) => { const k = f.rule + "|" + f.where + "|" + f.problem; if (seen.has(k)) return false; seen.add(k); return true; }) };
}
