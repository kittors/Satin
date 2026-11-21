# 只为演示存在的参数、内置数据：清单和处理（2026-11-21）

范围：`packages/satin-ui/src/` 里所有组件。查的是"库里写死、只有设计稿演示才用得上"的东西——演示参数（`rows`、`seed`、`failAt`……）、内置的样例数据、假装的服务端 / 进度、写死的演示文案、按演示列名写的样式。

结论先说：数据表格、Canvas 表格已经改完（演示数据全部搬到 `demo/`，库里只剩通用的列定义 + 数据接口）；流程图、无限列表、对话的回答、输入框的附件本来就由使用的人传，只剩过时注释（已改）。还剩 6 处没改，原因都写在表里：要么会改变设计稿或官网的现有效果、要配合别处一起改，要么文件正在被主会话改。

| 组件 | 演示用的参数 / 内置数据 | 换成真数据的办法 | 状态 |
| --- | --- | --- | --- |
| 数据表格 grid（`src/grid.js`、`table-data.js`、`table-source.js`） | `rows`、`seed`；内置的演示项目表（列定义、十万行生成、后台线程当"服务端"、筛选排序的协议只认 status / owner / tag / dur）；样式和代码里写死的列名（name、sel、act、upd）；行详情的封面 / 镜头条；默认读屏名"数据表格，十万行"，搜索框"搜索名称，比如 站台"，工具条"（N 个项目）""服务端算了 N ms"，"…的更多操作"提示 | `columns` + `data`（数组）或 `dataSource`（`{ total, load({ start, end, sort, filter }) }`，也可以是整套后端）；行详情用 `detail`；树形数量文字用 `treeCount`；"更多"用 `onRowAction`。见 `docs/notes/grid-api.md` | **已改**。演示数据、Worker、演示的解析报错在 `demo/grid-data.js`、`demo/grid-worker.js`、`demo/grid-backend.js`；设计稿两节用新 API 接（`demo/sections/grid.js`、`canvas-grid.js`），列名、文案、详情的标记和改造前一样 |
| Canvas 表格 cgrid（`src/canvas-grid.js`） | 同上；默认读屏名"数据表格，一百万行，画布绘制"；行详情画死的封面、标题、镜头条 | 同上；行详情用 `detail.draw(ctx)` | **已改**（同上） |
| 上传 upload（`src/nav.js` 的 `mountUpload`） | 不给 `upload` 时走假进度（每 220ms 涨 5%～13%）；名字带"断网"的文件传到一半失败 | 已经有 `upload(file, onProgress) → Promise` 的口子。建议：假进度和"断网"挪进 `demo/sections/nav.js`（演示传一个模拟的 `upload`）；库里不给 `upload` 时只列出文件、标"待上传"，由使用的人调上传 | **没改**：不给 `upload` 的地方（`tests/wrappers` 里的 Upload，官网上的上传演示）都靠这个假进度演示，要和 site/、封装测试一起改，不然它们会停在"待上传" |
| 输入框 composer（`src/input.js` 的 `mountComposer`） | 不给 `upload` 时附件走假进度（130～270ms 一阵）；附件的 `failAt`（演示传一半失败）；默认的模型标签"分镜模型 · {p0}"（`locales/zh-CN/input.js` 的 input.32） | 附件本身已经由 `attachments`（在 `demo/sections/input.js`）给；建议同上：假进度挪进 demo、`failAt` 只在 demo 的模拟上传里认；模型名做成选项 | **没改**：`src/input.js` 主会话正在改 |
| 对话 chat（`src/chat.js`） | 发出去的消息"发送中 → 已发送"是定时器假装的（450～850ms）；`sendText(text, { fail })` 模拟发送失败；镜头卡片的标题前缀写死"镜头 "（chat.19） | 建议加 `onSend(消息) → Promise`：成功标已发送、失败标失败可重发，不给时直接标已发送；卡片的标题由 `respond` 给（`card: { title, … }`） | **没改**：设计稿对话的节奏靠这段假发送，要在 `demo/sections/chat.js` 传一个同样延时的 `onSend` 才能保持一样；还要动 `react/chat.js`、`vue/chat.js`、`ChatOptions` 的类型和对话的契约，不在这次的范围里，单独做 |
| 地址选择 picker region（`src/picker.js`） | 内置 10 个省、每省一两个市的样例数据（`REG`），没有传真数据的选项 | 建议加 `regions`（省 → 市 → 区的树），或者按需加载 `loadChildren(路径) → Promise`；样例挪进 demo | **没改**：要改 `types/components.d.ts`（主会话正在改）和 picker 的契约 |
| 音频 audio（`src/media.js`） | `mixkitWave(src)`：认出演示用的 mixkit 音频地址，去拿它家现成的波形 JSON | 已经有 `wave`（波形地址）选项，不给就从音频本身算。建议删掉 mixkit 的特判，演示在标记里写 `data-wave` | **没改**：设计稿的音频标记写在 `index.html` 里（不能改），删了特判演示会改成自己解码音频，波形出现的时机变了 |
| 波形 waveBars（`src/data.js`） | 音频消息、语音附件的波形按 `seed` 算的假波形 | 建议给 `peaks`（真实音频的峰值数组）时按它画，没有再用假的 | **没改**：`src/data.js` 主会话正在改 |
| 流程图 flow（`src/flow.js`） | 没有演示数据了（节点、连线由 `nodes`、`edges` 传，设计稿的流水线在 `demo/sections/flow.js`）；只剩一句"演示的流水线：…"的过时注释 | — | **已改**注释 |
| 无限列表 vlist（`src/list.js`） | 没有演示数据了（`loadPage` 由使用的人给，设计稿的演示在 `demo/sections/list.js`）；文件开头"滚动区域一节的演示内容也在这里生成"是过时注释 | — | **已改**注释 |
| 视频 player、侧栏 sidebar、看图 lightbox、Markdown、主题面板、命令面板 | 没发现演示数据：内容都由选项或标记给 | — | 不用改 |
| 各模块末尾的"展示页接线（demo/）要用的内部名字"（`feedback.js`、`list.js`、`nav.js`、`overlay.js` 导出的 `wait`、`OUT` 等） | 给 demo/ 用的内部导出，不是数据，不影响使用的人 | 可以以后挪进 `demo/` 自己的工具文件 | 不改（只是多导出几个内部名字） |

## 表格这次顺带修掉的问题（接真数据才会遇到）

- 数据源的接口上 `canTree`、`canReorder` 两个 getter 被同一行的注释吃掉了，带 `children` 的数组切不了树形。
- 树形模式下没有操作列时（真数据常见）填行会报错；主列写了 `render` 时会把展开箭头和下级数量冲掉。
- Canvas 版的 `sort`、`filter`、`selectedKeys` 用 `Object.assign` 挂上去，变成了创建那一刻的快照；没有空 / 加载 / 出错三种状态；`selectedKeys` 受控没接上。
- 列标题、选项文字、搜索词、出错文字直接拼进 HTML（数据里来的文字能插标记），全部转义。
- `defaultSort`、一开始的 `sort` 在挂载中途触发回调（会碰到还没建好的工具条）；改成建数据源时就带上。
- 挂上时会发一次空的 `selectionChange`；换数据时滚动回到顶上、勾选按行号错位；`dataSource` 按块加载时 `selectedKeys` 只认第一块。
- 数组数据和服务端数据也显示"服务端算了 N ms"（数组数据显示 0ms）：现在只有自己的后端报了耗时才显示（设计稿的演示照旧）。
- 表格框高度写死 480px：加了 `height`（`--sn-g-h`）。
