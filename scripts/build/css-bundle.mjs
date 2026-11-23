// 把 packages/satin-ui/css/satin.css 和 page.css 合并并压缩成单文件产物（dist/satin.min.css、dist/page.min.css）：
// 供 CDN（unpkg / jsDelivr）或零打包工具页面一次 HTTP 请求引入，同时保留 @layer satin。
// 用法：node scripts/build/css-bundle.mjs
import * as esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const ROOT = path.resolve(import.meta.dirname, "../..");
const PKG = path.join(ROOT, "packages/satin-ui");
const DIST = path.join(PKG, "dist");
fs.mkdirSync(DIST, { recursive: true });

const TARGETS = [
  ["css/satin.css", "dist/satin.min.css"],
  ["css/page.css", "dist/page.min.css"],
];

for (const [srcRel, outRel] of TARGETS) {
  const entry = path.join(PKG, srcRel);
  const outfile = path.join(PKG, outRel);
  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    outfile,
    logLevel: "warning",
  });
  const buf = fs.readFileSync(outfile);
  const rawKb = (buf.length / 1024).toFixed(1);
  const gzKb = (zlib.gzipSync(buf).length / 1024).toFixed(1);
  console.log(`✓ ${outRel.padEnd(20)} ${rawKb.padStart(6)} KB  gzip ${gzKb.padStart(5)} KB`);
}
