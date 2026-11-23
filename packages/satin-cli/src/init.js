// satin init：选一种写法，生成能直接跑的项目（样式、theme-boot、框架插件都配好），装上技能和 AGENTS.md / CLAUDE.md，package.json 里加 check 脚本
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { FRAMEWORKS, IDS } from "./frameworks.js";
import { STARTERS, SATIN_UI_DIR, IN_REPO, satinUiVersion } from "./paths.js";
import { copyDir, isEmptyDir, write } from "./fsx.js";
import { installSkill, AGENTS, AGENT_IDS } from "./skill.js";
import { detectPm, PMS, install, runCmd, installCmd, addCmd } from "./pm.js";
import { interactive, select, text } from "./prompt.js";
import { listOf } from "./args.js";
import { UsageError } from "./errors.js";

const sortKeys = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
export const pkgName = (dir) => path.basename(path.resolve(dir)).toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^[-._]+|[-._]+$/g, "") || "satin-app";

export async function init(args, log = console.log) {
  const f = args.flags, ask = interactive() && !f.yes;

  let dir = f.dir || args._[0];
  if (!dir || dir === true) dir = ask ? await text("项目目录", "satin-app") : "satin-app";

  let fw = typeof f.framework === "string" ? f.framework.toLowerCase() : null;
  if (fw && !FRAMEWORKS[fw]) throw new UsageError(`不认识的写法：${fw}。可选：${IDS.join("、")}`);
  if (!fw) {
    if (ask) fw = await select("用哪种写法？", IDS.map((id) => ({ value: id, label: `${id.padEnd(8)}${FRAMEWORKS[id].title}` })));
    else if (f.yes) fw = "react";
    else throw new UsageError(`不在终端里运行时要写 --framework（${IDS.join("、")}），或者加 --yes 用默认的 react`);
  }

  let pm = typeof f.pm === "string" ? f.pm.toLowerCase() : null;
  if (pm && !PMS.includes(pm)) throw new UsageError(`不认识的包管理器：${pm}。可选：${PMS.join("、")}`);
  if (!pm) pm = ask ? await select("用哪个包管理器装依赖？", PMS.map((p) => ({ value: p, label: p })), detectPm()) : detectPm();

  const agents = typeof f.agents === "string" ? listOf(f.agents) : AGENT_IDS;
  for (const a of agents) if (!AGENTS[a]) throw new UsageError(`不认识的编码助手：${a}。可选：${AGENT_IDS.join("、")}（逗号分隔）`);

  const abs = path.resolve(dir), def = FRAMEWORKS[fw];
  if (!isEmptyDir(abs) && !f.force) throw new UsageError(`${dir} 里已经有文件了。换一个目录，或者加 --force 往里写（同名文件会被覆盖）`);
  fs.mkdirSync(abs, { recursive: true });
  // satin-ui 的依赖写法先定下来（在仓库里运行要先打包，打包失败就别留下半个项目）
  const satin = satinDependency(abs, f.satin);

  // 1. 起步模板
  copyDir(path.join(STARTERS, fw), abs, () => false, (rel, buf) => (rel === "angular.json" ? buf.toString().replace("__PM__", pm) : null));

  // 2. package.json（satin-ui：没发布到 npm 之前，在仓库里运行时装本地打的包）
  const pkg = {
    name: pkgName(abs), private: true, version: "0.1.0", ...(def.module ? { type: "module" } : {}),
    // satin 命令（doctor、add、skill）读：这是哪种写法、用哪个包管理器
    satin: { framework: fw, packageManager: pm },
    scripts: { ...def.scripts },
    dependencies: sortKeys({ "satin-ui": satin.spec, ...def.deps }),
    ...(Object.keys(def.dev).length ? { devDependencies: sortKeys(def.dev) } : {}),
  };
  write(path.join(abs, "package.json"), JSON.stringify(pkg, null, 2) + "\n");
  // pnpm 默认不跑依赖的安装脚本：把这个写法要用的几个放行（esbuild、Angular 的缓存库、Nuxt 的文件监听）
  if (pm === "pnpm" && def.builds) write(path.join(abs, "pnpm-workspace.yaml"), "allowBuilds:\n" + Object.entries(def.builds).map(([k, v]) => `  ${/[@/]/.test(k) ? JSON.stringify(k) : k}: ${v}`).join("\n") + "\n");
  write(path.join(abs, ".gitignore"), ["node_modules", "dist", ".next", ".nuxt", ".output", ".angular", ".DS_Store", ""].join("\n"));
  write(path.join(abs, "README.md"), readme(pkg.name, fw, pm, agents, satin.local));

  // 3. 技能 + AGENTS.md / CLAUDE.md + check 脚本
  const sk = installSkill(abs, { agents, pm, src: def.src });

  log(`✓ 建好了：${dir}（${def.title}）`);
  for (const a of sk.agents) log(`  技能：${a.dir}（${AGENTS[a.id].name} 读 ${a.doc}）`);
  if (satin.local) log(`  satin-ui：本地打的包 ${satin.spec.replace("file:", "")}（还没发布到 npm）`);

  // 4. 安装依赖
  let installed = false;
  if (f.install !== false) {
    log(`\n装依赖：${installCmd(pm)}`);
    installed = await install(pm, abs);
    if (!installed) log(`✗ 依赖没装好。看上面的报错，修好以后在 ${dir} 里重新运行 ${installCmd(pm)}`);
  }

  log(`\n下一步：\n  cd ${path.relative(process.cwd(), abs) || "."}`);
  if (!installed) log(`  ${installCmd(pm)}`);
  log(`  ${runCmd(pm, "dev")}        开发服务器\n  ${runCmd(pm, sk.script || "check")}      去 AI 味检查（error 改到 0）`);
  return installed || f.install === false ? 0 : 1;
}

