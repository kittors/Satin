// satin-cli 的自动测试：只在临时目录里生成文件（init 都带 --no-install），不装依赖、不起浏览器，一分钟内跑完。
// 装依赖、构建、截图的完整验收在 scripts/cli/accept.mjs（排队跑）。用法：node --test packages/satin-cli/test
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { main } from "../src/cli.js";
import { parseArgs } from "../src/args.js";
import { upsert, snippet, START, END } from "../src/agents.js";
import { diagnose } from "../src/doctor.js";
import { FRAMEWORKS, IDS } from "../src/frameworks.js";
import { CLI_VERSION } from "../src/paths.js";

const CLI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO = path.resolve(CLI, "../..");
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "satin-cli-test-"));
test.after(() => fs.rmSync(TMP, { recursive: true, force: true }));

// 跑一条命令，收集输出
async function run(argv) {
  const out = [];
  const code = await main(argv, (...a) => out.push(a.join(" ")));
  return { code, out: out.join("\n") };
}
const read = (...p) => fs.readFileSync(path.join(...p), "utf8");
const json = (...p) => JSON.parse(read(...p));
const has = (...p) => fs.existsSync(path.join(...p));
const init = (fw, dir, extra = []) => run(["init", "--framework", fw, "--dir", dir, "--pm", "pnpm", "--no-install", "--satin", "^0.1.0", ...extra]);

// 每种写法的起步模板里应该有的文件（除了 package.json、README、AGENTS.md / CLAUDE.md、技能）
const FILES = {
  react: ["index.html", "tsconfig.json", "vite.config.ts", "src/main.tsx", "src/App.tsx"],
  vue: ["index.html", "tsconfig.json", "vite.config.ts", "src/main.ts", "src/App.vue"],
  svelte: ["index.html", "tsconfig.json", "vite.config.ts", "src/main.ts", "src/App.svelte"],
  solid: ["index.html", "tsconfig.json", "vite.config.ts", "src/main.tsx", "src/App.tsx"],
  preact: ["index.html", "tsconfig.json", "vite.config.ts", "src/main.tsx", "src/App.tsx"],
  angular: ["angular.json", "tsconfig.json", "src/index.html", "src/main.ts", "src/app.ts", "src/styles.css"],
  html: ["index.html", "main.js", "serve.mjs"],
  next: ["next.config.mjs", "tsconfig.json", "app/layout.tsx", "app/page.tsx", "app/new-project.tsx"],
  nuxt: ["nuxt.config.ts", "app/app.vue", "app/plugins/satin.ts"],
};

test("参数解析：开关不吃后面的词，--no-x 是 false，-y 是 --yes", () => {
  const a = parseArgs(["init", "--yes", "my-app", "--framework=vue", "--pm", "pnpm", "--no-install", "-y", "--agents", "claude,codex"]);
  assert.deepEqual(a._, ["init", "my-app"]);
  assert.equal(a.flags.yes, true);
  assert.equal(a.flags.framework, "vue");
  assert.equal(a.flags.pm, "pnpm");
  assert.equal(a.flags.install, false);
  assert.equal(a.flags.agents, "claude,codex");
});

test("--version、--help、不认识的命令", async () => {
  assert.equal((await run(["--version"])).out, CLI_VERSION);
  const h = await run(["--help"]);
  assert.equal(h.code, 0); assert.match(h.out, /satin <命令>/); assert.match(h.out, /init \[目录\]/); assert.match(h.out, /--framework/);
  assert.equal((await run(["frobnicate"])).code, 2);
  assert.equal((await run([])).code, 2);
});

