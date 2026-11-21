# 文字链接与文字按钮 · Link · TextButton

> 组件 id：`link`　分组：按钮

放在句子里的是链接：一条淡下划线，悬停时变实。独立的纯文字操作是文字按钮：平时只有文字，悬停时出现一层底色，按下再深一档并缩一下；带箭头的悬停时箭头右移 2px。

**句子里的链接是一条淡下划线、悬停变实；独立的纯文字操作是文字按钮，悬停出底色、按下缩一下。**

## 什么时候用

- 句子里提到的另一个页面、一份文档：用链接（`<a href>`）。
- 卡片角落、列表末尾的次要操作（"查看全部""编辑""取消"）：用文字按钮，不抢主按钮的风头。
- 要去别的页面的独立入口（"查看全部项目 →"）：写成 `<a class="sn-textbtn">`，带个往右的箭头。

## 什么时候别用

- 一个区域里最重要的动作：用主按钮。（换成 `button`）
- 只放得下一个图标：用纯图标按钮，名称放在 Tooltip 里。（换成 `iconbutton`）

## 相近的组件

- `button`：按钮有面、更醒目，用在主要动作；文字按钮只有文字，用在次要动作。
- `iconbutton`：没有文字、只有图标的按钮。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 只有样式：链接写 <a class="sn-link">，文字按钮写 class="sn-textbtn"；箭头图标写 data-i，外面包 <sn-enhance>` |
| React | `import { Icon } from "satin-ui/react"; // 只有箭头图标要引；链接、文字按钮写 className` |
| Vue | `import { Icon } from "satin-ui/vue"; // 只有箭头图标要引；链接、文字按钮写 class` |
| Svelte | `import Icon from "satin-ui/svelte/Icon.svelte"; // 只有箭头图标要引` |
| Angular | `// 只有样式：<a class="sn-link">、class="sn-textbtn"；箭头写 data-i，外面包 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 只有样式：<a class="sn-link">、class="sn-textbtn"；箭头写 data-i，外面包 <sn-enhance>` |
| Preact | `import { Icon } from "satin-ui/react"; // 只有箭头图标要引（经 preact/compat）` |

- React：纯样式，没有组件：链接写 `<a className="sn-link">`，文字按钮写 `<button className="sn-textbtn">`（去别的页面用 `<a>`），箭头用 `<Icon name="arrow-right" className="sn-after">`。
- Preact：纯样式：`<a class="sn-link">`、`<button class="sn-textbtn">`，箭头用 `satin-ui/react` 的 `<Icon>`。
- Vue：纯样式，没有组件：`<a class="sn-link">`、`<button class="sn-textbtn">`，箭头用 `<Icon name="arrow-right" class="sn-after">`。
- Svelte：纯样式：`<a class="sn-link">`、`<button class="sn-textbtn">`，箭头用 `<Icon name="arrow-right" class="sn-after">`。
- Angular：纯样式：`<a class="sn-link">`、`<button class="sn-textbtn">`，箭头写 `<span data-i="arrow-right:after">`，外面包 `<sn-enhance>`。
- Solid：纯样式：`<a class="sn-link">`、`<button class="sn-textbtn">`，箭头写 `<span data-i="arrow-right:after">`，外面包 `<sn-enhance>`。
- 纯 HTML：纯样式：`<a class="sn-link">`、`<button class="sn-textbtn">`，箭头写 `<span data-i="arrow-right:after">`，外面包 `<sn-enhance>`（换成图标）。

## 示例（由浅入深）

### 句子里的链接

和正文同色、一条淡下划线，悬停变实；链接文字说清去哪。

```html
<p class="sn-t-body">登录即表示你同意<a class="sn-link" href="/terms">用户协议</a>和<a class="sn-link" href="/privacy">隐私说明</a>。第一次用验证码登录会自动创建账号。</p>
```

纯 HTML 的写法：

```jsx
<p class="sn-t-body">登录即表示你同意<a class="sn-link" href="/terms">用户协议</a>和<a class="sn-link" href="/privacy">隐私说明</a>。第一次用验证码登录会自动创建账号。</p>
```

React 的写法：

```jsx
export default function LinkBasic() {
  return <p className="sn-t-body">登录即表示你同意<a className="sn-link" href="/terms">用户协议</a>和<a className="sn-link" href="/privacy">隐私说明</a>。第一次用验证码登录会自动创建账号。</p>;
}
```

Vue 的写法：

```vue
<template>
  <p class="sn-t-body">登录即表示你同意<a class="sn-link" href="/terms">用户协议</a>和<a class="sn-link" href="/privacy">隐私说明</a>。第一次用验证码登录会自动创建账号。</p>
</template>
```

Svelte 的写法：

