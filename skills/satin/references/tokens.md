# 令牌

写样式只用这些变量（`var(--sn-xxx)`），深浅主题、换主色、换圆角时自动跟着变。值以 `satin-ui/css/tokens.css` 为准（由 spec/tokens 生成）。

## 颜色（深浅两套）

| 变量 | 浅色 | 深色 | 用途 |
|---|---|---|---|
| `--sn-canvas` | `#f5f5f7` | `#000` | 页面底色（最底层） |
| `--sn-raised` | `#fff` | `#1c1c1e` | 卡片、面板、表格、输入区的底色（比页面高一层） |
| `--sn-overlay` | `#fff` | `#2c2c2e` | 浮层底色：菜单、弹出面板、弹窗、通知 |
| `--sn-sunken` | `#e8e8ed` | `#0e0e10` | 凹下去的底色：轨道、进度条底、代码块 |
| `--sn-fill-hover` | `rgba(0, 0, 0, .04)` | `rgba(255, 255, 255, .06)` | 悬停时叠一层的填充（半透明） |
| `--sn-fill-active` | `rgba(0, 0, 0, .07)` | `rgba(255, 255, 255, .1)` | 按下 / 选中时叠一层的填充 |
| `--sn-fill-hover-solid` | `color-mix(in srgb, #000 4%, var(--sn-raised))` | `color-mix(in srgb, #fff 6%, var(--sn-raised))` | 悬停填充的不透明版（行交叉时不透字） |
| `--sn-fill-active-solid` | `color-mix(in srgb, #000 7%, var(--sn-raised))` | `color-mix(in srgb, #fff 10%, var(--sn-raised))` | 按下填充的不透明版 |
| `--sn-fill-subtle` | `rgba(0, 0, 0, .05)` | `rgba(255, 255, 255, .08)` | 很淡的底：图标底、标签底、占位 |
| `--sn-scrim` | `rgba(0, 0, 0, .3)` | `rgba(0, 0, 0, .6)` | 弹窗、抽屉后面的遮罩 |
| `--sn-label` | `#1d1d1f` | `#f5f5f7` | 主文字（标题、正文） |
| `--sn-label2` | `#424245` | `#aeaeb2` | 次要文字（说明、表格里的次要列） |
| `--sn-label3` | `#6e6e73` | `#86868b` | 第三级文字（辅助说明、时间、表头） |
| `--sn-label-off` | `#aeaeb2` | `#48484a` | 禁用、占位文字 |
| `--sn-on-primary` | `#fff` | `#000` | 主色底上的文字 |
| `--sn-line` | `rgba(0, 0, 0, .08)` | `rgba(255, 255, 255, .09)` | 分隔线、卡片描边 |
| `--sn-line-control` | `rgba(0, 0, 0, .14)` | `rgba(255, 255, 255, .14)` | 输入框、次要按钮的描边 |
| `--sn-line-control-hover` | `rgba(0, 0, 0, .24)` | `rgba(255, 255, 255, .24)` | 输入框、次要按钮悬停时的描边 |
| `--sn-focus` | `rgba(0, 0, 0, .4)` | `rgba(255, 255, 255, .5)` | 键盘焦点框 |
| `--sn-accent` | `#1d1d1f` | `#f5f5f7` | 强调色 / 主按钮（默认是墨色，跟着文字走；可换品牌色） |
| `--sn-danger` | `#d92d20` | `#ff6961` | 危险、错误 |
| `--sn-danger-ring` | `rgba(217, 45, 32, .14)` | `rgba(255, 105, 97, .18)` | 错误输入框外圈 |
| `--sn-success` | `#248a3d` | `#30d158` | 成功、完成 |
| `--sn-warning` | `#b25000` | `#ffd60a` | 警告、待处理 |
| `--sn-field` | `#fff` | `#1c1c1e` | 输入框底色 |
| `--sn-ring` | `rgba(0, 0, 0, .07)` | `rgba(255, 255, 255, .09)` | 很淡的一圈描边（头像、缩略图） |
| `--sn-card-line` | `rgba(0, 0, 0, .06)` | `rgba(255, 255, 255, .09)` | 卡片内描边 |
| `--sn-glass-bg` | `rgba(255, 255, 255, .78)` | `rgba(28, 28, 30, .74)` | 毛玻璃浮动表面底色（仅限 fixed / sticky / absolute 浮层） |
| `--sn-glass-line` | `rgba(0, 0, 0, .08)` | `rgba(255, 255, 255, .12)` | 毛玻璃浮动表面细描边 |
| `--sn-b-primary` | `var(--sn-accent)` | `var(--sn-accent)` | 主按钮底色 |
| `--sn-b-primary-hover` | `color-mix(in srgb, var(--sn-accent) 86%, #fff)` | `color-mix(in srgb, var(--sn-accent) 70%, #fff)` | 主按钮底色（悬停） |
| `--sn-b-primary-active` | `color-mix(in srgb, var(--sn-accent) 86%, #000)` | `color-mix(in srgb, var(--sn-accent) 90%, #000)` | 主按钮底色（按下） |
| `--sn-b-on-primary` | `var(--sn-on-primary)` | `var(--sn-on-primary)` | 主按钮文字 |
| `--sn-b-outline` | `#fff` | `rgba(255, 255, 255, .03)` | 次要按钮底色 |
| `--sn-b-outline-hover` | `#f5f5f7` | `rgba(255, 255, 255, .07)` | 次要按钮底色（悬停） |
| `--sn-b-outline-active` | `#ebebee` | `rgba(255, 255, 255, .11)` | 次要按钮底色（按下） |
| `--sn-b-outline-line` | `rgba(0, 0, 0, .12)` | `rgba(255, 255, 255, .13)` | 次要按钮底色（描边） |
| `--sn-b-outline-line-hover` | `rgba(0, 0, 0, .2)` | `rgba(255, 255, 255, .22)` | 次要按钮底色（悬停） |
| `--sn-b-soft` | `rgba(0, 0, 0, .05)` | `rgba(255, 255, 255, .08)` | 第三级按钮底色 |
| `--sn-b-soft-hover` | `rgba(0, 0, 0, .085)` | `rgba(255, 255, 255, .12)` | 第三级按钮底色（悬停） |
| `--sn-b-soft-active` | `rgba(0, 0, 0, .12)` | `rgba(255, 255, 255, .16)` | 第三级按钮底色（按下） |
| `--sn-b-ghost-hover` | `rgba(0, 0, 0, .055)` | `rgba(255, 255, 255, .08)` |  |
| `--sn-b-ghost-active` | `rgba(0, 0, 0, .09)` | `rgba(255, 255, 255, .12)` |  |
| `--sn-b-danger` | `#d92d20` | `#d92d20` | 危险按钮底色 |
| `--sn-b-danger-hover` | `#c4291d` | `#c4291d` | 危险按钮底色（悬停） |
| `--sn-b-danger-active` | `#b42318` | `#b42318` | 危险按钮底色（按下） |
| `--sn-b-danger-soft` | `rgba(217, 45, 32, .08)` | `rgba(255, 105, 97, .12)` | 弱危险按钮底色 |
| `--sn-b-danger-soft-hover` | `rgba(217, 45, 32, .13)` | `rgba(255, 105, 97, .18)` | 危险按钮底色（悬停） |
| `--sn-b-danger-soft-active` | `rgba(217, 45, 32, .18)` | `rgba(255, 105, 97, .24)` | 危险按钮底色（按下） |
| `--sn-b-lift` | `0 1px 2px rgba(0, 0, 0, .05)` | `0 0 0 0 transparent` | 按钮极淡的落影 |
| `--sn-tip-bg` | `#1d1d1f` | `#3a3a3c` | Tooltip、Toast 的反色底 |
| `--sn-tip-fg` | `#f5f5f7` | `#f5f5f7` | Tooltip、Toast 的文字 |
| `--sn-av-bg` | `var(--sn-sunken)` | `#a7a7aa` | 头像的圆底（预设头像；照片没加载出来时也露出它） |
| `--sn-av-ink` | `#424245` | `#424245` | 预设头像的线条、眼睛 |
| `--sn-av-face` | `#fafafa` | `#e1e1e1` | 预设头像的脸、耳朵、脖子 |
| `--sn-av-black` | `#3f3a37` | `#393432` | 预设头像的发色：黑 |
| `--sn-av-brown` | `#5b4637` | `#523f32` | 预设头像的发色：深棕 |
| `--sn-av-gray` | `#c9c6c1` | `#b5b2ae` | 预设头像的发色：灰（年长者） |
| `--sn-av-blue` | `#c7d0da` | `#b3bbc4` | 预设头像的衣服、帽子、耳机：灰蓝 |
| `--sn-av-green` | `#cdd5c8` | `#b9c0b4` | 预设头像的衣服：灰绿 |
| `--sn-av-pink` | `#dccfcb` | `#c6bab7` | 预设头像的衣服：灰粉 |
| `--sn-av-violet` | `#d5d1df` | `#c0bcc9` | 预设头像的衣服、耳机：淡紫 |
| `--sn-av-beard` | `#958e88` | `#867f7a` | 预设头像的胡子 |
| `--sn-field-inset` | `0 0 0 0 transparent` | `0 0 0 0 transparent` | 输入框内阴影（默认没有） |
| `--sn-card-shadow` | `0 1px 3px rgba(0, 0, 0, .04)` | `none` | 卡片极淡的落影（一般不用：卡片只靠描边） |
| `--sn-e1` | `0 8px 24px rgba(0, 0, 0, .1), 0 0 0 1px rgba(0, 0, 0, .06)` | `0 8px 24px rgba(0, 0, 0, .5), inset 0 0 0 1px rgba(255, 255, 255, .09)` | 浮层阴影：菜单、弹出面板、通知 |
| `--sn-e2` | `0 24px 64px rgba(0, 0, 0, .16), 0 0 0 1px rgba(0, 0, 0, .06)` | `0 24px 64px rgba(0, 0, 0, .7), inset 0 0 0 1px rgba(255, 255, 255, .1)` | 弹窗阴影 |
| `--sn-tip-shadow` | `0 4px 14px rgba(0, 0, 0, .14)` | `0 4px 14px rgba(0, 0, 0, .5), inset 0 0 0 1px rgba(255, 255, 255, .08)` | Tooltip 阴影 |
| `--sn-grad-scrim` | `linear-gradient(to top, rgba(0, 0, 0, .64) 0%, rgba(0, 0, 0, .22) 48%, transparent 100%)` | `linear-gradient(to top, rgba(0, 0, 0, .74) 0%, rgba(0, 0, 0, .28) 50%, transparent 100%)` | 功能性压图护字底罩（仅用于摄影图上压字防糊，不作装饰） |
| `--sn-grad-fade` | `linear-gradient(to bottom, color-mix(in srgb, var(--sn-raised) 0%, transparent), var(--sn-raised))` | `linear-gradient(to bottom, color-mix(in srgb, var(--sn-raised) 0%, transparent), var(--sn-raised))` | 功能性边缘渐隐（列表底/顶融合底色） |
| `--sn-grad-sheen` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, .36), transparent)` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, .2), transparent)` | 功能性单向微光（活跃进度与完成瞬时反馈） |

