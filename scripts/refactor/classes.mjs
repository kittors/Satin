// 类名分三类：库（L，要加前缀）、展示页（D）、官网（S）。库 = 根目录样式表（doc.css 和 kit.css 的"文档框架""间距一节的演示"两段除外）里出现的类；
// 展示页、官网自己的类不加前缀；两边都用到的算库的（展示页、官网里引用它的选择器跟着改）
import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import selParser from "postcss-selector-parser";

export function classesOf(css) {
  const set = new Set(), kf = new Set(), vars = new Set();
  const root = postcss.parse(css);
  root.walkRules((r) => { if (r.parent?.type === "atrule" && /keyframes/.test(r.parent.name)) return; try { selParser((s) => s.walkClasses((c) => set.add(c.value))).processSync(r.selector); } catch {} });
  root.walkAtRules((a) => { if (/keyframes$/.test(a.name)) kf.add(a.params.trim()); if (a.name === "property") vars.add(a.params.trim()); });
  root.walkDecls((d) => { if (d.prop.startsWith("--")) vars.add(d.prop); for (const m of d.value.matchAll(/(?<![\w-])(--[a-zA-Z][\w-]*)/g)) vars.add(m[1]); });
  return { set, kf, vars };
}
// kit.css 里属于展示页的两段：按行号切（"2. 文档框架"到"3. 排版"之前；"间距一节的演示"到"放不下时怎么办"之前）。主题定制面板 .th-* 是库的
export function splitKit(src) {
  const lines = src.split("\n"), at = (re) => lines.findIndex((l) => re.test(l));
  const a0 = at(/^\/\* ———— 2\. 文档框架/), a1 = at(/^\/\* ———— 3\. 排版/), b0 = at(/^\/\* ———— 间距一节的演示/), b1 = at(/^\/\* ———— 放不下时怎么办/);
  // "放不下时怎么办"一段里，除了分段控件 / 标签页横着滑的两条（.sa:has(...)），都是展示页的排版（演示框容器、矩阵、两栏）
  const fit = lines.slice(b1), fitLib = (l) => /^\.sa:has/.test(l);
  const isTh = (l) => /^\.th-|^\[data-theme="dark"\] \.th-/.test(l);
  const demo = [...lines.slice(a0, a1).filter((l) => !isTh(l)), ...lines.slice(b0, b1), ...fit.filter((l) => !fitLib(l))].join("\n");
  const lib = [...lines.slice(0, a0), ...lines.slice(a0, a1).filter(isTh), ...lines.slice(a1, b0), ...fit.filter(fitLib)].join("\n");
  return { lib, demo };
}
export function classify(root) {
  const L = new Set(), D = new Set(), S = new Set(), K = new Set(), V = new Set(), DV = new Set();
  for (const f of fs.readdirSync(root).filter((x) => x.endsWith(".css"))) {
    const src = fs.readFileSync(path.join(root, f), "utf8");
    if (f === "doc.css") { const c = classesOf(src); c.set.forEach((x) => D.add(x)); c.vars.forEach((x) => DV.add(x)); continue; }
    if (f === "kit.css") { const { lib, demo } = splitKit(src); const a = classesOf(lib), b = classesOf(demo); a.set.forEach((x) => L.add(x)); a.kf.forEach((x) => K.add(x)); a.vars.forEach((x) => V.add(x)); b.set.forEach((x) => D.add(x)); b.vars.forEach((x) => DV.add(x)); b.kf.forEach((x) => K.add(x)); continue; }
    const c = classesOf(src); c.set.forEach((x) => L.add(x)); c.kf.forEach((x) => K.add(x)); c.vars.forEach((x) => V.add(x));
  }
  for (const f of ["site/site.css", "site/next.css"]) if (fs.existsSync(path.join(root, f))) classesOf(fs.readFileSync(path.join(root, f), "utf8")).set.forEach((x) => S.add(x));
  return { L, D, S, K, V, DV };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const { L, D, S, K, V, DV } = classify(process.argv[2] || process.cwd());
  console.log("库类", L.size, "展示页类", D.size, "官网类", S.size, "关键帧", K.size, "库变量", V.size, "展示页变量", DV.size);
  console.log("展示页∩库", [...D].filter((x) => L.has(x)).join(" "));
  console.log("官网∩库", [...S].filter((x) => L.has(x)).join(" "));
  console.log("关键帧", [...K].join(" "));
  console.log("短/易误伤的库类", [...L].filter((x) => x.length <= 2 || /^(css|js|html|png|jpg|svg|mp4|mp3|com|co|io|json|md|txt|map)$/.test(x)).join(" "));
  console.log("展示页变量∩库变量", [...DV].filter((x) => V.has(x)).join(" "));
}
