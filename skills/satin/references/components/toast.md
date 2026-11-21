# 轻提示 · Toast

> 组件 id：`toast`　分组：反馈

只回应用户刚做的事。三种：状态（确认结果，3 秒消失）、操作（能撤销的事直接做，给 5 秒撤销，一圈倒计时）、进度（先显示进度，完成后原地变成结果）。进入时下落 10px、从模糊变清晰；悬停或聚焦时暂停计时。

**底部中间出现一句话，告诉用户刚才的操作有了结果：状态提示 3 秒后自己消失；能撤销的带"撤销"和倒计时环（鼠标移上去暂停）；长任务先出进度，做完原地换成结果。反色底，一眼能和页面分开。**

## 什么时候用

- 操作完成的回执："已保存""已复制链接"。
- 能撤销的操作：直接做，再给"撤销"（不弹确认）。
- 几秒到十几秒的后台任务：进度 → 结果。

## 什么时候别用

- 需要用户处理、不能自己消失的消息（邀请、失败）：用通知。（换成 `notify`）
- 表单里某一项错了：写在字段下面。（换成 `field`）
- 影响整页的状态（离线、额度用完）：用横幅。（换成 `banner`）

## 相近的组件

- `notify`：通知在右上角、不自己消失、能放几个按钮；轻提示一句话、自己消失。
- `popconfirm`：不能撤销的操作才确认；能撤销的用轻提示给"撤销"。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { toast } from "satin-ui"; // 入口里调过 setup()` |
| React | `import { toast } from "satin-ui/react";` |
| Vue | `import { toast } from "satin-ui/vue";` |
| Svelte | `import { toast } from "satin-ui"; // 入口里调过 setup()` |
| Angular | `import { toast } from "satin-ui"; // 入口里调过 setup()` |
| Solid | `import { toast } from "satin-ui"; // 入口里调过 setup()` |
| Preact | `import { toast } from "satin-ui/react"; // 经 preact/compat` |

- React：`toast(选项)` 是普通函数，在事件里直接调，返回句柄（`update`、`pause`、`close`）；不用放组件、不用 Provider（第一次调时自己装上提示层）。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `toast`，在事件里直接调。
- Vue：`toast(选项)` 是普通函数，在 `<script setup>` 里引进来、事件里直接调，返回句柄。
- Svelte：`toast(选项)` 从 `satin-ui` 引进来，在事件里直接调（入口里调过 `setup()`）。
- Angular：`toast(选项)` 从 `satin-ui` 引进来，在组件方法里直接调（入口里调过 `setup()`）。
- Solid：`toast(选项)` 从 `satin-ui` 引进来，在事件里直接调（入口里调过 `setup()`）。
- 纯 HTML：`toast({ text })` 从 `satin-ui` 引进来直接调；返回的句柄 `update(选项)` 原地改内容（进度 → 结果、撤销 → 已恢复）、`pause(true)` 暂停倒计时、`close()` 关上。

## 示例（由浅入深）

### 最简单的用法

在事件里调一下：底部中间出现，3 秒后自己消失。

```html
<button type="button" class="sn-btn sn-secondary">存草稿</button>
```

纯 HTML 的写法：

```jsx
<button type="button" class="sn-btn sn-secondary" id="toast-basic-btn">存草稿</button>

<script type="module">
  import { toast } from "satin-ui";
  // 状态提示：底部中间出现，3 秒后自己消失
  document.getElementById("toast-basic-btn").addEventListener("click", () => {
    toast({ text: "已保存到草稿箱" });
  });
</script>
```

React 的写法：

```jsx
import { Button, toast } from "satin-ui/react";

// 状态提示：底部中间出现，3 秒后自己消失
const run = () => {
  toast({ text: "已保存到草稿箱" });
};

export default function SaveDraft() {
  return <Button onClick={run}>存草稿</Button>;
}
```

Vue 的写法：

```vue
<script setup>
import { Button, toast } from "satin-ui/vue";

// 状态提示：底部中间出现，3 秒后自己消失
const run = () => {
  toast({ text: "已保存到草稿箱" });
};
</script>

<template>
  <Button @click="run">存草稿</Button>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { toast } from "satin-ui";

  // 状态提示：底部中间出现，3 秒后自己消失
  const run = () => {
    toast({ text: "已保存到草稿箱" });
  };
</script>

<button type="button" class="sn-btn sn-secondary" onclick={run}>存草稿</button>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";
import { toast } from "satin-ui";

@Component({
  selector: "demo-toast-basic",
  template: `<button type="button" class="sn-btn sn-secondary" (click)="run()">存草稿</button>`,
})
export class ToastBasicComponent {
  // 状态提示：底部中间出现，3 秒后自己消失
  run() {
    toast({ text: "已保存到草稿箱" });
  }
}
```

