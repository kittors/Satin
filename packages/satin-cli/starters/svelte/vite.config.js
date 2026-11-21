import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import satin from "satin-ui/vite"; // 把 theme-boot 内联进 <head> 最前面：第一帧之前写好深浅主题，刷新不闪

export default defineConfig({ plugins: [svelte(), satin()] });
