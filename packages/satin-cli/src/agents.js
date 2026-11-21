// AGENTS.md（Codex 读）/ CLAUDE.md（Claude Code 读）里 Satin 的那一段：用起止注释包住，重复运行只换这一段，用户自己写的内容不动。
// 内容来自技能里的 AGENTS.snippet.md，<skill> 换成项目里技能的实际目录
import fs from "node:fs";
import path from "node:path";
import { SKILL_SRC } from "./paths.js";

export const START = "<!-- satin:start -->";
export const END = "<!-- satin:end -->";
const NOTE = "<!-- 这一段由 satin 命令写入，重新运行 satin skill 会整段替换；自己的说明写在这一段外面 -->";

export function snippet(skillPath, checkCmd) {
  const raw = fs.readFileSync(path.join(SKILL_SRC, "AGENTS.snippet.md"), "utf8").replace(/\r\n/g, "\n");
  const body = raw.replace(/^<!--[\s\S]*?-->\n*/, "").trim().replaceAll("<skill>", skillPath);
  const extra = checkCmd ? `\n- 项目里配好了检查命令，等同上面的 static：\`${checkCmd}\`` : "";
  return `${START}\n${NOTE}\n${body}${extra}\n${END}`;
}

// 把 block 放进已有内容：有起止标记就整段替换，没有就接在末尾（空一行）
export function upsert(existing, block) {
  const s = (existing || "").replace(/\r\n/g, "\n");
  const i = s.indexOf(START), j = s.indexOf(END, i + 1);
  if (i >= 0 && j > i) return s.slice(0, i) + block + s.slice(j + END.length);
  if (!s.trim()) return block + "\n";
  return s.replace(/\n*$/, "\n\n") + block + "\n";
}

export const hasBlock = (content) => !!content && content.includes(START) && content.includes(END);
