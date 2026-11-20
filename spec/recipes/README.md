# 页面配方

8 种常见页面的骨架：先照着搭结构，再换成自己的内容。只用 Satin 的骨架类（`packages/satin-ui/css/shell.css`）和组件，不需要自己写布局和颜色。
标记是纯 HTML；React / Vue 里 class 照写（React 写 `className`），有交互的部分换成对应组件（`<Select>`、`<Pager>`、`<Dialog>`……）。
由 `scripts/skill/build.mjs` 合并进 `skills/satin/references/recipes.md`。

| 文件 | 页面 |
|---|---|
| [01-admin-table.md](01-admin-table.md) | 后台列表（侧栏 + 搜索筛选 + 表格 + 分页） |
| [02-settings.md](02-settings.md) | 设置页 |
| [03-auth.md](03-auth.md) | 登录 / 注册 |
| [04-dashboard.md](04-dashboard.md) | 仪表盘 |
| [05-chat.md](05-chat.md) | AI 对话 |
| [06-landing.md](06-landing.md) | 落地页 |
| [07-mobile-order.md](07-mobile-order.md) | 移动端 H5 下单 |
| [08-wizard.md](08-wizard.md) | 表单向导（多步） |