Solid 的写法：

```jsx
import { toast } from "satin-ui";

// 状态提示：底部中间出现，3 秒后自己消失
const run = () => {
  toast({ text: "已保存到草稿箱" });
};

export default function SaveDraft() {
  return <button type="button" class="sn-btn sn-secondary" onClick={run}>存草稿</button>;
}
```

Preact 的写法：

```jsx
import { Button, toast } from "satin-ui/react";

// 状态提示：底部中间出现，3 秒后自己消失
const run = () => {
  toast({ text: "已保存到草稿箱" });
};

export default function SaveDraft() {
  return <Button onClick={run}>存草稿</Button>;
}
```

### 带"撤销"

能撤销的操作不确认：直接做，再给"撤销"；点了原地换成"已恢复"。

```html
<button type="button" class="sn-btn sn-secondary">归档</button>
```

纯 HTML 的写法：

```jsx
<button type="button" class="sn-btn sn-secondary" id="toast-action-btn">归档</button>

<script type="module">
  import { toast } from "satin-ui";
  document.getElementById("toast-action-btn").addEventListener("click", () => {
    toast({
      kind: "action",
      text: "已归档“雨夜车站”",
      // 能撤销的操作不确认：直接做，再给"撤销"（5 秒倒计时，鼠标移上去暂停）
      action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复“雨夜车站”", done: true, duration: 2000 }) },
    });
  });
</script>
```

React 的写法：

```jsx
import { Button, toast } from "satin-ui/react";

const run = () => {
  toast({
    kind: "action",
    text: "已归档“雨夜车站”",
    // 能撤销的操作不确认：直接做，再给"撤销"（5 秒倒计时，鼠标移上去暂停）
    action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复“雨夜车站”", done: true, duration: 2000 }) },
  });
};

export default function ArchiveProject() {
  return <Button onClick={run}>归档</Button>;
}
```

Vue 的写法：

```vue
<script setup>
import { Button, toast } from "satin-ui/vue";

const run = () => {
  toast({
    kind: "action",
    text: "已归档“雨夜车站”",
    // 能撤销的操作不确认：直接做，再给"撤销"（5 秒倒计时，鼠标移上去暂停）
    action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复“雨夜车站”", done: true, duration: 2000 }) },
  });
};
</script>

<template>
  <Button @click="run">归档</Button>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { toast } from "satin-ui";

  const run = () => {
    toast({
      kind: "action",
      text: "已归档“雨夜车站”",
      // 能撤销的操作不确认：直接做，再给"撤销"（5 秒倒计时，鼠标移上去暂停）
      action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复“雨夜车站”", done: true, duration: 2000 }) },
    });
  };
</script>

<button type="button" class="sn-btn sn-secondary" onclick={run}>归档</button>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";
import { toast } from "satin-ui";

@Component({
  selector: "demo-toast-action",
  template: `<button type="button" class="sn-btn sn-secondary" (click)="run()">归档</button>`,
})
export class ToastActionComponent {
  run() {
    toast({
      kind: "action",
      text: "已归档“雨夜车站”",
      // 能撤销的操作不确认：直接做，再给"撤销"（5 秒倒计时，鼠标移上去暂停）
      action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复“雨夜车站”", done: true, duration: 2000 }) },
    });
  }
}
```

Solid 的写法：

```jsx
import { toast } from "satin-ui";

const run = () => {
  toast({
    kind: "action",
    text: "已归档“雨夜车站”",
    // 能撤销的操作不确认：直接做，再给"撤销"（5 秒倒计时，鼠标移上去暂停）
    action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复“雨夜车站”", done: true, duration: 2000 }) },
  });
};

export default function ArchiveProject() {
  return <button type="button" class="sn-btn sn-secondary" onClick={run}>归档</button>;
}
```

Preact 的写法：

```jsx
import { Button, toast } from "satin-ui/react";

const run = () => {
  toast({
    kind: "action",
    text: "已归档“雨夜车站”",
    // 能撤销的操作不确认：直接做，再给"撤销"（5 秒倒计时，鼠标移上去暂停）
    action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复“雨夜车站”", done: true, duration: 2000 }) },
  });
};

export default function ArchiveProject() {
  return <Button onClick={run}>归档</Button>;
}
```

### 进度 → 结果

