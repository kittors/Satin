// 新版官网的页面清单：文档页左边的目录、上一页 / 下一页、窄屏的导航抽屉（文档页和首页）、⌘K 搜索都用这一份。
// 站点地图和每一项为什么放在那里，见 docs/site-ia.md。旧版文档页（docs.html）还是只读 pages.js 的 START、GUIDES。
import { START, GUIDES } from "./pages.js";
import { START_MORE, AI_PAGES, INTRO, CLI_PAGE, BROWSERS, CUSTOM_PAGES, OTHER_PAGES, RECIPES } from "./pages-more.js";

// "开始"一组：介绍 → 快速上手 → 用 CLI 创建项目 → 框架接入 → 移动端与 H5 → 浏览器支持
export const STARTS = [INTRO, START.find((p) => p.id === "start"), CLI_PAGE, ...START_MORE, BROWSERS];
export { AI_PAGES, GUIDES, CUSTOM_PAGES, OTHER_PAGES, RECIPES };

// 目录里每页的图标（组件页不带图标）
export const SIDE_IC = {
  intro: "book-open", start: "zap", cli: "terminal", frameworks: "blocks", mobile: "smartphone", browsers: "globe",
  theming: "palette", dark: "moon", tokens: "hash", i18n: "languages", "icon-usage": "star",
  ai: "code-xml", agents: "file-text", checker: "check-check", eval: "chart-column",
  principles: "compass", color: "swatch-book", type: "type", spacing: "ruler", layout: "layout-dashboard", shape: "box", elevation: "layers", motion: "activity",
  icons: "component", feel: "mouse-pointer-2", "no-ai": "scan-eye", a11y: "accessibility", writing: "pen-line",
  components: "layout-grid", recipes: "rows-3", changelog: "history", roadmap: "map-pin",
};
const blockPages = (list, group) => list.map((p) => ({ hash: "#/" + p.id, title: p.title, group, section: group, kind: "start", p, icon: SIDE_IC[p.id] || "file-text" }));

// 所有页按顺序：开始 → 定制 → 给 AI 用 → 规范 → 组件（总览 + 各组）→ 配方（总览 + 8 种）→ 其他。
// cat：组件目录（catalog.js 读展示页得到）；没有就先不带各组组件（首页的抽屉在目录载好之前先用这些）
export function docPages(cat) {
  return [
    ...blockPages(STARTS, "开始"),
    ...blockPages(CUSTOM_PAGES, "定制"),
    ...blockPages(AI_PAGES, "给 AI 用"),
    ...GUIDES.map((p) => ({ hash: "#/guide/" + p.id, title: p.title, group: "规范", section: "规范", kind: "guide", p, icon: SIDE_IC[p.id] || "file-text" })),
    { hash: "#/components", title: "组件总览", group: "组件", section: "组件", kind: "overview", icon: SIDE_IC.components },
    ...(cat ? cat.components.map((c) => ({ hash: "#/c/" + c.id, title: c.name, group: c.group, section: "组件", kind: "comp", c, icon: "" })) : []),
    { hash: "#/recipes", title: "配方总览", group: "配方", section: "配方", kind: "recipes", icon: SIDE_IC.recipes },
    ...RECIPES.map((r) => ({ hash: "#/recipe/" + r.id, title: r.title, group: "配方", section: "配方", kind: "recipe", r, icon: "" })),
    ...blockPages(OTHER_PAGES, "其他"),
  ];
}

// 顶栏的五项各管哪些页（选中哪一项）
export const NAV_OF = (pg) => !pg ? "" : pg.kind === "comp" || pg.kind === "overview" ? "c" : pg.kind === "guide" ? "guide" : pg.kind === "recipes" || pg.kind === "recipe" ? "recipes" : pg.group === "给 AI 用" ? "ai" : "start";

// 按组排好：[{ name, items: [页] }]
export function groupsOf(pages) {
  const out = [];
  for (const pg of pages) { let g = out[out.length - 1]; if (!g || g.name !== pg.group) out.push((g = { name: pg.group, items: [] })); g.items.push(pg); }
  return out;
}

// 两层：顶层分区 → 分区里直接列的页 + 组件的各个类别。[{ name, items: [页], cats: [{ name, items: [页] }] }]
export function sectionsOf(pages) {
  const out = [];
  for (const pg of pages) {
    let sec = out[out.length - 1];
    if (!sec || sec.name !== pg.section) out.push((sec = { name: pg.section, items: [], cats: [] }));
    if (pg.kind === "comp") { let c = sec.cats[sec.cats.length - 1]; if (!c || c.name !== pg.group) sec.cats.push((c = { name: pg.group, items: [] })); c.items.push(pg); }
    else sec.items.push(pg);
  }
  return out;
}
