import { defineConfig } from "vite";
import satin from "satin-ui/vite";
import preact from "@preact/preset-vite";
export default defineConfig({ plugins: [preact(), satin()], base: "./" });