// satin-ui 的依赖写法：--satin 指定的优先；在 Satin 仓库里运行（还没发布）就把 packages/satin-ui 打成 .tgz 放进项目的 .satin/；否则用 npm 上的版本
export function satinDependency(abs, flag) {
  if (typeof flag === "string" && flag) return { spec: flag, local: false };
  if (!IN_REPO || !SATIN_UI_DIR) return { spec: `^${satinUiVersion()}`, local: false };
  const dest = path.join(abs, ".satin"); fs.mkdirSync(dest, { recursive: true });
  const r = spawnSync("npm", ["pack", "--json", "--pack-destination", dest], { cwd: SATIN_UI_DIR, encoding: "utf8", shell: process.platform === "win32" });
  let file = null;
  try {
    const out = r.stdout || "", i = out.indexOf("[");
    file = JSON.parse(i >= 0 ? out.slice(i) : out)[0]?.filename;
  } catch { /* 下面报错 */ }
  if (r.status !== 0 || !file) throw new Error(`把本地的 satin-ui 打成包没成功（npm pack）：${(r.stderr || r.stdout || "").trim().split("\n").slice(-3).join(" ")}。可以用 --satin 指定依赖写法，比如 --satin file:../Satin/packages/satin-ui`);
  return { spec: `file:.satin/${path.basename(file)}`, local: true };
}

function readme(name, fw, pm, agents, local) {
  const def = FRAMEWORKS[fw], lines = [
    `# ${name}`, "",
    `用 Satin（satin-ui）搭的 ${def.title} 项目，由 \`satin init\` 生成。`, "",
    "## 常用命令", "",
    `- 开发：\`${runCmd(pm, "dev")}\``,
    ...(def.scripts.build ? [`- 构建：\`${runCmd(pm, "build")}\``] : []),
    `- 去 AI 味检查：\`${runCmd(pm, "check")}\`（error 改到 0；页面检查：\`node ${AGENTS[agents[0]]?.dir || ".claude/skills/satin"}/scripts/check.mjs dom <页面地址>\`）`, "",
    "## 给编码助手", "",
    ...agents.map((id) => `- ${AGENTS[id].name}：读 \`${AGENTS[id].doc}\` 和 \`${AGENTS[id].dir}/\``), "",
    "做页面之前先读技能里的 SKILL.md，整页先套 references/recipes.md 里的页面配方；做完跑检查。更新技能：`npx satin skill`。", "",
  ];
  if (local) lines.push(`satin-ui 现在装的是在 Satin 仓库里本地打的包（\`.satin/\` 里的 .tgz）。satin-ui 发布到 npm 以后换成正式版本：\`${addCmd(pm, "satin-ui")}\`，再删掉 \`.satin/\`。`, "");
  return lines.join("\n");
}
