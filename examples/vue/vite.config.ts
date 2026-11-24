import { defineConfig } from "vite";
import satin from "satin-ui/vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";
// 三个页面：示例（index.html）、泄漏测试（leak.html）、全量示例（gallery.html）
const page = (f: string) => fileURLToPath(new URL(f, import.meta.url));
export default defineConfig({ plugins: [vue(), satin()], base: "./", build: { rollupOptions: { input: { main: page("index.html"), leak: page("leak.html"), gallery: page("gallery.html") } } } });
