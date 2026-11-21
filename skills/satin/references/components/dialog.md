# 弹窗 · Dialog

> 组件 id：`dialog`　分组：浮层

只在必须停下来时用：短表单、影响大或不能撤销的确认、要先做另一个决定。从按钮那里长出来，关闭时原路缩回；焦点限制在弹窗里，Esc 取消，关闭后焦点回到按钮。点背景不会关掉，只轻轻顶一下，免得误点丢了填好的内容。

**盖在页面上、必须先处理完才能回去的一小块界面：短表单、不能撤销的确认、要先做的另一个决定。**

## 什么时候用

- 短表单：重命名、新建项目（三五个字段以内）。
- 影响大或者不能撤销的确认：删除项目、移出成员，并且要写清影响范围。
- 继续之前必须先做一个决定：关闭前保存修改吗？

## 什么时候别用

- 能撤销的操作：直接做，再用轻提示给"撤销"，不要先弹确认。（换成 `toast`）
- 单条、属于自己、不能撤销的小操作：用锚在按钮上的气泡确认。（换成 `popconfirm`）
- 长表单、要对照页面编辑：用抽屉，背后的页面保持可见。（换成 `drawer`）

## 相近的组件

- `drawer`：抽屉从右边滑进来，背后的页面还看得见，适合长表单和边看边改；不用来做确认。
- `popconfirm`：气泡确认锚在按钮上、从按钮那里展开，只问一句话，适合单条的小操作。
- `toast`：能撤销的操作直接做，用轻提示给"撤销"，不打断用户。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { setup, enhance, openDialog, closeDialog } from "satin-ui";` |
| React | `import { Dialog } from "satin-ui/react";` |
| Vue | `import { Dialog as SnDialog } from "satin-ui/vue";` |
| Svelte | `import { setup, enhance, closeDialog } from "satin-ui";` |
| Angular | `import { setup, enhance, closeDialog } from "satin-ui";` |
| Solid | `import { setup, enhance, closeDialog } from "satin-ui";` |
| Preact | `import { setup, enhance, closeDialog } from "satin-ui";` |

React、Vue 用 Dialog 组件，open 控制开关；其余框架和纯 HTML 写 `<dialog class="sn-dlg">`：触发按钮写 `data-dlg="弹窗 id"`，`enhance()` 接上，代码里用 `openDialog()`、`closeDialog()`。

## 示例（由浅入深）

### 基础用法：打开、取消、提交

触发按钮写 `data-dlg="弹窗 id"`，`enhance()` 接上：从按钮那里长出来，Esc、取消都会关。提交不会自动关，处理完自己调 `closeDialog()`。

```html
<button type="button" class="sn-btn sn-primary" data-dlg="dlg-rename">重命名</button>
<dialog class="sn-dlg" id="dlg-rename" aria-labelledby="dlg-rename-t">
  <form method="dialog">
    <div class="sn-hd"><div style="flex:1"><h3 id="dlg-rename-t">重命名项目</h3><div class="sn-sub">新名称会同步给所有协作者。</div></div></div>
    <div class="sn-bd">
      <div class="sn-field"><label class="sn-lbl" for="dlg-rename-name">项目名称</label><input class="sn-input" id="dlg-rename-name" value="雨夜车站" autocomplete="off"></div>
    </div>
    <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
  </form>
</dialog>
```

```js
import { closeDialog, toast } from "satin-ui";

const dlg = document.querySelector("#dlg-rename");
// 弹窗不会因为提交自己关：在这里保存，成功了再关
dlg.querySelector("form").addEventListener("submit", () => {
  const name = dlg.querySelector("input").value.trim();
  closeDialog(dlg);
  toast({ text: "已改名为：" + name });
});
```

### 危险确认

不能撤销的操作才确认：标题写要做的事，正文列出会一起删掉什么，主按钮用 danger 并写清动作。

```html
<button type="button" class="sn-btn sn-danger-soft" data-dlg="dlg-del" data-i="trash-2:before">删除项目…</button>
<dialog class="sn-dlg" id="dlg-del" aria-labelledby="dlg-del-t">
  <form method="dialog">
    <div class="sn-hd"><span class="sn-dlg-icon" data-i="trash-2"></span><div style="flex:1"><h3 id="dlg-del-t">删除"雨夜车站"？</h3><div class="sn-sub">删除后无法恢复，协作者也会失去访问权限。</div></div></div>
    <div class="sn-bd">
      <div class="sn-impact"><b>将一起删除</b><ul><li>12 个镜头和全部画面版本</li><li>3 段配音、2 个已导出的成片</li></ul></div>
    </div>
    <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-danger">删除项目</button></div>
  </form>
