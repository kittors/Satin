# 用 CLI 创建项目（官网页面正文草稿）

> 给官网"开始 → 用 CLI 创建项目"那一页用。命令行工具在 `packages/satin-cli`，命令名 `satin`；`npx satin-ui init` 会转给它。

## 现在的状态

**还没有发布到 npm。** `satin-cli` 和 `satin-ui` 都还没发布，发布要用户确认。现在只能在 Satin 仓库里用本地的命令（下面的写法）。
在仓库里运行时，新项目装的 `satin-ui` 是从 `packages/satin-ui` 现打的包（放在新项目的 `.satin/` 里），发布以后换成 npm 上的版本。

```sh
# 在 Satin 仓库外面任何目录都行，路径换成你的仓库位置
node <Satin 仓库>/packages/satin-cli/bin/satin.js init --framework react --dir my-app
cd my-app
npm run dev
```

发布以后的写法（现在还不能用）：

```sh
npx satin-cli init        # 或者 npx satin-ui init
```

## 一条命令建好项目

```sh
satin init my-app --framework vue --pm pnpm
```

建好的项目能直接跑：样式、`theme-boot`（第一帧之前写好深浅主题，刷新不闪）、框架插件都配好了；带一个起步页（页头、一个输入框、一个分段控件、一个主按钮，深浅两套主题都对）；
给编码助手的技能和说明也装好了，`package.json` 里多一个 `check` 脚本跑去 AI 味检查。

不在终端里运行（AI 直接调用、CI）时不会提问：要写 `--framework`，或者加 `--yes` 用默认的 React。

## 命令

| 命令 | 做什么 |
|---|---|
| `satin init [目录]` | 新建项目 |
| `satin add <配方>` | 把页面配方拷进项目（按项目的写法）；`satin add --list` 看有哪些 |
| `satin check [目录或文件…]` | 跑去 AI 味检查器，每条问题带修法；有"必须改"时退出码 1 |
| `satin doctor` | 查项目配置，每一项不对都给一句修法 |
| `satin skill` | 给已有项目装上或更新技能，写好 `AGENTS.md` / `CLAUDE.md` 里 Satin 那一段，加 `check` 脚本 |

### init 的参数

| 参数 | 说明 | 默认 |
|---|---|---|
| `--framework <写法>` | `react`、`vue`、`next`、`nuxt`、`svelte`、`angular`、`solid`、`preact`、`html` | 终端里会问；加 `--yes` 用 `react` |
| `--dir <目录>` | 项目目录，也可以直接写在命令后面 | `satin-app` |
| `--pm <包管理器>` | `pnpm`、`npm`、`yarn`、`bun` | 按运行这条命令的工具猜（`pnpm dlx`、`npx`、`yarn dlx`、`bunx`），猜不出用 `npm` |
| `--agents <列表>` | 给哪些编码助手装技能：`claude`、`codex`，逗号分隔 | 两个都装 |
| `--yes`、`-y` | 不问，没写的都用默认值 | |
| `--no-install` | 只生成文件，不装依赖 | 会装 |
| `--satin <依赖写法>` | `satin-ui` 的依赖写法，比如 `^0.1.0`、`file:../Satin/packages/satin-ui` | npm 上的版本；在仓库里运行时用本地打的包 |
| `--force` | 目录里已经有文件也往里写（同名文件会被覆盖） | 不写 |

### add、check、doctor、skill 的参数

| 命令 | 参数 |
|---|---|
| `add` | `--list` 看有哪些配方；`--dir` 项目目录；`--framework` 指定写法（看不出来时）；`--force` 覆盖已有文件 |
| `check` | 不写路径时扫这个写法的源码目录；`--dom <地址>` 在浏览器里量页面（深浅 × 1440 / 768 / 390，要 Playwright）；`--json`；`--max <条数>` |
| `doctor` | `--dir`；`--json` |
| `skill` | `--agents claude,codex`（不写时：已经装了哪几个就更新哪几个，一个都没有就两个都装）；`--dir` |

退出码：`0` 成功；`1` 跑了但有问题（检查有 error、依赖没装好、配方没有这种写法……）；`2` 参数不对。

## 每种写法生成哪些文件

所有写法都有这几个：

```text
package.json          satin-ui + 框架依赖；dev、build、check 脚本；"satin" 字段记下写法和包管理器（doctor、add 读）
README.md             常用命令、给编码助手的说明在哪
AGENTS.md             Codex 读：Satin 那一段（用 <!-- satin:start --> … <!-- satin:end --> 包住）
CLAUDE.md             Claude Code 读：同上
.agents/skills/satin/ Codex 的项目级技能
.claude/skills/satin/ Claude Code 的项目级技能
.gitignore
pnpm-workspace.yaml   只有 --pm pnpm 时有：放行这个写法要用的安装脚本（esbuild 等）
.satin/               只有在仓库里运行时有：本地打的 satin-ui 包
```

