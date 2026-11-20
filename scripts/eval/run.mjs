// AI 评测：同一批页面需求（eval/tasks.json）× 框架（react、vue、html）× 有 / 没有 Satin 技能，交给低档模型（codex exec）去做。
// 每一份都在 /tmp/satin-eval/<批次>/ 下自己的目录里做（不在仓库里），codex 只能写这个目录（workspace-write 沙箱，不联网）；
// 依赖事先装好（React / Vue 的 Vite 模板；有技能的那份多装 satin-ui 的本地包），技能放进 .agents/skills/satin，再写一份 AGENTS.md。
// 做完以后的打分在 scripts/eval/score.mjs。
// 用法：node scripts/eval/run.mjs --batch b1 --model clirelay/gpt-6-luna [--cond with,without] [--fw react,vue,html] [--tasks admin-table,settings] [--jobs 2] [--timeout 30]
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import crypto from "node:crypto";

const ROOT = path.resolve(import.meta.dirname, "../..");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : d; };
const BATCH = arg("batch", "b1"), MODEL = arg("model", "clirelay/gpt-6-luna"), JOBS = +arg("jobs", 3), TIMEOUT = +arg("timeout", 25) * 60000;
// 推理强度：默认 medium（用户本机默认是 xhigh，一份页面要 30 分钟以上；评测几十份只能降一档，两组一样）
const EFFORT = arg("effort", "medium");
const CONDS = arg("cond", "with,without").split(","), FWS = arg("fw", "react,vue,html").split(",");
const TASKS = JSON.parse(fs.readFileSync(path.join(ROOT, "eval/tasks.json"), "utf8")).tasks.filter((t) => !arg("tasks") || arg("tasks").split(",").includes(t.id));
const BASE = "/tmp/satin-eval", OUT = path.join(BASE, BATCH, MODEL.replace(/[^\w.-]+/g, "_"));
const PKG = path.join(BASE, "_pkg/satin-ui-0.1.0.tgz");
fs.mkdirSync(OUT, { recursive: true });
// 每次都按仓库里现在的 packages/satin-ui 重新打包；包变了，装过 satin-ui 的模板重装
fs.mkdirSync(path.dirname(PKG), { recursive: true });
spawnSync("pnpm", ["pack", "--pack-destination", path.dirname(PKG)], { cwd: path.join(ROOT, "packages/satin-ui"), encoding: "utf8" });
const PKG_HASH = crypto.createHash("sha1").update(fs.readFileSync(PKG)).digest("hex").slice(0, 12);
const sh = (cmd, args, cwd, extra = {}) => { const r = spawnSync(cmd, args, { cwd, encoding: "utf8", ...extra }); if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")} 失败（${cwd}）：\n${(r.stdout || "") + (r.stderr || "")}`.slice(0, 3000)); return r.stdout; };

// ———— 模板：每种框架 × 有 / 没有 satin-ui 各装一份，评测目录从这里拷（node_modules 用 pnpm 离线装，硬链接，快） ————
const TPL = path.join(BASE, "_templates");
function template(fw, satin) {
  const dir = path.join(TPL, `${fw}${satin ? "-satin" : ""}`);
  const stamp = satin ? PKG_HASH : "plain";
  if (fs.existsSync(path.join(dir, ".ready")) && fs.readFileSync(path.join(dir, ".ready"), "utf8") === stamp) return dir;
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const deps = {}, dev = {};
  if (fw === "react") { Object.assign(deps, { react: "^19.2.0", "react-dom": "^19.2.0" }); Object.assign(dev, { vite: "^8.0.0", "@vitejs/plugin-react": "^6.0.0" }); }
  if (fw === "vue") { Object.assign(deps, { vue: "^3.5.0" }); Object.assign(dev, { vite: "^8.0.0", "@vitejs/plugin-vue": "^6.0.0" }); }
  if (satin) deps["satin-ui"] = `file:${PKG}`;
  const scripts = fw === "html" ? {} : { dev: "vite", build: "vite build", preview: "vite preview" };
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ name: `eval-${fw}`, private: true, type: "module", scripts, dependencies: deps, devDependencies: dev }, null, 2));
  if (fw === "react") {
    fs.writeFileSync(path.join(dir, "vite.config.js"), `import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nexport default defineConfig({ plugins: [react()], base: "./" });\n`);
    fs.writeFileSync(path.join(dir, "index.html"), `<!doctype html>\n<html lang="zh-CN">\n<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>页面</title></head>\n<body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body>\n</html>\n`);
    fs.mkdirSync(path.join(dir, "src")); fs.writeFileSync(path.join(dir, "src/main.jsx"), `import { createRoot } from "react-dom/client";\nimport App from "./App.jsx";\ncreateRoot(document.getElementById("root")).render(<App />);\n`);
    fs.writeFileSync(path.join(dir, "src/App.jsx"), `export default function App() {\n  return <div>在这里开始</div>;\n}\n`);
  }
  if (fw === "vue") {
    fs.writeFileSync(path.join(dir, "vite.config.js"), `import { defineConfig } from "vite";\nimport vue from "@vitejs/plugin-vue";\nexport default defineConfig({ plugins: [vue()], base: "./" });\n`);
    fs.writeFileSync(path.join(dir, "index.html"), `<!doctype html>\n<html lang="zh-CN">\n<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>页面</title></head>\n<body><div id="app"></div><script type="module" src="/src/main.js"></script></body>\n</html>\n`);
    fs.mkdirSync(path.join(dir, "src")); fs.writeFileSync(path.join(dir, "src/main.js"), `import { createApp } from "vue";\nimport App from "./App.vue";\ncreateApp(App).mount("#app");\n`);
    fs.writeFileSync(path.join(dir, "src/App.vue"), `<template>\n  <div>在这里开始</div>\n</template>\n`);
  }
  if (fw === "html") fs.writeFileSync(path.join(dir, "index.html"), `<!doctype html>\n<html lang="zh-CN">\n<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>页面</title></head>\n<body>\n  在这里开始\n</body>\n</html>\n`);
  if (Object.keys(deps).length || Object.keys(dev).length) sh("pnpm", ["install", "--config.node-linker=hoisted", "--ignore-workspace"], dir);
  fs.writeFileSync(path.join(dir, ".ready"), stamp);
  return dir;
}

