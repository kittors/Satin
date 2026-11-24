# 动效规格

只动 transform、opacity、filter；曲线和时长只用下面这几档（令牌：spec/tokens/base.tokens.json 的 motion.easing）。

## 曲线

| 名字 | CSS | 用在哪 |
| --- | --- | --- |
| `ease.out` | `cubic-bezier(0, 0, 0.58, 1)` | 进入；悬停、按下 |
| `ease.outStrong` | `cubic-bezier(0.22, 1, 0.36, 1)` | 小件落定；容器出现后错峰的子元素 |
| `ease.in` | `cubic-bezier(0.42, 0, 1, 1)` | 只用于离开 |
| `ease.inOut` | `cubic-bezier(0.42, 0, 0.58, 1)` | 留在屏上换位、换尺寸 |
| `ease.overshoot` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 小型确认：勾选、开关圆钮、徽标 |
| `ease.open` | `cubic-bezier(0.32, 0.72, 0, 1)` | 展开和收回：卡片变详情、面板 |
| `ease.spring` | `linear(0, 0.32, 0.78, 1.04, 1.09, 1.06, 1.02, 1, 0.99, 0.99, 1)` | 拖拽、滑动松手后的回弹 |
| `linear` | `linear` | 只用于转圈、进度条 |

## 时长

| 档位 | 例子 | 时长 |
| --- | --- | --- |
| 即时反馈 | 悬停、按下 | 100–150ms |
| 小型 | Toast、Tooltip、菜单、勾选 | 进入 150–250ms，离开 120–200ms |
| 中型 | 对话框、Popover、抽屉 | 250–350ms，离开短约三分之一 |
| 大型 | 整页切换、全屏面板 | 350–500ms |
| 子元素错峰 | 图标、文字、计数 | 比容器晚 100–200ms，彼此再错开 20–50ms |
| 弹簧、过冲 | — | 同档的 1.5 倍 |

## 实际用量

样式表里的过渡 / 动画 476 处，脚本里的 WAAPI 113 处（清单见 inventory.json）。曲线用量：

- `var(--sn-ease-out)`：388
- `var(--sn-ease-out-strong)`：90
- `linear`：36
- `var(--sn-ease-in-out)`：30
- `var(--sn-ease-in)`：30
- `var(--sn-ease-open)`：20
- `var(--sn-ease-overshoot)`：16
- `cubic-bezier(.16, 1, .3, 1)`：4
- `ease-in`：3
- `cubic-bezier(.55, .15, .45, .85)`：2
- `cubic-bezier(.25, .1, .25, 1)`：2
- `cubic-bezier(.3, .1, .3, 1)`：1
- `cubic-bezier(.45, .05, .55, .95)`：1
- `cubic-bezier(.34, 1.56, .64, 1)`：1
- `cubic-bezier(.62, .12, .38, .88)`：1
- `cubic-bezier(.65, .815, .735, .395)`：1
- `cubic-bezier(.165, .84, .44, 1)`：1

## 验收

逐帧记录（rAF 每帧取关键元素的位置和透明度）：帧间隔 p95 ≤ 17ms、最长 ≤ 34ms、没有 > 50ms 的帧。录屏只用来看画面。
