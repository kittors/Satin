// 读一个已有项目：package.json、是哪种写法、源码在哪
import path from "node:path";
import { readJSON, exists } from "./fsx.js";
import { detectFramework, FRAMEWORKS } from "./frameworks.js";

export function project(dir, override) {
  const pkg = readJSON(path.join(dir, "package.json"));
  const fw = override || detectFramework(pkg, exists(path.join(dir, "index.html")) || exists(path.join(dir, "src/index.html")));
  return { dir, pkg, fw, def: fw ? FRAMEWORKS[fw] : null };
}

// 检查器默认扫哪些：这个写法的源码目录里存在的那些；看不出写法时有 src 扫 src，没有扫整个目录
export function sourceDirs(p) {
  const list = (p.def?.src || ["src"]).filter((s) => s === "." || exists(path.join(p.dir, s)));
  return list.length ? list : ["."];
}

// 第一个存在的文件（相对 dir）
export const firstOf = (dir, rels) => rels.map((r) => path.join(dir, r)).find(exists) || null;
