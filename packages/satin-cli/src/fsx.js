// 文件小工具：建目录写文件、按过滤条件拷目录、目录是不是空的、整个目录的指纹（判断技能是不是最新）
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}
export const read = (file) => { try { return fs.readFileSync(file, "utf8"); } catch { return null; } };
export const readJSON = (file) => { const s = read(file); if (s == null) return null; try { return JSON.parse(s); } catch { return null; } };
export const exists = (p) => fs.existsSync(p);

// 目录不存在，或者里面只有 .git、.DS_Store 这类不碍事的东西
export function isEmptyDir(dir) {
  if (!fs.existsSync(dir)) return true;
  return fs.readdirSync(dir).every((f) => f === ".git" || f === ".DS_Store");
}

// 列出目录里所有文件（相对路径，排好序）；skip(相对路径) 返回 true 的跳过（目录也一样）
export function listFiles(dir, skip = () => false, base = dir) {
  const out = [];
  for (const name of fs.readdirSync(dir).sort()) {
    const abs = path.join(dir, name), rel = path.relative(base, abs).split(path.sep).join("/");
    if (skip(rel)) continue;
    const st = fs.statSync(abs);
    if (st.isDirectory()) out.push(...listFiles(abs, skip, base));
    else if (st.isFile()) out.push(rel);
  }
  return out;
}

export function copyDir(src, dest, skip = () => false, transform = null) {
  const files = listFiles(src, skip);
  for (const rel of files) {
    const from = path.join(src, rel), to = path.join(dest, rel);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    if (transform) { const buf = fs.readFileSync(from), t = transform(rel, buf); fs.writeFileSync(to, t ?? buf); }
    else fs.copyFileSync(from, to);
  }
  return files;
}

// 指纹：每个文件的相对路径 + 内容一起算 sha1（换行统一成 \n，Windows 上拷过去的也一样）
export function hashFiles(dir, files) {
  const h = crypto.createHash("sha1");
  for (const rel of files) { h.update(rel + "\0"); h.update(fs.readFileSync(path.join(dir, rel), "utf8").replace(/\r\n/g, "\n")); h.update("\0"); }
  return h.digest("hex").slice(0, 16);
}