## color

| 变量 | 值 | 说明 |
|---|---|---|
| `--sn-sel-ring` | `color-mix(in srgb, var(--sn-accent) 45%, transparent)` | 可文字编辑单元格的柔和修改框选 |
| `--sn-range-line` | `color-mix(in srgb, var(--sn-accent) 52%, transparent)` | 多格合并范围框选的柔和边框 |
| `--sn-guide-line` | `color-mix(in srgb, var(--sn-label) 48%, transparent)` | 对齐参考线 |
| `--sn-tree-line` | `color-mix(in srgb, var(--sn-label) 12%, transparent)` | 树形缩进线 |
| `--sn-menu-bg` | `var(--sn-overlay)` | 菜单底色 |
| `--sn-sk-shine` | `rgba(255, 255, 255, .75)` | 骨架屏扫光 |
| `--sn-sa-thumb` | `rgba(0, 0, 0, .26)` | 滚动条滑块 |
| `--sn-sa-thumb-hover` | `rgba(0, 0, 0, .44)` | 滚动条滑块（悬停） |
| `--sn-flow-dot` | `rgba(0, 0, 0, .12)` | 流程图画布网格点 |

## shadow

| 变量 | 值 | 说明 |
|---|---|---|
| `--sn-lift-shadow` | `inset 0 0 0 1px var(--sn-line-control), 0 12px 28px -10px rgba(0, 0, 0, .26), 0 2px 6px -2px rgba(0, 0, 0, .1)` | 拖起来的东西：一圈细边 + 很淡的落影 |
| `--sn-menu-shadow` | `0 18px 34px rgba(0, 0, 0, .12), 0 2px 4px rgba(0, 0, 0, .05), 0 0 0 1px rgba(0, 0, 0, .06), inset 0 1px 0 rgba(255, 255, 255, .74)` | 菜单阴影 |

