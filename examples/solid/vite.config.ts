import { defineConfig } from "vite";
import satin from "satin-ui/vite";
import { fileURLToPath } from "node:url";
import solid from "@solidjs/vite-plugin";
const page = (f: string) => fileURLToPath(new URL(f, import.meta.url));
// 两个入口：index.html（同一批组件的对照页）、gallery.html（全量示例：设计稿 61 块的全部演示）
export default defineConfig({ plugins: [solid(), satin()], base: "./", build: { rollupOptions: { input: { main: page("index.html"), gallery: page("gallery.html") } } } });
