// satin 命令行的入口：main(参数数组) → 退出码。bin/satin.js 和 satin-ui 的 bin（npx satin-ui init）都调它
import path from "node:path";
import { parseArgs, listOf } from "./args.js";
import { CLI_VERSION, IN_REPO } from "./paths.js";
import { init } from "./init.js";
import { add } from "./add.js";
import { check } from "./check.js";
import { doctor } from "./doctor.js";
import { installSkill, AGENTS, AGENT_IDS, installedSkills } from "./skill.js";
import { project, sourceDirs } from "./project.js";
import { projectPm, runCmd } from "./pm.js";
import { IDS } from "./frameworks.js";
import { UsageError } from "./errors.js";
import { closePrompts, Cancelled } from "./prompt.js";

export const HELP = `satin ${CLI_VERSION}：用 Satin（satin-ui）做界面的命令行工具

用法：satin <命令> [参数]

  init [目录]        新建项目：选一种写法，样式、theme-boot、框架插件都配好，装上技能和 AGENTS.md / CLAUDE.md
      --framework <写法>   ${IDS.join(" | ")}
      --dir <目录>         项目目录（默认 satin-app）
      --pm <包管理器>      pnpm | npm | yarn | bun（默认按运行这条命令的工具猜，猜不出用 npm）
      --agents <列表>      claude,codex（默认两个都装）
      --yes, -y            不问，没写的都用默认值
      --no-install         只生成文件，不装依赖
      --satin <依赖写法>   satin-ui 的依赖写法（默认：npm 上的版本；在 Satin 仓库里运行时用本地打的包）
      --force              目录里已经有文件也往里写

  add <配方>         把页面配方拷进项目（按项目的写法）；satin add --list 看有哪些
      --dir <目录>  --framework <写法>  --force

  check [目录或文件…]  跑去 AI 味检查器（技能里带的），error 要改到 0
      --dom <地址>   在浏览器里量页面（要 Playwright）   --json   --max <条数>

  doctor             查项目配置，每一项不对都给修法    --json

  skill              给已有项目装上或更新技能，写好 AGENTS.md / CLAUDE.md 里 Satin 那一段，加 check 脚本
      --agents <列表>  --dir <目录>

  --help, -h   --version, -v

不在终端里运行（AI 调用、CI）时不会提问：init 要写 --framework，或者加 --yes。
退出码：0 成功；1 跑了但有问题（检查有 error、依赖没装好……）；2 参数不对。`;

async function skill(args, log = console.log) {
  const f = args.flags, dir = path.resolve(typeof f.dir === "string" ? f.dir : ".");
  // 没写 --agents：项目里已经装了哪几个就更新哪几个，一个都没有就两个都装
  const have = installedSkills(dir).map((s) => s.id);
  const agents = typeof f.agents === "string" ? listOf(f.agents) : have.length ? have : AGENT_IDS;
  for (const a of agents) if (!AGENTS[a]) throw new UsageError(`不认识的编码助手：${a}。可选：${AGENT_IDS.join("、")}（逗号分隔）`);
  const p = project(dir), pm = typeof f.pm === "string" ? f.pm : projectPm(dir);
  const r = installSkill(dir, { agents, pm, src: sourceDirs(p) });
  log(`✓ 技能装好了（${r.files} 个文件）：`);
  for (const a of r.agents) log(`  ${a.dir}（${AGENTS[a.id].name}），${a.doc} 里 Satin 那一段已更新`);
  if (r.script) log(`  package.json 的 ${r.script}：${runCmd(pm, r.script)}`);
  else log("  这里没有 package.json，检查命令：satin check");
  return 0;
}

const COMMANDS = { init, add, check, doctor, skill };

export async function main(argv, log = console.log) {
  const args = parseArgs(argv), cmd = args._[0];
  if (args.flags.version && !cmd) { log(CLI_VERSION); return 0; }
  if (!cmd) { log(HELP); return args.flags.help ? 0 : 2; }
  if (cmd === "help" || args.flags.help) { log(HELP); return 0; }
  const run = COMMANDS[cmd];
  if (!run) { log(`没有 ${cmd} 这个命令。\n\n${HELP}`); return 2; }
  args._.shift();
  if (IN_REPO && process.env.SATIN_DEBUG) log(`（在 Satin 仓库里运行：技能、satin-ui 都读仓库里的）`);
  try { return await run(args, log); }
  catch (e) {
    if (e instanceof UsageError) { log(`✗ ${e.message}`); return 2; }
    if (e instanceof Cancelled) { log("\n已取消"); return 130; }
    throw e;
  } finally { closePrompts(); }
}