// ———— 一份评测的目录 ————
const ENV = {
  react: "这是一个 React 19 + Vite 项目（入口 src/main.jsx，页面写在 src/ 里）。依赖已经装好，不能联网，不要装新的依赖。做完以后 `npm run build` 要能通过。",
  vue: "这是一个 Vue 3 + Vite 项目（入口 src/main.js，页面写在 src/ 里）。依赖已经装好，不能联网，不要装新的依赖。做完以后 `npm run build` 要能通过。",
  html: "这是一个纯 HTML 项目：直接写 index.html（可以拆出 .css、.js 文件），不用构建工具，用浏览器直接打开就能看。不能联网，不要引外部 CDN。",
};
const SATIN_ENV = { react: "satin-ui 已经装在 node_modules 里（本地包，npm 上还没发布）。", vue: "satin-ui 已经装在 node_modules 里（本地包，npm 上还没发布）。", html: "satin-ui 已经装在 node_modules/satin-ui 里（本地包），页面里用相对路径 ./node_modules/satin-ui/… 引用。" };
function prepare(task, fw, cond) {
  const dir = path.join(OUT, cond, fw, task.id);
  if (fs.existsSync(path.join(dir, "_done.json"))) return { dir, skip: true };
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(path.dirname(dir), { recursive: true });
  const tpl = template(fw, cond === "with");
  sh("cp", ["-Rc", tpl, dir], BASE); // APFS 写时复制：不占额外空间 fs.rmSync(path.join(dir, ".ready"), { force: true });
  let agents = `# 项目说明\n\n${ENV[fw]}\n`;
  if (cond === "with") {
    const sk = path.join(dir, ".agents/skills/satin");
    fs.mkdirSync(sk, { recursive: true });
    for (const f of ["SKILL.md", "AGENTS.snippet.md"]) fs.copyFileSync(path.join(ROOT, "skills/satin", f), path.join(sk, f));
    sh("cp", ["-R", path.join(ROOT, "skills/satin/references"), sk], ROOT);
    fs.mkdirSync(path.join(sk, "scripts"), { recursive: true });
    sh("cp", ["-R", path.join(ROOT, "skills/satin/scripts/lib"), path.join(sk, "scripts/lib")], ROOT);
    fs.copyFileSync(path.join(ROOT, "skills/satin/scripts/check.mjs"), path.join(sk, "scripts/check.mjs"));
    const snippet = fs.readFileSync(path.join(ROOT, "skills/satin/AGENTS.snippet.md"), "utf8").replace(/^<!--[\s\S]*?-->\n/, "").replaceAll("<skill>", ".agents/skills/satin");
    agents += `\n${SATIN_ENV[fw]}\n\n${snippet}\n（评测环境：检查器只跑 static 模式就行，dom 模式和截图由评测方统一跑。）\n`;
  }
  fs.writeFileSync(path.join(dir, "AGENTS.md"), agents);
  return { dir, skip: false };
}

