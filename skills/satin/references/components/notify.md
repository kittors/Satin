# 通知 · Notification

> 组件 id：`notify`　分组：反馈

不是用户刚才的操作引起的：后台任务完成或失败、额度、更新、审核。显示在右上角，直到用户处理或关闭；铃铛和窗口标题都显示数量，铃铛里能找回全部。新的一条从上方落到旧的上面，旧的后退、每层露出 12px，最多 3 层；指针移上去就展开成列表。

**右上角滑进来的卡片：标题、一两句说明、时间，可以带几个按钮；不自己消失，点 × 或按钮关上。几条叠在一起时往下排，关掉一条其余的补位。**

## 什么时候用

- 需要用户看到、可能要处理的事：导出完成、被邀请协作、生成失败。
- 用户不在这个页面时发生的事（后台任务完成）。

## 什么时候别用

- 刚点的操作的回执：用轻提示。（换成 `toast`）
- 整页的状态（离线、额度用完）：用横幅。（换成 `banner`）

## 相近的组件

- `toast`：轻提示是回执、自己消失；通知要人看到、能处理。
- `banner`：横幅钉在页面顶上、一直在；通知一条一条来。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { notify } from "satin-ui"; // 入口里调过 setup()` |
| React | `import { notify } from "satin-ui/react";` |
| Vue | `import { notify } from "satin-ui/vue";` |
| Svelte | `import { notify } from "satin-ui"; // 入口里调过 setup()` |
| Angular | `import { notify } from "satin-ui"; // 入口里调过 setup()` |
| Solid | `import { notify } from "satin-ui"; // 入口里调过 setup()` |
| Preact | `import { notify } from "satin-ui/react"; // 经 preact/compat` |

- React：`notify(选项)` 是普通函数，在事件、请求回来的地方直接调，返回句柄（`close()`）。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `notify`。
- Vue：`notify(选项)` 是普通函数，引进来直接调，返回句柄。
- Svelte：`notify(选项)` 从 `satin-ui` 引进来直接调（入口里调过 `setup()`）。
- Angular：`notify(选项)` 从 `satin-ui` 引进来，在组件方法里直接调。
- Solid：`notify(选项)` 从 `satin-ui` 引进来直接调。
- 纯 HTML：`notify({ title, body, tone, time, actions })` 从 `satin-ui` 引进来直接调；按钮的 `run(卡片)` 里调 `card.close()` 关上。

## 示例（由浅入深）

### 最简单的用法

标题、说明、时间：右上角滑进来，不自己消失，点 × 关上。

```html
<button type="button" class="sn-btn sn-secondary">模拟导出完成</button>
```

纯 HTML 的写法：

```html
<button type="button" class="sn-btn sn-secondary" id="notify-basic-btn">模拟导出完成</button>

<script type="module">
  import { notify } from "satin-ui";
  // 通知：右上角滑进来，不自己消失，点 × 关
  document.getElementById("notify-basic-btn").addEventListener("click", () => {
    notify({ title: "第三集导出完成", body: "已保存到“下载”文件夹，1080p，12 分 36 秒。", tone: "ok", time: "刚刚" });
  });
</script>
```

React 的写法：

```tsx
import { Button, notify } from "satin-ui/react";

// 通知：右上角滑进来，不自己消失，点 × 关
const run = () => {
  notify({ title: "第三集导出完成", body: "已保存到“下载”文件夹，1080p，12 分 36 秒。", tone: "ok", time: "刚刚" });
};

export default function ExportDone() {
  return <Button onClick={run}>模拟导出完成</Button>;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Button, notify } from "satin-ui/vue";

// 通知：右上角滑进来，不自己消失，点 × 关
const run = () => {
  notify({ title: "第三集导出完成", body: "已保存到“下载”文件夹，1080p，12 分 36 秒。", tone: "ok", time: "刚刚" });
};
</script>

<template>
  <Button @click="run">模拟导出完成</Button>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { notify } from "satin-ui";

  // 通知：右上角滑进来，不自己消失，点 × 关
  const run = () => {
    notify({ title: "第三集导出完成", body: "已保存到“下载”文件夹，1080p，12 分 36 秒。", tone: "ok", time: "刚刚" });
  };
</script>

<button type="button" class="sn-btn sn-secondary" onclick={run}>模拟导出完成</button>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";
import { notify } from "satin-ui";

@Component({
  selector: "demo-notify-basic",
  template: `<button type="button" class="sn-btn sn-secondary" (click)="run()">模拟导出完成</button>`,
})
export class NotifyBasicComponent {
  // 通知：右上角滑进来，不自己消失，点 × 关
  run() {
    notify({ title: "第三集导出完成", body: "已保存到“下载”文件夹，1080p，12 分 36 秒。", tone: "ok", time: "刚刚" });
  }
}
```

