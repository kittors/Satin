// 给项目装上（或更新）Satin 技能：拷技能目录、写 AGENTS.md / CLAUDE.md 里的那一段、package.json 里加 check 脚本。
// Claude Code 读 .claude/skills/satin + CLAUDE.md；Codex 读 .agents/skills/satin + AGENTS.md。默认两种都装
import fs from "node:fs";
import path from "node:path";
import { SKILL_SRC, satinUiVersion, CLI_VERSION } from "./paths.js";
import { listFiles, copyDir, hashFiles, read, readJSON, write } from "./fsx.js";
import { snippet, upsert } from "./agents.js";
import { runCmd } from "./pm.js";

export const AGENTS = {
  claude: { dir: ".claude/skills/satin", doc: "CLAUDE.md", name: "Claude Code" },
  codex: { dir: ".agents/skills/satin", doc: "AGENTS.md", name: "Codex" },
};
export const AGENT_IDS = Object.keys(AGENTS);
export const STAMP = ".satin-skill.json";

// 技能里只给仓库自己测检查器用的（样例、检查器的自测）不拷进项目
const SKIP = (rel) => rel === "scripts/fixtures" || rel.startsWith("scripts/fixtures/") || rel === "scripts/check.test.mjs" || rel.endsWith(".DS_Store") || rel === STAMP;
export const skillFiles = () => listFiles(SKILL_SRC, SKIP);
export const skillHash = () => hashFiles(SKILL_SRC, skillFiles());

// 项目里 check 脚本的写法：用第一个装好的技能里的检查器，扫这个写法默认的源码目录
export const checkScript = (agentDir, src) => `node ${agentDir}/scripts/check.mjs static ${src.join(" ")}`;

export function installSkill(dir, { agents = AGENT_IDS, pm = "npm", src = ["src"] } = {}) {
  if (!fs.existsSync(path.join(SKILL_SRC, "SKILL.md"))) throw new Error(`找不到技能文件（${SKILL_SRC}）：在 Satin 仓库里运行，或者先给 satin-cli 跑 prepack`);
  const files = skillFiles(), hash = hashFiles(SKILL_SRC, files), done = [];
  for (const id of agents) {
    const a = AGENTS[id]; if (!a) throw new Error(`不认识的编码助手：${id}（可选 ${AGENT_IDS.join("、")}）`);
    const dest = path.join(dir, a.dir);
    // 整个目录换成新的（是 satin 管的副本，不是用户写的东西）；路径一定以 skills/satin 结尾，在项目目录里
    if (path.basename(dest) === "satin" && dest.startsWith(path.resolve(dir) + path.sep)) fs.rmSync(dest, { recursive: true, force: true });
    copyDir(SKILL_SRC, dest, SKIP);
    write(path.join(dest, STAMP), JSON.stringify({ version: satinUiVersion(), hash, by: `satin-cli ${CLI_VERSION}` }, null, 2) + "\n");
    const docFile = path.join(dir, a.doc);
    write(docFile, upsert(read(docFile), snippet(a.dir, runCmd(pm, "check"))));
    done.push({ id, dir: a.dir, doc: a.doc });
  }
  // package.json 的 check 脚本：已经有别的 check（不是 Satin 检查器）就加成 check:satin
  const pkgFile = path.join(dir, "package.json"), pkg = readJSON(pkgFile);
  let script = null;
  if (pkg && done.length) {
    pkg.scripts ||= {};
    const cmd = checkScript(done[0].dir, src), mine = (s) => typeof s === "string" && s.includes("scripts/check.mjs");
    script = !pkg.scripts.check || mine(pkg.scripts.check) ? "check" : "check:satin";
    pkg.scripts[script] = cmd;
    write(pkgFile, JSON.stringify(pkg, null, 2) + "\n");
  }
  return { agents: done, script, files: files.length };
}

// 项目里装着的技能（doctor、check 用）
export function installedSkills(dir) {
  return AGENT_IDS.map((id) => ({ id, ...AGENTS[id], abs: path.join(dir, AGENTS[id].dir) }))
    .filter((a) => fs.existsSync(path.join(a.abs, "scripts/check.mjs")))
    .map((a) => ({ ...a, stamp: readJSON(path.join(a.abs, STAMP)) }));
}