</dialog>
```

```js
import { closeDialog, toast } from "satin-ui";

const dlg = document.querySelector("#dlg-del");
dlg.querySelector("form").addEventListener("submit", () => {
  closeDialog(dlg);
  toast({ text: "已删除\"雨夜车站\"" });
});
```

### 填了内容再关：底栏原地问一句

guard 拦下 Esc 和取消：填了内容就在底栏原地问"放弃填写的内容？"，不再叠第二个弹窗；确认要关时自己调 `closeDialog()`。

```html
<button type="button" class="sn-btn sn-secondary" data-dlg="dlg-note">写备注</button>
<dialog class="sn-dlg" id="dlg-note" aria-labelledby="dlg-note-t">
  <form method="dialog">
    <div class="sn-hd"><div style="flex:1"><h3 id="dlg-note-t">给第 3 场写备注</h3></div></div>
    <div class="sn-bd"><textarea class="sn-input" rows="3" aria-label="备注" placeholder="比如：雨再大一点，站台的灯偏冷"></textarea></div>
    <div class="sn-ft sn-two">
      <div class="sn-g sn-a"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
      <div class="sn-g sn-b" inert><span>放弃填写的内容？</span><button type="button" class="sn-btn sn-ghost" data-keep>继续填写</button><button type="button" class="sn-btn sn-danger-soft" data-discard>放弃</button></div>
    </div>
  </form>
</dialog>
```

```js
import { closeDialog } from "satin-ui";

const dlg = document.querySelector("#dlg-note"), note = dlg.querySelector("textarea"), foot = dlg.querySelector(".sn-ft");
const ask = (on) => {
  foot.classList.toggle("sn-asking", on);
  foot.querySelector(".sn-g.sn-a").inert = on;
  foot.querySelector(".sn-g.sn-b").inert = !on;
  (on ? foot.querySelector("[data-keep]") : note).focus();
};
// Esc、取消都先走 guard：在问的时候再按一次就回去接着填；填了内容就问；空的直接关
dlg.guard = () => (foot.classList.contains("sn-asking") ? ask(false) : note.value.trim() ? ask(true) : closeDialog(dlg));
foot.querySelector("[data-keep]").addEventListener("click", () => ask(false));
foot.querySelector("[data-discard]").addEventListener("click", () => { closeDialog(dlg); note.value = ""; ask(false); });
dlg.querySelector("form").addEventListener("submit", () => closeDialog(dlg));
```

### 关上以后做点什么

关完会发原生的 close 事件（React 是 onClose，Vue 是 @close）：在这里同步你自己的状态。

```html
<div class="sn-row" data-ex="dlg-ev">
  <button type="button" class="sn-btn sn-secondary" data-dlg="dlg-ev-d">导出设置</button>
  <span class="sn-help" data-out>还没打开过</span>
</div>
<dialog class="sn-dlg" id="dlg-ev-d" aria-labelledby="dlg-ev-t">
  <form method="dialog">
    <div class="sn-hd"><div style="flex:1"><h3 id="dlg-ev-t">导出设置</h3><div class="sn-sub">按 Esc 或点"关闭"，看下面那行字怎么变。</div></div></div>
    <div class="sn-ft"><button type="button" class="sn-btn sn-primary" data-cancel>关闭</button></div>
  </form>
</dialog>
```

```js
const out = document.querySelector('[data-ex="dlg-ev"] [data-out]');
document.querySelector("#dlg-ev-d").addEventListener("close", () => {
  out.textContent = "关上了：" + new Date().toLocaleTimeString("zh-CN");
});
```

### 受控：开关放在自己的状态里

React 用 open + onClose，Vue 用 v-model:open；纯 HTML 和其他框架用 `data-dlg` 打开、`closeDialog()` 关。

```html
<button type="button" class="sn-btn sn-primary" data-dlg="dlg-ctl">新建项目</button>
<dialog class="sn-dlg" id="dlg-ctl" aria-labelledby="dlg-ctl-t">
  <form method="dialog">
    <div class="sn-hd"><div style="flex:1"><h3 id="dlg-ctl-t">新建项目</h3><div class="sn-sub">名称之后随时可以改。</div></div></div>
    <div class="sn-bd">
      <div class="sn-field"><label class="sn-lbl" for="dlg-ctl-name">项目名称</label><input class="sn-input" id="dlg-ctl-name" placeholder="比如：雨夜车站" autocomplete="off"></div>
    </div>
    <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">创建项目</button></div>
  </form>
</dialog>
```

```js
import { closeDialog, toast } from "satin-ui";

