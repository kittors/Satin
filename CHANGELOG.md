# Changelog

All notable changes to **Satin** (`satin-ui` and `satin-cli`) are documented in this file.

## [0.1.0] - 2026-11-23

Initial public open-source and npm release of `satin-ui` and `satin-cli`.

### Highlights

- **Core Library (`satin-ui`)**:
  - Framework-agnostic, zero-dependency ESM core with full TypeScript declarations and `@layer satin` CSS encapsulation.
  - First-class wrappers for **React 18+**, **Vue 3.3+**, **Svelte 5**, and Light-DOM **Web Components** (`satin-ui/elements`).
  - Complete lightweight suite: buttons, segmented controls, sliders, selects, OTP, tabs, pagers, collapse, tag input, stepper, search/password/email/count/long-text/prompt composer inputs, date/range/time/datetime/region pickers, dialogs, drawers, popovers, context & cascading submenus with safe-triangle geometry, command palette (`⌘K`), toasts, notifications, 8-variant geometric `Loader`, upgraded `Progress` (linear, shimmer, segmented, SVG ring), 6 neutral `EmptyArt` illustrations, and 149 Solar Icons.
  - Dedicated subpaths for enterprise heavy components: 100K-row `DataGrid`, 1M-row `CanvasGrid`, streaming AI `Chat` & `ThreadRail`, HiDPI Canvas charts (`AreaChart`, `BarChart`, `DonutChart`, `Chart3D`, `Sparkline`, `Icon3D`), `Flow`, `Markdown` (XSS-sanitized), `Lightbox`, and `Media`.
  - Declarative theming & live customization: `<SatinProvider>` / `<ThemeScope>` / `useTheme()` (React), `app.use(Satin, options)` / `<SnThemeScope>` / `useTheme()` (Vue), first-frame anti-flash `satin-ui/vite` & `satin-ui/theme-boot-script`, and an interactive Theme Panel featuring a custom Satin HSV color picker with live WCAG AA contrast feedback and EyeDropper support.
  - Full **English (`en`) & Simplified Chinese (`zh-CN`)** i18n across all 20 component modules (550+ strings), one-call `setLocale("en", en)`, reactive `useLocale()`, and CI-enforced locale parity tests.
  - Pre-built single-file minified CSS bundles (`satin-ui/css/min` and `satin-ui/css/page.min.css`).
- **CLI & AI Skills (`satin-cli`)**:
  - Project scaffolding (`satin init`) across 9 frameworks (React, Vue, Next.js, Nuxt, Svelte, Angular, Solid, Preact, HTML).
  - Page recipes (`satin add`), static + browser DOM anti-AI-slop auditor (`satin check`), setup diagnostics (`satin doctor`), and AI coding skill installer (`satin skill`).
