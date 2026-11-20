# 骨架与加载 · Skeleton · Spinner

> 组件 id：`loading`　分组：反馈

300ms 以内的等待什么都不显示；超过 300ms 才出现，一旦出现至少留 500ms。布局已知时用骨架，不用孤零零的转圈；数据到了逐行替换，每行间隔 40ms 淡入。

## 验收要点

- 骨架的光带 1.2 秒扫过一次，整列共用一道光，不是每块各扫各的。
- 转圈 0.9 秒一圈；按钮里的转圈至少转满一圈再停。只在按钮里和很小的区域用转圈。
- 自动保存这类用户不用察觉的等待，不显示加载，只在固定位置放一个安静的状态字。

## 写法

### loadWithSkeleton(容器, 选项)

| 选项 | 说明 |
|---|---|
| load | () => Promise：取数据 |
| skeleton | 骨架的 HTML（.sn-sk 是一条骨架） |
| render | (数据) => HTML |
| stagger | 逐行替换的间隔（默认 40ms） |
| 返回 | Promise：{ shown（骨架出现过没有）, waited（等了多久）} |

## 用法

```js
import { loadWithSkeleton } from "satin-ui/components";

// 300ms 内回来就不显示骨架（不闪）；显示了就至少留 500ms；数据到了逐行替换，每行淡入
const { shown, waited } = await loadWithSkeleton(document.querySelector(".sn-sk-list"), {
  load: () => fetch("/api/shots").then((r) => r.json()),
  skeleton: '<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px"></span>…</div>'.repeat(4),
  render: (shots) => shots.map((s) => `<div class="sn-sk-row"><b>${s.title}</b></div>`).join(""),
});
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-row" style="margin-bottom:16px">
<button class="sn-btn sn-secondary" data-load="200">加载（快，200ms）</button><button class="sn-btn sn-secondary" data-load="1600">加载（慢，1.6 秒）</button>
<span class="sn-note" id="loadNote">快的那次不会闪出骨架</span>
</div><div class="sn-sk-list" id="skList"></div>
```

## 规则

- 骨架的光带 1.2 秒扫过一次，整列共用一道光，不是每块各扫各的。
- 转圈 0.9 秒一圈；按钮里的转圈至少转满一圈再停。只在按钮里和很小的区域用转圈。
- 自动保存这类用户不用察觉的等待，不显示加载，只在固定位置放一个安静的状态字。

