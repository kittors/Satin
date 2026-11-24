<div align="center">

# Satin

**A restrained, high-craft Web UI component & design system library engineered for both human developers and AI coding agents.**

[English](./README.md) · [简体中文](./README.zh-CN.md)

[![npm version (satin-ui)](https://img.shields.io/npm/v/satin-ui?label=satin-ui&color=111111)](https://www.npmjs.com/package/satin-ui)
[![npm version (satin-cli)](https://img.shields.io/npm/v/satin-cli?label=satin-cli&color=111111)](https://www.npmjs.com/package/satin-cli)
[![CI](https://github.com/kittors/Satin/actions/workflows/ci.yml/badge.svg)](https://github.com/kittors/Satin/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)](./packages/satin-ui/types/index.d.ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-18794e.svg)](./LICENSE)

</div>

---

Named after *satin* — smooth, lustrous, and never loud. Satin pairs a framework-agnostic, zero-runtime-dependency component core with first-class **React**, **Vue**, **Svelte**, and **Web Components** wrappers, W3C DTCG design tokens, frame-by-frame choreographed motion, full **English & Simplified Chinese** i18n, and an **AI skill + anti-AI-slop design auditor**.

## Highlights

- **Zero Mandatory Runtime Dependencies & Strict Tree-Shaking**: Pure ESM with named exports, `"sideEffects"` annotated, and automated gzip size budgets enforced in CI.
- **First-Class Multi-Framework Ergonomics**: Native-feeling wrappers for **React 18+** (Next.js App Router ready), **Vue 3.3+** (Nuxt ready), **Svelte 5**, **Web Components** (Light DOM, zero Shadow DOM styling friction), **Angular**, **Solid**, **Preact**, and vanilla HTML.
- **Declarative Theming & Live Customization**: `<SatinProvider>` / `<ThemeScope>` / `useTheme()` (React) and `app.use(Satin, options)` / `<SnThemeScope>` / `useTheme()` (Vue), plus an interactive visual Theme Panel with a custom Satin HSV color picker, WCAG AA contrast adaptation, light/dark modes, 4 radius presets, line contrast levels, and motion pacing.
- **Bilingual i18n Built In (`en` & `zh-CN`)**: 100% key parity across 20 component modules (550+ strings), on-demand English locale tree-shaken when unused, one-call `setLocale("en", en)`, and reactive `useLocale()`.
- **Enterprise Heavy Components on Dedicated Subpaths**:
  - `DataGrid` (100K-row virtualized DOM grid) & `CanvasGrid` (1M-row high-FPS Canvas grid)
  - `Chat` & `ThreadRail` (AI streaming responses, collapsible thinking blocks, tool call cards, prompt composer, thread scrubber rail)
  - `AreaChart`, `BarChart`, `DonutChart`, `Chart3D`, `Sparkline`, `Icon3D` (zero-dependency HiDPI Canvas charts synced to CSS tokens)
  - `Flow` (DOM + 50K-node Canvas node graph) & `Markdown` (XSS-sanitized renderer)
- **Zero Style Leakage & SSR Safety**: Every stylesheet lives inside `@layer satin`; all modules are safe to import in Node/SSR without touching `window` or `document`; includes first-frame anti-flash theme boot scripts.
- **AI-Ready Specification & Auditor (`satin-cli`)**: Ships W3C DTCG tokens, 13-chapter design guidelines, 62 machine-checked component contracts, page recipes, `AGENTS.md` / `CLAUDE.md` agent skills, and an automated static + browser DOM anti-AI-slop checker.

---

## Installation

Install the component library directly into an existing project:

```bash
pnpm add satin-ui
# or
npm install satin-ui
```

Or scaffold a complete project (across 9 frameworks) with `satin-ui`, anti-flash theming, and AI coding skills pre-configured:

```bash
pnpm dlx satin-cli init my-app
# or
npx satin-cli init my-app
```

---

## Quick Start

### 1. Import Styles

```ts
// Full-page Satin app (includes minimal reset + all component styles inside @layer satin)
import "satin-ui/css/page.css";

// Embed inside an existing design system (no global reset)
// import "satin-ui/css";

// Single-file minified CSS bundle (~57 KB gzip, ideal for CDN or static sites)
// import "satin-ui/css/page.min.css";
```

### 2. React / Next.js

```tsx
import "satin-ui/css/page.css";
import en from "satin-ui/locales/en";
import {
  SatinProvider,
  ThemeScope,
  Button,
  Segmented,
  Loader,
  Progress,
  toast,
  useTheme,
  useLocale,
} from "satin-ui/react";
import { AreaChart } from "satin-ui/react/charts";
import { Chat } from "satin-ui/react/chat";

export default function App() {
  return (
    <SatinProvider
      mode="auto"
      locale="en"
      messages={en}
      theme={{ accent: "ink", radius: "pill" }}
    >
      <Segmented items={["Overview", "Shots", "Settings"]} defaultValue="Overview" />
      <Button variant="primary" onClick={() => toast({ text: "Saved" })}>
        Save changes
      </Button>
      <Loader variant="matrix" size="md" />
      <Progress value={0.68} segments={8} tone="ok" />

      <ThemeScope mode="dark" accent="blue" radius="8">
        <AreaChart
          labels={["Mon", "Tue", "Wed", "Thu"]}
          series={[{ name: "Throughput", values: [120, 184, 162, 238] }]}
          height={220}
        />
      </ThemeScope>
    </SatinProvider>
  );
}
```

### 3. Vue 3 / Nuxt

```ts
import { createApp } from "vue";
import "satin-ui/css/page.css";
import Satin from "satin-ui/vue";
import en from "satin-ui/locales/en";
import App from "./App.vue";

createApp(App)
  .use(Satin, {
    mode: "auto",
    locale: "en",
    messages: en,
    theme: { accent: "ink", radius: "pill" },
  })
  .mount("#app");
```

Then use `<SnButton>`, `<SnSegmented v-model="view" />`, `<SnLoader variant="matrix" />`, `<SnProgress :value="0.68" :segments="8" />`, `<SnThemeScope mode="dark">` directly in templates, and import heavy components on demand:

```ts
import { AreaChart, BarChart, DonutChart, Chart3D } from "satin-ui/vue/charts";
import { Chat, ThreadRail } from "satin-ui/vue/chat";
import { DataGrid } from "satin-ui/vue/grid";
```

### 4. Vanilla HTML / Web Components / Svelte / Solid / Angular

```html
<sn-segmented items='["Overview","Shots"]' value="Overview"></sn-segmented>
<sn-loader variant="matrix" size="lg"></sn-loader>
<button class="sn-btn sn-primary">Save changes</button>

<script type="module">
  import { setup, enhance, setLocale } from "satin-ui";
  import en from "satin-ui/locales/en";
  import { defineElements } from "satin-ui/elements";

  setLocale("en", en);
  setup();
  defineElements();
  enhance();
</script>
```

### 5. Zero-Flash Dark/Light Theme Boot

- **Vite**: Add `import satin from "satin-ui/vite"` and `plugins: [satin()]` in `vite.config.ts`.
- **Next.js / Nuxt**: Import `themeBoot` from `"satin-ui/theme-boot-script"` and inline it in `<head>`.
- **Static HTML**: Include `<script src="…/satin-ui/src/theme-boot.js"></script>` before stylesheets in `<head>`.

---

## Internationalization (English & Simplified Chinese)

Satin defaults to Simplified Chinese (`zh-CN`) and ships a complete, tree-shakeable English (`en`) locale pack covering all 20 component modules.

```ts
import { setLocale, addLocale, getLocale } from "satin-ui";
import en from "satin-ui/locales/en";

// Switch to English in a single call
setLocale("en", en);

// Switch back to Simplified Chinese
setLocale("zh-CN");

// Override individual keys or register custom locales (e.g. ja, fr, de)
addLocale("ja", myJapanesePack);
setLocale("ja");
```

In React and Vue, pass `locale` and `messages` to `<SatinProvider>` / `app.use(Satin, ...)` and reactively subscribe via `useLocale()`.

---

## Package Exports (`satin-ui`)

| Subpath | Contents |
| --- | --- |
| `satin-ui` | `setup()`, `enhance()`, lightweight component factories (`createSegmented`, `createTable`, `createLoader`, `createPicker`, …), markup helpers, overlays, toasts, icons, i18n |
| `satin-ui/react`, `satin-ui/vue` | First-class React 18+ / Vue 3.3+ components, `SatinProvider` / `ThemeScope` / `useTheme` / `useLocale`, `Loader`, `Progress`, `Dialog`, `Drawer`, `toast`, `notify` |
| `satin-ui/react/charts`, `satin-ui/vue/charts` | `AreaChart`, `BarChart`, `DonutChart`, `Chart3D`, `Sparkline`, `Icon3D` |
| `satin-ui/react/chat`, `satin-ui/vue/chat` | `Chat` (streaming, reasoning accordion, tool cards, composer), `ThreadRail` |
| `satin-ui/react/grid`, `satin-ui/vue/grid` | `DataGrid` (100K-row DOM virtualized grid) |
| `satin-ui/react/canvas-grid`, `satin-ui/vue/canvas-grid` | `CanvasGrid` (1M-row Canvas grid) |
| `satin-ui/react/flow`, `satin-ui/vue/flow` | `Flow` (DOM + 50K-node Canvas graph editor) |
| `satin-ui/react/markdown`, `satin-ui/vue/markdown` | `Markdown` (sanitized renderer with code copy & tables) |
| `satin-ui/elements`, `satin-ui/svelte/*.svelte` | Light-DOM Custom Elements and Svelte 5 components |
| `satin-ui/theme`, `satin-ui/theme-panel` | Runtime theme engine (`setMode`, `set`, `applyTheme`) & interactive visual Theme Panel with custom HSV color picker |
| `satin-ui/css`, `satin-ui/css/page.css` | Modular `@layer satin` source stylesheets |
| `satin-ui/css/min`, `satin-ui/css/page.min.css` | Pre-built single-file minified CSS bundles |
| `satin-ui/tokens/*`, `satin-ui/locales/en` | W3C DTCG design token JSON files & bilingual locale packs |
| `satin-ui/vite`, `satin-ui/theme-boot-script` | Vite zero-flash theme plugin & inline SSR boot string |

---

## Monorepo Architecture

| Path | Description |
| --- | --- |
| [`packages/satin-ui/`](./packages/satin-ui/) | Publishable UI library (`src/`, `css/`, `dist/`, `react/`, `vue/`, `svelte/`, `elements/`, `types/`, `tokens/`, `vite/`) |
| [`packages/satin-cli/`](./packages/satin-cli/) | Publishable CLI (`satin init`, `add`, `check`, `doctor`, `skill`) supporting 9 frameworks |
| [`spec/`](./spec/) | W3C DTCG tokens, 13-chapter UI/UX spec, 62 component contracts, motion inventory, anti-AI-slop rules, 8 page recipes |
| [`skills/satin/`](./skills/satin/) | Coding-agent skill bundle & static/DOM design auditor |
| [`site/`](./site/) | Documentation portal (`site/next.html`, `site/next-docs.html`) |
| [`index.html`](./index.html), [`demo/`](./demo/) | Single-page interactive design reference covering every component |
| [`examples/`](./examples/) | Cross-framework parity apps (HTML, React, Vue, Svelte, Solid, Preact, Angular, Next.js, Nuxt) |
| [`scripts/`](./scripts/) | Token/spec/CSS builders, contract & i18n tests, size budget checks, Playwright browser & visual parity suites |

---

## Local Development & Verification

```bash
pnpm install
pnpm serve                  # Starts local no-cache server on http://127.0.0.1:5192
```

- Design Reference: `http://127.0.0.1:5192/`
- Documentation Portal: `http://127.0.0.1:5192/site/next.html` & `http://127.0.0.1:5192/site/next-docs.html`
- Vanilla HTML Examples: `http://127.0.0.1:5192/examples/html/`

Run the verification suite:

```bash
pnpm test                   # ESLint + imports + i18n completeness + SSR + size budgets + contracts + TypeScript
pnpm test:cli               # CLI scaffolding, recipe copy, doctor, and auditor tests
pnpm test:browser           # Requires `pnpm serve`: 100x mount/destroy leak tests, XSS, React/Vue wrappers
pnpm build:css              # Rebuild single-file minified CSS bundles
pnpm build:examples         # Build all framework example apps
```

---

## Browser Support

Chrome / Edge 117+, Safari 17.5+, Firefox 129+ (all modern evergreen browsers with `@layer`, `color-mix()`, and CSS nesting / `:has()`).

## Quality Standards

- **Compositor-Only Motion**: Animations strictly animate `transform`, `opacity`, and `filter` (p95 frame interval ≤ 17ms).
- **Dual-Theme & Responsive Parity**: Every component is verified across light and dark modes, desktop and mobile viewports.
- **Anti-AI-Slop Discipline**: No decorative glow, rainbow gradients, or noisy chrome; color is reserved for hierarchy and status.

## Contributing & Security

- Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.
- Report security issues following [SECURITY.md](./SECURITY.md).
- Release history is tracked in [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT](./LICENSE) © Satin Contributors
