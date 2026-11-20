# 折叠面板 · Collapse

> 组件 id：`collapse`　分组：数据展示

高度用 0fr → 1fr 过渡，内容在展开过半时淡入；箭头跟着转 90°。可以同时展开多个，也可以只开一个（手风琴）。

## 写法

### createCollapse(.sn-acc, 选项)

| 选项 / 方法 | 说明 |
|---|---|
| items / open | 空容器按它渲染：[{ title, content 或 html }]、一开始展开第几项（[0]）；已有标记时不用给 |
| single | 同时只开一项 |
| onToggle | ({ index, open }) => {}；同时在容器上冒泡 sn-toggle |
| open(i) / close(i) | 展开 / 收起第 i 项 |
| bindCollapses(root) | 接上 root 里所有 .sn-acc |

### 标记

| 写法 | 说明 |
|---|---|
| .sn-acc > .sn-acc-item(.sn-open) > .sn-acc-hd + .sn-acc-bd > div | 标题按钮 + 内容（内容外面多包一层，高度过渡不重排） |

## 用法

```js
import { createCollapse, bindCollapses } from "satin-ui/components";

// 点条目标题展开 / 收起（高度过渡）；single：同时只开一项
const faq = createCollapse(document.querySelector(".sn-acc"), {
  single: true,
  onToggle: ({ open }) => console.log(open ? "展开" : "收起"),
});
faq.open(0);

// 或者把页面上所有 .sn-acc 一次接上
bindCollapses(document);

// 不写标记也行：给一个空容器，按选项渲染
createCollapse(document.querySelector("#faq"), {
  items: [{ title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里。" }, { title: "能多人一起编辑吗？", content: "可以，在设置里邀请协作者。" }],
  open: [0],
});
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-acc" id="acc">
<div class="sn-acc-item sn-open"><button class="sn-acc-hd" aria-expanded="true"><span data-i="chevron-right"></span>导出的成片放在哪里？</button><div class="sn-acc-bd"><div><p>默认放在"下载"文件夹里，以项目名建一个子文件夹。可以在设置 → 导出里改。</p></div></div></div>
<div class="sn-acc-item"><button class="sn-acc-hd" aria-expanded="false"><span data-i="chevron-right"></span>额度用完了会怎样？</button><div class="sn-acc-bd"><div><p>新的生成会排队，等额度恢复或充值后自动继续，已经提交的任务不会丢。</p></div></div></div>
<div class="sn-acc-item"><button class="sn-acc-hd" aria-expanded="false"><span data-i="chevron-right"></span>可以多人一起编辑一个项目吗？</button><div class="sn-acc-bd"><div><p>可以。在项目里点"分享"，把链接发给协作者；同一个镜头同一时间只能一个人编辑，别人会看到"正在编辑"。</p></div></div></div>
</div>
```

