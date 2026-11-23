// 给 satin add 生成页面配方的"纯 HTML"写法：读 tests/recipes/<id>.html（node scripts/skill/recipes-render.mjs 的产物，
// 图片是本地占位图、对话接口是假的流式回复，打开就能看），把仓库里的相对路径换成项目里 node_modules 的路径，
// 写到 packages/satin-cli/templates/recipes/<id>/html/：<id>.html + manifest.json。其它写法（React、Vue……）由主线的生成脚本写到同一个目录下。
// 用法：node scripts/skill/recipes-render.mjs && node scripts/cli/recipes-html.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const SRC = path.join(ROOT, "tests/recipes"), OUT = path.join(ROOT, "packages/satin-cli/templates/recipes");
const ids = JSON.parse(fs.readFileSync(path.join(SRC, "index.json"), "utf8"));
let n = 0;
for (const id of ids) {
  const file = path.join(SRC, id + ".html");
  if (!fs.existsSync(file)) { console.log(`  ✗ 没有 ${path.relative(ROOT, file)}（先跑 node scripts/skill/recipes-render.mjs）`); process.exitCode = 1; continue; }
  let html = fs.readFileSync(file, "utf8");
  const title = (html.match(/<title>配方 · ([^<]+)<\/title>/) || [, id])[1];
  html = html.replace(/import \{ toast \} from "satin-ui\/components";\n/, "").replace(/\/\* satin-preview-guard:start \*\/[\s\S]*?\/\* satin-preview-guard:end \*\/\n?/, "");
  html = html.replaceAll("../../packages/satin-ui/", "/node_modules/satin-ui/").replace(/<title>配方 · ([^<]+)<\/title>/, "<title>$1</title>");
  if (html.includes("../../")) { console.log(`  ✗ ${id}：换完路径还有指向仓库的相对路径`); process.exitCode = 1; continue; }
  const dir = path.join(OUT, id, "html");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, id + ".html"), html);
  fs.writeFileSync(path.join(dir, "manifest.json"), JSON.stringify({ title, files: [id + ".html"], entry: id + ".html" }, null, 2) + "\n");
  n++;
}
console.log(`配方 HTML 写法：${n}/${ids.length} 份 → ${path.relative(ROOT, OUT)}/<配方>/html/`);