const dlg = document.querySelector("#dlg-ctl");
dlg.querySelector("form").addEventListener("submit", () => {
  const name = dlg.querySelector("input").value.trim() || "未命名项目";
  closeDialog(dlg);
  toast({ text: "已创建：" + name });
});
```

React 的写法：

```jsx
import { useState } from "react";
import { Button, Dialog, toast } from "satin-ui/react";

export default function NewProject() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const create = () => { setOpen(false); toast({ text: "已创建：" + (name.trim() || "未命名项目") }); };
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>新建项目</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="新建项目"
        description="名称之后随时可以改。"
        footer={<>
          <Button variant="ghost" onClick={() => setOpen(false)}>取消</Button>
          <Button variant="primary" onClick={create}>创建项目</Button>
        </>}
      >
        <div className="sn-field">
          <label className="sn-lbl" htmlFor="new-name">项目名称</label>
          <input className="sn-input" id="new-name" placeholder="比如：雨夜车站" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </Dialog>
    </>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Button as SnButton, Dialog as SnDialog, toast } from "satin-ui/vue";
const open = ref(false), name = ref("");
const create = () => { open.value = false; toast({ text: "已创建：" + (name.value.trim() || "未命名项目") }); };
</script>

<template>
  <SnButton variant="primary" @click="open = true">新建项目</SnButton>
  <SnDialog v-model:open="open" title="新建项目" description="名称之后随时可以改。">
    <div class="sn-field">
      <label class="sn-lbl" for="new-name">项目名称</label>
      <input class="sn-input" id="new-name" placeholder="比如：雨夜车站" autocomplete="off" v-model="name" />
    </div>
    <template #footer>
      <SnButton variant="ghost" @click="open = false">取消</SnButton>
      <SnButton variant="primary" @click="create">创建项目</SnButton>
    </template>
  </SnDialog>
