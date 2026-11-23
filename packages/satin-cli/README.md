# satin-cli

[English](./README.md) · [简体中文](https://github.com/kittors/Satin/blob/main/README.zh-CN.md)

The official CLI for **[Satin (`satin-ui`)](https://github.com/kittors/Satin)** — scaffold ready-to-run apps across 9 frameworks, install AI coding-agent skills (`AGENTS.md` / `CLAUDE.md`), copy page recipes, audit UI quality with the anti-AI-slop checker, and verify project setup.

## Usage

Run directly without global installation:

```bash
pnpm dlx satin-cli init my-app
# or
npx satin-cli init my-app
```

Or install globally as `satin`:

```bash
pnpm add -g satin-cli
satin init my-app
```

## Commands

| Command | Description |
| --- | --- |
| `satin init [dir]` | Scaffold a project across **React, Vue, Next.js, Nuxt, Svelte, Angular, Solid, Preact, or vanilla HTML** with `satin-ui`, zero-flash `theme-boot`, framework plugins, and AI coding skills configured |
| `satin add <recipe>` | Copy a production page recipe (e.g. dashboard, settings, login, table list, AI chat, wizard) matching the current project's framework (`satin add --list` to browse) |
| `satin check [paths...]` | Run the static & optional Playwright `--dom <url>` anti-AI-slop design auditor (`--json`, `--max <n>`) |
| `satin doctor` | Inspect project configuration (styles, theme-boot, Vite plugin, skills, `package.json`) with actionable fixes (`--json`) |
| `satin skill` | Install or upgrade Satin AI skills and `AGENTS.md` / `CLAUDE.md` sections in an existing repository |

## Common Flags (`satin init`)

```bash
pnpm dlx satin-cli init my-app \
  --framework react \
  --pm pnpm \
  --agents claude,codex \
  --yes
```

- `--framework <id>`: `react | vue | next | nuxt | svelte | angular | solid | preact | html`
- `--dir <path>`: Target directory (defaults to `satin-app`)
- `--pm <manager>`: `pnpm | npm | yarn | bun`
- `--agents <list>`: `claude,codex` (default: both)
- `--yes, -y`: Non-interactive mode with defaults
- `--no-install`: Generate files without running package installation
- `--force`: Allow writing into a non-empty directory

## Requirements

- Node.js `>= 20`

## License

[MIT](./LICENSE)
