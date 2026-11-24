#!/usr/bin/env node
// 生成指定版本（或当前工作区到上一版本 Tag 之间）的分类中文 Release Notes。
// 用法：
//   node scripts/release/notes.mjs [--version 0.1.1] [--from v0.1.0] [--to HEAD] [--out /tmp/notes.md]
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "../..");
const REPO_URL = "https://github.com/kittors/Satin";

function git(args, allowFail = false) {
  const r = spawnSync("git", args, { cwd: ROOT, encoding: "utf8" });
  if (r.status !== 0) {
    if (allowFail) return "";
    throw new Error(`git ${args.join(" ")} 失败：${r.stderr || r.stdout}`);
  }
  return r.stdout.trim();
}

function argOf(name, fallback = "") {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : fallback;
}

export function listSemverTags() {
  const raw = git(["tag", "--list", "v[0-9]*.[0-9]*.[0-9]*", "--sort=-v:refname"], true);
  return raw ? raw.split(/\r?\n/).filter(Boolean) : [];
}

export function findPreviousTag(currentTag) {
  const tags = listSemverTags();
  if (!tags.length) return "";
  if (!currentTag) return tags[0];
  const idx = tags.indexOf(currentTag);
  if (idx >= 0) return tags[idx + 1] || "";
  return tags[0];
}

const SECTIONS = [
  { key: "feat", title: "✨ 新特性（Features）", re: /^feat(\([^)]+\))?!?:\s*/i },
  { key: "fix", title: "🐛 问题修复（Bug Fixes）", re: /^fix(\([^)]+\))?!?:\s*/i },
  { key: "perf", title: "⚡ 性能与动效优化（Performance & Polish）", re: /^(perf|style|refactor)(\([^)]+\))?!?:\s*/i },
  { key: "docs", title: "📚 文档与技能同步（Docs & Skills）", re: /^docs(\([^)]+\))?!?:\s*/i },
  { key: "other", title: "🔧 工程与构建（Chores & CI）", re: /^(chore|ci|build|test)(\([^)]+\))?!?:\s*/i },
];

export function generateReleaseNotes({ version, fromTag, toRef = "HEAD" } = {}) {
  const uiPkg = JSON.parse(fs.readFileSync(path.join(ROOT, "packages/satin-ui/package.json"), "utf8"));
  const ver = String(version || uiPkg.version).replace(/^v/, "");
  const curTag = `v${ver}`;
  const prev = fromTag !== undefined ? fromTag : findPreviousTag(curTag);
  const range = prev ? `${prev}..${toRef}` : toRef;

  const raw = git(["log", range, "--no-merges", "--pretty=format:%h%x09%s"], true);
  const lines = raw ? raw.split(/\r?\n/).filter(Boolean) : [];

  const buckets = Object.fromEntries(SECTIONS.map((s) => [s.key, []]));
  const breaking = [];

  for (const line of lines) {
    const [hash, subject = ""] = line.split("\t");
    if (!subject || /^chore\(release\):/i.test(subject)) continue;
    const isBreaking = /^[a-z]+(\([^)]+\))?!:/i.test(subject);
    let matched = false;
    for (const sec of SECTIONS) {
      if (sec.re.test(subject)) {
        const scope = subject.match(/^[a-z]+\(([^)]+)\)/i)?.[1];
        const clean = subject.replace(sec.re, "").trim();
        const entry = `- ${scope ? `**${scope}**: ` : ""}${clean} (\`${hash}\`)`;
        if (isBreaking) breaking.push(entry);
        buckets[sec.key].push(entry);
        matched = true;
        break;
      }
    }
    if (!matched) buckets.other.push(`- ${subject} (\`${hash}\`)`);
  }

  const isPre = /-/.test(ver);
  const distTag = isPre ? (ver.includes("beta") ? "beta" : ver.includes("rc") ? "rc" : "next") : "latest";
  const installSuffix = distTag === "latest" ? `@${ver}` : `@${distTag}`;

  const out = [];
  out.push(`## Satin \`v${ver}\`${isPre ? "（预发布版）" : ""}`);
  out.push("");
  out.push("| 包名 | 版本 | dist-tag | npm 链接 |");
  out.push("| --- | --- | --- | --- |");
  out.push(`| \`satin-ui\` | \`${ver}\` | \`${distTag}\` | https://www.npmjs.com/package/satin-ui/v/${ver} |`);
  out.push(`| \`satin-cli\` | \`${ver}\` | \`${distTag}\` | https://www.npmjs.com/package/satin-cli/v/${ver} |`);
  out.push("");
  out.push("### 📦 安装与体验");
  out.push("```bash");
  out.push(`npm install satin-ui${installSuffix}`);
  out.push(`npx satin-cli${installSuffix} init`);
  out.push("```");
  out.push("");

  if (breaking.length) {
    out.push("### ⚠️ 破坏性变更（Breaking Changes）", "", ...breaking, "");
  }

  let hasChange = false;
  for (const sec of SECTIONS) {
    if (!buckets[sec.key].length) continue;
    hasChange = true;
    out.push(`### ${sec.title}`, "", ...buckets[sec.key], "");
  }
  if (!hasChange) {
    out.push("### 变更说明", "", `- 发布 \`satin-ui@${ver}\` 与 \`satin-cli@${ver}\`。`, "");
  }

  if (prev) {
    out.push(`**完整提交对比**：[${prev}...${curTag}](${REPO_URL}/compare/${prev}...${curTag})`);
  }
  return out.join("\n").trim() + "\n";
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const version = argOf("version");
  const fromTag = process.argv.includes("--from") ? argOf("from") : undefined;
  const toRef = argOf("to", "HEAD");
  const outFile = argOf("out");
  const md = generateReleaseNotes({ version, fromTag, toRef });
  if (outFile) {
    fs.mkdirSync(path.dirname(path.resolve(outFile)), { recursive: true });
    fs.writeFileSync(outFile, md, "utf8");
    console.log(`已生成 Release Notes → ${outFile}`);
  } else {
    process.stdout.write(md);
  }
}
