import { defineConfig } from "vite";
import satin from "satin-ui/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
// 两个页面：示例（index.html）、泄漏测试（leak.html，scripts/test/framework-leaks.mjs 用）
const page = (f) => fileURLToPath(new URL(f, import.meta.url));
export default defineConfig({ plugins: [react(), satin()], base: "./", build: { rollupOptions: { input: { main: page("index.html"), leak: page("leak.html") } } } });
