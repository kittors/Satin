# 搜索、密码、邮箱 · SearchField · SecretInput · EmailField

> 组件 id：`special`　分组：表单

搜索：空着时显示快捷键，一输入就换成清除按钮；等结果超过 300ms 时放大镜换成转圈，结果数量从右边淡入。密码：强度条从左往右依次点亮，文字滚动换掉；大写锁定打开时下面展开一行提示。邮箱：格式对了，右边的对勾一笔画出来。

**搜索：空着时显示快捷键，一输入就换成清除按钮；等结果超过 300ms 时放大镜换成转圈，结果数量从右边淡入。密码：强度条从左往右依次点亮，文字滚动换掉；大写锁定打开时下面展开一行提示。邮箱：格式对了，右边的对勾一笔画出来。**

## 什么时候用

- 搜索框：筛一个列表、找素材，按 / 直接跳过来。
- 设置密码、登录：要显示 / 隐藏、提示大写锁定。
- 填邮箱：边输边告诉格式对没对。

## 什么时候别用

- 全局的命令、跳转：用命令面板。（换成 `cmdk`）
- 普通的一行文字：用输入框。（换成 `input`）

## 相近的组件

- `input`：这三种都是在输入框上加了按钮和校验。
- `cmdk`：命令面板 ⌘K 全局找命令；搜索框筛眼前这一个列表。
- `field`：密码、邮箱自带标签和说明（就是一个字段）；错误也写在下面。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createSearch } from "satin-ui"; // 给一个空容器` |
| React | `import { Search, Password, Email } from "satin-ui/react";` |
| Vue | `import { Search, Password, Email } from "satin-ui/vue";` |
| Svelte | `import Satin from "satin-ui/svelte/Satin.svelte"; import { createSearch } from "satin-ui";` |
| Angular | `import { createSearch } from "satin-ui";` |
| Solid | `import { createSearch } from "satin-ui";` |
| Preact | `import { Search, Password, Email } from "satin-ui/react"; // 经 preact/compat` |

- React：`<Search search onSearch>`：`search(q)` 返回结果数（或数组、Promise），超过 300ms 放大镜换成转圈；`<Password label meter>`、`<Email label>` 是带标签和说明的整个字段，`value` + `onChange(值)` 受控。`id` 写在里面的输入框上。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `Search`、`Password`、`Email`。
- Vue：`<Search :search>` 发 `search`；`<Password v-model label meter>`、`<Email v-model label>`。
- Svelte：没有专门的 Svelte 组件：用 `Satin.svelte` 包 `createSearch` / `createPassword` / `createEmail`，选项写在 `options` 里。
- Angular：没有专门的组件：`afterNextRender` 里 `createSearch(元素, 选项)`（密码、邮箱同理），`DestroyRef.onDestroy` 里 `destroy()`。
- Solid：没有专门的组件：`onSettled` 里 `createSearch(元素, 选项)`，返回的函数里 `destroy()`。
- 纯 HTML：给空容器 `createSearch(容器, { search, placeholder })`、`createPassword(容器, { label, meter })`、`createEmail(容器, { label })`；照设计稿写好的标记（`data-search`、`data-pw`、`data-email`）`enhance()` 也会接上。

## 示例（由浅入深）

### 最简单的用法：搜索框

search(q) 返回结果数，右边淡入"N 个结果"；空着时显示快捷键，一输入换成清除按钮。

```html
<div id="special-basic"></div>
```

纯 HTML 的写法：

```jsx
<div id="special-basic"></div>

<script type="module">
  import { createSearch } from "satin-ui";
  const SHOTS = ["站台远景", "雨里的车灯", "推门进候车厅", "站台告别", "末班列车"];
  // 空着时显示快捷键 /，一输入换成清除按钮
  createSearch(document.getElementById("special-basic"), {
    placeholder: "搜索镜头",
    label: "搜索镜头",
    // search(q) 返回结果数：右边淡入"N 个结果"；返回 Promise 时等超过 300ms 放大镜换成转圈
    search: (q) => SHOTS.filter((s) => s.includes(q)).length,
  });
</script>
```

React 的写法：

