# 导入时没有副作用：把各模块顶层的 document / window 读取和全局监听，挪进显式的 installXxx()；
# 展示页 main.js 在最开头按原来模块的执行顺序依次调用（监听注册的先后和原来一样）。
# 每处替换都断言"原文存在"，改不到就报错，不会静默漏改。
import re, sys, pathlib

ROOT = pathlib.Path.cwd()
def edit(path, pairs):
    p = ROOT / path; s = p.read_text()
    for old, new in pairs:
        if old not in s: sys.exit(f"没找到（{path}）：{old[:120]}")
        s = s.replace(old, new, 1)
    p.write_text(s)

# ———— core.js：$ 不再去展示页的暂存容器里找；root 惰性；Tooltip 的容器和委托监听进 installTooltips() ————
edit("packages/satin-ui/src/core.js", [
    ('''// 嵌入模式（官网文档里的演示 iframe）只把要演示的那一块留在页面上，别的区块挪进一个不挂到页面上的容器（见 index.html 末尾）：
// 在整页里按选择器找不到时再去那里找——各模块给别的区块接线的代码照样跑、不报错，但那些元素不算样式、不排版、不画
const rest = () => globalThis.__satinRest;
export const $ = (s, r = document) => r.querySelector(s) ?? (r === document && rest() ? rest().querySelector(s) : null), $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const root = document.documentElement;''',
     '''export const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
// 根元素：在 Node / SSR 里导入时没有 document，这里是 undefined（只在浏览器里调用的函数才用到它）
export const root = typeof document !== "undefined" ? document.documentElement : undefined;'''),
    ('''const tip = $("#tip") || document.body.appendChild(Object.assign(document.createElement("div"), { className: "sn-tip", id: "tip", popover: "manual" }));
let tipTimer = 0, lastHide = 0, tipFor = null;''',
     '''let tip = null, tipTimer = 0, lastHide = 0, tipFor = null;
const tipEl = () => (tip ??= document.getElementById("sn-tip") || document.body.appendChild(Object.assign(document.createElement("div"), { className: "sn-tip", id: "sn-tip", popover: "manual" })));'''),
    ('''export function showTip(el, text) {
  if (!tip.matches(":popover-open")) tip.showPopover();''', '''export function showTip(el, text) {
  tipEl(); if (!tip.matches(":popover-open")) tip.showPopover();'''),
    ('''export const resetTipLayer = () => { hideTip(); if (tip.matches(":popover-open")) tip.hidePopover(); };''',
     '''export const resetTipLayer = () => { hideTip(); if (tip?.matches(":popover-open")) tip.hidePopover(); };'''),
    ('''document.addEventListener("pointerover", (e) => {''', '''// 页面级：悬停 / 聚焦带 data-tip 的元素出提示。setup() 里装一次（展示页在 main.js 开头按原来的顺序装）
export function installTooltips() {
tipEl();
document.addEventListener("pointerover", (e) => {'''),
    ('''addEventListener("scroll", hideTip, { passive: true });''', '''addEventListener("scroll", hideTip, { passive: true });
}'''),
])

# ———— form.js：5 个页面级监听 ————
s = (ROOT / "packages/satin-ui/src/form.js").read_text()
lines = s.split("\n")
idx = [i for i, l in enumerate(lines) if l.startswith("document.addEventListener(")]
if len(idx) != 5: sys.exit(f"form.js 顶层监听不是 5 个：{len(idx)}")
# 原样挪进 installForms，按原来的先后
moved = []
for i in reversed(idx): moved.insert(0, lines.pop(i))
s = "\n".join(lines).rstrip("\n") + "\n\n// 页面级：复选框勾上时弹一下、下拉在外面点一下就收起、字段改了就清错、抖动结束去掉类、带 aria-disabled 的按钮点了不触发（只出提示）。\n// setup() 里装一次\nexport function installForms() {\n" + "\n".join(moved) + "\n}\n"
(ROOT / "packages/satin-ui/src/form.js").write_text(s)