Solid 的写法：

```tsx
import { notify } from "satin-ui";

// 通知：右上角滑进来，不自己消失，点 × 关
const run = () => {
  notify({ title: "第三集导出完成", body: "已保存到“下载”文件夹，1080p，12 分 36 秒。", tone: "ok", time: "刚刚" });
};

export default function ExportDone() {
  return <button type="button" class="sn-btn sn-secondary" onClick={run}>模拟导出完成</button>;
}
```

Preact 的写法：

```tsx
import { Button, notify } from "satin-ui/react";

// 通知：右上角滑进来，不自己消失，点 × 关
const run = () => {
  notify({ title: "第三集导出完成", body: "已保存到“下载”文件夹，1080p，12 分 36 秒。", tone: "ok", time: "刚刚" });
};

export default function ExportDone() {
  return <Button onClick={run}>模拟导出完成</Button>;
}
```

### 带按钮

要用户处理的事给按钮；run 里做完再关上。

```html
<button type="button" class="sn-btn sn-secondary">模拟收到邀请</button>
```

纯 HTML 的写法：

```html
<button type="button" class="sn-btn sn-secondary" id="notify-actions-btn">模拟收到邀请</button>

<script type="module">
  import { notify } from "satin-ui";
  document.getElementById("notify-actions-btn").addEventListener("click", () => {
    notify({
      title: "林夏邀请你一起编辑“雨夜车站”",
      body: "你会看到她改的分镜，她也会看到你的。",
      icon: "users",
      time: "2 分钟前",
      // 按钮点了跑 run(卡片)；要关上就调 card.close()
      actions: [
        { label: "接受", variant: "primary", run: (card) => card.close() },
        { label: "稍后", run: (card) => card.close() },
      ],
    });
  });
</script>
```

React 的写法：

```tsx
import { Button, notify } from "satin-ui/react";

const run = () => {
  notify({
    title: "林夏邀请你一起编辑“雨夜车站”",
    body: "你会看到她改的分镜，她也会看到你的。",
    icon: "users",
    time: "2 分钟前",
    // 按钮点了跑 run(卡片)；要关上就调 card.close()
    actions: [
      { label: "接受", variant: "primary", run: (card) => card.close() },
      { label: "稍后", run: (card) => card.close() },
    ],
  });
};

export default function InviteNotice() {
  return <Button onClick={run}>模拟收到邀请</Button>;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Button, notify } from "satin-ui/vue";

const run = () => {
  notify({
    title: "林夏邀请你一起编辑“雨夜车站”",
    body: "你会看到她改的分镜，她也会看到你的。",
    icon: "users",
    time: "2 分钟前",
    // 按钮点了跑 run(卡片)；要关上就调 card.close()
    actions: [
      { label: "接受", variant: "primary", run: (card) => card.close() },
      { label: "稍后", run: (card) => card.close() },
    ],
  });
};
</script>

<template>
  <Button @click="run">模拟收到邀请</Button>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { notify } from "satin-ui";

  const run = () => {
    notify({
      title: "林夏邀请你一起编辑“雨夜车站”",
      body: "你会看到她改的分镜，她也会看到你的。",
      icon: "users",
      time: "2 分钟前",
      // 按钮点了跑 run(卡片)；要关上就调 card.close()
      actions: [
        { label: "接受", variant: "primary", run: (card) => card.close() },
        { label: "稍后", run: (card) => card.close() },
      ],
    });
  };
</script>

<button type="button" class="sn-btn sn-secondary" onclick={run}>模拟收到邀请</button>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";
import { notify } from "satin-ui";

@Component({
  selector: "demo-notify-actions",
  template: `<button type="button" class="sn-btn sn-secondary" (click)="run()">模拟收到邀请</button>`,
})
export class NotifyActionsComponent {
  run() {
    notify({
      title: "林夏邀请你一起编辑“雨夜车站”",
      body: "你会看到她改的分镜，她也会看到你的。",
      icon: "users",
      time: "2 分钟前",
      // 按钮点了跑 run(卡片)；要关上就调 card.close()
      actions: [
        { label: "接受", variant: "primary", run: (card) => card.close() },
        { label: "稍后", run: (card) => card.close() },
      ],
    });
  }
}
```

