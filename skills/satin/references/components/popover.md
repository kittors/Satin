# 弹出面板 · Popover

> 组件 id：`popover`　分组：浮层

点一下才出现，里面可以放少量操作，改动立即生效，不需要"保存"。从按钮那一侧长出来，下方放不下就翻到上方；点外面或按 Esc 关闭，焦点回到按钮。

## 验收要点

- 面板宽 248–320，圆角 12，内边距 14–16；标题 13/600，说明 12。
- 打开后焦点移到面板里第一个控件；Tab 走出面板时自动关闭。
- 和 Tooltip 的分工：Tooltip 悬停出现、只有文字；Popover 点击出现、可以操作。

## 写法

### openPopover(面板, 触发按钮, 选项)

| 选项 | 取值 | 默认 | 说明 |
|---|---|---|---|
| align | "start" \| "end" | "start" | 和按钮左边对齐还是右边对齐 |
| onClose | () => {} | 无 | 关上以后调 |

### 返回值

| 名称 | 说明 |
|---|---|
| close(refocus) | 关上；refocus 为 true 时焦点回到按钮 |

### 其他

| 名称 | 说明 |
|---|---|
| popoverOf(面板) | 正开着的那个（没开返回 undefined），用来做“再点一下关上” |
| [data-pop="面板 id"] | 写在按钮上，bindOverlays 接上：点了开、再点关 |
| 关闭时机 | Esc、点面板外面（要整页调过 setup()）、Tab 走出面板、窗口变化时重新对位 |

## 用法

```html
<button class="sn-btn sn-secondary" data-pop="pop-share">分享</button>

<!-- 面板放在页面任意地方（一般放在 body 末尾），打开时贴着按钮弹出 -->
<div class="sn-pop sn-popover" id="pop-share" role="dialog" aria-label="分享">
  <h4>分享给协作者</h4>
  <p>拿到链接的人可以查看，不能修改。</p>
  <div class="sn-acts"><button class="sn-btn sn-primary sn-sm">复制链接</button></div>
</div>
```

```js
import { setup } from "satin-ui";
import { bindOverlays, openPopover, popoverOf } from "satin-ui/components";
import "satin-ui/css/overlay.css";

setup(); // 页面级行为（Esc、点外面关上），整页调一次

// 写在标记上：[data-pop="面板 id"] 点了开、再点关；Esc、点外面、焦点离开面板都会关
bindOverlays(document);

// 或者自己控制：贴着按钮打开（align: "end" 右对齐），返回的 close() 关上
const btn = document.querySelector("#share"), pop = document.querySelector("#pop-share");
btn.addEventListener("click", () => {
  const open = popoverOf(pop);
  if (open) open.close();
  else openPopover(pop, btn, { align: "end", onClose: () => console.log("关了") });
});
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-row">
<button class="sn-btn sn-secondary" data-pop="pop-share" data-i="share:before">分享</button>
<button class="sn-btn sn-secondary" data-pop="pop-filter" data-i="list-filter:before"><span class="sn-txt">筛选</span><span class="sn-count-badge sn-num" hidden></span></button>
<button class="sn-btn sn-ghost sn-ibtn" data-pop="pop-info" data-tip="画面比例说明" data-i="info"></button>
</div>
```

## 规则

- 面板宽 248–320，圆角 12，内边距 14–16；标题 13/600，说明 12。
- 打开后焦点移到面板里第一个控件；Tab 走出面板时自动关闭。
- 和 Tooltip 的分工：Tooltip 悬停出现、只有文字；Popover 点击出现、可以操作。