## font

| 变量 | 值 | 说明 |
|---|---|---|
| `--sn-sans` | `-apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif` | 正文字体（系统字体栈，中文回退苹方 / 微软雅黑） |
| `--sn-mono` | `"SF Mono", ui-monospace, Menlo, "Cascadia Mono", Consolas, monospace` | 等宽字体（代码、数字） |
| `--sn-serif` | `"Songti SC", STSong, "Noto Serif SC", serif` | 衬线字体（长文阅读） |

## motion

| 变量 | 值 | 说明 |
|---|---|---|
| `--sn-ease-linear` | `linear` | 线性（只给进度这类匀速的） |
| `--sn-ease-out` | `cubic-bezier(0, 0, 0.58, 1)` | 默认的减速曲线：大多数出现、移动 |
| `--sn-ease-out-strong` | `cubic-bezier(0.22, 1, 0.36, 1)` | 更快到位的减速：小元素弹出 |
| `--sn-ease-in` | `cubic-bezier(0.42, 0, 1, 1)` | 加速：离开、消失 |
| `--sn-ease-in-out` | `cubic-bezier(0.42, 0, 0.58, 1)` | 两头慢：在屏幕上来回移动 |
| `--sn-ease-overshoot` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 带一点回弹：对勾、开关 |
| `--sn-ease-spring` | `linear(0, .32, .78, 1.04, 1.09, 1.06, 1.02, 1, .99, .99, 1)` | 弹簧：拖拽松手归位 |
| `--sn-ease-open` | `cubic-bezier(0.32, 0.72, 0, 1)` | 展开 / 抽屉 / 侧栏开合 |
| `--sn-press` | `0.97` | 按钮按下时缩到的比例 |
| `--sn-press-icon` | `0.92` | 图标按钮按下时缩到的比例 |
| `--sn-motion-scale` | `1` | 全局动效节奏倍率：1 标准，0.55 干脆，0 零过渡 |
| `--sn-dur-fast` | `calc(120ms * var(--sn-motion-scale))` | 即时反馈时长（悬停、按下、微态切换） |
| `--sn-dur-base` | `calc(200ms * var(--sn-motion-scale))` | 小型进出时长（提示、浮层、微动效显影） |
| `--sn-dur-slow` | `calc(320ms * var(--sn-motion-scale))` | 中型容器展开时长（抽屉、对话框、卡片展开） |