```jsx
import { Search } from "satin-ui/react";

const SHOTS = ["站台远景", "雨里的车灯", "推门进候车厅", "站台告别", "末班列车"];

export default function ShotSearch() {
  // search(q) 返回结果数：右边淡入"N 个结果"；返回 Promise 时等超过 300ms 放大镜换成转圈
  return <Search placeholder="搜索镜头" label="搜索镜头" search={(q) => SHOTS.filter((s) => s.includes(q)).length} />;
}
```

Vue 的写法：

```vue
<script setup>
import { Search } from "satin-ui/vue";

const SHOTS = ["站台远景", "雨里的车灯", "推门进候车厅", "站台告别", "末班列车"];
// search(q) 返回结果数：右边淡入"N 个结果"；返回 Promise 时等超过 300ms 放大镜换成转圈
const count = (q) => SHOTS.filter((s) => s.includes(q)).length;
</script>

<template>
  <Search placeholder="搜索镜头" label="搜索镜头" :search="count" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createSearch } from "satin-ui";
  const SHOTS = ["站台远景", "雨里的车灯", "推门进候车厅", "站台告别", "末班列车"];

  // 空着时显示快捷键 /，一输入换成清除按钮
  const options = {
    placeholder: "搜索镜头",
    label: "搜索镜头",
    // search(q) 返回结果数：右边淡入"N 个结果"；返回 Promise 时等超过 300ms 放大镜换成转圈
    search: (q) => SHOTS.filter((s) => s.includes(q)).length,
  };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createSearch，选项写在 options 里 -->
<Satin create={createSearch} {options} />
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createSearch } from "satin-ui";

const SHOTS = ["站台远景", "雨里的车灯", "推门进候车厅", "站台告别", "末班列车"];

@Component({
  selector: "demo-special-basic",
  template: `<div #host></div>`,
})
export class SpecialBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 空着时显示快捷键 /，一输入换成清除按钮；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createSearch(this.host().nativeElement, {
        placeholder: "搜索镜头",
        label: "搜索镜头",
        // search(q) 返回结果数：右边淡入"N 个结果"；返回 Promise 时等超过 300ms 放大镜换成转圈
        search: (q) => SHOTS.filter((s) => s.includes(q)).length,
      });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createSearch } from "satin-ui";

const SHOTS = ["站台远景", "雨里的车灯", "推门进候车厅", "站台告别", "末班列车"];

export default function ShotSearch() {
  let host;
  // 空着时显示快捷键 /，一输入换成清除按钮；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createSearch(host, {
      placeholder: "搜索镜头",
      label: "搜索镜头",
      // search(q) 返回结果数：右边淡入"N 个结果"；返回 Promise 时等超过 300ms 放大镜换成转圈
      search: (q) => SHOTS.filter((s) => s.includes(q)).length,
    });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { Search } from "satin-ui/react";

const SHOTS = ["站台远景", "雨里的车灯", "推门进候车厅", "站台告别", "末班列车"];

export default function ShotSearch() {
  // search(q) 返回结果数：右边淡入"N 个结果"；返回 Promise 时等超过 300ms 放大镜换成转圈
  return <Search placeholder="搜索镜头" label="搜索镜头" search={(q) => SHOTS.filter((s) => s.includes(q)).length} />;
}
```

### 设置密码

meter 出强度条；大写锁定打开时下面展开提示；右边的眼睛切换显示。

```html
<div id="special-password"></div>
```

纯 HTML 的写法：

```jsx
<div id="special-password"></div>

<script type="module">
  import { createPassword } from "satin-ui";
  // meter：强度条依次点亮；大写锁定打开时下面展开提示
  createPassword(document.getElementById("special-password"), { label: "设置密码", placeholder: "至少 8 位，字母加数字更安全", meter: true, id: "new-pw" });
</script>
```

React 的写法：

```jsx
import { Password } from "satin-ui/react";

export default function NewPassword() {
  // meter：强度条从左往右依次点亮；大写锁定打开时下面展开一行提示；右边的眼睛切换显示
  return <Password label="设置密码" placeholder="至少 8 位，字母加数字更安全" meter id="new-pw" />;
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Password } from "satin-ui/vue";

const pw = ref("");
</script>

