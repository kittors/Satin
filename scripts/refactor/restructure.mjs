// 目录重排：根目录的 kit-*.js 按 split.mjs 的引用分析拆成
//   packages/satin-ui/src/<名字>.js（库）和 demo/sections/<名字>.js（展示页接线、演示数据）；kit.js → demo/main.js。
// 代码一个字不改，只搬位置（每段带着它前面的注释）、改 import 路径、库里补导出展示页要用的名字。
// 用法：node scripts/refactor/restructure.mjs [--dry]
import fs from "node:fs";
import path from "node:path";
import { analyze } from "./split.mjs";

const ROOT = process.cwd(), DRY = process.argv.includes("--dry");
const LIB = "packages/satin-ui/src", DEMO = "demo/sections";
// 原文件 → 新名字；demoOnly：整个文件都是展示页的
const MODS = {
  "kit-core.js": { name: "core", lib: ["initSeg"] }, "kit-form.js": { name: "form" }, "kit-overlay.js": { name: "overlay" }, "kit-feedback.js": { name: "feedback" },
  "kit-data.js": { name: "data" }, "kit-input.js": { name: "input" }, "kit-nav.js": { name: "nav" }, "kit-picker.js": { name: "picker" }, "kit-number.js": { name: "number" },
  "kit-list.js": { name: "list" }, "kit-chat.js": { name: "chat" }, "kit-md.js": { name: "markdown" }, "kit-media.js": { name: "media" }, "kit-lightbox.js": { name: "lightbox" },
  "kit-scroll.js": { name: "scroll" }, "kit-theme.js": { name: "theme" }, "kit-theme-panel.js": { name: "theme-panel" }, "kit-flow.js": { name: "flow" },
  "kit-grid.js": { name: "grid" }, "kit-grid-bars.js": { name: "grid-bars" }, "kit-grid-canvas.js": { name: "canvas-grid" },
  "flow-layout.js": { name: "flow-layout", whole: "lib" }, "flow-layout-worker.js": { name: "flow-layout-worker", whole: "lib" }, "icons.js": { name: "icons", whole: "lib" },
  "table-source.js": { name: "table-source", whole: "lib" }, "table-worker.js": { name: "table-worker", whole: "lib" }, "table-data.js": { name: "table-data", whole: "lib" },
  "kit-layout.js": { name: "layout", whole: "demo" }, "kit-spacing.js": { name: "spacing", whole: "demo" }, "kit-flow-stress.js": { name: "flow-stress", whole: "demo" },
  "kit.js": { name: "main", whole: "main" },
};
const libPath = (f) => `${LIB}/${MODS[f].name}.js`, demoPath = (f) => (MODS[f].whole === "main" ? "demo/main.js" : `${DEMO}/${MODS[f].name}.js`);
const rel = (from, to) => { let r = path.relative(path.dirname(from), to); if (!r.startsWith(".")) r = "./" + r; return r; };

// 第一遍：分析每个文件，记下每个名字落在哪边
const info = {};
for (const [f, m] of Object.entries(MODS)) {
  const src = fs.readFileSync(path.join(ROOT, f), "utf8");
  if (m.whole) { info[f] = { src, whole: m.whole }; continue; }
  const r = analyze(src, { libRoots: m.lib || [] });
  info[f] = { src, r };
}
const where = (f, name) => { const x = info[f]; if (!x) return null; if (x.whole) return x.whole === "lib" ? libPath(f) : demoPath(f); const d = x.r.decls.find((d) => d.names.includes(name) || d.reexport?.some(([, e]) => e === name)); if (!d) return null; return d.side === "demo" ? demoPath(f) : libPath(f); };
const header = (src) => { const m = /^(\s*(\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*\n))+/.exec(src); return m ? m[0] : ""; };