# ———— input.js：抖动结束去掉类 ————
edit("packages/satin-ui/src/input.js", [
    ('''document.addEventListener("animationend", (e) => e.target.classList?.remove("sn-nudge"));''',
     '''// 页面级：字数到顶时计数抖一下，抖完去掉类。setup() 里装一次
export function installInputs() { document.addEventListener("animationend", (e) => e.target.classList?.remove("sn-nudge")); }'''),
])

# ———— lightbox.js：看图的键盘 ————
s = (ROOT / "packages/satin-ui/src/lightbox.js").read_text()
m = re.search(r'\ndocument\.addEventListener\("keydown", \(e\) => \{\n[\s\S]*?\n\}(, true)?\);\n', s)
if not m: sys.exit("lightbox.js 没找到顶层 keydown")
block = m.group(0)
s = s.replace(block, "\n// 页面级：看图打开时的键盘（左右翻页、Esc 关、加减缩放）。setup() 里装一次\nexport function installLightbox() {" + block.rstrip("\n") + "\n}\n", 1)
(ROOT / "packages/satin-ui/src/lightbox.js").write_text(s)

# ———— overlay.js：浮层栈的 Esc / 点外面、右键菜单的点击 / 键盘、失焦 / 改窗口宽度 / 滚动就关 ————
s = (ROOT / "packages/satin-ui/src/overlay.js").read_text()
top = [m for m in re.finditer(r'^(document\.addEventListener|addEventListener)\(', s, re.M)]
if len(top) != 7: sys.exit(f"overlay.js 顶层监听不是 7 个：{len(top)}")
# 每段从开头到这一条语句结束（下一行不以空格开头的分号行）——用括号配平找结束位置
def stmt_end(src, i):
    depth = 0; j = i; ins = None
    while j < len(src):
        c = src[j]
        if ins:
            if c == "\\": j += 2; continue
            if c == ins: ins = None
        elif c in "\"'`": ins = c
        elif c in "([{": depth += 1
        elif c in ")]}":
            depth -= 1
            if depth == 0 and src[j+1:j+2] == ";": return j + 2
        j += 1
    sys.exit("overlay.js 括号没配平")
spans = [(m.start(), stmt_end(s, m.start())) for m in top]
pieces = [s[a:b] for a, b in spans]
for a, b in reversed(spans): s = s[:a] + s[b:]
# 窗口改尺寸：库里不要官网嵌入模式的判断（问题 19）——只在宽度变了才关（高度变：手机地址栏伸缩、软键盘、iframe 长高，都不关）
pieces = [p.replace('if (document.documentElement.classList.contains("embed") && innerWidth === winW) return;', "if (innerWidth === winW) return;") for p in pieces]
if not any("innerWidth === winW) return;" in p and "embed" not in p for p in pieces): sys.exit("overlay.js resize 没改到")
s = s.rstrip("\n") + "\n\n// 页面级：浮层栈（Esc 关最上面那层、点外面关）、右键菜单（点条目、键盘）、失焦 / 窗口变宽变窄 / 页面滚动时收起右键菜单。setup() 里装一次\nexport function installOverlays() {\n" + "\n".join(pieces) + "\n}\n"
(ROOT / "packages/satin-ui/src/overlay.js").write_text(s)

# ———— feedback.js、theme.js：root 惰性 ————
edit("packages/satin-ui/src/feedback.js", [('''const root = document.documentElement;''', '''const root = typeof document !== "undefined" ? document.documentElement : undefined;''')])
edit("packages/satin-ui/src/theme.js", [
    ('''const root = document.documentElement, KEY = "satin-custom";''', '''const root = typeof document !== "undefined" ? document.documentElement : undefined, KEY = "satin-custom";'''),
    ('''let cur = load();''', '''let cur = typeof localStorage !== "undefined" ? load() : { ...DEFAULTS };'''),
    ('''new MutationObserver(() => paint()).observe(root, { attributes: true, attributeFilter: ["data-theme"] });''', '''// 页面级：深浅主题切换后重新上色、别的标签页改了主题同步过来、第一次写上当前选择。setup() 里装一次
export function installTheme() {
new MutationObserver(() => paint()).observe(root, { attributes: true, attributeFilter: ["data-theme"] });'''),
    ('''paint(); remember();''', '''paint(); remember();
}'''),
])
print("改完：core、form、input、lightbox、overlay、feedback、theme")
