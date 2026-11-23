# 组件一览

每个组件的写法、选项、设计稿标记、验收要点在 `components/<id>.md`。基础（颜色、排版、间距……）的数值以 `tokens.md` 为准。

## 基础

| id | 组件 | 一句话 |
|---|---|---|
| [`color`](components/color.md) | 颜色 · 04 号 §1 | 只用中性色 |
| [`type`](components/type.md) | 排版 · Text | Text 组件 = 层级 × 色调 |
| [`spacing`](components/spacing.md) | 间距 · Spacing | 16 以下每 2px 一档，只在控件内部用（图标和字之间、控件内边距） |
| [`layout`](components/layout.md) | 布局与响应式 · Layout | 断点按容器宽度划分，不按窗口宽度：compact 小于 720、regular 720～1199、wide 1200 及以上 |
| [`space`](components/space.md) | 圆角与线 · 04 号 §4–§5 | 圆角 6 档 |
| [`elevation`](components/elevation.md) | 阴影与层级 · 04 号 §6 | 三层：卡片（只靠描边和明度差）、浮层（菜单、Popover、通知）、对话框 |
| [`motion`](components/motion.md) | 动效曲线 · 09 号 §1 | 全系统只有这几条曲线 |
| [`loadingmotion`](components/loadingmotion.md) | 内容加载与过渡 · Loading & transitions | 消灭「点一下先白屏闪空壳，几十毫秒后再硬砸进 DOM」的割裂体验 |
| [`icons`](components/icons.md) | 图标 · 04 号 §7 | 统一采用 Solar Icons（24px 网格、1.5px 线宽、圆润轮廓），全部消除重影与断线毛刺，颜色跟随文字 |

## 按钮

| id | 组件 | 一句话 |
|---|---|---|
| [`button`](components/button.md) | 按钮 · Button | 扁平：纯色面或 1px 细边，不用渐变和投影 |
| [`iconbutton`](components/iconbutton.md) | 纯图标按钮 · IconButton | 没有文字的按钮必须有名称：悬停 500ms 后用 Tooltip 显示，读屏也读这个名称 |
| [`link`](components/link.md) | 文字链接与文字按钮 · Link · TextButton | 放在句子里的是链接：一条淡下划线，悬停时变实 |
| [`compound`](components/compound.md) | 组合按钮 · ButtonGroup · SplitButton · CopyButton | 相关的几个操作连成一组 |
| [`chip`](components/chip.md) | 切换芯片 · ToggleChip · Tag | 筛选条件、多选标签 |

## 表单

| id | 组件 | 一句话 |
|---|---|---|
| [`field`](components/field.md) | 字段与错误 · FormField | 每个表单项 = 标签 + 控件 + 帮助文字 + 错误 |
| [`input`](components/input.md) | 输入框 · TextField | 四种高度：28 用在表格和工具条，32 默认，36 用在主要表单，40 只用在登录和欢迎页 |
| [`special`](components/special.md) | 搜索、密码、邮箱 · SearchField · SecretInput · EmailField | 搜索：空着时显示快捷键，一输入就换成清除按钮 |
| [`count`](components/count.md) | 字数统计 · Counter · LongText | 单行：聚焦或有内容时，右边淡入"已写/上限"，数字滚动变化 |
| [`taginput`](components/taginput.md) | 标签输入 · TagInput | 输入后按回车或逗号变成标签，新标签弹出来 |
| [`number`](components/number.md) | 数字步进 · Stepper | 点加减数字滚动变化 |
| [`prompt`](components/prompt.md) | 提示词输入框 · Composer | 生成画面时用 |
| [`select`](components/select.md) | 下拉选择与菜单 · Select · Menu | 面板从触发器那里长出来，带一点回弹，全程不透明，不会透出背后的字 |
| [`picker`](components/picker.md) | 日期、时间、地址 · DatePicker · TimePicker · RegionPicker | 触发框和下拉选择同一个样子，面板和菜单同一种开合 |
| [`choice`](components/choice.md) | 复选、单选、开关 · Checkbox · Radio · Switch | 勾选时对勾一笔画出来并轻轻弹一下 |
| [`segmented`](components/segmented.md) | 分段控件 · Segmented | 滑块的左右两条边各走一条曲线：前缘先到，后缘跟上，落定时纵向轻压一下 |
| [`slider`](components/slider.md) | 滑块 · Slider | 悬停时圆钮放大，拖动时再放大一点，并在上方显示数值 |
| [`otp`](components/otp.md) | 验证码 · OTP | 6 格，输入后自动跳到下一格 |

