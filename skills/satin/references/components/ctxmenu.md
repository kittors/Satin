# 右键菜单与子菜单 · Context menu · Submenu

> 组件 id：`ctxmenu`　分组：浮层

右键菜单出现在指针处，靠边时向内翻。子菜单与父层重叠 8px、首行对齐，右边放不下就翻到左边，一旦往左开，再往下的层也往左。斜着移向子菜单时，途经的行不会抢走高亮；停住 1.2 秒，或者离开安全三角区才切换。菜单还可以限定在一个容器里：菜单和每一层子菜单（"移动到 › 第一集 › 场景"两级）都不出这个框；太矮就限高、在菜单里滚动；窄到子菜单左右都放不下时，点开它会在原位置下钻，顶上一行返回。

## 验收要点

- 打开子菜单等 220ms（拖拽中 420ms），切换最多等 1200ms，关闭等 360ms，期间指针回来就取消；点外面立即关闭。
- 范围：默认是整个窗口；指定了容器，就只在容器和窗口的交集里，四边留 8px。右边、下边放不下先翻过去，翻过去也放不下就贴着边；比范围高就限高，在菜单里滚动。
- 下钻：只在点击或按键时发生，悬停不会突然换掉整个菜单；上一层往左淡出，下一层从右边滑进来；左键或点返回行回去。
- 容器滚动、变大小、窗口缩放时菜单直接关掉，不跟着漂。
- 高亮只由状态决定，不用 CSS 悬停，否则安全区里途经的行也会亮。
- 键盘：上下移动，Right 或回车展开子菜单，Left 回上一层，Esc 全部关闭并把焦点还给按钮。

## 写法

### openMenu(菜单, 选项)

| 选项 | 说明 |
|---|---|
| trigger | 触发的元素：打开时加 .sn-is-open、关上后焦点回到它 |
| anchor | 贴着这个元素弹（菜单按钮） |
| x / y | 在这个位置弹（右键菜单）；放不下往左、往上开 |
| bound | 菜单（连同每一层子菜单）只能待在这个容器里 |
| keyboard | 用键盘打开：先高亮第一项 |
| onSelect | ({ item, label, path, menu }) => {}：选中一项时调 |

### 其他

| 名称 | 说明 |
|---|---|
| closeMenu(refocus) | 关上整套菜单 |
| menuselect 事件 | 选中时在根菜单上冒泡；detail 同 onSelect |
| [data-ctx="菜单 id"] | 右键区域（Shift+F10、菜单键也行；bindOverlays 接上） |
| [data-fmenu="菜单 id"] | 菜单按钮（↓ 键也能打开；bindOverlays 接上） |

### 菜单标记

| 写法 | 说明 |
|---|---|
| .sn-menu.sn-float > .sn-item | 条目；.sn-key 快捷键提示、.sn-danger-item 危险项、.sn-is-off 不可用 |
| data-sub="子菜单 id" | 有子菜单的条目：悬停 220ms 打开，朝子菜单走时有安全三角区 |
| .sn-sep / .sn-head | 分组之间的间隔 / 分组标题 |
| 键盘 | ↑↓ 移动、→ 进子菜单、← 回上一层、回车选中、Esc 关闭（要整页调过 setup()） |

## 用法

```html
<!-- 右键区域：data-ctx 写菜单 id；键盘用 Shift+F10 或菜单键打开 -->
<div class="sn-ctx-zone" data-ctx="m-shot" tabindex="0">在这里点右键</div>

<!-- 菜单按钮：贴着按钮弹 -->
<button class="sn-btn sn-secondary" data-fmenu="m-shot">更多</button>

<div class="sn-menu sn-float" id="m-shot" role="menu">
  <div class="sn-item" data-i="pencil:before">重命名<span class="sn-key">F2</span></div>
  <div class="sn-item" data-sub="m-move">移动到<span data-i="chevron-right:more"></span></div>
  <div class="sn-item sn-is-off">分享给协作者</div>        <!-- 不可用 -->
  <div class="sn-sep"></div>
  <div class="sn-item sn-danger-item" data-i="trash-2:before">移到回收站</div>
</div>
<!-- 子菜单：上一层的条目写 data-sub="子菜单 id" -->
<div class="sn-menu sn-float" id="m-move" role="menu">
  <div class="sn-head">第一季</div>
  <div class="sn-item">第一集</div>
  <div class="sn-item">第二集</div>
</div>
```

