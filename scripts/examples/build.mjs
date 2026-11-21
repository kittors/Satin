// 依次构建各框架示例（串行，不叠加）：React、Vue、Svelte、Solid、Preact（Vite）、Angular、Next.js、Nuxt。纯 HTML 版不用构建。
// 用法：node scripts/examples/build.mjs [--only react,vue]
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ROOT, arg } from "../parity/lib.mjs";
const STEPS = { react: ["npx", "vite", "build"], vue: ["npx", "vite", "build"], svelte: ["npx", "vite", "build"], solid: ["npx", "vite", "build"], preact: ["npx", "vite", "build"], angular: ["npx", "ng", "build"], next: ["npx", "next", "build"], nuxt: ["npx", "nuxt", "build"] };
const only = arg("only", "") ? new Set(String(arg("only")).split(",")) : null;
let bad = 0;
for (const [name, [cmd, ...args]] of Object.entries(STEPS)) {
  if (only && !only.has(name)) continue;
  const t = Date.now(), r = spawnSync(cmd, args, { cwd: path.join(ROOT, "examples", name), env: { ...process.env, NG_CLI_ANALYTICS: "false", NEXT_TELEMETRY_DISABLED: "1", NUXT_TELEMETRY_DISABLED: "1" }, encoding: "utf8" });
  const ok = r.status === 0; if (!ok) bad++;
  // Angular 只出一个 index.html（地址里带 ?gallery 启动全量示例）：另存一份 gallery.html，和别的框架一样按 dist/…/gallery.html 打开
  if (ok && name === "angular") { const d = path.join(ROOT, "examples/angular/dist/browser"); fs.copyFileSync(path.join(d, "index.html"), path.join(d, "gallery.html")); }
  console.log(`  ${ok ? "✓" : "✗"} ${name.padEnd(8)} ${((Date.now() - t) / 1000).toFixed(1)}s`);
  if (!ok) console.log((r.stdout + r.stderr).split("\n").filter((l) => /error|Error|✗|TS\d{4}/.test(l)).slice(0, 12).join("\n"));
}
console.log(bad ? `示例构建：${bad} 个失败` : "示例构建：全部通过");
process.exitCode = bad ? 1 : 0;