// import 语句按新位置改写：同一来源的名字可能拆到库和展示页两边
function imports(file, imps, used) {
  const out = new Map();
  for (const i of imps) {
    const srcFile = path.basename(i.source);
    for (const s of i.specs) {
      if (!used.has(s.local)) continue;
      const target = MODS[srcFile] ? where(srcFile, s.imported) : null;
      const to = target ? rel(file, target) : i.source;
      if (!out.has(to)) out.set(to, []);
      out.get(to).push(s.imported === s.local ? s.local : s.imported === "*" ? `* as ${s.local}` : `${s.imported} as ${s.local}`);
    }
  }
  return [...out].map(([to, ns]) => (ns.some((n) => n.startsWith("* as")) ? `import ${ns[0]} from "${to}";` : `import { ${ns.join(", ")} } from "${to}";`)).join("\n");
}
const writes = [];
for (const [f, m] of Object.entries(MODS)) {
  const x = info[f];
  if (x.whole) {
    const to = x.whole === "lib" ? libPath(f) : demoPath(f);
    // 整个搬：只改 import 路径（静态 import 和 new URL("./x.js", import.meta.url)）
    const out = x.src.replace(/(from\s+|import\s*\(\s*|new URL\(\s*)(["'])(\.\/[\w.-]+\.js)\2/g, (all, pre, q, p) => { const sf = path.basename(p); if (!MODS[sf]) return all; const t = MODS[sf].whole ? (MODS[sf].whole === "lib" ? libPath(sf) : demoPath(sf)) : libPath(sf); return pre + q + rel(to, t) + q; });
    writes.push([to, out]); continue;
  }
  const { r, src } = x, H = header(src);
  const part = (side) => r.decls.filter((d) => d.side === side || (side === "lib" && d.side === "unused"));
  const usedBy = (ds) => { const s = new Set(); for (const d of ds) for (const n of d.refs) s.add(n); return s; };
  const libDecls = part("lib"), demoDecls = part("demo");
  const libNames = new Set(libDecls.flatMap((d) => d.names)), exported = new Set(libDecls.filter((d) => d.exported).flatMap((d) => d.names).concat(libDecls.filter((d) => d.kind === "export-list").flatMap((d) => d.reexport.map(([, e]) => e))));
  const demoNeeds = [...usedBy(demoDecls)].filter((n) => libNames.has(n));
  const extraExport = demoNeeds.filter((n) => !exported.has(n));
  const body = (ds) => ds.map((d) => src.slice(d.lead, d.end)).join("\n");
  const lp = libPath(f), dp = demoPath(f);
  const libSrc = H + imports(lp, r.imports, usedBy(libDecls)) + "\n" + body(libDecls.map((d) => ({ ...d, lead: Math.max(d.lead, H.length) }))) + (extraExport.length ? `\n// 展示页接线（demo/）要用的内部名字\nexport { ${extraExport.join(", ")} };\n` : "\n");
  writes.push([lp, libSrc]);
  if (demoDecls.length) {
    const libImp = demoNeeds.length ? `import { ${demoNeeds.join(", ")} } from "${rel(dp, lp)}";\n` : "";
    const demoSrc = `// 展示页接线：从 ${f} 拆出来的 ${demoDecls.flatMap((d) => d.names).filter((n) => /^init/.test(n)).join("、")} 和演示数据。\n` + H + libImp + imports(dp, r.imports, usedBy(demoDecls)) + "\n" + body(demoDecls) + "\n";
    writes.push([dp, demoSrc]);
  }
}
// kit.js 里 import 的 initX 现在在 demo/sections 下：上面整个搬时已经按 where() 改好（where 对整文件搬的模块按 lib 算）——这里再按名字逐个修正
const mainIdx = writes.findIndex(([p]) => p === "demo/main.js");
{
  let s = info["kit.js"].src;
  s = s.replace(/import \{([^}]+)\} from "\.\/([\w.-]+\.js)";/g, (all, names, sf) => {
    if (!MODS[sf]) return all;
    const groups = new Map();
    for (const raw of names.split(",").map((x) => x.trim()).filter(Boolean)) { const nm = raw.split(/\s+as\s+/)[0]; const t = where(sf, nm) || libPath(sf); if (!groups.has(t)) groups.set(t, []); groups.get(t).push(raw); }
    return [...groups].map(([t, ns]) => `import { ${ns.join(", ")} } from "${rel("demo/main.js", t)}";`).join("\n");
  });
  writes[mainIdx] = ["demo/main.js", s];
}
for (const [p, s] of writes) { console.log(`${DRY ? "（试跑）" : ""}写 ${p}（${(s.length / 1024).toFixed(1)}KB）`); if (!DRY) { fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true }); fs.writeFileSync(path.join(ROOT, p), s); } }
if (!DRY) for (const f of Object.keys(MODS)) fs.rmSync(path.join(ROOT, f));
