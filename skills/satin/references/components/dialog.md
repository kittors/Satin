# 弹窗 · Dialog

> 组件 id：`dialog`　分组：浮层

只在必须停下来时用：短表单、影响大或不能撤销的确认、要先做另一个决定。从按钮那里长出来，关闭时原路缩回；焦点限制在弹窗里，Esc 取消，关闭后焦点回到按钮。点背景不会关掉，只轻轻顶一下，免得误点丢了填好的内容。

## 验收要点

- 标题 17/600，说明 13；按钮靠右，主按钮在最右；"不保存"这类第三个出口放最左。
- 危险确认把影响范围列出来；影响他人或数据多的，要输入项目名才能删。
- 弹窗里填了内容再关，先在底栏原地问一句"放弃填写的内容？"，不再叠第二个弹窗。

## 写法

### 函数

| 名称 | 说明 |
|---|---|
| openDialog(弹窗, 触发按钮) | 从按钮那里长出来（只动 transform 和 opacity） |
| closeDialog(弹窗, refocus = true) | 原路缩回，焦点回到按钮；返回 Promise（动画走完才 resolve） |
| 弹窗.guard = () => {} | 挂在弹窗上：Esc、取消、× 都先调它（比如有填写内容先问一句） |

### 标记

| 写法 | 说明 |
|---|---|
|  | 弹窗；里面 .sn-hd 标题、.sn-bd 内容、.sn-ft 按钮（主按钮在最右） |
| [data-dlg="弹窗 id"] | 打开弹窗的按钮（bindOverlays 接上） |
| [data-x] / [data-cancel] | 关闭（走 guard） |
| 点背景 | 只“顶一下”提示，不关（避免误关丢内容） |

## 用法

```html
<button class="sn-btn sn-primary" data-dlg="dlg-new">新建项目</button>

<dialog class="sn-dlg" id="dlg-new" aria-labelledby="dn-t">
  <form method="dialog" novalidate>
    <div class="sn-hd">
      <div style="flex:1"><h3 id="dn-t">新建项目</h3><div class="sn-sub">名称之后随时可以改。</div></div>
      <button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-i="x"></button>
    </div>
    <div class="sn-bd">
      <div class="sn-field"><label class="sn-lbl" for="dn-name">项目名称</label><input class="sn-input" id="dn-name"></div>
    </div>
    <div class="sn-ft">
      <button type="button" class="sn-btn sn-ghost" data-cancel>取消</button>
      <button type="submit" class="sn-btn sn-primary">创建项目</button>
    </div>
  </form>
</dialog>
```

```js
import { setup } from "satin-ui";
import { bindOverlays, openDialog, closeDialog, busy } from "satin-ui/components";

setup(); // 页面级行为（Esc、浮层栈），整页调一次

// [data-dlg="弹窗 id"] 打开：从按钮那里长出来，关闭时原路缩回，焦点回到按钮
// 弹窗里的 [data-x]、[data-cancel] 和 Esc 关闭；点背景只"顶一下"，不关
bindOverlays(document);

const dlg = document.querySelector("#dlg-new"), name = dlg.querySelector("#dn-name");

// 关闭前先问一句：挂一个 guard，Esc / 取消 / 点 × 都会先调它
dlg.guard = () => (name.value.trim() ? askDiscard() : closeDialog(dlg));

dlg.querySelector("form").addEventListener("submit", async () => {
  await busy(dlg.querySelector(".sn-ft .sn-primary"), createProject(name.value));
  closeDialog(dlg);
});

// 不用标记也行：openDialog(弹窗, 触发按钮)
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-row">
<button class="sn-btn sn-primary" data-dlg="dlg-new" data-i="plus:before">新建项目</button>
<button class="sn-btn sn-danger-soft" data-dlg="dlg-del" data-i="trash-2:before">删除项目…</button>
<button class="sn-btn sn-secondary" data-dlg="dlg-unsaved">关闭编辑器</button>
</div>
```

## 规则

- 标题 17/600，说明 13；按钮靠右，主按钮在最右；"不保存"这类第三个出口放最左。
- 危险确认把影响范围列出来；影响他人或数据多的，要输入项目名才能删。
- 弹窗里填了内容再关，先在底栏原地问一句"放弃填写的内容？"，不再叠第二个弹窗。

