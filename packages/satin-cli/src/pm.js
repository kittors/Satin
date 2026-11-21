// 包管理器：pnpm / npm / yarn / bun。默认按"是用哪个跑的这条命令"猜（pnpm dlx、npx、yarn dlx、bunx 都会设 npm_config_user_agent），猜不出用 npm
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

export const PMS = ["pnpm", "npm", "yarn", "bun"];

const fromUA = () => { const ua = process.env.npm_config_user_agent || ""; return PMS.find((pm) => ua.startsWith(pm + "/")) || null; };

// 新项目（init）：用运行这条命令的工具
export const detectPm = () => fromUA() || "npm";

// 已有项目（doctor、skill、add）：先看项目自己——锁文件、pnpm-workspace.yaml、package.json 里 init 记下的 satin.packageManager，再看运行这条命令的工具
export function projectPm(dir) {
  const locks = { "pnpm-lock.yaml": "pnpm", "pnpm-workspace.yaml": "pnpm", "package-lock.json": "npm", "yarn.lock": "yarn", "bun.lock": "bun", "bun.lockb": "bun" };
  for (const [f, pm] of Object.entries(locks)) if (fs.existsSync(path.join(dir, f))) return pm;
  try { const pm = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8")).satin?.packageManager; if (PMS.includes(pm)) return pm; } catch { /* 没有或读不了 */ }
  return fromUA() || "npm";
}

// 一律写成 <包管理器> run <脚本>：yarn check、pnpm doctor 这类和自带命令重名的也不会跑错
export const runCmd = (pm, script) => `${pm} run ${script}`;
export const addCmd = (pm, pkg, dev = false) => (pm === "npm" ? `npm i ${dev ? "-D " : ""}${pkg}` : `${pm} add ${dev ? "-D " : ""}${pkg}`);
export const installCmd = (pm) => `${pm} install`;

// 在 dir 里跑安装，输出直接打到终端；返回是否成功
export function install(pm, dir) {
  return new Promise((resolve) => {
    const child = spawn(pm, ["install"], { cwd: dir, stdio: "inherit", shell: process.platform === "win32" });
    child.on("error", () => resolve(false));
    child.on("exit", (code) => resolve(code === 0));
  });
}

export const has = (cmd) => spawnSync(cmd, ["--version"], { stdio: "ignore", shell: process.platform === "win32" }).status === 0;
