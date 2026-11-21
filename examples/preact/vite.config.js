import { defineConfig } from "vite";
import satin from "satin-ui/vite";
import { fileURLToPath } from "node:url";
const page = (f) => fileURLToPath(new URL(f, import.meta.url));
import preact from "@preact/preset-vite";
// 两个入口：index.html（同一批组件的对照页）、gallery.html（全量示例：设计稿 61 块的全部演示）
// dedupe：库在仓库根目录（examples/preact 外面），它里面的 react → preact/compat 也要从这个工程的 node_modules 找
export default defineConfig({ plugins: [preact(), satin()], resolve: { dedupe: ["preact"] }, base: "./", build: { rollupOptions: { input: { main: page("index.html"), gallery: page("gallery.html") } } } });
