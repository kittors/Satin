import { defineConfig } from "vite";
import satin from "satin-ui/vite";
import solid from "@solidjs/vite-plugin";
export default defineConfig({ plugins: [solid(), satin()], base: "./" });