<template>
  <!-- meter：强度条从左往右依次点亮；大写锁定打开时下面展开一行提示；右边的眼睛切换显示 -->
  <Password v-model="pw" label="设置密码" placeholder="至少 8 位，字母加数字更安全" meter id="new-pw" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createPassword } from "satin-ui";

  // meter：强度条依次点亮；大写锁定打开时下面展开提示
  const options = { label: "设置密码", placeholder: "至少 8 位，字母加数字更安全", meter: true, id: "new-pw" };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createPassword，选项写在 options 里 -->
<Satin create={createPassword} {options} />
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createPassword } from "satin-ui";

@Component({
  selector: "demo-special-password",
  template: `<div #host></div>`,
})
export class SpecialPasswordComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // meter：强度条依次点亮；大写锁定打开时下面展开提示；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createPassword(this.host().nativeElement, { label: "设置密码", placeholder: "至少 8 位，字母加数字更安全", meter: true, id: "new-pw" });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createPassword } from "satin-ui";

export default function NewPassword() {
  let host;
  // meter：强度条依次点亮；大写锁定打开时下面展开提示；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createPassword(host, { label: "设置密码", placeholder: "至少 8 位，字母加数字更安全", meter: true, id: "new-pw" });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { Password } from "satin-ui/react";

export default function NewPassword() {
  // meter：强度条从左往右依次点亮；大写锁定打开时下面展开一行提示；右边的眼睛切换显示
  return <Password label="设置密码" placeholder="至少 8 位，字母加数字更安全" meter id="new-pw" />;
}
```

### 受控：邮箱

value + onChange 受控；格式对了右边的对勾一笔画出来。

```html
<div id="special-email"></div>
```

纯 HTML 的写法：

```jsx
<div id="special-email"></div>

<script type="module">
  import { createEmail } from "satin-ui";
  // 格式对了右边的对勾一笔画出来
  createEmail(document.getElementById("special-email"), { label: "通知邮箱", placeholder: "name@example.com", id: "notify-email" });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { Email } from "satin-ui/react";

export default function NotifyEmail() {
  // 受控：value + onChange；格式对了右边的对勾一笔画出来
  const [mail, setMail] = useState("");
  return <Email label="通知邮箱" placeholder="name@example.com" id="notify-email" value={mail} onChange={setMail} />;
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { Email } from "satin-ui/vue";

const mail = ref("");
</script>

<template>
  <!-- v-model；格式对了右边的对勾一笔画出来 -->
  <Email v-model="mail" label="通知邮箱" placeholder="name@example.com" id="notify-email" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createEmail } from "satin-ui";

  // 格式对了右边的对勾一笔画出来
  const options = { label: "通知邮箱", placeholder: "name@example.com", id: "notify-email" };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createEmail，选项写在 options 里 -->
<Satin create={createEmail} {options} />
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createEmail } from "satin-ui";

