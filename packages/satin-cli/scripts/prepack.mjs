// 打包发布之前（npm pack / npm publish 会自动跑）：把仓库里的技能拷进 templates/skill/，记下这时 satin-ui 的版本（templates/meta.json）。
// 发布出去的 satin-cli 不在 Satin 仓库里，靠这两样找技能、决定新项目装哪个版本的 satin-ui。只在仓库里跑；这两样不进 git（见 .gitignore）
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CLI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), REPO = path.resolve(CLI, "../..");
const SKILL = path.join(REPO, "skills/satin"), UI = path.join(REPO, "packages/satin-ui/package.json");
if (!fs.existsSync(path.join(SKILL, "SKILL.md")) || !fs.existsSync(UI)) { console.error("prepack 要在 Satin 仓库里跑（找不到 skills/satin 或 packages/satin-ui）"); process.exit(1); }

// 和 src/skill.js 里的规则一致：检查器的样例和自测不拷
const skip = (rel) => rel === "scripts/fixtures" || rel.startsWith("scripts/fixtures/") || rel === "scripts/check.test.mjs" || rel.endsWith(".DS_Store");
const dest = path.join(CLI, "templates/skill");
fs.rmSync(dest, { recursive: true, force: true });
let n = 0;
(function copy(dir) {
  for (const name of fs.readdirSync(dir).sort()) {
    const abs = path.join(dir, name), rel = path.relative(SKILL, abs).split(path.sep).join("/");
    if (skip(rel)) continue;
    if (fs.statSync(abs).isDirectory()) copy(abs);
    else { fs.mkdirSync(path.dirname(path.join(dest, rel)), { recursive: true }); fs.copyFileSync(abs, path.join(dest, rel)); n++; }
  }
})(SKILL);
const version = JSON.parse(fs.readFileSync(UI, "utf8")).version;
fs.writeFileSync(path.join(CLI, "templates/meta.json"), JSON.stringify({ satinUi: version }, null, 2) + "\n");
const recipes = fs.existsSync(path.join(CLI, "templates/recipes")) ? fs.readdirSync(path.join(CLI, "templates/recipes")).length : 0;
console.log(`prepack：技能 ${n} 个文件 → templates/skill/；satin-ui ${version} → templates/meta.json；配方 ${recipes} 份`);
