// 代码检查：只开"一定是错"的规则（未定义的变量、给常量赋值、重复的键、走不到的代码、错的 typeof……），风格不管。
// 跑法：pnpm lint
import js from "@eslint/js";
import globals from "globals";

const bugsOnly = {
  ...js.configs.recommended.rules,
  "no-unused-vars": "off", // 设计稿时期留下的参数、解构很多，不当错误
  "no-empty": "off", // try {} catch {} 吞掉错误是有意的（localStorage、matchMedia 在一些环境里会抛）
  "no-cond-assign": ["error", "except-parens"],
  "no-control-regex": "off", // Markdown 过滤、XSS 防护里要匹配控制字符
  "no-useless-escape": "off",
  "no-prototype-builtins": "off",
  "no-fallthrough": "off",
  "no-sparse-arrays": "off",
  "no-misleading-character-class": "off",
  "no-irregular-whitespace": ["error", { skipStrings: true, skipTemplates: true, skipRegExps: true, skipComments: true, skipJSXText: true }], // 中文排版的全角空格是有意的
};
export default [
  { ignores: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/.nuxt/**", "**/.output/**", "**/.angular/**", ".parity/**", "eval/runs/**", "examples/**/*.{jsx,tsx,vue,svelte,ts}", "skills/satin/scripts/fixtures/**", "packages/satin-ui/src/flow-layout-worker.js"] },
  { files: ["packages/satin-ui/**/*.js", "demo/**/*.js", "site/**/*.js", "examples/**/*.js", "tests/**/*.js"], languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: { ...globals.browser } }, rules: bugsOnly },
  { files: ["packages/satin-ui/src/table-worker.js"], languageOptions: { globals: { ...globals.worker } } },
  { files: ["scripts/**/*.mjs", "skills/**/*.mjs", "eslint.config.js", "examples/**/*.config.{js,mjs}", "examples/**/vite.config.js"], languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: { ...globals.node, ...globals.browser } }, rules: bugsOnly },
  // 巡检脚本里放进页面执行的函数用到页面上的全局 __audit
  { files: ["scripts/docs-audit.mjs"], languageOptions: { globals: { __audit: "readonly" } } },
  // 页面里跑的探针（Playwright addInitScript）：浏览器全局
  { files: ["scripts/parity/inpage.js"], languageOptions: { sourceType: "script", globals: { ...globals.browser } } },
];