@Component({
  selector: "demo-special-email",
  template: `<div #host></div>`,
})
export class SpecialEmailComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 格式对了右边的对勾一笔画出来；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createEmail(this.host().nativeElement, { label: "通知邮箱", placeholder: "name@example.com", id: "notify-email" });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```jsx
import { onSettled } from "solid-js";
import { createEmail } from "satin-ui";

export default function NotifyEmail() {
  let host;
  // 格式对了右边的对勾一笔画出来；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createEmail(host, { label: "通知邮箱", placeholder: "name@example.com", id: "notify-email" });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { Email } from "satin-ui/react";

export default function NotifyEmail() {
  // 受控：value + onChange；格式对了右边的对勾一笔画出来
  const [mail, setMail] = useState("");
  return <Email label="通知邮箱" placeholder="name@example.com" id="notify-email" value={mail} onChange={setMail} />;
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `search` | `(q: string) => number \| unknown[] \| Promise<number \| unknown[]>` | — | 否 | 搜：返回结果数（或者结果数组），右边淡入"N 个结果"；返回 Promise 时等超过 300ms 放大镜换成转圈。 | createXxx 选项：`search`；React：`search`；Preact：`search`；Vue：`search` |
| `debounce` | `number` | 150 | 否 | 停手多少毫秒再搜。 | createXxx 选项：`debounce`；React：`debounce`；Preact：`debounce`；Vue：`debounce` |
| `placeholder` | `string` | — | 否 | 空着时的提示："搜索镜头、角色"。 | createXxx 选项：`placeholder`；React：`placeholder`；Preact：`placeholder`；Vue：`placeholder`；纯 HTML：`input 的 placeholder` |
| `label` | `string` | placeholder | 否 | 读屏读出来的名字。 | createXxx 选项：`label`；React：`label`；Preact：`label`；Vue：`label`；纯 HTML：`aria-label` |
| `kbd` | `string \| false` | "/" | 否 | 空着时右边显示的快捷键（按它跳到这里）；false 不显示。 | createXxx 选项：`kbd`；React：`kbd`；Preact：`kbd`；Vue：`kbd`；纯 HTML：`.sn-kbd` |
| `id` | `string` | — | 否 | 写在输入框上（对上 <label for>）。 | createXxx 选项：`id`；React：`id`；Preact：`id`；Vue：`id` |
| `name` | `string` | — | 否 | 表单字段名。 | createXxx 选项：`name`；React：`name`；Preact：`name`；Vue：`name` |
| `size` | `"sm" \| "lg" \| "xl"` | — | 否 | 输入框的高度档。 | createXxx 选项：`size`；React：`size`；Preact：`size`；Vue：`size` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `search` | `string` | 停手 debounce 毫秒以后、清空的时候，参数是现在的搜索词。 | createXxx 选项：`onSearch`；React：`onSearch`；Preact：`onSearch`；Vue：`@search`；纯 HTML：`sn-search（e.detail）` |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-field / --sn-line-control`（全局令牌） | 输入框的底色和边 | 白 / 黑 14% |
| `--sn-success`（全局令牌） | 邮箱格式对了的对勾 | 绿 |
| `--sn-warning`（全局令牌） | 密码强度弱的那几格、大写锁定的提示 | 橙 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-ib.sn-search[data-search]` | 搜索框（.sn-pre 放大镜 / 转圈，.sn-post 结果数、快捷键、清除按钮） |
| `input[data-pw] / .sn-pw-meter / .sn-caps` | 密码框 / 强度条 / 大写锁定提示 |
| `input[data-email] / .sn-ok-mark` | 邮箱框 / 格式对了的对勾 |

## 导出的类型

`SearchProps`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| / |  | 跳到搜索框（页面里只有一个搜索框时）。 |
| Esc（搜索框里） |  | 清空。 |
| 空格 / Enter（眼睛按钮上） |  | 显示 / 隐藏密码。 |

## 无障碍

- 搜索框写 `aria-label`；结果数在 `aria-live` 里，读屏读"N 个结果"。
- 显示密码的按钮写 `aria-label="显示密码"`；强度条 `aria-live="polite"`。
- 清除以后焦点留在输入框里。
- 密码框 `autocomplete` 写 `new-password`（设置）或 `current-password`（登录），密码管理器才认得。

## 设计规范

- 这样做：搜索框写搜什么："搜索镜头、角色"。
- 这样做：设置密码时给强度条和规则说明。
- 不要：强度条用红黄绿三色大块。（规则 `status-color`）
- 不要：搜索结果一出来就弹窗。（规则 `no-overlap`）

文案：

- 密码规则写在 placeholder 或说明里："至少 8 位，字母加数字更安全"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 清除按钮、结果数淡入 | `ease.out` | 150ms |
| 强度条依次点亮 | `ease.outStrong` | 每格晚 60ms |
| 邮箱对勾一笔画出来 | `ease.outStrong` | 300ms |

## 验收要点

- 搜索的转圈遵守 09 号 §7：300ms 内回来就不转，转了至少留 500ms。
- 密码强度只看长度和字符种类，不在用户还没写完时说"太弱"：8 位以内只亮灰色。
- 邮箱校验在停止输入 400ms 后才判断；离开输入框时格式还不对，才在下面展开错误。

## 规则

- 搜索的转圈遵守 09 号 §7：300ms 内回来就不转，转了至少留 500ms。
- 密码强度只看长度和字符种类，不在用户还没写完时说"太弱"：8 位以内只亮灰色。
- 邮箱校验在停止输入 400ms 后才判断；离开输入框时格式还不对，才在下面展开错误。

