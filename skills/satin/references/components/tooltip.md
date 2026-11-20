# 文字提示 · Tooltip

> 组件 id：`tooltip`　分组：浮层

只放一句文字：名称、快捷键，或者为什么不能点。不放按钮和链接，要操作就用弹出面板。第一次悬停 500ms 后出现，在一组按钮之间移动时立即切换；键盘聚焦时同样出现；靠近窗口上沿时自动翻到下方。

## 验收要点

- 浅色主题用近黑底白字，深色主题用深灰底，不反成白块；圆角 6，字 12/500。
- 同一时间只有一个，不超出窗口，指针可以穿过它；出现 120ms，离开 80ms。
- 超过约 20 个字时换行，最宽 240。

## 写法

### 标记

| 写法 | 说明 |
|---|---|
| data-tip="文字" | 整页调一次 setup() 后自动有提示：悬停 500ms 出现，键盘聚焦也出现 |
| data-kbd="⌘C" | 提示后面带快捷键 |
| .sn-tip.sn-wrap | 长提示换行（最宽 240） |

### 函数（satin-ui）

| 名称 | 说明 |
|---|---|
| setup() | 页面级行为（含 Tooltip），整页调一次；React / Vue 封装会自动调 |
| showTip(元素, 文字) | 在别的时机显示（比如校验失败） |
| hideTip() | 收起 |

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-cols">
<span class="sn-cap">名称和快捷键</span>
<div class="sn-row"><div class="sn-toolbar" role="toolbar" aria-label="编辑">
<button class="sn-btn sn-ghost sn-ibtn" data-tip="撤销" data-kbd="⌘Z" data-i="undo-2"></button><button class="sn-btn sn-ghost sn-ibtn" data-tip="重做" data-kbd="⇧⌘Z" data-i="redo-2"></button><span class="sn-vr"></span><button class="sn-btn sn-ghost sn-ibtn" data-tip="剪切" data-kbd="⌘X" data-i="scissors"></button><button class="sn-btn sn-ghost sn-ibtn" data-tip="复制" data-kbd="⌘C" data-i="copy"></button><button class="sn-btn sn-ghost sn-ibtn" data-tip="粘贴" data-kbd="⌘V" data-i="clipboard"></button><span class="sn-vr"></span><button class="sn-btn sn-ghost sn-ibtn" data-tip="放大预览" data-i="zoom-in"></button><button class="sn-btn sn-ghost sn-ibtn" data-tip="全屏" data-kbd="F" data-i="maximize-2"></button>
</div><span class="sn-note">先在一个按钮上停一下，再左右滑过其他按钮</span></div>
<span class="sn-cap">说明不能点的原因</span>
<div class="sn-row"><button class="sn-btn sn-primary" aria-disabled="true" data-tip="还有 3 个镜头没生成完，生成完才能导出">导出成片</button><span class="sn-note">禁用时悬停或点击，都会说明原因</span></div>
<span class="sn-cap">截断时显示全文</span>
<div class="sn-row"><div class="sn-trunc-box"><span class="sn-truncate" data-tip-full="">第三集 · 雨夜车站，林夏在站台上等最后一班车（第二版分镜）</span></div><span class="sn-note">只有真的被截断时才出现</span></div>
<span class="sn-cap">静态样式</span>
<div class="sn-row" style="align-items:flex-start"><span class="sn-tip sn-static">通知</span><span class="sn-tip sn-static">复制<kbd>⌘C</kbd></span><span class="sn-tip sn-static sn-wrap">还有 3 个镜头没生成完，生成完才能导出</span></div>
</div>
```

## 规则

- 浅色主题用近黑底白字，深色主题用深灰底，不反成白块；圆角 6，字 12/500。
- 同一时间只有一个，不超出窗口，指针可以穿过它；出现 120ms，离开 80ms。
- 超过约 20 个字时换行，最宽 240。

