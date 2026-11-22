# 头像 · Avatar

> 组件 id：`avatar`　分组：数据展示

有照片用照片；加载失败或者没有照片，就按用户 id（没有就用名字）稳定地挑一张预设头像，同一个人每次都是同一张。头像里不放文字。24px 及以下自动换成简化版，深色主题下不反色。

**代表一个人的小圆图：有照片用照片，没有就按名字稳定地挑一张预设头像，同一个人每次都是同一张；头像里不放文字。**

## 什么时候用

- 列表、表格、评论、对话里标出是谁：头像加名字，头像只是装饰。
- 地方紧的位置只放头像（标签、头像叠放组），名字放在 `label` 或悬停提示里。

## 什么时候别用

- 表示团队、项目、文件这类不是人的东西：用图标或缩略图。
- 取名字的第一个字放进圆里当头像：这是文字头像，严禁；没有照片就用预设。

## 相近的组件

- `tags`：标签、徽标、头像叠放组的样式在那里；标签里可以带一个小头像。
- `list`：列表行左边放头像、右边写名字，头像只是装饰。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 入口里调过 defineElements()：直接写 <sn-avatar>（也可以 import { createAvatar, avatarHTML } from "satin-ui"）` |
| React | `import { Avatar } from "satin-ui/react";` |
| Vue | `import { Avatar } from "satin-ui/vue";` |
| Svelte | `import Avatar from "satin-ui/svelte/Avatar.svelte";` |
| Angular | `// 入口里调过 defineElements()：模板里写 <sn-avatar>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 入口里调过 defineElements()：直接写 <sn-avatar>` |
| Preact | `import { Avatar } from "satin-ui/react"; // 经 preact/compat` |

- React：`Avatar` 组件：`name` 挑预设、也是读屏念的名称；有照片给 `src`，加载失败原地换成预设；旁边已经写了名字就加 `decorative`。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Avatar`：`name`、`src`、`size`、`decorative`。
- Vue：`Avatar` 组件（全局注册后叫 `SnAvatar`）：`name`、`src`、`:size`、`decorative`。
- Svelte：`Avatar` 组件（`satin-ui/svelte/Avatar.svelte`）：`name`、`src`、`size`、`decorative`。
- Angular：写 `<sn-avatar>` 自定义元素：`[attr.name]`、`[attr.src]`、`[attr.size]`；`decorative` 只写属性名，在线状态写 `[attr.status]="online ? 'online' : null"`（避开 `on*` 事件前缀）。
- Solid：写 `<sn-avatar>`：`name`、`src`、`size`；`decorative` 写成空字符串，在线状态写 `status="online"`（避开 `on*` 事件前缀）。
- 纯 HTML：写 `<sn-avatar name="张伟" size="24" decorative>`；也可以 `createAvatar(容器, 选项)`，或者在 Node / SSR 里 `avatarHTML(选项)` 拿标记。

## 示例（由浅入深）

### 六种尺寸

给名字就能用：没有照片时按名字挑一张预设，同一个名字在哪个尺寸都是同一个人；24 及以下自动换成简化版。

```html
<div class="sn-row"><sn-avatar name="张伟" size="16"></sn-avatar><sn-avatar name="张伟" size="20"></sn-avatar><sn-avatar name="张伟" size="24"></sn-avatar><sn-avatar name="张伟"></sn-avatar><sn-avatar name="张伟" size="40"></sn-avatar><sn-avatar name="张伟" size="64"></sn-avatar></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-row"><sn-avatar name="张伟" size="16"></sn-avatar><sn-avatar name="张伟" size="20"></sn-avatar><sn-avatar name="张伟" size="24"></sn-avatar><sn-avatar name="张伟"></sn-avatar><sn-avatar name="张伟" size="40"></sn-avatar><sn-avatar name="张伟" size="64"></sn-avatar></div>
```

React 的写法：

```jsx
import { Avatar } from "satin-ui/react";