```js
import { toast } from "satin-ui/components";

// 写在标记上：[data-ctx="菜单 id"] 右键（或 Shift+F10、菜单键）在指针处弹，触屏长按 500ms 弹；[data-fmenu="菜单 id"] 贴着按钮弹——enhance() 已经接上
// 选中：根菜单上冒泡 menuselect，detail 里有条目文字和子菜单路径
document.querySelector("#m-shot").addEventListener("menuselect", (e) => {
  const { label, path } = e.detail; // 比如 "第二集"、["移动到"]
  toast({ text: [...path, label].join(" › ") });
});
// 自己控制：openMenu(菜单, { trigger, x, y, bound })，在指针处弹、只待在 bound 这个框里；closeMenu() 关上整套菜单
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-row" style="align-items:stretch;gap:16px">
<div class="sn-ctx-zone" data-ctx="m-ctx" tabindex="0" aria-label="镜头卡片，按 Shift+F10 打开菜单"><span>在这里点右键</span><span class="sn-note">键盘：聚焦后按 Shift+F10</span></div>
<div class="sn-stack" style="align-content:start;gap:12px">
<button class="sn-btn sn-secondary" data-fmenu="m-move" data-i="chevron-down:caret">移动到</button>
<label class="sn-check" data-c=""><input type="checkbox" id="showTri">显示安全三角区</label>
</div>
</div>
<div class="sn-ctx-demo">
<div class="sn-ctx-box sn-show-bound" data-ctx-box="" tabindex="0" aria-label="受限容器，按 Shift+F10 打开菜单"><i class="sn-ctx-bound"></i><span class="sn-ctx-hint"><b>受限容器</b><span>在这里点右键，菜单不会出这个框</span></span><i class="sn-ctx-grip" data-ctx-grip="" title="拖动改变大小"></i></div>
<div class="sn-ctx-cfg">
<div class="sn-ctx-row"><span class="sn-cap">范围</span><div class="sn-seg sn-sm" data-seg="ctxbound"><span class="sn-thumb"></span><button data-v="box">这个容器</button><button data-v="win">整个窗口</button></div></div>
<div class="sn-ctx-row"><span class="sn-cap">尺寸</span><div class="sn-seg sn-sm" data-seg="ctxsize"><span class="sn-thumb"></span><button data-v="420x300">默认</button><button data-v="560x150">宽而矮</button><button data-v="240x340">窄而高</button><button data-v="240x150">很小</button></div></div>
<label class="sn-check" data-c=""><input type="checkbox" data-ctx-showbound="" checked>显示边界和 8px 安全距离</label>
<span class="sn-note">也可以拖容器右下角改大小</span>
</div>
</div>
```

## 规则

- 打开子菜单等 220ms（拖拽中 420ms），切换最多等 1200ms，关闭等 360ms，期间指针回来就取消；点外面立即关闭。
- 范围：默认是整个窗口；指定了容器，就只在容器和窗口的交集里，四边留 8px。右边、下边放不下先翻过去，翻过去也放不下就贴着边；比范围高就限高，在菜单里滚动。
- 下钻：只在点击或按键时发生，悬停不会突然换掉整个菜单；上一层往左淡出，下一层从右边滑进来；左键或点返回行回去。
- 容器滚动、变大小、窗口缩放时菜单直接关掉，不跟着漂。
- 高亮只由状态决定，不用 CSS 悬停，否则安全区里途经的行也会亮。
- 键盘：上下移动，Right 或回车展开子菜单，Left 回上一层，Esc 全部关闭并把焦点还给按钮。