几秒的后台任务：先出进度，做完了原地换成结果，不连弹两条。

```html
<button type="button" class="sn-btn sn-primary">导出成片</button>
```

纯 HTML 的写法：

```jsx
<button type="button" class="sn-btn sn-primary" id="toast-progress-btn">导出成片</button>

<script type="module">
  import { toast } from "satin-ui";
  document.getElementById("toast-progress-btn").addEventListener("click", () => {
    // 进度提示：先出进度环和百分比，做完了原地换成结果
    const t = toast({ kind: "progress", text: "正在导出 第三集.mp4", progress: 0 });
    let p = 0;
    const timer = setInterval(() => {
      p = Math.min(1, p + 0.2);
      if (p < 1) return t.update({ progress: p });
      clearInterval(timer);
      t.update({ kind: "status", text: "已导出到“下载”", done: true, duration: 3000 });
    }, 400);
  });
</script>
```

React 的写法：

```jsx
import { Button, toast } from "satin-ui/react";

const run = () => {
  // 进度提示：先出进度环和百分比，做完了原地换成结果
  const t = toast({ kind: "progress", text: "正在导出 第三集.mp4", progress: 0 });
  let p = 0;
  const timer = setInterval(() => {
    p = Math.min(1, p + 0.2);
    if (p < 1) return t.update({ progress: p });
    clearInterval(timer);
    t.update({ kind: "status", text: "已导出到“下载”", done: true, duration: 3000 });
  }, 400);
};

export default function ExportShots() {
  return <Button variant="primary" onClick={run}>导出成片</Button>;
}
```

Vue 的写法：

```vue
<script setup>
import { Button, toast } from "satin-ui/vue";

const run = () => {
  // 进度提示：先出进度环和百分比，做完了原地换成结果
  const t = toast({ kind: "progress", text: "正在导出 第三集.mp4", progress: 0 });
  let p = 0;
  const timer = setInterval(() => {
    p = Math.min(1, p + 0.2);
    if (p < 1) return t.update({ progress: p });
    clearInterval(timer);
    t.update({ kind: "status", text: "已导出到“下载”", done: true, duration: 3000 });
  }, 400);
};
</script>

<template>
  <Button variant="primary" @click="run">导出成片</Button>
</template>
```

Svelte 的写法：

```jsx
<script>
  import { toast } from "satin-ui";

  const run = () => {
    // 进度提示：先出进度环和百分比，做完了原地换成结果
    const t = toast({ kind: "progress", text: "正在导出 第三集.mp4", progress: 0 });
    let p = 0;
    const timer = setInterval(() => {
      p = Math.min(1, p + 0.2);
      if (p < 1) return t.update({ progress: p });
      clearInterval(timer);
      t.update({ kind: "status", text: "已导出到“下载”", done: true, duration: 3000 });
    }, 400);
  };
</script>

<button type="button" class="sn-btn sn-primary" onclick={run}>导出成片</button>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";
import { toast } from "satin-ui";

@Component({
  selector: "demo-toast-progress",
  template: `<button type="button" class="sn-btn sn-primary" (click)="run()">导出成片</button>`,
})
export class ToastProgressComponent {
  run() {
    // 进度提示：先出进度环和百分比，做完了原地换成结果
    const t = toast({ kind: "progress", text: "正在导出 第三集.mp4", progress: 0 });
    let p = 0;
    const timer = setInterval(() => {
      p = Math.min(1, p + 0.2);
      if (p < 1) return t.update({ progress: p });
      clearInterval(timer);
      t.update({ kind: "status", text: "已导出到“下载”", done: true, duration: 3000 });
    }, 400);
  }
}
```

Solid 的写法：

```jsx
import { toast } from "satin-ui";

const run = () => {
  // 进度提示：先出进度环和百分比，做完了原地换成结果
  const t = toast({ kind: "progress", text: "正在导出 第三集.mp4", progress: 0 });
  let p = 0;
  const timer = setInterval(() => {
    p = Math.min(1, p + 0.2);
    if (p < 1) return t.update({ progress: p });
    clearInterval(timer);
    t.update({ kind: "status", text: "已导出到“下载”", done: true, duration: 3000 });
  }, 400);
};

export default function ExportShots() {
  return <button type="button" class="sn-btn sn-primary" onClick={run}>导出成片</button>;
}
```

Preact 的写法：

