import path from "node:path";
// 示例在 Satin 仓库里，共用 ../shared 的组件清单；Turbopack 的根目录设到仓库根才能引到
/** @type {import('next').NextConfig} */
export default { reactStrictMode: true, agentRules: false, turbopack: { root: path.resolve(import.meta.dirname, "../..") } };