for (const fw of IDS) {
  test(`init ${fw}：文件齐全、依赖和脚本对、技能和 AGENTS.md / CLAUDE.md 都写好、检查器 0 error`, async () => {
    const dir = path.join(TMP, "init-" + fw);
    const r = await init(fw, dir);
    assert.equal(r.code, 0, r.out);
    for (const f of [...FILES[fw], "package.json", "README.md", ".gitignore", "AGENTS.md", "CLAUDE.md"]) assert.ok(has(dir, f), `${fw} 缺 ${f}`);
    const pkg = json(dir, "package.json"), def = FRAMEWORKS[fw];
    assert.equal(pkg.dependencies["satin-ui"], "^0.1.0");
    for (const d of Object.keys(def.deps)) assert.ok(pkg.dependencies[d], `${fw} 缺依赖 ${d}`);
    for (const d of Object.keys(def.dev)) assert.ok(pkg.devDependencies[d], `${fw} 缺开发依赖 ${d}`);
    assert.deepEqual(pkg.satin, { framework: fw, packageManager: "pnpm" });
    assert.equal(pkg.scripts.check, `node .claude/skills/satin/scripts/check.mjs static ${def.src.join(" ")}`);
    assert.equal(has(dir, "pnpm-workspace.yaml"), !!def.builds, "pnpm 项目放行安装脚本");
    // 技能：两份都在，样例和自测没拷，带版本记录
    for (const d of [".claude/skills/satin", ".agents/skills/satin"]) {
      assert.ok(has(dir, d, "SKILL.md") && has(dir, d, "scripts/check.mjs") && has(dir, d, "references/recipes.md"), `${fw} ${d} 不全`);
      assert.ok(!has(dir, d, "scripts/fixtures") && !has(dir, d, "scripts/check.test.mjs"), `${fw} ${d} 拷进了检查器自测的东西`);
      assert.ok(json(dir, d, ".satin-skill.json").hash);
    }
    assert.match(read(dir, "CLAUDE.md"), /`\.claude\/skills\/satin\/SKILL\.md`/);
    assert.match(read(dir, "AGENTS.md"), /`\.agents\/skills\/satin\/SKILL\.md`/);
    assert.doesNotMatch(read(dir, "AGENTS.md"), /<skill>/);
    assert.match(read(dir, "AGENTS.md"), /pnpm run check/);
    // 起步页过技能自带的检查器（源码模式）：0 error
    const c = spawnSync(process.execPath, [path.join(dir, ".claude/skills/satin/scripts/check.mjs"), "static", ...def.src, "--json"], { cwd: dir, encoding: "utf8" });
    const res = JSON.parse(c.stdout);
    assert.equal(res.counts.error, 0, `${fw} 起步页有检查器 error：${JSON.stringify(res.counts.byRule)}`);
    assert.ok(res.files >= 2, `${fw} 检查器没扫到文件`);
  });
}