```jsx
import { Button, toast } from "satin-ui/react";

const run = () => {
  // 进度提示：先出进度环和百分比，做完了原地换成结果
  const t = toast({ kind: "progress", text: "正在导出 第三集.mp4", progress: 0 });
  let p = 0;
  const timer = setInterval(() => {
    p = Math.min(1, p + 0.2);
    if (p < 1) return t.update({ progress: p });
    clearInterval(timer);
    t.update({ kind: "status", text: "已导出到“下载”", done: true, duration: 3000 });
  }, 400);
};

export default function ExportShots() {
  return <Button variant="primary" onClick={run}>导出成片</Button>;
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `text` | `string` | — | 是 | 一句话：说结果，不说过程。 | createXxx 选项：`text` |
| `kind` | `"status" \| "action" \| "progress"` | "status" | 否 | status：结果回执（3 秒）；action：带一个按钮和倒计时环（5 秒，鼠标移上去暂停）；progress：进度环 + 百分比，直到 update 成结果。 | createXxx 选项：`kind` |
| `tone` | `"ok" \| "danger" \| "info"` | status 是 "ok" | 否 | 图标的颜色：成功、失败、信息。 | createXxx 选项：`tone` |
| `icon` | `string` | 按 tone | 否 | 换图标（Satin 的图标名）。 | createXxx 选项：`icon` |
| `duration` | `number` | 3000（action 5000） | 否 | 多少毫秒后自己消失。 | createXxx 选项：`duration` |
| `action` | `{ label: string; run(t: ToastHandle): void }` | — | 否 | 按钮：`label` 写"撤销""查看"，点了调 `run(句柄)`。 | createXxx 选项：`action` |
| `progress` | `number` | 0 | 否 | 进度 0～1（kind 是 progress 时）。 | createXxx 选项：`progress` |
| `alert` | `boolean` | false | 否 | 读屏马上打断去读（`role="alert"`）：只给失败、要紧的。默认是 `role="status"`。 | createXxx 选项：`alert` |
| `done` | `boolean` | false | 否 | update 成结果时扫一道光泽（进度做完、撤销完成）。 | createXxx 选项：`done` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `toast(o: ToastOptions): ToastHandle` | `satin-ui` | 弹出一条轻提示，返回句柄：`update(选项)` 原地改内容，`pause(on)` 暂停 / 继续倒计时，`close()` 关上；`el` 是这条的元素。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-tip-bg / --sn-tip-fg`（全局令牌） | 反色底 / 字（和文字提示同一套） | #1d1d1f / 白 |
| `--sn-success / --sn-danger`（全局令牌） | 成功、失败图标的颜色 | 绿 / 红 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-toast` | 一条轻提示（role="status"，alert 时 role="alert"） |
| `.sn-toasts` | 放轻提示的层（自己建，不用写） |

## 导出的类型

`ToastOptions`、`ToastHandle`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 带按钮的轻提示：焦点能走到"撤销"上（不抢焦点）。 |

## 无障碍

- `role="status"`（读屏读完手上的再读）；`alert: true` 时 `role="alert"`。
- 不抢焦点；倒计时在鼠标移上去、按钮聚焦时暂停。
- 一句话说完；按钮文字写动作（"撤销"），不写"确定"。

## 设计规范

- 这样做：说结果："已归档“雨夜车站”"。
- 这样做：能撤销的直接做、给"撤销"，不弹确认。
- 这样做：同一件事更新同一条（进度 → 结果），不连弹好几条。
- 不要：用轻提示说表单哪一项错了。（规则 `no-overlap`）
- 不要：成功用绿色大块底、加 emoji。（规则 `status-color`）

文案：

- "已……"开头说结果；失败说原因和下一步："没导出去：磁盘满了"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 从下面升上来、淡入 | `ease.outStrong` | 300ms |
| 收起 | `ease.in` | 200ms |
| 成功时扫一道光泽 | `ease.out` | 600ms |

## 验收要点

- 和 Tooltip 同一种反色底，一眼能和页面内容分开；最多同时 3 条，新的在最靠边的位置，旧的让开。
- 离开 200ms ease.in；光泽只在"完成"的那一刻扫过一次。
- 不用 Toast 的情况：必须修好的问题（失败留在条目上）、不可撤销的操作（事前确认）、不是刚才的操作引起的（用通知）。

## 规则

- 和 Tooltip 同一种反色底，一眼能和页面内容分开；最多同时 3 条，新的在最靠边的位置，旧的让开。
- 离开 200ms `ease.in`；光泽只在"完成"的那一刻扫过一次。
- 不用 Toast 的情况：必须修好的问题（失败留在条目上）、不可撤销的操作（事前确认）、不是刚才的操作引起的（用通知）。

