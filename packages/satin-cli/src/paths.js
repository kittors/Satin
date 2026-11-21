// 资源在哪：在 Satin 仓库里运行时直接读仓库的 skills/satin、packages/satin-ui；
// 发布出去的包里读 templates/（prepack 时从仓库拷进来，见 scripts/prepack.mjs）。起步模板（starters/）和配方（templates/recipes/）两种情况都在包里
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const CLI_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO = path.resolve(CLI_DIR, "../..");
// 环境变量 SATIN_CLI_PACKAGED=1：在仓库里也按"发布出去的包"找资源（测试 prepack 的结果用）
export const IN_REPO = !process.env.SATIN_CLI_PACKAGED && fs.existsSync(path.join(REPO, "skills/satin/SKILL.md")) && fs.existsSync(path.join(REPO, "packages/satin-ui/package.json"));

export const STARTERS = path.join(CLI_DIR, "starters");
export const RECIPES = path.join(CLI_DIR, "templates/recipes");
export const SKILL_SRC = IN_REPO ? path.join(REPO, "skills/satin") : path.join(CLI_DIR, "templates/skill");
// 仓库里的 satin-ui 包（本地打包用）；发布出去的包里没有
export const SATIN_UI_DIR = IN_REPO ? path.join(REPO, "packages/satin-ui") : null;

const readJSON = (f) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } };
export const CLI_VERSION = readJSON(path.join(CLI_DIR, "package.json"))?.version || "0.0.0";
// 生成的项目要装的 satin-ui 版本：仓库里读 satin-ui 的 package.json；发布的包里读 prepack 记下的；都没有就跟命令行同一个版本（两个包一起发版）
export function satinUiVersion() {
  if (SATIN_UI_DIR) return readJSON(path.join(SATIN_UI_DIR, "package.json"))?.version || CLI_VERSION;
  return readJSON(path.join(CLI_DIR, "templates/meta.json"))?.satinUi || CLI_VERSION;
}
