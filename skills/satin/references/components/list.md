# 列表与键值 · List · Description

> 组件 id：`list`　分组：数据展示

设置页、详情页用。行高 44，左边图标、中间标题和说明、右边是值或开关；能点进去的行末尾有箭头，悬停时箭头往右挪 2px。

**设置页、详情页用：一行一项，左边图标、中间标题和说明、右边是值或开关；能点进去的行末尾有箭头，悬停时箭头往右挪 2px。详情用键值对，键在左、值在右。**

## 什么时候用

- 设置页：一项一行，能点进去或者直接开关。
- 详情页：项目信息、文件属性这类键值对。

## 什么时候别用

- 很多行、要排序筛选的数据：用表格。（换成 `table`）
- 有封面的对象：用卡片。（换成 `card`）

## 相近的组件

- `table`：表格是多列数据；列表一行一项，信息少。
- `card`：卡片靠封面；列表靠文字。
- `choice`：开关的写法见复选、单选、开关。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 只有样式：设置列表 .sn-set-list > .sn-set-row，键值 dl.sn-kv` |
| React | `import { Icon } from "satin-ui/react"; // 列表本身写 className，图标用 <Icon>` |
| Vue | `import { Icon } from "satin-ui/vue"; // 列表本身写 class，图标用 <Icon>` |
| Svelte | `import Icon from "satin-ui/svelte/Icon.svelte";` |
| Angular | `// 只有样式：.sn-set-list > .sn-set-row；图标写 data-i，外面包 <sn-enhance>` |
| Solid | `// 只有样式：.sn-set-list > .sn-set-row；图标写 data-i，外面包 <sn-enhance>` |
| Preact | `import { Icon } from "satin-ui/react"; // 经 preact/compat` |

- React：纯样式，没有专门的组件：`<div className="sn-set-list">` 里每行 `.sn-set-row`（`.sn-ico` 图标、`.sn-tx` 标题和说明、`.sn-val` 值、`.sn-end` 箭头）；键值写 `<dl className="sn-kv">`。
- Preact：纯样式：结构同 React，图标用 `satin-ui/react` 的 `<Icon>`。
- Vue：纯样式，没有专门的组件：`.sn-set-list > .sn-set-row`、`dl.sn-kv`，图标用 `<Icon>`。
- Svelte：纯样式：`.sn-set-list > .sn-set-row`、`dl.sn-kv`，图标用 `<Icon>`。
- Angular：纯样式：`.sn-set-list > .sn-set-row`、`dl.sn-kv`；图标写 `data-i`，外面包 `<sn-enhance>`。
- Solid：纯样式：`.sn-set-list > .sn-set-row`、`dl.sn-kv`；图标写 `data-i`，外面包 `<sn-enhance>`。
- 纯 HTML：设置列表 `.sn-set-list > .sn-set-row`（能点的行写 `tabindex="0"`，危险的加 `sn-danger`）；键值 `<dl class="sn-kv">` 里 `dt` / `dd` 交替。

## 示例（由浅入深）

### 最简单的用法：设置列表

能点进去的行末尾有箭头；危险的一行加 sn-danger。

```html
<div class="sn-set-list"><div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="user"></span><div class="sn-tx"><b>个人资料</b><span>头像、昵称、邮箱</span></div><span class="sn-end" data-i="chevron-right"></span></div><div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="layout-grid"></span><div class="sn-tx"><b>默认画面比例</b></div><span class="sn-val">16:9</span><span class="sn-end" data-i="chevron-right"></span></div><div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="key-round"></span><div class="sn-tx"><b>修改密码</b></div><span class="sn-end" data-i="chevron-right"></span></div><div class="sn-set-row sn-danger" tabindex="0"><span class="sn-ico" data-i="log-out"></span><div class="sn-tx"><b>退出登录</b></div></div></div>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <div class="sn-set-list">
    <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="user"></span><div class="sn-tx"><b>个人资料</b><span>头像、昵称、邮箱</span></div><span class="sn-end" data-i="chevron-right"></span></div>
    <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="layout-grid"></span><div class="sn-tx"><b>默认画面比例</b></div><span class="sn-val">16:9</span><span class="sn-end" data-i="chevron-right"></span></div>
    <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="key-round"></span><div class="sn-tx"><b>修改密码</b></div><span class="sn-end" data-i="chevron-right"></span></div>
    <div class="sn-set-row sn-danger" tabindex="0"><span class="sn-ico" data-i="log-out"></span><div class="sn-tx"><b>退出登录</b></div></div>
  </div>
</sn-enhance>
```

React 的写法：

