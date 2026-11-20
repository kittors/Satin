# 命令面板 · Command palette

> 组件 id：`cmdk`　分组：浮层

按 ⌘K（Windows 上 Ctrl+K）随时打开，输入就筛选；上下键选、回车执行、Esc 关闭。高亮条在行间滑过去，筛选时留下的行移到新位置，其他的淡出。

## 验收要点

- 宽 560，离窗口顶 14%；行高 38，组标题 11/600。
- 没有结果时说清楚搜了什么，并给一个出口（比如"在素材库里搜索"）。
- 执行后面板先收起，结果用状态 Toast 告诉用户。

## 写法

### createCommandPalette(分组, 选项)

| 选项 | 说明 |
|---|---|
| 分组 | [{ name, items: [{ icon, name, sub, key, keys }] }]；keys 是额外的搜索词（比如英文名） |
| onRun | (item) => {}：选中一项执行 |
| placeholder | 输入框占位文字 |
| empty | (q) => HTML：没有结果时显示；里面带 data-empty-act 的按钮点了调 onEmpty |
| onEmpty | (q) => {}：没有结果时回车或点出口按钮 |
| hotkey | true：⌘K / Ctrl+K 打开（默认） |

### 返回值

| 名称 | 说明 |
|---|---|
| open() / close() / toggle() | 打开、关上、切换 |
| input / list | 输入框、列表元素 |

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-row"><button class="sn-btn sn-secondary" data-cmdk-open="" data-i="search:before"><span class="sn-txt">搜索或执行命令</span><span class="sn-kbd-hint">⌘K</span></button><span class="sn-note">也可以直接按 ⌘K</span></div>
```

## 规则

- 宽 560，离窗口顶 14%；行高 38，组标题 11/600。
- 没有结果时说清楚搜了什么，并给一个出口（比如"在素材库里搜索"）。
- 执行后面板先收起，结果用状态 Toast 告诉用户。