```jsx
<p class="sn-t-body">登录即表示你同意<a class="sn-link" href="/terms">用户协议</a>和<a class="sn-link" href="/privacy">隐私说明</a>。第一次用验证码登录会自动创建账号。</p>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-link-basic",
  template: `
    <p class="sn-t-body">登录即表示你同意<a class="sn-link" href="/terms">用户协议</a>和<a class="sn-link" href="/privacy">隐私说明</a>。第一次用验证码登录会自动创建账号。</p>
  `,
})
export class LinkBasicComponent {}
```

Solid 的写法：

```jsx
export default function LinkBasic() {
  return <p class="sn-t-body">登录即表示你同意<a class="sn-link" href="/terms">用户协议</a>和<a class="sn-link" href="/privacy">隐私说明</a>。第一次用验证码登录会自动创建账号。</p>;
}
```

Preact 的写法：

```jsx
export default function LinkBasic() {
  return <p class="sn-t-body">登录即表示你同意<a class="sn-link" href="/terms">用户协议</a>和<a class="sn-link" href="/privacy">隐私说明</a>。第一次用验证码登录会自动创建账号。</p>;
}
```

### 文字按钮

次要操作用文字按钮：默认、更弱的 quiet、危险的 danger-text。

```html
<div class="sn-row"><button type="button" class="sn-textbtn">编辑</button><button type="button" class="sn-textbtn sn-quiet">取消</button><button type="button" class="sn-textbtn sn-quiet">忘记密码？</button><button type="button" class="sn-textbtn sn-danger-text">删除草稿</button></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-row">
  <button type="button" class="sn-textbtn">编辑</button>
  <button type="button" class="sn-textbtn sn-quiet">取消</button>
  <button type="button" class="sn-textbtn sn-quiet">忘记密码？</button>
  <button type="button" class="sn-textbtn sn-danger-text">删除草稿</button>
</div>
```

React 的写法：

```jsx
export default function LinkTextbtn() {
  return (
    <div className="sn-row">
      <button type="button" className="sn-textbtn">编辑</button>
      <button type="button" className="sn-textbtn sn-quiet">取消</button>
      <button type="button" className="sn-textbtn sn-quiet">忘记密码？</button>
      <button type="button" className="sn-textbtn sn-danger-text">删除草稿</button>
    </div>
  );
}
```

Vue 的写法：

```vue
<template>
  <div class="sn-row">
    <button type="button" class="sn-textbtn">编辑</button>
    <button type="button" class="sn-textbtn sn-quiet">取消</button>
    <button type="button" class="sn-textbtn sn-quiet">忘记密码？</button>
    <button type="button" class="sn-textbtn sn-danger-text">删除草稿</button>
  </div>
</template>
```

Svelte 的写法：

```jsx
<div class="sn-row">
  <button type="button" class="sn-textbtn">编辑</button>
  <button type="button" class="sn-textbtn sn-quiet">取消</button>
  <button type="button" class="sn-textbtn sn-quiet">忘记密码？</button>
  <button type="button" class="sn-textbtn sn-danger-text">删除草稿</button>
</div>
```

Angular 的写法：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "demo-link-textbtn",
  template: `
    <div class="sn-row">
      <button type="button" class="sn-textbtn">编辑</button>
      <button type="button" class="sn-textbtn sn-quiet">取消</button>
      <button type="button" class="sn-textbtn sn-quiet">忘记密码？</button>
      <button type="button" class="sn-textbtn sn-danger-text">删除草稿</button>
    </div>
  `,
})
export class LinkTextbtnComponent {}
```

Solid 的写法：

```jsx
export default function LinkTextbtn() {
  return (
    <div class="sn-row">
      <button type="button" class="sn-textbtn">编辑</button>
      <button type="button" class="sn-textbtn sn-quiet">取消</button>
      <button type="button" class="sn-textbtn sn-quiet">忘记密码？</button>
      <button type="button" class="sn-textbtn sn-danger-text">删除草稿</button>
    </div>
  );
}
```

Preact 的写法：

```jsx
export default function LinkTextbtn() {
  return (
    <div class="sn-row">
      <button type="button" class="sn-textbtn">编辑</button>
      <button type="button" class="sn-textbtn sn-quiet">取消</button>
      <button type="button" class="sn-textbtn sn-quiet">忘记密码？</button>
      <button type="button" class="sn-textbtn sn-danger-text">删除草稿</button>
    </div>
  );
}
```

### 带箭头的入口

去别的页面的独立入口写成 `<a class="sn-textbtn">`，箭头在文字后面，悬停时往右挪。

```html
<sn-enhance><div class="sn-row"><a class="sn-textbtn" href="/projects">查看全部项目<span data-i="arrow-right:after"></span></a><a class="sn-textbtn sn-danger-text" href="/billing">去处理<span data-i="arrow-right:after"></span></a></div></sn-enhance>
```

纯 HTML 的写法：

```jsx
<sn-enhance>
  <div class="sn-row">
    <a class="sn-textbtn" href="/projects">查看全部项目<span data-i="arrow-right:after"></span></a>
    <a class="sn-textbtn sn-danger-text" href="/billing">去处理<span data-i="arrow-right:after"></span></a>
  </div>