export default function AvatarSizes() {
  return (
    <div className="sn-row">
      {[16, 20, 24, 32, 40, 64].map((size) => <Avatar key={size} name="张伟" size={size} />)}
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Avatar } from "satin-ui/vue";

const sizes = [16, 20, 24, 32, 40, 64];
</script>

<template>
  <div class="sn-row">
    <Avatar v-for="size in sizes" :key="size" name="张伟" :size="size" />
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Avatar from "satin-ui/svelte/Avatar.svelte";

  const sizes = [16, 20, 24, 32, 40, 64];
</script>

<div class="sn-row">
  {#each sizes as size (size)}
    <Avatar name="张伟" {size} />
  {/each}
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-avatar-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-avatar>
  template: `<div class="sn-row">
    @for (size of sizes; track size) {
      <sn-avatar name="张伟" [attr.size]="size"></sn-avatar>
    }
  </div>`,
})
export class AvatarBasicComponent {
  protected sizes = [16, 20, 24, 32, 40, 64];
}
```

Solid 的写法：

```jsx
import { For } from "solid-js";

export default function AvatarSizes() {
  return (
    <div class="sn-row">
      <For each={[16, 20, 24, 32, 40, 64]}>{(size) => <sn-avatar name="张伟" size={size}></sn-avatar>}</For>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Avatar } from "satin-ui/react";

export default function AvatarSizes() {
  return (
    <div className="sn-row">
      {[16, 20, 24, 32, 40, 64].map((size) => <Avatar key={size} name="张伟" size={size} />)}
    </div>
  );
}
```

### 列表里：头像加名字

名字已经写在旁边，头像加 `decorative` 只当装饰；有照片给 `src`，没有照片（或加载失败）自动换成预设。

```html
<div class="sn-set-list"><div class="sn-set-row"><sn-avatar name="何慧" decorative status="online"></sn-avatar><div class="sn-tx"><b>何慧</b><span>前端开发</span></div></div><div class="sn-set-row"><sn-avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80" name="黄磊" decorative></sn-avatar><div class="sn-tx"><b>黄磊</b><span>产品设计</span></div></div><div class="sn-set-row"><sn-avatar name="徐丽" decorative></sn-avatar><div class="sn-tx"><b>徐丽</b><span>财务顾问</span></div></div></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-set-list"><div class="sn-set-row"><sn-avatar name="何慧" decorative status="online"></sn-avatar><div class="sn-tx"><b>何慧</b><span>前端开发</span></div></div><div class="sn-set-row"><sn-avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80" name="黄磊" decorative></sn-avatar><div class="sn-tx"><b>黄磊</b><span>产品设计</span></div></div><div class="sn-set-row"><sn-avatar name="徐丽" decorative></sn-avatar><div class="sn-tx"><b>徐丽</b><span>财务顾问</span></div></div></div>
```

React 的写法：

```jsx
import { Avatar } from "satin-ui/react";

const PEOPLE = [
  { name: "何慧", role: "前端开发", online: true },
  { name: "黄磊", role: "产品设计", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "徐丽", role: "财务顾问" },
];

export default function Members() {
  return (
    <div className="sn-set-list">
      {PEOPLE.map((p) => (
        <div className="sn-set-row" key={p.name}>
          <Avatar name={p.name} src={p.src} online={p.online} decorative />
          <div className="sn-tx"><b>{p.name}</b><span>{p.role}</span></div>
        </div>
      ))}
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Avatar } from "satin-ui/vue";

const people = [
  { name: "何慧", role: "前端开发", online: true },
  { name: "黄磊", role: "产品设计", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "徐丽", role: "财务顾问" },
];
</script>

<template>
  <div class="sn-set-list">
    <div v-for="p in people" :key="p.name" class="sn-set-row">
      <Avatar :name="p.name" :src="p.src" :online="p.online" decorative />
      <div class="sn-tx"><b>{{ p.name }}</b><span>{{ p.role }}</span></div>
    </div>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Avatar from "satin-ui/svelte/Avatar.svelte";

  const people = [
    { name: "何慧", role: "前端开发", online: true },
    { name: "黄磊", role: "产品设计", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80" },
    { name: "徐丽", role: "财务顾问" },
  ];
</script>

<div class="sn-set-list">
  {#each people as p (p.name)}
    <div class="sn-set-row">
      <Avatar name={p.name} src={p.src} online={p.online} decorative />
      <div class="sn-tx"><b>{p.name}</b><span>{p.role}</span></div>
    </div>
  {/each}
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-avatar-list",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-avatar>
  template: `<div class="sn-set-list">
    @for (p of people; track p.name) {
      <div class="sn-set-row">
        <sn-avatar [attr.name]="p.name" [attr.src]="p.src ?? null" [attr.status]="p.online ? 'online' : null" decorative></sn-avatar>
        <div class="sn-tx"><b>{{ p.name }}</b><span>{{ p.role }}</span></div>
      </div>
    }
  </div>`,
})
export class AvatarListComponent {
  protected people: { name: string; role: string; src?: string; online?: boolean }[] = [
    { name: "何慧", role: "前端开发", online: true },
    { name: "黄磊", role: "产品设计", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80" },
    { name: "徐丽", role: "财务顾问" },
  ];
}
```

Solid 的写法：

```jsx
import { For } from "solid-js";

const PEOPLE = [
  { name: "何慧", role: "前端开发", online: true },
  { name: "黄磊", role: "产品设计", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "徐丽", role: "财务顾问" },
];

export default function Members() {
  return (
    <div class="sn-set-list">
      <For each={PEOPLE}>{(p) => (
        <div class="sn-set-row">
          <sn-avatar name={p.name} src={p.src} status={p.online ? "online" : undefined} decorative=""></sn-avatar>
          <div class="sn-tx"><b>{p.name}</b><span>{p.role}</span></div>
        </div>
      )}</For>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { Avatar } from "satin-ui/react";

const PEOPLE = [
  { name: "何慧", role: "前端开发", online: true },
  { name: "黄磊", role: "产品设计", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "徐丽", role: "财务顾问" },
];

export default function Members() {
  return (
    <div className="sn-set-list">
      {PEOPLE.map((p) => (
        <div className="sn-set-row" key={p.name}>
          <Avatar name={p.name} src={p.src} online={p.online} decorative />
          <div className="sn-tx"><b>{p.name}</b><span>{p.role}</span></div>
        </div>
      ))}
    </div>
  );
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `src` | `string` | — | 否 | 照片地址。加载失败（坏链接、离线）原地换成按 `seed` / `name` 挑的预设，不留破图。 | createXxx 选项：`src`；React：`src`；Vue：`src`；Svelte：`src`；Preact：`src`；自定义元素：`src`；标记：`里面放 <img src alt="">，加 data-seed 记下退回用的名字`；纯 HTML：`src` |
| `name` | `string` | — | 否 | 这个人的名字：没有照片时按它挑预设（同一个名字永远是同一张），单独出现时也是读屏念的名称。 | createXxx 选项：`name`；React：`name`；Vue：`name`；Svelte：`name`；Preact：`name`；自定义元素：`name`；标记：`aria-label（单独出现时）`；纯 HTML：`name` |
| `seed` | `string` | 同 `name` | 否 | 挑预设用的键，比如用户 id：重名的人分得开，改名也不换头像。 | createXxx 选项：`seed`；React：`seed`；Vue：`seed`；Svelte：`seed`；Preact：`seed`；自定义元素：`seed`；纯 HTML：`seed` |
| `size` | `16 \| 20 \| 24 \| 32 \| 40 \| 64 \| number` | 32 | 否 | 边长（像素）。24 及以下用简化版预设（去掉脖子、耳朵、嘴和眼镜，线条加粗），32 及以上用完整版。 | createXxx 选项：`size`；React：`size`；Vue：`size`；Svelte：`size`；Preact：`size`；自定义元素：`size`；标记：`类名 sn-2xs / sn-xs / sn-sm / —— / sn-lg / sn-xl`；纯 HTML：`size` |
| `label` | `string` | 同 `name` | 否 | 读屏念的名称（单独出现时）。 | createXxx 选项：`label`；React：`label`；Vue：`label`；Svelte：`label`；Preact：`label`；自定义元素：`label`；标记：`aria-label`；纯 HTML：`label` |
| `decorative` | `boolean` | false | 否 | 旁边已经写了名字（列表、表格、评论）：头像只是装饰，`aria-hidden`，读屏只念一遍名字。 | createXxx 选项：`decorative`；React：`decorative`；Vue：`decorative`；Svelte：`decorative`；Preact：`decorative`；自定义元素：`decorative（只写属性名）`；标记：`aria-hidden="true"`；纯 HTML：`decorative` |
| `online` | `boolean` | false | 否 | 右下角画在线的小绿点（自定义元素写 `status="online"`，避开 HTML/框架的 `on*` 事件前缀）。 | createXxx 选项：`online`；React：`online`；Vue：`online`；Svelte：`online`；Preact：`online`；自定义元素：`status="online"`；标记：`类名 sn-online，里面加 <i></i>`；纯 HTML：`status="online"` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `avatarHTML(o?: AvatarOptions): string` | `satin-ui` | 头像的标记（和组件渲染的一样），Node / SSR 里也能调。 |
| `presetAvatar(seed: string, size?: number): { id: string; svg: string }` | `satin-ui` | 按 id 或名字稳定地挑一张预设：同一个 `seed` 永远同一张；`size` ≤ 24 给简化版。 |
| `avatarSvg(id: string, size?: number): string` | `satin-ui` | 直接取某一张预设（`a1` … `a12`）的 SVG。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-s` | 头像边长（尺寸类名就是改它） | 32px |
| `--sn-av-bg`（全局令牌） | 预设的圆底，照片没加载出来时也露出它 | 浅色 #e8e8ed、深色 #a7a7aa |
| `--sn-av-ink / --sn-av-face`（全局令牌） | 预设的线条、脸 | #424245 / #fafafa |
| `--sn-av-black / brown / gray / blue / green / pink / violet / beard`（全局令牌） | 预设的发色、衣服色、胡子 | 低饱和，深色主题压到约 90% |
| `--sn-av-ring` | 叠放组里每个头像外面那圈分隔色，放在别的底色上时跟着设 | 卡片底色 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-av` | 头像：里面只放 `<img>`（照片）或预设 `<svg>`，不放文字 |
| `.sn-av.sn-2xs / .sn-xs / .sn-sm / .sn-lg / .sn-xl` | 16 / 20 / 24 / 40 / 64px（默认 32） |
| `.sn-av.sn-online > i` | 在线的小绿点 |
| `.sn-av-group` | 头像叠放组：叠在一起，悬停或键盘聚焦时散开 |
| `.sn-av.sn-more` | 叠放组末尾的 +N 计数 |

## 导出的类型

`AvatarOptions`

## 无障碍

- 单独出现时 `role="img"` + `aria-label`（`label`，没给用 `name`）。
- 头像本身不可聚焦；叠放组加 `tabindex="0"` 和 `data-tip` 写全部名字。
- 旁边已经写了名字就加 `decorative`：整个头像 `aria-hidden`，读屏只念一遍名字。
- 预设的 svg 本身 `aria-hidden`，名字由外层的 `.sn-av` 给。

## 设计规范

- 这样做：没有照片就用预设，按用户 id 挑（`seed`），重名和改名都不乱。
- 这样做：列表、表格里头像加名字，名字是主要信息。
- 这样做：同一处的头像用同一个尺寸。
- 不要：头像里放名字的第一个字。（规则 `text-avatar`）
- 不要：随机色的圆底当头像，或者每次刷新换一张。

文案：

- 叠放组的提示写全部名字："何慧、黄磊、徐丽 等 7 人"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 叠放组悬停散开 | `ease.outStrong` | 250ms |

## 验收要点

- 没有照片就用预设：按用户 id 挑（`seed`），重名、改名都不乱；头像里不放名字的第一个字。
- 照片加载失败原地换成预设，不留破图；照片没加载出来之前露出圆底。
- 旁边已经写了名字就加 `decorative`：头像只是装饰，读屏只念一遍名字；单独出现时 `role="img"`，念 `name`。
- 24px 及以下用简化版（去掉脖子、耳朵、嘴和眼镜，线条加粗），32px 及以上用完整版。
- 深色主题下头像不反色：人物沿用浅色、整体压暗，圆底也保留浅色，放在页面、卡片、浮层上都分得出来。

## 规则

- 没有照片就用预设：按用户 id 挑（`seed`），重名、改名都不乱；头像里不放名字的第一个字。
- 照片加载失败原地换成预设，不留破图；照片没加载出来之前露出圆底。
- 旁边已经写了名字就加 `decorative`：头像只是装饰，读屏只念一遍名字；单独出现时 `role="img"`，念 `name`。
- 24px 及以下用简化版（去掉脖子、耳朵、嘴和眼镜，线条加粗），32px 及以上用完整版。
- 深色主题下头像不反色：人物沿用浅色、整体压暗，圆底也保留浅色，放在页面、卡片、浮层上都分得出来。