Solid 的写法：

```tsx
import { notify } from "satin-ui";

const run = () => {
  notify({
    title: "林夏邀请你一起编辑“雨夜车站”",
    body: "你会看到她改的分镜，她也会看到你的。",
    icon: "users",
    time: "2 分钟前",
    // 按钮点了跑 run(卡片)；要关上就调 card.close()
    actions: [
      { label: "接受", variant: "primary", run: (card) => card.close() },
      { label: "稍后", run: (card) => card.close() },
    ],
  });
};

export default function InviteNotice() {
  return <button type="button" class="sn-btn sn-secondary" onClick={run}>模拟收到邀请</button>;
}
```

Preact 的写法：

```tsx
import { Button, notify } from "satin-ui/react";

const run = () => {
  notify({
    title: "林夏邀请你一起编辑“雨夜车站”",
    body: "你会看到她改的分镜，她也会看到你的。",
    icon: "users",
    time: "2 分钟前",
    // 按钮点了跑 run(卡片)；要关上就调 card.close()
    actions: [
      { label: "接受", variant: "primary", run: (card) => card.close() },
      { label: "稍后", run: (card) => card.close() },
    ],
  });
};

export default function InviteNotice() {
  return <Button onClick={run}>模拟收到邀请</Button>;
}
```

### 失败

tone: "bad"：读屏马上读；说清原因、给去修改的按钮。

```html
<button type="button" class="sn-btn sn-secondary">模拟生成失败</button>
```

纯 HTML 的写法：

```html
<button type="button" class="sn-btn sn-secondary" id="notify-fail-btn">模拟生成失败</button>

<script type="module">
  import { notify } from "satin-ui";
  document.getElementById("notify-fail-btn").addEventListener("click", () => {
    notify({
      title: "第 12 个镜头生成失败",
      body: "画面描述里有不能生成的内容，改一下再试。",
      tone: "bad",
      time: "刚刚",
      actions: [{ label: "去修改", variant: "primary", run: (card) => card.close() }],
    });
  });
</script>
```

React 的写法：

```tsx
import { Button, notify } from "satin-ui/react";

const run = () => {
  notify({
    title: "第 12 个镜头生成失败",
    body: "画面描述里有不能生成的内容，改一下再试。",
    tone: "bad",
    time: "刚刚",
    actions: [{ label: "去修改", variant: "primary", run: (card) => card.close() }],
  });
};

export default function RenderFailed() {
  return <Button onClick={run}>模拟生成失败</Button>;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Button, notify } from "satin-ui/vue";

const run = () => {
  notify({
    title: "第 12 个镜头生成失败",
    body: "画面描述里有不能生成的内容，改一下再试。",
    tone: "bad",
    time: "刚刚",
    actions: [{ label: "去修改", variant: "primary", run: (card) => card.close() }],
  });
};
</script>

<template>
  <Button @click="run">模拟生成失败</Button>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { notify } from "satin-ui";

  const run = () => {
    notify({
      title: "第 12 个镜头生成失败",
      body: "画面描述里有不能生成的内容，改一下再试。",
      tone: "bad",
      time: "刚刚",
      actions: [{ label: "去修改", variant: "primary", run: (card) => card.close() }],
    });
  };
</script>

<button type="button" class="sn-btn sn-secondary" onclick={run}>模拟生成失败</button>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";
import { notify } from "satin-ui";

@Component({
  selector: "demo-notify-fail",
  template: `<button type="button" class="sn-btn sn-secondary" (click)="run()">模拟生成失败</button>`,
})
export class NotifyFailComponent {
  run() {
    notify({
      title: "第 12 个镜头生成失败",
      body: "画面描述里有不能生成的内容，改一下再试。",
      tone: "bad",
      time: "刚刚",
      actions: [{ label: "去修改", variant: "primary", run: (card) => card.close() }],
    });
  }
}
```