## border

| 变量 | 值 | 说明 |
|---|---|---|
| `--sn-bw-hairline` | `1px` | 常规分割线、表格网格线、卡片细描边 |
| `--sn-bw-ctrl` | `1px` | 输入框、次要按钮与选择器描边 |
| `--sn-bw-focus` | `2px` | 键盘焦点环粗细 |
| `--sn-bw-accent` | `2px` | 拉引线、思考导引线、侧边刻度指示线粗细 |

## blur

| 变量 | 值 | 说明 |
|---|---|---|
| `--sn-blur-sm` | `8px` | 轻虚化：悬浮图注标签、小型毛玻璃徽标 |
| `--sn-blur-md` | `16px` | 标准虚化：吸顶顶栏、浮层卡片、对话侧边浮窗 |
| `--sn-blur-lg` | `24px` | 深虚化：全幅媒体控制栏、沉浸式遮罩浮层 |

## radius

| 变量 | 值 | 说明 |
|---|---|---|
| `--sn-r-xs` | `4px` | 圆角 4：标签、徽标 |
| `--sn-r-sm` | `6px` | 圆角 6：小按钮、输入框内元素 |
| `--sn-r-md` | `8px` | 圆角 8：输入框、菜单项 |
| `--sn-r-lg` | `12px` | 圆角 12：卡片、表格、面板 |
| `--sn-r-xl` | `16px` | 圆角 16：弹窗、大面板 |
| `--sn-r-full` | `9999px` | 整圆：头像、胶囊 |
| `--sn-btn-r` | `8px` | 按钮圆角（跟着 data-radius 档：6 / 8 / 10 / 胶囊，默认胶囊） |