</sn-enhance>
```

React 的写法：

```jsx
import { Icon } from "satin-ui/react";

export default function LinkArrow() {
  return (
    <div className="sn-row">
      <a className="sn-textbtn" href="/projects">查看全部项目<Icon name="arrow-right" className="sn-after" /></a>
      <a className="sn-textbtn sn-danger-text" href="/billing">去处理<Icon name="arrow-right" className="sn-after" /></a>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { Icon } from "satin-ui/vue";
</script>

<template>
  <div class="sn-row">
    <a class="sn-textbtn" href="/projects">查看全部项目<Icon name="arrow-right" class="sn-after" /></a>
    <a class="sn-textbtn sn-danger-text" href="/billing">去处理<Icon name="arrow-right" class="sn-after" /></a>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-row">
  <a class="sn-textbtn" href="/projects">查看全部项目<Icon name="arrow-right" class="sn-after" /></a>
  <a class="sn-textbtn sn-danger-text" href="/billing">去处理<Icon name="arrow-right" class="sn-after" /></a>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-link-arrow",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-row">
        <a class="sn-textbtn" href="/projects">查看全部项目<span data-i="arrow-right:after"></span></a>
        <a class="sn-textbtn sn-danger-text" href="/billing">去处理<span data-i="arrow-right:after"></span></a>
      </div>
    </sn-enhance>
  `,
})
export class LinkArrowComponent {}
```

Solid 的写法：

```jsx
export default function LinkArrow() {
  return (
    <sn-enhance>
      <div class="sn-row">
        <a class="sn-textbtn" href="/projects">查看全部项目<span data-i="arrow-right:after"></span></a>
        <a class="sn-textbtn sn-danger-text" href="/billing">去处理<span data-i="arrow-right:after"></span></a>
      </div>
    </sn-enhance>
  );
}
```

Preact 的写法：

```jsx
import { Icon } from "satin-ui/react";

export default function LinkArrow() {
  return (
    <div class="sn-row">
      <a class="sn-textbtn" href="/projects">查看全部项目<Icon name="arrow-right" class="sn-after" /></a>
      <a class="sn-textbtn sn-danger-text" href="/billing">去处理<Icon name="arrow-right" class="sn-after" /></a>
    </div>
  );
}
```

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `click` | `MouseEvent` | 点文字按钮；链接是浏览器自己跳转。 | React：`onClick`；Vue：`@click`；Angular：`(click)`；Svelte：`onclick`；Solid：`onClick`；Preact：`onClick`；纯 HTML：`addEventListener("click")` |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-label`（全局令牌） | 链接、文字按钮的文字颜色（跟正文一样，不用蓝色） | 正文色 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-link` | 句子里的链接：淡下划线，悬停变实 |
| `.sn-textbtn` | 文字按钮：悬停出底色，按下缩一下 |
| `.sn-textbtn.sn-quiet` | 更弱的文字按钮（"取消""忘记密码？"）：二级文字色 |
| `.sn-textbtn.sn-danger-text` | 危险的文字按钮：红色文字 |
| `data-i="arrow-right:after"` | 文字后面的箭头：悬停时往右挪 2px |

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 聚焦链接或文字按钮。 |
| Enter |  | 打开链接 / 按下文字按钮（文字按钮按空格也行）。 |

## 无障碍

- 去别的地方用 `<a href>`（角色是 link）；在这里做一件事用 `<button>`。不要用 `<span>` 加点击事件。
- 键盘聚焦时 2px 焦点环（:focus-visible）。
- 链接文字要说清去哪："用户协议"，不写"点这里"。
- 新窗口打开的链接加 `rel="noopener"`，并在文字里说明。

## 设计规范

- 这样做：链接和正文同色，靠下划线区分。
- 这样做：文字按钮放在主按钮旁边当次要操作，或者放在卡片、列表的角落。
- 这样做：去别的页面的文字按钮带一个往右的箭头。
- 不要：链接用蓝色、加粗来"突出"。（规则 `link-style`）
- 不要：一行里堆好几个颜色不同的文字按钮：颜色只表达状态（危险）。（规则 `status-color`）

文案：

- 链接写名词（要去的地方）："用户协议""隐私说明"。
- 文字按钮写动作："编辑""查看全部项目"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 悬停时箭头往右挪 2px | `ease.out` | 150ms |
| 按下缩一下 | `ease.out` | 100ms |