test("起步模板：theme-boot、样式、框架接入放对了（按写法）", () => {
  const d = (fw) => path.join(TMP, "init-" + fw);
  assert.match(read(d("angular"), "angular.json"), /"packageManager": "pnpm"/);
  assert.match(read(d("angular"), "angular.json"), /theme-boot\.js/);
  assert.match(read(d("angular"), "src/index.html"), /<script src="theme-boot.js"><\/script>/);
  assert.match(read(d("html"), "index.html"), /<head>\n<meta charset="utf-8">\n<!--[^\n]*-->\n<script src="\/node_modules\/satin-ui\/src\/theme-boot.js"><\/script>/);
  assert.match(read(d("next"), "app/layout.tsx"), /suppressHydrationWarning/);
  assert.match(read(d("nuxt"), "nuxt.config.ts"), /tagPosition: "head"/);
  for (const fw of ["react", "vue", "svelte", "solid", "preact"]) assert.match(read(d(fw), "vite.config.ts"), /import satin from "satin-ui\/vite";[\s\S]*satin\(\)/);
  // 起步模板里不能留示例专用的东西（截图对比用的 sink、泄漏测试的 leak、示例目录外的相对路径）
  for (const fw of IDS) for (const f of FILES[fw]) assert.doesNotMatch(read(d(fw), f), /sink|leak|\.\.\/\.\.\/|shared\//, `${fw}/${f}`);
});

test("init：不在终端里又没写 --framework → 参数错（2）；--yes 用默认的 react；目录里有文件 → 2", async () => {
  const r = await run(["init", "--dir", path.join(TMP, "no-fw"), "--no-install"]);
  assert.equal(r.code, 2); assert.match(r.out, /--framework/);
  const y = await run(["init", "--yes", "--dir", path.join(TMP, "yes"), "--no-install", "--satin", "^0.1.0", "--pm", "npm"]);
  assert.equal(y.code, 0, y.out); assert.equal(json(TMP, "yes", "package.json").satin.framework, "react");
  assert.equal(json(TMP, "yes", "package.json").scripts.check.includes("check.mjs"), true);
  assert.equal(has(TMP, "yes", "pnpm-workspace.yaml"), false);
  const again = await init("vue", path.join(TMP, "yes"));
  assert.equal(again.code, 2); assert.match(again.out, /已经有文件/);
  assert.equal((await run(["init", "--framework", "qwik", "--dir", path.join(TMP, "x"), "--no-install"])).code, 2);
  assert.equal((await run(["init", "--framework", "react", "--pm", "deno", "--dir", path.join(TMP, "x"), "--no-install"])).code, 2);
});

test("init --agents codex：只装 Codex 那一份，check 脚本指向它", async () => {
  const dir = path.join(TMP, "codex-only");
  assert.equal((await init("vue", dir, ["--agents", "codex"])).code, 0);
  assert.ok(has(dir, ".agents/skills/satin/SKILL.md")); assert.ok(!has(dir, ".claude")); assert.ok(!has(dir, "CLAUDE.md"));
  assert.match(json(dir, "package.json").scripts.check, /^node \.agents\/skills\/satin\/scripts\/check\.mjs static/);
});

test("AGENTS.md：起止标记之间整段替换，用户自己写的不动；重复运行不会多出一段", () => {
  const user = "# 我的项目\n\n这里是我自己写的说明。\n";
  const once = upsert(user, snippet(".agents/skills/satin", "npm run check"));
  assert.ok(once.startsWith(user.trimEnd()));
  const twice = upsert(once, snippet(".agents/skills/satin", "pnpm run check"));
  assert.equal(twice.split(START).length - 1, 1); assert.equal(twice.split(END).length - 1, 1);
  assert.match(twice, /`pnpm run check`/); assert.doesNotMatch(twice, /`npm run check`/);
  assert.ok(twice.startsWith("# 我的项目\n\n这里是我自己写的说明。"));
  assert.equal(upsert("", "X"), "X\n");
});

test("satin skill：给已有项目装上 / 更新，用户在 AGENTS.md、CLAUDE.md 里写的内容保留；已有别的 check 脚本时加成 check:satin", async () => {
  const dir = path.join(TMP, "existing");
  fs.mkdirSync(path.join(dir, "src"), { recursive: true });
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ name: "x", dependencies: { react: "^19.0.0" }, scripts: { check: "tsc --noEmit" } }));
  fs.writeFileSync(path.join(dir, "AGENTS.md"), "# 团队约定\n\n提交前跑测试。\n");
  const r = await run(["skill", "--dir", dir]);
  assert.equal(r.code, 0, r.out);
  assert.match(read(dir, "AGENTS.md"), /^# 团队约定\n\n提交前跑测试。\n\n<!-- satin:start -->/);
  assert.ok(has(dir, "CLAUDE.md") && has(dir, ".claude/skills/satin/SKILL.md") && has(dir, ".agents/skills/satin/SKILL.md"));
  const pkg = json(dir, "package.json");
  assert.equal(pkg.scripts.check, "tsc --noEmit");
  assert.match(pkg.scripts["check:satin"], /check\.mjs static src$/);
  // 再跑一次：还是一段；没写 --agents 时只更新已经装了的
  fs.rmSync(path.join(dir, ".claude"), { recursive: true }); fs.rmSync(path.join(dir, "CLAUDE.md"));
  assert.equal((await run(["skill", "--dir", dir])).code, 0);
  assert.equal(read(dir, "AGENTS.md").split(START).length - 1, 1);
  assert.ok(!has(dir, ".claude"), "没写 --agents 时不该把删掉的那份装回来");
});

