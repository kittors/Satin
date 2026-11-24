// 校验全部 React 契约示例、设计稿演示、页面配方、CLI 起步模板与 React 示例工程在严格 TypeScript 下 0 报错。
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "../..");
const TMP = path.join(ROOT, ".parity/examples-ts");
fs.mkdirSync(TMP, { recursive: true });
const shim = path.join(TMP, "shims.d.ts");
fs.writeFileSync(shim, 'declare module "*.css";\ndeclare module "next";\ndeclare module "next/font/google";\n');
const cfg = path.join(TMP, "tsconfig.json");
fs.writeFileSync(cfg, JSON.stringify({
  compilerOptions: {
    target: "ES2022",
    module: "ESNext",
    moduleResolution: "bundler",
    jsx: "react-jsx",
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    lib: ["ES2022", "DOM", "DOM.Iterable"],
    baseUrl: ROOT,
    paths: {
      "satin-ui": ["./packages/satin-ui/types/index.d.ts"],
      "satin-ui/react": ["./packages/satin-ui/types/react.d.ts"],
      "satin-ui/react/*": ["./packages/satin-ui/types/react-*.d.ts"],
      "satin-ui/elements": ["./packages/satin-ui/types/elements.d.ts"],
      "satin-ui/components": ["./packages/satin-ui/types/components.d.ts"],
      "satin-ui/*": ["./packages/satin-ui/types/*.d.ts"],
    },
    typeRoots: [path.join(ROOT, "node_modules/@types")],
  },
  include: [
    shim,
    path.join(ROOT, "packages/satin-ui/types/react.d.ts"),
    path.join(ROOT, "examples/shared/sink.d.ts"),
    path.join(ROOT, "spec/components/_api/code/*/react.tsx"),
    path.join(ROOT, "examples/react/src/App.tsx"),
    path.join(ROOT, "examples/react/src/main.tsx"),
    path.join(ROOT, "examples/react/src/leak.tsx"),
    path.join(ROOT, "examples/react/src/demos/*.tsx"),
    path.join(ROOT, "examples/react/src/recipes/*.tsx"),
    path.join(ROOT, "packages/satin-cli/starters/react/src/*.tsx"),
    path.join(ROOT, "packages/satin-cli/starters/next/app/*.tsx"),
  ],
}, null, 2));

const tsc = path.join(ROOT, "node_modules/.bin/tsc");
const r = spawnSync(tsc, ["-p", cfg], { cwd: ROOT, encoding: "utf8" });
fs.rmSync(TMP, { recursive: true, force: true });
if (r.status !== 0) {
  console.error(r.stdout || r.stderr);
  process.exit(r.status || 1);
}
const nContracts = fs.readdirSync(path.join(ROOT, "spec/components/_api/code")).filter((d) => fs.existsSync(path.join(ROOT, "spec/components/_api/code", d, "react.tsx"))).length;
const nDemos = fs.readdirSync(path.join(ROOT, "examples/react/src/demos")).filter((f) => f.endsWith(".tsx")).length;
const nRecipes = fs.readdirSync(path.join(ROOT, "examples/react/src/recipes")).filter((f) => f.endsWith(".tsx")).length;
console.log(`TS 示例类型检查：${nContracts} 份契约 + ${nDemos} 份演示 + ${nRecipes} 份配方 + CLI 起步模板全部通过 strict 校验`);
