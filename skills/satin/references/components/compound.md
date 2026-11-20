# 组合按钮 · ButtonGroup · SplitButton · CopyButton

> 组件 id：`compound`　分组：按钮

相关的几个操作连成一组；主操作带若干备选时用分裂按钮；复制按钮复制成功后图标原地变成对勾 1.2 秒，不另弹 Toast。

## 写法

### 标记

| 写法 | 说明 |
|---|---|
| .sn-group | 按钮组：相关操作连成一组（共用圆角、中间不留缝） |
| .sn-group.sn-split.sn-select | 分裂按钮：主按钮 + 一个菜单按钮（用 bindSelects 接上） |
| [data-copy] | 复制按钮：里面放 .sn-swap（.sn-a 复制图标、.sn-b 对勾） |

### 函数

| 名称 | 说明 |
|---|---|
| copied(按钮) | 图标原地换成对勾 1.2 秒，再换回来（复制本身由你做） |
| bindSelects(root) | 接上分裂按钮里的菜单 |

## 用法

```html
<!-- 按钮组：相关的几个操作连成一组 -->
<div class="sn-group">
  <button class="sn-btn sn-secondary sn-ibtn" data-tip="上一个" data-i="chevron-left"></button>
  <button class="sn-btn sn-secondary sn-ibtn" data-tip="下一个" data-i="chevron-right"></button>
</div>

<!-- 分裂按钮：主操作 + 备选（备选是一个菜单按钮） -->
<div class="sn-group sn-split sn-select sn-inline-menu">
  <button class="sn-btn sn-primary">导出成片</button>
  <button class="sn-btn sn-primary sn-more" data-menubtn data-tip="更多导出方式" data-i="chevron-down"></button>
  <div class="sn-menu sn-end" role="menu">
    <div class="sn-item">MP4（1080p）</div>
    <div class="sn-item">MP4（4K）</div>
  </div>
</div>

<!-- 复制按钮：成功后图标原地换成对勾 -->
<button class="sn-btn sn-ghost sn-ibtn" data-copy="https://example.com/s/7f3k2q" data-tip="复制链接">
  <span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span>
</button>
```

```js
import { setup, injectIcons } from "satin-ui";
import { bindSelects, copied } from "satin-ui/components";
import "satin-ui/css/buttons.css";
import "satin-ui/css/overlay.css";

setup();               // 页面级行为（提示、点外面收起菜单），整页调一次
injectIcons(document);
bindSelects(document); // 分裂按钮的备选菜单

// 复制按钮：写入剪贴板，成功后图标换成对勾 1.2 秒
for (const b of document.querySelectorAll("[data-copy]")) {
  b.addEventListener("click", async () => {
    await navigator.clipboard.writeText(b.dataset.copy);
    copied(b);
  });
}
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-row" style="gap:20px">
<div class="sn-group"><button class="sn-btn sn-secondary sn-ibtn" data-tip="上一个" data-i="chevron-left"></button><button class="sn-btn sn-secondary sn-ibtn" data-tip="下一个" data-i="chevron-right"></button></div>
<div class="sn-group"><button class="sn-btn sn-secondary sn-sm sn-ibtn" data-tip="缩小" data-i="minus"></button><button class="sn-btn sn-secondary sn-sm sn-num" style="width:56px">100%</button><button class="sn-btn sn-secondary sn-sm sn-ibtn" data-tip="放大" data-i="plus"></button></div>
<div class="sn-group sn-split sn-select sn-inline-menu"><button class="sn-btn sn-primary">导出成片</button><button class="sn-btn sn-primary sn-more" data-menubtn="" data-tip="更多导出方式" data-i="chevron-down"></button>
<div class="sn-menu sn-end" role="menu" style="min-width:180px"><div class="sn-head">导出为</div><div class="sn-item" data-i="film:before">MP4（1080p）</div><div class="sn-item" data-i="film:before">MP4（4K）</div><div class="sn-item" data-i="image:before">逐帧图片</div></div></div>
<button class="sn-btn sn-ghost sn-ibtn" data-copy="" data-tip="复制链接" data-kbd="⌘C"><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button>
<span class="sn-ib sn-has-post" style="width:260px"><input class="sn-input" value="https://example.com/s/7f3k2" readonly><span class="sn-post"><button class="sn-btn sn-ghost sn-sm sn-ibtn" data-copy="" data-tip="复制"><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button></span></span>
</div>
```

