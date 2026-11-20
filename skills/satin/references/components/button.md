# 按钮 · Button

> 组件 id：`button`　分组：按钮

扁平：纯色面或 1px 细边，不用渐变和投影。悬停加深一档，按下再加深一档并轻轻缩一下。6 种变体由强到弱，每个区域只放一个主按钮。顶栏"评审"可以切换圆角来比较。

## 验收要点

- **等待**：转圈贴在文字左边，文字和按钮宽度都不动；300ms 内完成就不显示转圈，出现后至少留 500ms。
- **成功**：对勾弹出，光泽扫过一次，只在"完成"的时刻用。
- **禁用**：整体降到 45%，悬停时用 Tooltip 说明原因，不在旁边另加一行灰字。
- **文字**：写明动作（"删除项目"），不写"确定"；按钮文字不换行。

## 写法

### 变体和尺寸

| 写法 | 说明 |
|---|---|
| .sn-btn.sn-primary / sn-secondary / sn-tertiary / sn-ghost / sn-danger / sn-danger-soft | 6 种变体，由强到弱；每个区域只放一个主按钮 |
| .sn-sm / （默认）/ .sn-lg | 高 28 / 32 / 40 |
| .sn-ibtn | 只有图标的按钮（要写 data-tip 或 aria-label） |
| data-i="图标名:before" | 图标在文字前；:after 在后；data-i 由 injectIcons 换成图标 |
| aria-disabled="true" + data-tip | 禁用：点了不响应，只把原因亮出来（不用 disabled，免得读屏跳过；要整页调过 setup()） |

### 函数

| 名称 | 说明 |
|---|---|
| buttonHTML({ text, variant, size, icon, tip, disabled }) | 生成按钮的标记（纯字符串，服务端渲染也能用），和手写的一模一样 |
| busy(按钮, 毫秒或 Promise) | 等待：300ms 内回来不转圈，转圈出现后至少留 500ms；期间点不了。返回 Promise |
| succeed(按钮) | 原地换成对勾，一会儿换回文字 |
| prepBusy(按钮) | 提前把内容包好（避免第一次等待时排版跳一下） |

## 用法

```html
<!-- 可等待的按钮：busy() 会把内容包成 .sn-label，转圈和对勾都放在里面 -->
<button class="sn-btn sn-primary" id="save">保存修改</button>
```

```js
import { busy, succeed } from "satin-ui/components";
import "satin-ui/css/buttons.css";

const save = document.querySelector("#save");
save.addEventListener("click", async () => {
  // 300ms 内回来不转圈；转圈出现后至少留 500ms；等待期间点不了
  await busy(save, fetch("/api/projects/42", { method: "PUT" }));
  succeed(save); // 原地换成对勾，一会儿换回文字
});
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

### 图标位置和下拉

```html
<div class="sn-row">
<button class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
<button class="sn-btn sn-secondary" data-i="upload:before">导入原文</button>
<button class="sn-btn sn-secondary" data-i="arrow-right:after">下一步</button>
<div class="sn-select sn-inline-menu"><button class="sn-btn sn-secondary" data-menubtn="" data-prefix="排序：" data-i="chevron-down:caret">排序：最近更新</button>
<div class="sn-menu" role="menu"><div class="sn-item sn-sel" data-i="check:chk">最近更新</div><div class="sn-item">名称</div><div class="sn-item">创建时间</div></div></div>
</div>
```

### 试一下：等待 → 成功

```html
<div class="sn-row">
<button class="sn-btn sn-primary" data-demo="save"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7" /></svg><span class="sn-txt">保存修改</span></span></button>
<button class="sn-btn sn-secondary" data-demo="quick"><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7" /></svg><span class="sn-txt">刷新（很快完成）</span></span></button>
<button class="sn-btn sn-danger" data-demo="del"><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7" /></svg><span class="sn-txt">删除项目</span></span></button>
<span class="sn-note">"刷新"在 300ms 内完成，所以不出现转圈；另外两个出现转圈后至少留 500ms。</span>
</div>
```

## 规则

- **等待**：转圈贴在文字左边，文字和按钮宽度都不动；300ms 内完成就不显示转圈，出现后至少留 500ms。
- **成功**：对勾弹出，光泽扫过一次，只在"完成"的时刻用。
- **禁用**：整体降到 45%，悬停时用 Tooltip 说明原因，不在旁边另加一行灰字。
- **文字**：写明动作（"删除项目"），不写"确定"；按钮文字不换行。

