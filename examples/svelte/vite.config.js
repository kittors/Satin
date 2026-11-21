import { defineConfig } from "vite";
import satin from "satin-ui/vite";
import { fileURLToPath } from "node:url";
const page = (f) => fileURLToPath(new URL(f, import.meta.url));
import { svelte } from "@sveltejs/vite-plugin-svelte";
// 两个入口：index.html（同一批组件的对照页）、gallery.html（全量示例：设计稿 61 块的全部演示）
export default defineConfig({ plugins: [svelte(), satin()], base: "./", build: { rollupOptions: { input: { main: page("index.html"), gallery: page("gallery.html") } } } });
