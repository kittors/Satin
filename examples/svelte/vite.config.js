import { defineConfig } from "vite";
import satin from "satin-ui/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
export default defineConfig({ plugins: [svelte(), satin()], base: "./" });