Solid 的写法：

```tsx
import { notify } from "satin-ui";

const run = () => {
  notify({
    title: "第 12 个镜头生成失败",
    body: "画面描述里有不能生成的内容，改一下再试。",
    tone: "bad",
    time: "刚刚",
    actions: [{ label: "去修改", variant: "primary", run: (card) => card.close() }],
  });
};

export default function RenderFailed() {
  return <button type="button" class="sn-btn sn-secondary" onClick={run}>模拟生成失败</button>;
}
```

Preact 的写法：

```tsx
import { Button, notify } from "satin-ui/react";

const run = () => {
  notify({
    title: "第 12 个镜头生成失败",
    body: "画面描述里有不能生成的内容，改一下再试。",
    tone: "bad",
    time: "刚刚",
    actions: [{ label: "去修改", variant: "primary", run: (card) => card.close() }],
  });
};

export default function RenderFailed() {
  return <Button onClick={run}>模拟生成失败</Button>;
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `title` | `string` | — | 是 | 标题：一句话说发生了什么。 | createXxx 选项：`title` |
| `body` | `string` | — | 否 | 说明：细节和下一步，一两句。 | createXxx 选项：`body` |
| `icon` | `string` | 按 tone | 否 | 左上角的图标（Satin 的图标名）。 | createXxx 选项：`icon` |
| `tone` | `"ok" \| "bad" \| "warn"` | — | 否 | 图标颜色：成功、失败（读屏马上读）、提醒。 | createXxx 选项：`tone` |
| `time` | `string` | — | 否 | 什么时候："刚刚""2 分钟前"。 | createXxx 选项：`time` |
| `actions` | `{ label: string; variant?: string; run?(card: NotifyHandle): void }[]` | [] | 否 | 按钮：`variant` 是按钮样式（primary 只给一个），`run(卡片)` 点了调；不给 run 点了直接关。 | createXxx 选项：`actions` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `notify(o: NotifyOptions): NotifyHandle` | `satin-ui` | 弹出一条通知，返回句柄：`close()` 关上，`el` 是这张卡片。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-overlay`（全局令牌） | 卡片底色 | 白（深色主题 #2c2c2e） |
| `--sn-e1`（全局令牌） | 浮层阴影 | 浮层一档 |
| `--sn-success / --sn-danger / --sn-warning`（全局令牌） | 成功、失败、提醒图标的颜色 | 绿 / 红 / 橙 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-notifs` | 放通知的层（aria-live="polite"，自己建） |
| `.sn-notif` | 一张通知（role="status"，失败时 role="alert"） |

## 导出的类型

`NotifyOptions`、`NotifyHandle`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 焦点能走到通知里的按钮和 ×（不抢焦点）。 |

## 无障碍

- 层是 `aria-live="polite"`；每张 `role="status"`，失败（tone: "bad"）是 `role="alert"`。
- 不抢焦点；× 写了"关闭通知"。
- 标题自己就能看懂，不靠图标颜色表达成功失败。

## 设计规范

- 这样做：标题说发生了什么，说明写下一步。
- 这样做：按钮最多两个，主要的那个用 primary。
- 不要：一次弹一堆通知。（规则 `no-overlap`）
- 不要：通知卡片用彩色底、彩色边。（规则 `status-color`）

文案：

- "第三集导出完成"；失败写原因："画面描述里有不能生成的内容"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 新通知卡片自右侧滑入 | `ease.outStrong` | 320ms |
| 关闭单条通知后，其余通知按弹簧曲线补位 | `spring` | 300ms |

## 验收要点

- 宽 360，圆角 12；标题 13/600，正文 13，时间 12。操作按钮在右下角，主按钮放最后，最多两个。
- 落下 560ms `ease.open`；关掉一条时，下面的补上来。
- 客户端来源：生成完成或失败、导出完成、额度不足、版本更新、公告；后台：待审核、举报、系统告警、导出完成。

## 规则

- 宽 360，圆角 12；标题 13/600，正文 13，时间 12。操作按钮在右下角，主按钮放最后，最多两个。
- 落下 560ms `ease.open`；关掉一条时，下面的补上来。
- 客户端来源：生成完成或失败、导出完成、额度不足、版本更新、公告；后台：待审核、举报、系统告警、导出完成。