各写法自己的文件：

```text
react     index.html  tsconfig.json  vite.config.ts  src/main.tsx  src/App.tsx
vue       index.html  tsconfig.json  vite.config.ts  src/main.ts   src/App.vue
svelte    index.html  tsconfig.json  vite.config.ts  src/main.ts   src/App.svelte
solid     index.html  tsconfig.json  vite.config.ts  src/main.tsx  src/App.tsx        （Solid 2：@solidjs/web、@solidjs/vite-plugin）
preact    index.html  tsconfig.json  vite.config.ts  src/main.tsx  src/App.tsx
angular   angular.json  tsconfig.json  src/index.html  src/main.ts  src/app.ts  src/styles.css
next      next.config.mjs  tsconfig.json  app/layout.tsx  app/page.tsx  app/new-project.tsx
nuxt      nuxt.config.ts  app/app.vue  app/plugins/satin.ts
html      index.html  main.js  serve.mjs                              （不用打包工具；npm run dev 起一个本地服务）
```

### 各写法里配好了什么

| 写法 | 样式 | theme-boot | 组件 |
|---|---|---|---|
| React、Vue、Svelte、Solid、Preact（Vite） | 入口里 `import "satin-ui/css/page.css"` | `vite.config.ts` 里的 `satin()` 插件 | React：`satin-ui/react`；Vue：`app.use(Satin)`；其余：`setup()` + `defineElements()`，用 `<sn-xxx>` |
| Next.js | `app/layout.tsx` 里引 `page.css` | `satin-ui/theme-boot-script` 内联进 `<head>`，`<html>` 加 `suppressHydrationWarning` | `satin-ui/react`（服务端组件里也能用） |
| Nuxt | `nuxt.config.ts` 的 `css` | `app.head.script` 里 `tagPosition: "head"` | `app/plugins/satin.ts` 里 `vueApp.use(Satin)` |
| Angular | `src/styles.css` 里 `@import` | `angular.json` 把 `theme-boot.js` 拷进构建，`src/index.html` 的 `<head>` 最前面引 | `setup()` + `defineElements()`，组件上加 `CUSTOM_ELEMENTS_SCHEMA` |
| 纯 HTML | `<link>` 引 `node_modules` 里的 `page.css` | `<head>` 最前面的 `<script src="…/theme-boot.js">` | 导入映射把 `satin-ui` 指到 `node_modules`；`setup()` + `defineElements()` + `enhance()` |

## 页面配方

```sh
satin add --list
satin add settings
```

8 种页面配方：后台列表、设置页、登录注册、仪表盘、AI 对话、落地页、移动端下单、表单向导。
纯 HTML 项目拷成项目根目录下的一张页面（比如 `settings.html`，开发服务器起来以后打开 `/settings.html`）；
Vite 类的写法拷进 `src/recipes/<配方>/`，Next.js、Nuxt 拷进 `app/recipes/<配方>/`（Next.js 还会建好路由 `app/<配方>/page.tsx`）。
某种写法的配方模板还没有时，命令会说清楚现在有哪几种写法，退出码 1。

## 常见问题

**能在已有项目里用吗？** 能。在项目根目录运行 `satin skill` 装技能和说明，`satin doctor` 看还差什么（样式、theme-boot、框架插件），照着修法改。

**`AGENTS.md`、`CLAUDE.md` 里我自己写的内容会被改吗？** 不会。Satin 那一段用 `<!-- satin:start -->` 和 `<!-- satin:end -->` 包住，重新运行只换这一段。

**怎么更新技能？** 运行 `satin skill`。`satin doctor` 会告诉你项目里的技能是不是最新的。

**`package.json` 里本来就有 `check` 脚本怎么办？** 不动它，Satin 的检查加成 `check:satin`。

**用 pnpm 装依赖时提示有安装脚本没跑？** pnpm 默认不跑依赖的安装脚本。`--pm pnpm` 生成的项目带 `pnpm-workspace.yaml`，把这个写法要用的几个（esbuild、Angular 的 lmdb、Nuxt 的 @parcel/watcher）放行了；还有别的提示就照 pnpm 给的命令放行。

**Next.js 开发时 `AGENTS.md` 里多了一段 Next.js 的说明？** 那是 Next.js 自己加的（检测到编码助手时），和 Satin 那一段互不影响。不想要就在 `next.config.mjs` 里写 `agentRules: false`。

**页面检查（`check --dom`）提示要 Playwright？** 在项目里装 `npm i -D playwright`（用本机的 Chrome），或者设环境变量 `PLAYWRIGHT` 指向已经装好的 playwright 包。只查代码用默认的 static 模式，不需要 Playwright。

**`satin init` 卡在提问？** 不会：不在终端里运行时不提问。在终端里想跳过提问，加 `--yes`。
