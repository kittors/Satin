# 抽屉 · Drawer

> 组件 id：`drawer`　分组：浮层

长表单、要对照页面编辑时用。从右边滑进来，背后的页面保持可见；改动即时反映到背后的页面，自动保存。抽屉不用来做确认。

## 验收要点

- 悬浮在窗口里，四周留 8px，圆角 16；开 320ms ease.open，关 220ms ease.in。
- 背后的页面只压暗 12%（深色 40%），保证能对照着改。
- Esc 或点外面关闭，焦点回到"编辑"按钮。

## 写法

### openDrawer(抽屉, 选项)

| 选项 | 说明 |
|---|---|
| trigger | 触发的按钮：关上后焦点回到这里 |
| focus | 打开后焦点先落在这里（默认抽屉里第一个能聚焦的） |
| scrim | 遮罩元素（默认页面上的 .sn-drawer-scrim，没有就建一个） |
| onClose | 关上以后调 |

### 其他

| 名称 | 说明 |
|---|---|
| 返回值 | { close(refocus) } |
| closeDrawer(refocus) | 关上正开着的那个抽屉 |
| [data-drawer="抽屉 id"] | 打开抽屉的按钮（bindOverlays 接上） |
| 抽屉里的 [data-x] | 关闭 |
| 关闭时机 | Esc、点外面（提示、轻提示、菜单除外；要整页调过 setup()） |

## 用法

```html
<button class="sn-btn sn-ghost sn-sm sn-ibtn" id="edit-shot" data-tip="编辑镜头" aria-label="编辑镜头" data-i="pencil"></button>

<!-- 遮罩可以不写：没有 .sn-drawer-scrim 会自动建一个。写在标记上也行：按钮加 data-drawer="dr-edit"，enhance() 接上就能开 -->
<aside class="sn-drawer" id="dr-edit" role="dialog" aria-modal="true" aria-labelledby="dr-t" tabindex="-1">
  <div class="sn-hd">
    <h3 id="dr-t">编辑镜头</h3>
    <button class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-i="x"></button>
  </div>
  <div class="sn-bd">
    <div class="sn-field"><label class="sn-lbl" for="dr-title">镜头标题</label><input class="sn-input" id="dr-title"></div>
  </div>
  <div class="sn-ft"><button class="sn-btn sn-ghost" data-x>完成</button></div>
</aside>
```

```js
import { openDrawer, toast } from "satin-ui/components";

// 抽屉里的 [data-x]、Esc、点外面关闭，焦点圈在抽屉里，触屏上手指往右拖也能关
// 自己控制：先把要编辑的内容填进去再打开，关上时收尾
const editBtn = document.querySelector("#edit-shot"), drawer = document.querySelector("#dr-edit"), title = document.querySelector("#dr-title");
const shot = { title: "车站外，雨刚停" };
editBtn.addEventListener("click", () => {
  title.value = shot.title;
  openDrawer(drawer, {
    trigger: editBtn, // 关上后焦点回到这里
    focus: title,     // 打开后焦点先落在这里
    onClose: () => {  // 换成你的保存
      const v = title.value.trim();
      if (v && v !== shot.title) { shot.title = v; toast({ text: `已保存"${v}"` }); }
    },
  });
});
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-shot-cards" id="shotCards"></div>
```

## 规则

- 悬浮在窗口里，四周留 8px，圆角 16；开 320ms `ease.open`，关 220ms `ease.in`。
- 背后的页面只压暗 12%（深色 40%），保证能对照着改。
- Esc 或点外面关闭，焦点回到"编辑"按钮。