```tsx
import { Icon } from "satin-ui/react";

export default function ListBasic() {
  return (
    <div className="sn-set-list">
      <div className="sn-set-row" tabIndex={0}><span className="sn-ico"><Icon name="user" /></span><div className="sn-tx"><b>个人资料</b><span>头像、昵称、邮箱</span></div><span className="sn-end"><Icon name="chevron-right" /></span></div>
      <div className="sn-set-row" tabIndex={0}><span className="sn-ico"><Icon name="layout-grid" /></span><div className="sn-tx"><b>默认画面比例</b></div><span className="sn-val">16:9</span><span className="sn-end"><Icon name="chevron-right" /></span></div>
      <div className="sn-set-row" tabIndex={0}><span className="sn-ico"><Icon name="key-round" /></span><div className="sn-tx"><b>修改密码</b></div><span className="sn-end"><Icon name="chevron-right" /></span></div>
      <div className="sn-set-row sn-danger" tabIndex={0}><span className="sn-ico"><Icon name="log-out" /></span><div className="sn-tx"><b>退出登录</b></div></div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Icon } from "satin-ui/vue";
</script>

<template>
  <div class="sn-set-list">
    <div class="sn-set-row" tabindex="0"><span class="sn-ico"><Icon name="user" /></span><div class="sn-tx"><b>个人资料</b><span>头像、昵称、邮箱</span></div><span class="sn-end"><Icon name="chevron-right" /></span></div>
    <div class="sn-set-row" tabindex="0"><span class="sn-ico"><Icon name="layout-grid" /></span><div class="sn-tx"><b>默认画面比例</b></div><span class="sn-val">16:9</span><span class="sn-end"><Icon name="chevron-right" /></span></div>
    <div class="sn-set-row" tabindex="0"><span class="sn-ico"><Icon name="key-round" /></span><div class="sn-tx"><b>修改密码</b></div><span class="sn-end"><Icon name="chevron-right" /></span></div>
    <div class="sn-set-row sn-danger" tabindex="0"><span class="sn-ico"><Icon name="log-out" /></span><div class="sn-tx"><b>退出登录</b></div></div>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-set-list">
  <div class="sn-set-row" tabindex="0"><span class="sn-ico"><Icon name="user" /></span><div class="sn-tx"><b>个人资料</b><span>头像、昵称、邮箱</span></div><span class="sn-end"><Icon name="chevron-right" /></span></div>
  <div class="sn-set-row" tabindex="0"><span class="sn-ico"><Icon name="layout-grid" /></span><div class="sn-tx"><b>默认画面比例</b></div><span class="sn-val">16:9</span><span class="sn-end"><Icon name="chevron-right" /></span></div>
  <div class="sn-set-row" tabindex="0"><span class="sn-ico"><Icon name="key-round" /></span><div class="sn-tx"><b>修改密码</b></div><span class="sn-end"><Icon name="chevron-right" /></span></div>
  <div class="sn-set-row sn-danger" tabindex="0"><span class="sn-ico"><Icon name="log-out" /></span><div class="sn-tx"><b>退出登录</b></div></div>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-list-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-set-list">
        <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="user"></span><div class="sn-tx"><b>个人资料</b><span>头像、昵称、邮箱</span></div><span class="sn-end" data-i="chevron-right"></span></div>
        <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="layout-grid"></span><div class="sn-tx"><b>默认画面比例</b></div><span class="sn-val">16:9</span><span class="sn-end" data-i="chevron-right"></span></div>
        <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="key-round"></span><div class="sn-tx"><b>修改密码</b></div><span class="sn-end" data-i="chevron-right"></span></div>
        <div class="sn-set-row sn-danger" tabindex="0"><span class="sn-ico" data-i="log-out"></span><div class="sn-tx"><b>退出登录</b></div></div>
      </div>
    </sn-enhance>
  `,
})
export class ListBasicComponent {}
```

Solid 的写法：

```tsx
export default function ListBasic() {
  return (
    <sn-enhance>
      <div class="sn-set-list">
        <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="user"></span><div class="sn-tx"><b>个人资料</b><span>头像、昵称、邮箱</span></div><span class="sn-end" data-i="chevron-right"></span></div>
        <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="layout-grid"></span><div class="sn-tx"><b>默认画面比例</b></div><span class="sn-val">16:9</span><span class="sn-end" data-i="chevron-right"></span></div>
        <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="key-round"></span><div class="sn-tx"><b>修改密码</b></div><span class="sn-end" data-i="chevron-right"></span></div>
        <div class="sn-set-row sn-danger" tabindex="0"><span class="sn-ico" data-i="log-out"></span><div class="sn-tx"><b>退出登录</b></div></div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { Icon } from "satin-ui/react";

export default function ListBasic() {
  return (
    <div class="sn-set-list">
      <div class="sn-set-row" tabIndex={0}><span class="sn-ico"><Icon name="user" /></span><div class="sn-tx"><b>个人资料</b><span>头像、昵称、邮箱</span></div><span class="sn-end"><Icon name="chevron-right" /></span></div>
      <div class="sn-set-row" tabIndex={0}><span class="sn-ico"><Icon name="layout-grid" /></span><div class="sn-tx"><b>默认画面比例</b></div><span class="sn-val">16:9</span><span class="sn-end"><Icon name="chevron-right" /></span></div>
      <div class="sn-set-row" tabIndex={0}><span class="sn-ico"><Icon name="key-round" /></span><div class="sn-tx"><b>修改密码</b></div><span class="sn-end"><Icon name="chevron-right" /></span></div>
      <div class="sn-set-row sn-danger" tabIndex={0}><span class="sn-ico"><Icon name="log-out" /></span><div class="sn-tx"><b>退出登录</b></div></div>
    </div>
  );
}
```

### 键值

详情页用 dl：键在左、值在右，数字用等宽。

```html
<dl class="sn-kv"><dt>项目</dt><dd>雨夜车站</dd><dt>负责人</dt><dd><sn-avatar seed="u3" name="林夏" size="20" decorative></sn-avatar>林夏</dd><dt>状态</dt><dd><span class="sn-tag sn-ok"><i></i>已完成</span></dd><dt>镜头</dt><dd class="sn-num">48 个 · 12 分 36 秒</dd><dt>创建时间</dt><dd class="sn-num">2026-11-02 14:20</dd></dl>
```

纯 HTML 的写法：

```html
<dl class="sn-kv">
  <dt>项目</dt><dd>雨夜车站</dd>
  <dt>负责人</dt><dd><sn-avatar seed="u3" name="林夏" size="20" decorative></sn-avatar>林夏</dd>
  <dt>状态</dt><dd><span class="sn-tag sn-ok"><i></i>已完成</span></dd>
  <dt>镜头</dt><dd class="sn-num">48 个 · 12 分 36 秒</dd>
  <dt>创建时间</dt><dd class="sn-num">2026-11-02 14:20</dd>
</dl>
```

React 的写法：

```tsx
import { Avatar } from "satin-ui/react";

export default function ListKv() {
  return (
    <dl className="sn-kv">
      <dt>项目</dt><dd>雨夜车站</dd>
      <dt>负责人</dt><dd><Avatar seed="u3" name="林夏" size={20} decorative />林夏</dd>
      <dt>状态</dt><dd><span className="sn-tag sn-ok"><i></i>已完成</span></dd>
      <dt>镜头</dt><dd className="sn-num">48 个 · 12 分 36 秒</dd>
      <dt>创建时间</dt><dd className="sn-num">2026-11-02 14:20</dd>
    </dl>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Avatar } from "satin-ui/vue";
</script>

<template>
  <dl class="sn-kv">
    <dt>项目</dt><dd>雨夜车站</dd>
    <dt>负责人</dt><dd><Avatar seed="u3" name="林夏" :size="20" decorative />林夏</dd>
    <dt>状态</dt><dd><span class="sn-tag sn-ok"><i></i>已完成</span></dd>
    <dt>镜头</dt><dd class="sn-num">48 个 · 12 分 36 秒</dd>
    <dt>创建时间</dt><dd class="sn-num">2026-11-02 14:20</dd>
  </dl>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import Avatar from "satin-ui/svelte/Avatar.svelte";
</script>

<dl class="sn-kv">
  <dt>项目</dt><dd>雨夜车站</dd>
  <dt>负责人</dt><dd><Avatar seed="u3" name="林夏" size={20} decorative />林夏</dd>
  <dt>状态</dt><dd><span class="sn-tag sn-ok"><i></i>已完成</span></dd>
  <dt>镜头</dt><dd class="sn-num">48 个 · 12 分 36 秒</dd>
  <dt>创建时间</dt><dd class="sn-num">2026-11-02 14:20</dd>
</dl>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-list-kv",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-avatar>
  template: `
    <dl class="sn-kv">
      <dt>项目</dt><dd>雨夜车站</dd>
      <dt>负责人</dt><dd><sn-avatar seed="u3" name="林夏" size="20" decorative></sn-avatar>林夏</dd>
      <dt>状态</dt><dd><span class="sn-tag sn-ok"><i></i>已完成</span></dd>
      <dt>镜头</dt><dd class="sn-num">48 个 · 12 分 36 秒</dd>
      <dt>创建时间</dt><dd class="sn-num">2026-11-02 14:20</dd>
    </dl>
  `,
})
export class ListKvComponent {}
```

Solid 的写法：

```tsx
export default function ListKv() {
  return (
    <dl class="sn-kv">
      <dt>项目</dt><dd>雨夜车站</dd>
      <dt>负责人</dt><dd><sn-avatar seed="u3" name="林夏" size="20" decorative=""></sn-avatar>林夏</dd>
      <dt>状态</dt><dd><span class="sn-tag sn-ok"><i></i>已完成</span></dd>
      <dt>镜头</dt><dd class="sn-num">48 个 · 12 分 36 秒</dd>
      <dt>创建时间</dt><dd class="sn-num">2026-11-02 14:20</dd>
    </dl>
  );
}
```

Preact 的写法：

```tsx
import { Avatar } from "satin-ui/react";

export default function ListKv() {
  return (
    <dl class="sn-kv">
      <dt>项目</dt><dd>雨夜车站</dd>
      <dt>负责人</dt><dd><Avatar seed="u3" name="林夏" size={20} decorative />林夏</dd>
      <dt>状态</dt><dd><span class="sn-tag sn-ok"><i></i>已完成</span></dd>
      <dt>镜头</dt><dd class="sn-num">48 个 · 12 分 36 秒</dd>
      <dt>创建时间</dt><dd class="sn-num">2026-11-02 14:20</dd>
    </dl>
  );
}
```

### 带开关的行

马上生效的设置在行里放开关。

```html
<div class="sn-set-list"><div class="sn-set-row"><span class="sn-ico" data-i="bell"></span><div class="sn-tx"><b>生成完成时提醒</b><span>在桌面右上角显示通知</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="生成完成时提醒" checked><span class="sn-track"><span class="sn-knob"></span></span></label></div><div class="sn-set-row"><span class="sn-ico" data-i="save"></span><div class="sn-tx"><b>自动保存草稿</b><span>每次改动 2 秒后保存</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="自动保存草稿"><span class="sn-track"><span class="sn-knob"></span></span></label></div></div>
```

纯 HTML 的写法：

```html
<sn-enhance>
  <div class="sn-set-list">
    <div class="sn-set-row"><span class="sn-ico" data-i="bell"></span><div class="sn-tx"><b>生成完成时提醒</b><span>在桌面右上角显示通知</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="生成完成时提醒" checked><span class="sn-track"><span class="sn-knob"></span></span></label></div>
    <div class="sn-set-row"><span class="sn-ico" data-i="save"></span><div class="sn-tx"><b>自动保存草稿</b><span>每次改动 2 秒后保存</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="自动保存草稿"><span class="sn-track"><span class="sn-knob"></span></span></label></div>
  </div>
</sn-enhance>
```

React 的写法：

```tsx
import { Icon } from "satin-ui/react";

export default function ListSwitch() {
  return (
    <div className="sn-set-list">
      <div className="sn-set-row"><span className="sn-ico"><Icon name="bell" /></span><div className="sn-tx"><b>生成完成时提醒</b><span>在桌面右上角显示通知</span></div><label className="sn-switch"><input type="checkbox" role="switch" aria-label="生成完成时提醒" defaultChecked /><span className="sn-track"><span className="sn-knob"></span></span></label></div>
      <div className="sn-set-row"><span className="sn-ico"><Icon name="save" /></span><div className="sn-tx"><b>自动保存草稿</b><span>每次改动 2 秒后保存</span></div><label className="sn-switch"><input type="checkbox" role="switch" aria-label="自动保存草稿" /><span className="sn-track"><span className="sn-knob"></span></span></label></div>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Icon } from "satin-ui/vue";
</script>

<template>
  <div class="sn-set-list">
    <div class="sn-set-row"><span class="sn-ico"><Icon name="bell" /></span><div class="sn-tx"><b>生成完成时提醒</b><span>在桌面右上角显示通知</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="生成完成时提醒" checked><span class="sn-track"><span class="sn-knob"></span></span></label></div>
    <div class="sn-set-row"><span class="sn-ico"><Icon name="save" /></span><div class="sn-tx"><b>自动保存草稿</b><span>每次改动 2 秒后保存</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="自动保存草稿"><span class="sn-track"><span class="sn-knob"></span></span></label></div>
  </div>
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-set-list">
  <div class="sn-set-row"><span class="sn-ico"><Icon name="bell" /></span><div class="sn-tx"><b>生成完成时提醒</b><span>在桌面右上角显示通知</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="生成完成时提醒" checked><span class="sn-track"><span class="sn-knob"></span></span></label></div>
  <div class="sn-set-row"><span class="sn-ico"><Icon name="save" /></span><div class="sn-tx"><b>自动保存草稿</b><span>每次改动 2 秒后保存</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="自动保存草稿"><span class="sn-track"><span class="sn-knob"></span></span></label></div>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-list-switch",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-set-list">
        <div class="sn-set-row"><span class="sn-ico" data-i="bell"></span><div class="sn-tx"><b>生成完成时提醒</b><span>在桌面右上角显示通知</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="生成完成时提醒" checked><span class="sn-track"><span class="sn-knob"></span></span></label></div>
        <div class="sn-set-row"><span class="sn-ico" data-i="save"></span><div class="sn-tx"><b>自动保存草稿</b><span>每次改动 2 秒后保存</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="自动保存草稿"><span class="sn-track"><span class="sn-knob"></span></span></label></div>
      </div>
    </sn-enhance>
  `,
})
export class ListSwitchComponent {}
```

Solid 的写法：

```tsx
export default function ListSwitch() {
  return (
    <sn-enhance>
      <div class="sn-set-list">
        <div class="sn-set-row"><span class="sn-ico" data-i="bell"></span><div class="sn-tx"><b>生成完成时提醒</b><span>在桌面右上角显示通知</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="生成完成时提醒" checked /><span class="sn-track"><span class="sn-knob"></span></span></label></div>
        <div class="sn-set-row"><span class="sn-ico" data-i="save"></span><div class="sn-tx"><b>自动保存草稿</b><span>每次改动 2 秒后保存</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="自动保存草稿" /><span class="sn-track"><span class="sn-knob"></span></span></label></div>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```tsx
import { Icon } from "satin-ui/react";

export default function ListSwitch() {
  return (
    <div class="sn-set-list">
      <div class="sn-set-row"><span class="sn-ico"><Icon name="bell" /></span><div class="sn-tx"><b>生成完成时提醒</b><span>在桌面右上角显示通知</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="生成完成时提醒" checked /><span class="sn-track"><span class="sn-knob"></span></span></label></div>
      <div class="sn-set-row"><span class="sn-ico"><Icon name="save" /></span><div class="sn-tx"><b>自动保存草稿</b><span>每次改动 2 秒后保存</span></div><label class="sn-switch"><input type="checkbox" role="switch" aria-label="自动保存草稿" /><span class="sn-track"><span class="sn-knob"></span></span></label></div>
    </div>
  );
}
```

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-line`（全局令牌） | 列表外框 | 黑 8% |
| `--sn-fill-hover`（全局令牌） | 行悬停时的底色 | 黑 4% |
| `--sn-label3`（全局令牌） | 说明、键的颜色 | #6e6e73 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-set-list > .sn-set-row` | 设置列表的一行（最小高 52） |
| `.sn-ico / .sn-tx > b + span / .sn-val / .sn-end` | 左边图标 / 标题和说明 / 右边的值 / 末尾箭头 |
| `.sn-set-row.sn-danger` | 危险的一行（退出登录） |
| `dl.sn-kv > dt + dd` | 键值对（键 96 宽） |

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab / Enter |  | 能点进去的行写 tabindex="0"，Enter 打开（照常接 click、keydown）。 |

## 无障碍

- 键值用 `<dl>`、`<dt>`、`<dd>`，读屏按"键 值"读。
- 行里的开关是原生 `<input role="switch">`，写 `aria-label`。
- 能点的行聚焦时里面一圈焦点环。
- 行里只有一个主要操作：要么点进去，要么开关，不要两个都有。

## 设计规范

- 这样做：标题一行，说明一行；值靠右。
- 这样做：危险的操作放最后一行，单独一组。
- 不要：行之间都画分隔线。（规则 `no-decorative-divider`）
- 不要：行图标用彩色底。（规则 `status-color`）

文案：

- 标题用名词："个人资料""默认画面比例"；说明写里面有什么。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 悬停时末尾的箭头往右挪 2px | `ease.out` | 150ms |

## 验收要点

- 键值：标签列 tertiary 色、固定宽度，值列左对齐；能复制的值旁边放复制按钮，复制后图标原地变对勾。
- 危险行（退出登录、删除账号）放最后，文字和图标用红色。

## 规则

- 键值：标签列 tertiary 色、固定宽度，值列左对齐；能复制的值旁边放复制按钮，复制后图标原地变对勾。
- 危险行（退出登录、删除账号）放最后，文字和图标用红色。

