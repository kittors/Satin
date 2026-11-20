# 标签输入 · TagInput

> 组件 id：`taginput`　分组：表单

输入后按回车或逗号变成标签，新标签弹出来；空着时按一次退格先选中最后一个标签，再按一次才删；粘贴"雨夜，车站，悬疑"会拆成多个标签依次出现；重复的标签不再添加，已有的那个抖一下。

## 写法

### createTagInput(容器, 选项)

| 选项 | 说明 |
|---|---|
| tags | 一开始就有的标签 |
| max / placeholder / hint | 空容器按它渲染：最多几个、占位文字、下面那行提示（已有标记时写在标记上） |
| onChange | (tags) => {}：标签变了调；同时冒泡 sn-change |

### 返回值

| 名称 | 说明 |
|---|---|
| tags | 现在的标签（只读） |

### 标记

| 写法 | 说明 |
|---|---|
| [data-tagin][data-max] | 最多几个 |
| 后面紧跟的 .sn-tagin-foot 里的 .sn-roll | 计数 |

## 用法

```html
<div class="sn-box-in sn-tagin" data-tagin data-max="8">
  <input placeholder="输入标签，回车确认" aria-label="添加标签">
</div>
<div class="sn-tagin-foot">
  <span>回车或逗号添加 · 退格删除</span><span class="sn-num"><span class="sn-roll"><span>0</span></span> / 8</span>
</div>
```

```js
import { createTagInput } from "satin-ui/components";
import "satin-ui/css/input.css";

// 回车或逗号加标签；重复的抖一下；超过 data-max 个不让加；
// 退格先"点亮"最后一个、再按才删；粘贴一串自动拆开；中文输入法拼字时不响应
const tags = createTagInput(document.querySelector("[data-tagin]"), {
  tags: ["雨夜", "车站"],
  onChange: (list) => console.log(list),
});
tags.tags;    // ["雨夜", "车站"]

// 不写标记也行：给一个空容器，按选项渲染（输入框 + 下面的计数行）
createTagInput(document.querySelector("#tags"), { tags: ["雨夜"], max: 8 });
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div style="max-width:560px" class="sn-stack">
<div class="sn-box-in sn-tagin" data-tagin="" data-max="8"><input placeholder="输入标签，回车确认" aria-label="添加标签"></div>
<div class="sn-tagin-foot"><span>回车或逗号添加 · 退格删除</span><span class="sn-num"><span class="sn-roll"><span>0</span></span> / 8</span></div>
</div>
```