## 浮层

| id | 组件 | 一句话 |
|---|---|---|
| [`tooltip`](components/tooltip.md) | 文字提示 · Tooltip | 只放一句文字：名称、快捷键，或者为什么不能点 |
| [`popover`](components/popover.md) | 弹出面板 · Popover | 点一下才出现，里面可以放少量操作，改动立即生效，不需要"保存" |
| [`popconfirm`](components/popconfirm.md) | 气泡确认 · Popconfirm | 能撤销的操作不确认：直接做，再用 Toast 给"撤销" |
| [`ctxmenu`](components/ctxmenu.md) | 右键菜单与子菜单 · Context menu · Submenu | 右键菜单出现在指针处，靠边时向内翻 |
| [`dialog`](components/dialog.md) | 弹窗 · Dialog | 只在必须停下来时用：短表单、影响大或不能撤销的确认、要先做另一个决定 |
| [`drawer`](components/drawer.md) | 抽屉 · Drawer | 长表单、要对照页面编辑时用 |
| [`cmdk`](components/cmdk.md) | 命令面板 · Command palette | 按 ⌘K（Windows 上 Ctrl+K）随时打开，输入就筛选 |

## 反馈

| id | 组件 | 一句话 |
|---|---|---|
| [`toast`](components/toast.md) | 轻提示 · Toast | 只回应用户刚做的事 |
| [`notify`](components/notify.md) | 通知 · Notification | 不是用户刚才的操作引起的：后台任务完成或失败、额度、更新、审核 |
| [`banner`](components/banner.md) | 横幅与条目上的失败 · Banner · Inline error | 必须修好的问题不用 Toast：整页受影响的放在内容顶部的横幅，单个条目的失败留在条目上，附修复入口，一直留到修好为止 |
| [`empty`](components/empty.md) | 空状态 · Empty | 空的时候用克制的纯中性场景 SVG 插画搭配一句直白的话告诉用户这里会有什么、下一步做什么 |
| [`loading`](components/loading.md) | 骨架与加载 · Skeleton · Spinner | 300ms 以内的等待什么都不显示 |
| [`progress`](components/progress.md) | 进度 · Progress | 能数清楚、超过 3 秒的工作（导入、导出、上传、批量生成）显示进度：数量、进度条、剩余时间，可以取消 |
| [`numflow`](components/numflow.md) | 数字变化 · NumberFlow | 数字变了只动变了的那几位：变大往上走、变小往下走，从个位开始依次动 |

## 数据展示

