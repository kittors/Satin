#!/usr/bin/env node
// Satin 一键发版与版本同步脚本（零依赖，本地与 GitHub Actions workflow_dispatch 共用）。
// 用法：
//   pnpm release:patch                      # 0.1.0 -> 0.1.1，自动同步产物、跑校验、提交、打 v0.1.1 Tag 并推送触发自动发版
//   pnpm release:minor                      # 0.1.0 -> 0.2.0
//   pnpm release:major                      # 0.1.0 -> 1.0.0
//   pnpm release 0.2.0-beta.1               # 指定精确版本或预发布版本
//   pnpm release patch --dry-run            # 仅预览新版本号与变更记录，不修改任何文件
//   pnpm release patch --no-push            # 本地提交并打 Tag，暂不推送远程
//   node scripts/release/bump.mjs patch --ci --no-verify  # CI workflow_dispatch 内部调用
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { generateReleaseNotes } from "./notes.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const PKG_FILES = [
  path.join(ROOT, "packages/satin-ui/package.json"),
  path.join(ROOT, "packages/satin-cli/package.json"),
];

const SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const positional = args.filter((a) => !a.startsWith("--"));
const targetSpec = positional[0] || "patch";
const DRY = flags.has("--dry-run");
const NO_PUSH = flags.has("--no-push");
const NO_VERIFY = flags.has("--no-verify");
const ALLOW_BRANCH = flags.has("--allow-branch") || flags.has("--ci");
const PRE_ID = (() => {
  const idx = args.indexOf("--preid");
  return idx > 0 && args[idx + 1] && !args[idx + 1].startsWith("--") ? args[idx + 1] : "beta";
})();

function run(cmd, cmdArgs, opts = {}) {
  const r = spawnSync(cmd, cmdArgs, { cwd: ROOT, stdio: opts.capture ? "pipe" : "inherit", encoding: "utf8" });
  if (r.status !== 0) {
    const detail = opts.capture ? `\n${r.stderr || r.stdout}` : "";
    throw new Error(`命令失败：${cmd} ${cmdArgs.join(" ")}${detail}`);
  }
  return (r.stdout || "").trim();
}

function parseSemver(v) {
  const m = String(v).replace(/^v/, "").match(SEMVER_RE);
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +m[3], pre: m[4] || "" };
}

function computeNextVersion(curStr, spec) {
  const cur = parseSemver(curStr);
  if (!cur) throw new Error(`当前版本号不合法：${curStr}`);
  if (spec === "patch") return `${cur.major}.${cur.minor}.${cur.pre ? cur.patch : cur.patch + 1}`;
  if (spec === "minor") return `${cur.major}.${cur.minor + 1}.0`;
  if (spec === "major") return `${cur.major + 1}.0.0`;
  if (spec === "prerelease") {
    if (cur.pre) {
      const m = cur.pre.match(/^([0-9A-Za-z-]+)\.(\d+)$/);
      if (m) return `${cur.major}.${cur.minor}.${cur.patch}-${m[1]}.${Number(m[2]) + 1}`;
      return `${cur.major}.${cur.minor}.${cur.patch}-${cur.pre}.1`;
    }
    return `${cur.major}.${cur.minor}.${cur.patch + 1}-${PRE_ID}.0`;
  }
  const explicit = String(spec).replace(/^v/, "");
  if (!parseSemver(explicit)) {
    throw new Error(`不支持的版本参数 "${spec}"。请传入 patch | minor | major | prerelease 或合法 SemVer（如 0.2.0 / 0.2.0-beta.1）。`);
  }
  return explicit;
}

function distTagOf(ver) {
  const parsed = parseSemver(ver);
  if (!parsed?.pre) return "latest";
  const head = parsed.pre.split(".")[0].toLowerCase();
  if (["alpha", "beta", "rc", "next", "canary"].includes(head)) return head;
  return "next";
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

const uiPkg = readJson(PKG_FILES[0]);
const cliPkg = readJson(PKG_FILES[1]);
if (uiPkg.version !== cliPkg.version) {
  throw new Error(`双包版本不一致：satin-ui=${uiPkg.version}，satin-cli=${cliPkg.version}，请先手工对齐。`);
}

const currentVersion = uiPkg.version;
const nextVersion = computeNextVersion(currentVersion, targetSpec);
const nextTag = `v${nextVersion}`;
const distTag = distTagOf(nextVersion);

if (nextVersion === currentVersion) {
  throw new Error(`目标版本与当前版本相同（${currentVersion}），无需重复发布。`);
}

// 1. Git 工作区、分支与 Tag 冲突校验
const dirty = run("git", ["status", "--porcelain"], { capture: true });
if (dirty && !DRY) {
  throw new Error(`工作区存在未提交改动，请先提交或暂存后再发版：\n${dirty}`);
}
const branch = run("git", ["rev-parse", "--abbrev-ref", "HEAD"], { capture: true });
if (!ALLOW_BRANCH && branch !== "main") {
  throw new Error(`当前位于分支 "${branch}"，正式发版请在 main 分支执行（如需在当前分支发预发布版请加 --allow-branch）。`);
}
const existingTag = run("git", ["tag", "--list", nextTag], { capture: true });
if (existingTag === nextTag) {
  throw new Error(`Git Tag ${nextTag} 已存在，请更换版本号。`);
}

console.log(`\n🚀 准备发布 Satin ${currentVersion} → ${nextVersion}（Tag: ${nextTag}，npm dist-tag: ${distTag}）\n`);
const notesPreview = generateReleaseNotes({ version: nextVersion });
console.log("——— 变更日志预览 ———\n" + notesPreview + "————————————————————\n");

if (DRY) {
  console.log("✓ --dry-run 预览完成，未修改任何文件或推送 Tag。");
  process.exit(0);
}

// 2. 同步双包 version
for (const file of PKG_FILES) {
  const pkg = readJson(file);
  pkg.version = nextVersion;
  fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n", "utf8");
}
console.log(`✓ 已同步双包版本 → ${nextVersion}`);

// 3. 同步规范、AI 技能、生成物、压缩 CSS 并跑发版前快速门禁
run("pnpm", ["spec:build"]);
run("pnpm", ["skill:build"]);
run("node", ["scripts/test/sync.mjs", "--write"]);
run("pnpm", ["build:css"]);

if (!NO_VERIFY) {
  console.log("\n🔍 正在执行发版前本地门禁检查（lint / node / types / cli）...");
  run("pnpm", ["test"]);
  run("pnpm", ["test:cli"]);
}

// 4. 提交版本变更并打带注释的 SemVer Tag
run("git", ["add", "-A"]);
run("git", ["commit", "-m", `chore(release): ${nextTag}`]);
run("git", ["tag", "-a", nextTag, "-m", `Release ${nextTag}`]);
console.log(`\n✓ 已创建提交与标签 ${nextTag}`);

if (!NO_PUSH) {
  const pushTarget = branch === "HEAD" ? (process.env.GITHUB_REF_NAME || "main") : branch;
  run("git", ["push", "origin", `HEAD:${pushTarget}`]);
  run("git", ["push", "origin", nextTag]);
  console.log(`\n🎉 已推送 ${pushTarget} 与 ${nextTag} 到 origin！GitHub Actions Release 流水线将自动接管验证、OIDC 无密钥发布 npm 与创建 GitHub Release：`);
  console.log("   https://github.com/kittors/Satin/actions/workflows/release.yml");
} else {
  console.log(`\nℹ️ 已跳过推送（--no-push）。准备好后执行：\n   git push origin ${branch} && git push origin ${nextTag}`);
}
