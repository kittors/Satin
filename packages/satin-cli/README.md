# satin-cli

Satin（`satin-ui`）的命令行工具，命令名 `satin`：

- `satin init`：选一种写法（React、Vue、Next.js、Nuxt、Svelte、Angular、Solid、Preact、纯 HTML）建好能直接跑的项目，样式、theme-boot、框架插件都配好，装上给编码助手的技能和 `AGENTS.md` / `CLAUDE.md`
- `satin add <配方>`：把页面配方拷进项目
- `satin check`：跑去 AI 味检查器
- `satin doctor`：查项目配置，每一项不对都给修法
- `satin skill`：给已有项目装上或更新技能

还没有发布到 npm（发布要用户确认）。在 Satin 仓库里的用法：

```sh
node packages/satin-cli/bin/satin.js init --framework react --dir ../my-app
```

完整说明见 `docs/notes/cli-doc.md`。

- 测试：`pnpm test:cli`（只生成文件，不装依赖）
- 完整验收（装依赖、构建、截图、检查器）：`node scripts/cli/accept.mjs`
- 配方的纯 HTML 写法：`node scripts/skill/recipes-render.mjs && node scripts/cli/recipes-html.mjs`
- 发布前 `npm pack` / `npm publish` 会先跑 `scripts/prepack.mjs`，把技能拷进 `templates/skill/`
