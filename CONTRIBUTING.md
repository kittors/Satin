# Contributing to Satin

Thank you for considering contributing to **Satin**!

## Development Setup

```bash
git clone https://github.com/kittors/Satin.git
cd Satin
pnpm install
pnpm serve
```

- Design Reference: `http://127.0.0.1:5192/`
- Documentation Portal: `http://127.0.0.1:5192/site/next.html` and `http://127.0.0.1:5192/site/next-docs.html`

## Project Guidelines

1. **Zero Runtime Dependencies**: Keep `packages/satin-ui` free of mandatory third-party runtime dependencies and respect the bundle size budgets in `scripts/test/size.mjs`.
2. **Design & Motion Discipline**:
   - Animate only compositor-friendly properties (`transform`, `opacity`, `filter`).
   - All library CSS must reside inside `@layer satin` and use `--sn-*` tokens.
   - Verify visual changes in both **light** and **dark** modes and across desktop & mobile widths.
3. **Bilingual i18n Parity**: Any user-facing string in `packages/satin-ui/src/` must use `scoped()` from `src/i18n.js` with matching entries in both `src/locales/zh-CN/` and `src/locales/en/`.
4. **Generated Artifacts Sync**: When updating tokens, CSS classes, or CSS variables, run:
   ```bash
   node scripts/test/sync.mjs --write
   pnpm build:css
   ```

## Verification Before Submitting a PR

```bash
pnpm test
pnpm test:cli
pnpm test:browser   # while `pnpm serve` is running
```

## Pull Request Process

- Keep pull requests focused and atomic.
- Include screenshots or recordings for visual or interaction changes (both light and dark themes).
- Ensure all CI checks pass before requesting review.