// 评测时停用本机的全局技能（~/.agents/skills、~/.codex/skills 里的 ui、playwright……）：两组都不受它们影响，差别只在有没有 Satin。
// 只是这次命令行的临时设置（-c），不改 ~/.codex/config.toml
const HOME = process.env.HOME;
const NO_USER_SKILLS = "[" + [path.join(HOME, ".agents/skills"), path.join(HOME, ".codex/skills")].flatMap((d) => (fs.existsSync(d) ? fs.readdirSync(d).map((n) => path.join(d, n, "SKILL.md")).filter((f) => fs.existsSync(f)) : [])).map((f) => `{path=${JSON.stringify(f)},enabled=false}`).join(",") + "]";
// ———— 跑一份 ————
function runOne(task, fw, cond) {
  return new Promise((resolve) => {
    const { dir, skip } = prepare(task, fw, cond);
    if (skip) return resolve({ task: task.id, fw, cond, skip: true });
    const prompt = `${task.prompt}\n\n（${fw === "html" ? "用纯 HTML 做" : fw === "react" ? "用 React 做" : "用 Vue 做"}，做完就结束，不用问我。）`;
    const t0 = Date.now(), log = fs.openSync(path.join(dir, "_codex.jsonl"), "w");
    const p = spawn("codex", ["exec", "-m", MODEL, "-C", dir, "--skip-git-repo-check", "-s", "workspace-write", "-c", `skills.config=${NO_USER_SKILLS}`, "-c", `model_reasoning_effort="${EFFORT}"`, "--json", "-o", path.join(dir, "_last.md"), prompt], { stdio: ["ignore", log, log], env: { ...process.env, PLAYWRIGHT: process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright" } });
    const timer = setTimeout(() => { try { p.kill("SIGTERM"); } catch {} }, TIMEOUT);
    p.on("exit", (code, sig) => {
      clearTimeout(timer); fs.closeSync(log);
      const res = { task: task.id, fw, cond, model: MODEL, code, signal: sig, timeout: sig === "SIGTERM", ms: Date.now() - t0 };
      fs.writeFileSync(path.join(dir, "_done.json"), JSON.stringify(res, null, 2));
      resolve(res);
    });
  });
}

// ———— 排队，最多同时 JOBS 份 ————
const queue = [];
for (const task of TASKS) for (const fw of FWS) for (const cond of CONDS) queue.push([task, fw, cond]);
// 模板先串行装好（装依赖别并发）
for (const fw of FWS) for (const cond of CONDS) template(fw, cond === "with");
console.log(`评测 ${BATCH} · ${MODEL}：${queue.length} 份，同时 ${JOBS} 份 → ${OUT}`);
let done = 0; const results = [];
async function worker() {
  while (queue.length) {
    const [task, fw, cond] = queue.shift();
    const r = await runOne(task, fw, cond); results.push(r); done++;
    console.log(`  [${done}] ${r.skip ? "跳过（已做过）" : (r.code === 0 ? "✓" : "✗") + ` ${(r.ms / 60000).toFixed(1)} 分钟`} ${cond.padEnd(7)} ${fw.padEnd(5)} ${task.id}${r.timeout ? "（超时）" : ""}`);
  }
}
await Promise.all(Array.from({ length: Math.max(1, JOBS) }, worker));
fs.writeFileSync(path.join(OUT, "_runs.json"), JSON.stringify(results, null, 2));
console.log("全部跑完");