test("satin add：纯 HTML 项目拷配方页面（路径指向 node_modules）；没有对应写法时说清楚（1）；不认识的配方（2）；--list", async () => {
  const dir = path.join(TMP, "init-html");
  const r = await run(["add", "settings", "--dir", dir]);
  assert.equal(r.code, 0, r.out);
  const page = read(dir, "settings.html");
  assert.match(page, /\/node_modules\/satin-ui\/src\/theme-boot\.js/); assert.doesNotMatch(page, /\.\.\/\.\.\//);
  assert.equal((await run(["add", "settings", "--dir", dir])).code, 2, "已有文件不覆盖");
  assert.equal((await run(["add", "settings", "--dir", dir, "--force"])).code, 0);
  const list = await run(["add", "--list"]);
  assert.equal(list.code, 0); for (const id of json(REPO, "tests/recipes/index.json")) assert.match(list.out, new RegExp(id));
  assert.equal((await run(["add", "no-such", "--dir", dir])).code, 2);
  // React 写法的配方模板还没生成时：退出码 1，告诉用户怎么办；生成了就能拷
  const react = path.join(TMP, "init-react");
  const hasReact = has(CLI, "templates/recipes/settings/react/manifest.json");
  const rr = await run(["add", "settings", "--dir", react]);
  if (hasReact) assert.equal(rr.code, 0, rr.out);
  else { assert.equal(rr.code, 1); assert.match(rr.out, /还没有 react 写法/); }
});

test("satin doctor：生成的项目只差装依赖；改坏 theme-boot、删掉 AGENTS 那一段、技能过期都能查出来", async () => {
  const dir = path.join(TMP, "init-react");
  const bad = (d) => diagnose(d).results.filter((r) => !r.ok).map((r) => r.title);
  assert.deepEqual(bad(dir).map((t) => t.replace(/（.*/, "")), ["satin-ui 装进了 node_modules"]);
  assert.match(diagnose(dir).results.find((r) => !r.ok).fix, /pnpm install/, "按项目记下的包管理器给修法");
  fs.writeFileSync(path.join(dir, "vite.config.ts"), read(dir, "vite.config.ts").replace("satin()", ""));
  fs.writeFileSync(path.join(dir, "AGENTS.md"), "# 空的\n");
  const stamp = path.join(dir, ".claude/skills/satin/.satin-skill.json");
  fs.writeFileSync(stamp, JSON.stringify({ hash: "old" }));
  const now = bad(dir).join("\n");
  assert.match(now, /theme-boot/); assert.match(now, /AGENTS\.md/); assert.match(now, /\.claude\/skills\/satin 是最新的技能/);
  const r = await run(["doctor", "--dir", dir]);
  assert.equal(r.code, 1); assert.match(r.out, /→ 运行 satin skill/);
  // 修好：satin skill 更新技能和 AGENTS.md
  assert.equal((await run(["skill", "--dir", dir])).code, 0);
  assert.doesNotMatch(bad(dir).join("\n"), /AGENTS|最新的技能/);
  for (const fw of ["vue", "next", "nuxt", "svelte", "angular", "solid", "preact", "html"]) {
    assert.deepEqual(bad(path.join(TMP, "init-" + fw)).map((t) => t.replace(/（.*/, "")), fw === "html" ? ["satin-ui 装进了 node_modules"] : ["satin-ui 装进了 node_modules"], fw);
  }
});

test("satin check：转给技能里的检查器（起步页 0 error → 0）；没装技能 → 2；--dom 没给地址 → 2", async () => {
  const ok = spawnSync(process.execPath, [path.join(CLI, "bin/satin.js"), "check", "--dir", path.join(TMP, "init-html")], { encoding: "utf8" });
  assert.equal(ok.status, 0, ok.stdout + ok.stderr); assert.match(ok.stdout, /没有发现问题/);
  const bare = path.join(TMP, "bare"); fs.mkdirSync(bare, { recursive: true });
  assert.equal((await run(["check", "--dir", bare])).code, 2);
  assert.equal((await run(["check", "--dir", path.join(TMP, "init-html"), "--dom"])).code, 2);
  // 有问题的文件：检查器的修法原样转出来，退出码 1
  fs.writeFileSync(path.join(TMP, "init-html", "bad.html"), '<div style="background: linear-gradient(90deg, #7c3aed, #db2777); color: #ff00aa">x</div>');
  const b = spawnSync(process.execPath, [path.join(CLI, "bin/satin.js"), "check", "bad.html", "--dir", path.join(TMP, "init-html")], { encoding: "utf8", cwd: path.join(TMP, "init-html") });
  assert.equal(b.status, 1); assert.match(b.stdout, /→ /);
  fs.rmSync(path.join(TMP, "init-html", "bad.html"));
});

test("npx satin-ui …：satin-ui 的 bin 转给 satin-cli", () => {
  const r = spawnSync(process.execPath, [path.join(REPO, "packages/satin-ui/bin/satin-ui.js"), "--version"], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr); assert.equal(r.stdout.trim(), CLI_VERSION);
  assert.equal(json(REPO, "packages/satin-ui/package.json").bin["satin-ui"], "bin/satin-ui.js");
});

test("在仓库里运行、没写 --satin：satin-ui 打成本地 .tgz 放进项目（还没发布时的用法）", { skip: spawnSync("npm", ["--version"]).status !== 0 && "没有 npm" }, async () => {
  const dir = path.join(TMP, "local");
  const r = await run(["init", "--framework", "html", "--dir", dir, "--pm", "npm", "--no-install"]);
  assert.equal(r.code, 0, r.out);
  const spec = json(dir, "package.json").dependencies["satin-ui"];
  assert.match(spec, /^file:\.satin\/satin-ui-[\d.]+\.tgz$/);
  assert.ok(has(dir, spec.replace("file:", "")));
  assert.match(read(dir, "README.md"), /本地打的包/);
});

test("发布出去的包（prepack 以后，不在仓库里）：技能从 templates/skill 读，satin-ui 用 npm 上的版本", () => {
  const pre = spawnSync(process.execPath, [path.join(CLI, "scripts/prepack.mjs")], { encoding: "utf8" });
  assert.equal(pre.status, 0, pre.stderr);
  try {
    assert.ok(has(CLI, "templates/skill/SKILL.md") && !has(CLI, "templates/skill/scripts/fixtures"));
    const dir = path.join(TMP, "packaged");
    const r = spawnSync(process.execPath, [path.join(CLI, "bin/satin.js"), "init", "--framework", "svelte", "--dir", dir, "--pm", "bun", "--no-install"], { encoding: "utf8", env: { ...process.env, SATIN_CLI_PACKAGED: "1" } });
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.equal(json(dir, "package.json").dependencies["satin-ui"], "^" + json(REPO, "packages/satin-ui/package.json").version);
    assert.ok(has(dir, ".agents/skills/satin/SKILL.md"));
    assert.ok(!has(dir, ".satin"));
    assert.match(read(dir, "README.md"), /bun run dev/);
  } finally {
    fs.rmSync(path.join(CLI, "templates/skill"), { recursive: true, force: true });
    fs.rmSync(path.join(CLI, "templates/meta.json"), { force: true });
  }
});
