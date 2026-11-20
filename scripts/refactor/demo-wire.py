# 展示页接线跟着"导入无副作用"调整：
# · 展示页代码里的 $ / $$ 改从 demo/dom.js 拿（嵌入模式下去暂存容器里找的逻辑留在展示页）
# · main.js、官网 shell.js 开头调 setup()（原来这些行为在导入时就装上了）
# · 展示页里的 Tooltip 容器 id 跟库一致：sn-tip
import re, sys, pathlib
ROOT = pathlib.Path.cwd()

def fix_imports(path, dom_rel):
    p = ROOT / path; s = p.read_text()
    def repl(m):
        names = [x.strip() for x in m.group(1).split(",") if x.strip()]
        keep = [n for n in names if n not in ("$", "$$")]
        moved = [n for n in names if n in ("$", "$$")]
        out = []
        if keep: out.append(f'import {{ {", ".join(keep)} }} from "{m.group(2)}";')
        if moved: out.append(f'import {{ {", ".join(moved)} }} from "{dom_rel}";')
        return "\n".join(out)
    s2 = re.sub(r'import \{([^}]*)\} from "((?:\.\./)+packages/satin-ui/src/core\.js)";', repl, s)
    if s2 != s: p.write_text(s2); print("改", path)

fix_imports("demo/main.js", "./dom.js")
for f in sorted((ROOT / "demo/sections").glob("*.js")): fix_imports(f"demo/sections/{f.name}", "../dom.js")

# main.js：导入完先 setup()
p = ROOT / "demo/main.js"; s = p.read_text()
anchor = 'export { reduced, edgeFrames, initSeg, showTip, hideTip, tipTarget, resetTipLayer };'
if anchor not in s: sys.exit("main.js 没找到导出那一行")
s = s.replace('import { mountThemePanel } from "../packages/satin-ui/src/theme-panel.js";', 'import { mountThemePanel } from "../packages/satin-ui/src/theme-panel.js";\nimport { setup } from "../packages/satin-ui/src/setup.js";', 1)
s = s.replace(anchor, anchor + "\n// 页面级的全局行为（Tooltip、表单、浮层栈、看图键盘、主题）：原来各模块导入时就装上，现在显式装，顺序和原来一样\nsetup();", 1)
p.write_text(s)

# 官网：shell.js 是各页共用的，导入完先 setup()（docs.js、home.js 是旧版官网，也补上）
for f in ["site/shell.js", "site/docs.js", "site/home.js"]:
    p = ROOT / f; s = p.read_text()
    m = list(re.finditer(r'^import [^\n]*;\n', s, re.M))
    if not m: sys.exit(f"{f} 没有 import")
    last = m[-1].end()
    s = s[:last] + 'import { setup } from "../packages/satin-ui/src/setup.js";\nsetup(); // 页面级的全局行为（Tooltip、浮层栈、主题……），原来导入时就装上\n' + s[last:]
    p.write_text(s); print("改", f)

# Tooltip 容器
p = ROOT / "index.html"; s = p.read_text()
if '<div class="sn-tip" id="tip" popover="manual"></div>' not in s: sys.exit("index.html 没找到 #tip")
p.write_text(s.replace('<div class="sn-tip" id="tip" popover="manual"></div>', '<div class="sn-tip" id="sn-tip" popover="manual"></div>'))
print("改 index.html #tip → #sn-tip")