</template>
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `open` | `boolean` | false | 是 | 开着还是关着。React 里关上以后（Esc、取消、程序关）会调 onClose，在里面把它改回 false；Vue 用 v-model:open。纯 HTML 写法没有这个属性：触发按钮写 `data-dlg`，或者调 `openDialog()`。 | React：`open`；Vue：`v-model:open / open` |
| `title` | `string` | — | 否 | 标题，写要做的事："删除"雨夜车站"？"。React 里可以是任意节点。 | React：`title`；Vue：`title`；标记：`.sn-hd h3` |
| `description` | `string` | — | 否 | 标题下面一句说明：后果、影响范围。 | React：`description`；Vue：`description`；标记：`.sn-hd .sn-sub` |
| `footer` | `React.ReactNode` | — | 否 | 底部的按钮（主按钮放最右）。Vue 写在 #footer 插槽里。 | React：`footer`；标记：`.sn-ft` |
| `className` | `string` | — | 否 | 加在 `<dialog>` 上的类名，比如 sn-wide（宽 560，默认 440）。 | React：`className`；标记：`<dialog class="sn-dlg sn-wide">` |
| `guard` | `(close: () => void) => void` | — | 否 | 关之前拦一下（Esc、取消、×）：比如填了内容就先在底栏问一句。React 里给的 close 调了才真关；纯 HTML 里 guard 不带参数，确认要关时自己调 `closeDialog(弹窗)`。（例：`guard={(close) => (dirty ? setAsking(true) : close())}`） | React：`guard`；标记：`弹窗元素的 guard 属性：dialog.guard = () => {}` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `close` | `—` | 关完以后：Esc、取消、`data-x`、程序关都算。 | React：`onClose`；Vue：`@close（v-model:open 同时改成 false）`；Angular：`(close)`；Svelte：`onclose`；Solid：`onClose`；Preact：`onClose`；纯 HTML：`<dialog> 的原生 close 事件：addEventListener("close")` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `default` | 弹窗的内容：字段、说明。 | React：`children`；Vue：`默认插槽`；标记：`.sn-bd` |
| `footer` | 底部的按钮（React 里是 footer 属性）。 | Vue：`#footer`；标记：`.sn-ft` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `openDialog(dialog: HTMLDialogElement, trigger?: HTMLElement \| null): void` | `satin-ui` | 打开：从触发按钮那里长出来，焦点到第一个输入框（没有就到底部的主按钮）。不给触发按钮就从正中长出来。 |
| `closeDialog(dialog: HTMLDialogElement, refocus?: boolean): Promise<void>` | `satin-ui` | 关上：原路缩回，动画走完才 resolve；refocus（默认 true）把焦点还给打开它的按钮。不经过 guard。 |
| `wireDialog(dialog: HTMLDialogElement): void` | `satin-ui` | 接上 Esc、取消、`data-x`、点背景只顶一下（openDialog、enhance、bindOverlays 会自动接，一般不用调）。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-r-xl`（全局令牌） | 弹窗圆角 | 16px |
| `--sn-overlay`（全局令牌） | 弹窗底色 | 浮层表面色 |
| `--sn-e2`（全局令牌） | 弹窗阴影（对话框一层） | 对话框阴影 |
| `--sn-scrim`（全局令牌） | 背景遮罩 | 浅色 30% 黑、深色 60% 黑 |

| 类名 / 属性 | 作用 |
|---|---|
| `<dialog class="sn-dlg">` | 弹窗；写 `aria-labelledby` 指向标题 |
| `.sn-wide` | 宽一些（560，默认 440） |
| `<form method="dialog">` | 包住内容；提交不会自己关，在 submit 里处理完再 `closeDialog()` |
| `.sn-hd（h3 + .sn-sub）` | 标题和说明；右上角可以放一个带 `data-x` 的关闭按钮 |
| `.sn-bd` | 内容 |
| `.sn-ft（.sn-left 放最左）` | 底部按钮；主按钮在最右，"不保存"这类第三个出口加 `.sn-left` |
| `.sn-ft.sn-two > .sn-g.sn-a / .sn-g.sn-b，.sn-asking` | 底栏原地问一句：两组按钮叠在一起，加 `.sn-asking` 换成第二组 |
| `.sn-dlg-icon / .sn-impact` | 危险确认的图标 / 影响范围的列表 |
| `[data-dlg="弹窗 id"]` | 打开弹窗的按钮（`enhance()` 接上） |
| `[data-x] / [data-cancel]` | 关闭（先经过 guard） |

## 导出的类型

`DialogProps`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Esc |  | 取消：有 guard 先走 guard，没有就关。 |
| Tab / Shift + Tab |  | 焦点在弹窗里循环（浏览器原生的模态）。 |
| Enter（在输入框里） |  | 提交表单；弹窗不会自己关，在 submit 里处理完再关。 |

## 无障碍

- 原生 `<dialog>`，用 `showModal()` 打开：背后的页面点不了，读屏只读弹窗里的内容。
- 打开时焦点到第一个输入框（复选框除外），没有就到底部的主按钮。
- 关上后焦点回到打开它的按钮。
- 给 `<dialog>` 写 `aria-labelledby` 指向标题。还没做到：React、Vue 的 Dialog 组件没有自动加，读屏读不出弹窗的名字。
- 点背景不关，只轻轻顶一下，免得误点丢了填好的内容。

## 设计规范

- 这样做：只在必须停下来时用：短表单、影响大或不能撤销的确认、要先做的另一个决定。
- 这样做：按钮靠右，主按钮在最右；"不保存"这类第三个出口放最左。
- 这样做：危险确认把影响范围列出来；影响别人或者数据多的，要输入项目名才能删。
- 这样做：填了内容再关，先在底栏原地问一句"放弃填写的内容？"。
- 不要：能撤销的操作也弹确认：直接做，再用轻提示给"撤销"。
- 不要：弹窗里再叠一个弹窗。
- 不要：标题只写"提示""确认"。
- 不要：背景遮罩加毛玻璃、弹窗加彩色光晕。（规则 `no-colored-shadow`）

文案：

- 标题写要做的事："删除"雨夜车站"？"
- 按钮写动作："删除项目"，不写"确定"。
- 说明写后果："删除后无法恢复，协作者也会失去访问权限。"

| 动效 | 曲线 | 时长 |
|---|---|---|
| 打开：从按钮那边放大（0.96 → 1） | `--sn-ease-out-strong` | 300ms |
| 打开：淡入 | `--sn-ease-out` | 140ms |
| 关上：淡出并缩到 0.97 | `--sn-ease-in` | 180ms |
| 背景遮罩出现 / 消失 | `--sn-ease-out / --sn-ease-in` | 200ms / 180ms |
| 点背景：顶一下（放大 1.5%） | `--sn-ease-out` | 260ms |

## 验收要点

- 标题 17/600，说明 13；按钮靠右，主按钮在最右；"不保存"这类第三个出口放最左。
- 危险确认把影响范围列出来；影响他人或数据多的，要输入项目名才能删。
- 弹窗里填了内容再关，先在底栏原地问一句"放弃填写的内容？"，不再叠第二个弹窗。

## 规则

- 标题 17/600，说明 13；按钮靠右，主按钮在最右；"不保存"这类第三个出口放最左。
- 危险确认把影响范围列出来；影响他人或数据多的，要输入项目名才能删。
- 弹窗里填了内容再关，先在底栏原地问一句"放弃填写的内容？"，不再叠第二个弹窗。