| id | 组件 | 一句话 |
|---|---|---|
| [`table`](components/table.md) | 表格 · Table | 后台的主力组件 |
| [`grid`](components/grid.md) | 数据表格 · DOM · Data grid · 十万行 | 十万行，只渲染看得见的行 |
| [`cgrid`](components/cgrid.md) | 数据表格 · Canvas · Canvas grid · 一百万行 | 一百万行，表体画在一块画布上，功能和上面的 DOM 版一样：懒加载（200 行一块）、搜索和列头筛选、排序、拖列、改宽、左右固定列、拖行、编辑、勾选、键盘 |
| [`charts`](components/charts.md) | 数据图表与 3D 视觉 · Charts · 3D | 零第三方依赖 Canvas 微动效图表与 3D 立体视觉套件：平滑曲线描边入场、数据切换形变插值、阻尼跟手准星、分组柱状聚焦、环形联动、可 360° 拖拽旋转的真 3D 立体柱阵，以及带陀螺仪视差高光的 3D 立体质感图标 |
| [`list`](components/list.md) | 列表与键值 · List · Description | 设置页、详情页用 |
| [`card`](components/card.md) | 卡片 · Card | 项目、素材与通用内容均采用预设实面底（`--sn-raised`）加 1px 描边与轻托影，在浅灰/深黑画布及白底面板上边界均清晰独立 |
| [`tags`](components/tags.md) | 标签、徽标与头像 · Tag · Badge · Avatar | 标签只用中性底，靠前面的小圆点表示状态，不做大面积彩色块 |
| [`avatar`](components/avatar.md) | 头像 · Avatar | 有照片用照片 |
| [`collapse`](components/collapse.md) | 折叠面板 · Collapse | 高度用 0fr → 1fr 过渡，内容在展开过半时淡入 |
| [`scrollarea`](components/scrollarea.md) | 滚动区域 · ScrollArea | 所有会溢出滚动的地方都用它：原生滚动（惯性、键盘、读屏都在），系统滚动条换成一根细的悬浮滚动条，不滚动 0.7 秒后淡出，悬停或拖动时变粗 |
| [`vlist`](components/vlist.md) | 无限列表 · VirtualList · InfiniteList | 一万条也不卡：只渲染看得见的几十行，行节点循环复用，滚动时只改位置 |
| [`chat`](components/chat.md) | 聊天与 AI 对话 · Chat | 超多消息也流畅：已经载入一千多条，往上翻会继续加载，最多一万条 |
| [`md`](components/md.md) | Markdown 文档 · Markdown | AI 的回复、说明文档都用它渲染：标题、列表和任务、引用和提示块、表格、代码（高亮、行号、复制、自动换行、超高折叠）、图片（定高、定宽、定比例、加载占位、失败提示、点开放大）、公式（TeX 写法转成浏览器原生的 MathML） |
| [`flow`](components/flow.md) | 流程图 · FlowCanvas | 做视频的流水线：原文 → 拆分 → 分镜 |
| [`flowstress`](components/flowstress.md) | 流程图 · 万级 ComfyUI 节点集群 · Canvas · 异构多端口节点 · 视口裁剪 · 细节分级 | 节点超过几百个后改由一块 Canvas 画布承接，按 1024px 空间网格做视口裁剪与三档 LOD 细节分级 |

## 媒体与上传

| id | 组件 | 一句话 |
|---|---|---|
| [`image`](components/image.md) | 图片 · Image | 先占位再淡入，不让图片一块块刷出来 |
| [`media`](components/media.md) | 视频与音频 · Player | 控制条叠在画面上，用玻璃材质（09 号 §10） |
| [`upload`](components/upload.md) | 上传 · Upload | 拖进来时整块高亮，图标往上抬一点 |

## 导航

| id | 组件 | 一句话 |
|---|---|---|
| [`sidebar`](components/sidebar.md) | 侧栏与布局 · Sidebar · Layout | 侧栏收起和展开时，主区宽度跟着连续变化 |
| [`tabs`](components/tabs.md) | 标签页、面包屑、分页、步骤 · Tabs · Breadcrumb · Pagination · Steps | 标签页的下划线和分页的当前页，都是前缘先走、后缘跟上（和分段控件同一套） |

## 行为

| id | 组件 | 一句话 |
|---|---|---|
| [`reorder`](components/reorder.md) | 拖拽重排 · Reorder | 按住左边的把手拖（移动 4px 才算拿起，只点一下什么都不动） |
| [`addremove`](components/addremove.md) | 新增与删除 · Add · Remove | 新的一项从它该在的位置出现（位移 8px、从 96% 放大），其他项平滑让位 |
| [`optimistic`](components/optimistic.md) | 乐观更新 · Optimistic | 几乎一定成功、能撤回的操作（收藏、重命名、排序）先显示结果再保存 |

