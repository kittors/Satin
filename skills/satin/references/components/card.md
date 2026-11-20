# 卡片 · Card

> 组件 id：`card`　分组：数据展示

项目、素材用卡片。悬停时卡片不上浮、不加阴影：封面在框里慢慢放大一点，右上角出现"更多"，左上角出现勾选框。选中后外圈一道 2px 的线。

## 验收要点

- 封面 16:9，圆角 12（卡片）、内部元素按嵌套公式缩小；标题 13/500 一行截断，副信息 12。
- 封面放大 1.04、600ms ease.out；客户端的项目卡片悬停时改为播放预览视频。

## 用法

```js
import { setup } from "satin-ui";
import { openMenu } from "satin-ui/components";

setup(); // 页面级行为（菜单的键盘操作、点外面关上），整页调一次

// 卡片本身是标记：封面、标题、元信息；左上角的勾选框多选，右上角"更多"弹菜单
cards.addEventListener("change", (e) => e.target.closest(".sn-pc")?.classList.toggle("sn-sel", e.target.checked));
cards.addEventListener("click", (e) => {
  const more = e.target.closest("[data-card-more]");
  if (more) openMenu(document.querySelector("#m-card"), { trigger: more, anchor: more, align: "end" });
});
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-pcards" id="pcards"></div>
```

## 规则

- 封面 16:9，圆角 12（卡片）、内部元素按嵌套公式缩小；标题 13/500 一行截断，副信息 12。
- 封面放大 1.04、600ms `ease.out`；客户端的项目卡片悬停时改为播放预览视频。

