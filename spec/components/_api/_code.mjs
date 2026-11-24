// 契约示例的手写代码：spec/components/_api/code/<slug>/<写法>.<后缀>，一个示例一个目录，7 种写法各一个文件——每个都是能直接放进项目的 TypeScript 组件文件
// （React / Preact / Solid 是 export default function 的 .tsx，Vue 是 <script setup lang="ts"> SFC，Svelte 是 <script lang="ts"> .svelte，Angular 是独立组件 .ts，纯 HTML 是标记 + 需要时的 <script type="module">）。
// 页面级的 setup()、defineElements()（Vue 是 app.use(Satin)，React 可以包 <SatinProvider>）当作应用入口已经调过，示例里不写、也不加注释（只在快速上手、框架接入页讲一次）。
// 合并契约时（node scripts/spec/build.mjs --components）读进 examples[].code；生成全量示例的脚本原样写进 examples/<写法>/，构建、截图逐像素比。
// 命名：Angular 的类名是 slug 转大驼峰 + Component（button-basic → ButtonBasicComponent）、选择器 demo-<slug>（全量示例的入口按这个引）。
import fs from "node:fs";

const EXT = { html: "html", react: "tsx", vue: "vue", svelte: "svelte", angular: "ts", solid: "tsx", preact: "tsx" };
export const code = (slug) => Object.fromEntries(Object.entries(EXT).map(([fw, ext]) => [fw, fs.readFileSync(new URL(`./code/${slug}/${fw}.${ext}`, import.meta.url), "utf8").replace(/\s+$/, "") + "\n"]));
