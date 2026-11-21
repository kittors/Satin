// satin check：跑项目里装好的技能自带的去 AI 味检查器，输出原样转出来（每条都带"照着做就能改好"的修法）。
//   satin check                 扫这个写法默认的源码目录（Vite 类：src、index.html；Next、Nuxt：app；Angular：src；纯 HTML：整个目录）
//   satin check src/pages       只扫给的目录或文件
//   satin check --dom <地址>    在浏览器里量页面（要 Playwright）
// 退出码和检查器一样：有"必须改"时是 1
import path from "node:path";
import { spawnSync } from "node:child_process";
import { installedSkills } from "./skill.js";
import { project, sourceDirs } from "./project.js";
import { UsageError } from "./errors.js";

export function checkArgv(args, dir) {
  const f = args.flags, pass = [];
  if (f.json) pass.push("--json");
  if (f.max) pass.push("--max", String(f.max));
  if (f.dom) {
    const url = typeof f.dom === "string" ? f.dom : args._[0];
    if (!url) throw new UsageError("--dom 后面要写页面地址，比如 satin check --dom http://localhost:5173/");
    for (const k of ["out", "widths", "themes"]) if (typeof f[k] === "string") pass.push("--" + k, f[k]);
    if (f["no-floats"]) pass.push("--no-floats");
    return ["dom", url, ...pass];
  }
  const targets = args._.length ? args._ : sourceDirs(project(dir));
  return ["static", ...targets, ...pass];
}

export async function check(args, log = console.log) {
  const dir = path.resolve(typeof args.flags.dir === "string" ? args.flags.dir : ".");
  const skills = installedSkills(dir);
  if (!skills.length) { log("项目里还没装 Satin 技能（.claude/skills/satin 或 .agents/skills/satin）。先运行：satin skill"); return 2; }
  const argv = checkArgv(args, dir);
  const r = spawnSync(process.execPath, [path.join(skills[0].abs, "scripts/check.mjs"), ...argv], { cwd: dir, stdio: "inherit" });
  return r.status ?? 1;
}