## space

| 变量 | 值 | 说明 |
|---|---|---|
| `--sn-sp-0` | `0px` | 间距 0px（刻度：4 的倍数为主） |
| `--sn-sp-2` | `2px` | 间距 2px（刻度：4 的倍数为主） |
| `--sn-sp-4` | `4px` | 间距 4px（刻度：4 的倍数为主） |
| `--sn-sp-6` | `6px` | 间距 6px（刻度：4 的倍数为主） |
| `--sn-sp-8` | `8px` | 间距 8px（刻度：4 的倍数为主） |
| `--sn-sp-10` | `10px` | 间距 10px（刻度：4 的倍数为主） |
| `--sn-sp-12` | `12px` | 间距 12px（刻度：4 的倍数为主） |
| `--sn-sp-14` | `14px` | 间距 14px（刻度：4 的倍数为主） |
| `--sn-sp-16` | `16px` | 间距 16px（刻度：4 的倍数为主） |
| `--sn-sp-20` | `20px` | 间距 20px（刻度：4 的倍数为主） |
| `--sn-sp-24` | `24px` | 间距 24px（刻度：4 的倍数为主） |
| `--sn-sp-28` | `28px` | 间距 28px（刻度：4 的倍数为主） |
| `--sn-sp-32` | `32px` | 间距 32px（刻度：4 的倍数为主） |
| `--sn-sp-40` | `40px` | 间距 40px（刻度：4 的倍数为主） |
| `--sn-sp-48` | `48px` | 间距 48px（刻度：4 的倍数为主） |
| `--sn-sp-64` | `64px` | 间距 64px（刻度：4 的倍数为主） |
| `--sn-sp-80` | `80px` | 间距 80px（刻度：4 的倍数为主） |
| `--sn-gap-tight` | `var(--sn-sp-4)` | 最紧的间距：图标和文字 |
| `--sn-gap-inline` | `var(--sn-sp-8)` | 同一行元素之间 |
| `--sn-gap-stack` | `var(--sn-sp-12)` | 上下相邻的小块之间 |
| `--sn-gap-group` | `var(--sn-sp-16)` | 一组和一组之间 |
| `--sn-gap-section` | `var(--sn-sp-32)` | 页面大块之间 |
| `--sn-pad-card` | `var(--sn-sp-16)` | 卡片内边距 |
| `--sn-pad-panel` | `var(--sn-sp-24)` | 面板内边距 |
| `--sn-pad-page` | `var(--sn-sp-32)` | 页面内边距 |

## flow

| 变量 | 值 | 说明 |
|---|---|---|
| `--sn-edge-s` | `58%` | 滚动边缘渐隐（饱和度） |
| `--sn-edge-l` | `52%` | 滚动边缘渐隐（明度） |
| `--sn-edge-a` | `0.62` | 滚动边缘渐隐（透明度） |
| `--sn-beam-s` | `85%` | 流程图光束（饱和度） |
| `--sn-beam-l` | `70%` | 流程图光束（明度） |

## 圆角档（根元素 `data-radius`，默认胶囊）

undefined
