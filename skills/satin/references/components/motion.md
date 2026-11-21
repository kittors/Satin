# 动效曲线 · 09 号 §1

> 组件 id：`motion`　分组：基础

全系统只有这几条曲线。先看动效类型再选：进入先快后慢，离开先慢后快，换位两端慢中间快。点一下每张卡片看它怎么动。

**全系统只有这几条曲线：先看动效类型再选——进入先快后慢，离开先慢后快，换位两端慢中间快，按下回弹用弹簧。只动 transform、opacity、filter。**

## 相近的组件

- `segmented`：分段控件的滑块是"换位"的例子。
- `dialog`：对话框的开合是"进入 / 离开"的例子。

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-ease-out`（全局令牌） | 进入：先快后慢 | cubic-bezier(0, 0, .58, 1) |
| `--sn-ease-out-strong`（全局令牌） | 进入、落定（更干脆） | cubic-bezier(.22, 1, .36, 1) |
| `--sn-ease-in`（全局令牌） | 离开：先慢后快 | cubic-bezier(.42, 0, 1, 1) |
| `--sn-ease-in-out`（全局令牌） | 换位、展开收起：两端慢中间快 | cubic-bezier(.42, 0, .58, 1) |
| `--sn-ease-spring / --sn-ease-overshoot`（全局令牌） | 回弹、轻微过冲（补位、抖一下） | linear(…) / cubic-bezier(.34, 1.56, .64, 1) |
| `--sn-ease-open`（全局令牌） | 抽屉、面板拉开 | cubic-bezier(.32, .72, 0, 1) |
| `--sn-press`（全局令牌） | 按下时缩小到 | .97 |

## 设计规范

- 这样做：进入 150～300ms，离开比进入短一点。
- 这样做：减少动态效果打开时只留透明度变化，或者直接换。
- 不要：动 width、height、top、left 这些会重新排版的属性。（规则 `motion-props`）
- 不要：自己写 cubic-bezier、随手定时长。（规则 `easing-token`）

