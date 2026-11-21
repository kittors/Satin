# 标签输入 · TagInput

> 组件 id：`taginput`　分组：表单

输入后按回车或逗号变成标签，新标签弹出来；空着时按一次退格先选中最后一个标签，再按一次才删；粘贴"雨夜，车站，悬疑"会拆成多个标签依次出现；重复的标签不再添加，已有的那个抖一下。

**输入后按回车或逗号变成标签，新标签弹出来；空着时按一次退格先选中最后一个，再按一次才删；粘贴"雨夜，车站，悬疑"会拆成几个依次出现；重复的不再加，已有的那个抖一下。**

## 什么时候用

- 给素材、镜头、项目打几个自由填写的标签。
- 输入一组关键词去搜索、筛选。

## 什么时候别用

- 从固定的几个选项里挑：用切换芯片或下拉多选。（换成 `chip`）
- 只填一个值：用输入框。（换成 `input`）

## 相近的组件

- `chip`：芯片是固定选项里点选；标签输入是自己打字加。
- `tags`：标签与徽标只负责显示；标签输入能加、能删。
- `input`：输入框填一个值；标签输入填一组短词。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `// 入口里调过 defineElements()：直接写 <sn-tag-input>（也可以 import { createTagInput } from "satin-ui"）` |
| React | `import { TagInput } from "satin-ui/react";` |
| Vue | `import { TagInput } from "satin-ui/vue";` |
| Svelte | `import TagInput from "satin-ui/svelte/TagInput.svelte";` |
| Angular | `// 入口里调过 defineElements()：模板里写 <sn-tag-input>（组件加 CUSTOM_ELEMENTS_SCHEMA）` |
| Solid | `// 入口里调过 defineElements()：直接写 <sn-tag-input>` |
| Preact | `import { TagInput } from "satin-ui/react"; // 经 preact/compat` |

- React：`TagInput` 组件：`tags` + `onChange` 受控，只给 `defaultTags` 是非受控；`max` 最多几个，`placeholder`、`hint` 是输入框里和下面的提示。
- Preact：经 preact/compat 用 `satin-ui/react` 的 `TagInput`：`tags` + `onChange` 受控，`defaultTags` 非受控。
- Vue：`TagInput` 组件：`v-model` 绑标签数组，`max`、`placeholder`、`hint`；不绑 v-model、只写 `:tags` 是初始值。
- Svelte：`TagInput` 组件（`satin-ui/svelte/TagInput.svelte`）：`bind:tags` 双向绑定，`max`、`placeholder`、`hint`。
- Angular：写 `<sn-tag-input>`：`[attr.tags]` 绑标签（JSON），加了、删了以后发冒泡的 `(sn-change)`，`$event.detail` 是现在所有标签。
- Solid：写 `<sn-tag-input>`：`tags` 写成 JSON 字符串；`sn-change` 用 `ref` 挂监听。
- 纯 HTML：写 `<sn-tag-input tags='["雨夜"]' max="8">`，加了、删了以后发冒泡的 `sn-change`，`e.detail` 是现在所有标签；也可以 `createTagInput(容器, 选项)`。

## 示例（由浅入深）

### 最简单的用法

给一开始的标签就能用：回车、逗号加，退格删。

```html
<sn-tag-input tags='["雨夜","车站"]'></sn-tag-input>
```

纯 HTML 的写法：

```jsx
<sn-tag-input tags='["雨夜","车站"]'></sn-tag-input>
```

React 的写法：

```jsx
import { TagInput } from "satin-ui/react";

export default function SceneTags() {
  return <TagInput defaultTags={["雨夜", "车站"]} />;
}
```

Vue 的写法：

```vue
<script setup>
import { TagInput } from "satin-ui/vue";
</script>

<template>
  <TagInput :tags='["雨夜", "车站"]' />
</template>
```

Svelte 的写法：

```jsx
<script>
  import TagInput from "satin-ui/svelte/TagInput.svelte";
</script>

<TagInput tags={["雨夜", "车站"]} />
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-taginput-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-tag-input>
  template: `<sn-tag-input [attr.tags]="tags"></sn-tag-input>`,
})
export class TaginputBasicComponent {
  protected tags = JSON.stringify(["雨夜", "车站"]);
}
```

Solid 的写法：

```jsx
// 自定义元素的属性只认字符串：数组写成 JSON
const TAGS = JSON.stringify(["雨夜", "车站"]);

export default function SceneTags() {
  return <sn-tag-input tags={TAGS}></sn-tag-input>;
}
```

Preact 的写法：

```jsx
import { TagInput } from "satin-ui/react";

export default function SceneTags() {
  return <TagInput defaultTags={["雨夜", "车站"]} />;
}
```

### 受控：标签放在父组件里

加了、删了都回到父组件，拿去保存或者搜索；父组件改了，界面也跟着变。

```html
<div class="sn-stack sn-gap-8"><sn-tag-input max="5" placeholder="输入关键词，回车确认" tags='["悬疑","长镜头"]'></sn-tag-input><span class="sn-help">已添加 2 / 5 个</span></div>
```

纯 HTML 的写法：

```jsx
<div class="sn-stack sn-gap-8" id="taginput-controlled-box">
  <sn-tag-input max="5" placeholder="输入关键词，回车确认" tags='["悬疑","长镜头"]'></sn-tag-input>
  <span class="sn-help">已添加 2 / 5 个</span>
</div>

<script type="module">
  const box = document.getElementById("taginput-controlled-box");
  box.addEventListener("sn-change", (e) => {
    const v = e.detail;
    box.querySelector(".sn-help").textContent = `已添加 ${v.length} / 5 个`;
  });
</script>
```

React 的写法：

```jsx
import { useState } from "react";
import { TagInput } from "satin-ui/react";

export default function KeywordTags() {
  const [tags, setTags] = useState(["悬疑", "长镜头"]);
  return (
    <div className="sn-stack sn-gap-8">
      <TagInput max={5} placeholder="输入关键词，回车确认" tags={tags} onChange={setTags} />
      <span className="sn-help">已添加 {tags.length} / 5 个</span>
    </div>
  );
}
```

Vue 的写法：

```vue
<script setup>
import { ref } from "vue";
import { TagInput } from "satin-ui/vue";

const tags = ref(["悬疑", "长镜头"]);
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <TagInput v-model="tags" :max="5" placeholder="输入关键词，回车确认" />
    <span class="sn-help">已添加 {{ tags.length }} / 5 个</span>
  </div>
</template>
```

Svelte 的写法：

```jsx
<script>
  import TagInput from "satin-ui/svelte/TagInput.svelte";

  let tags = $state(["悬疑", "长镜头"]);
</script>

<div class="sn-stack sn-gap-8">
  <TagInput max={5} placeholder="输入关键词，回车确认" bind:tags={tags} />
  <span class="sn-help">已添加 {tags.length} / 5 个</span>
</div>
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, computed } from "@angular/core";

@Component({
  selector: "demo-taginput-controlled",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-tag-input>
  template: `
    <div class="sn-stack sn-gap-8">
      <sn-tag-input max="5" placeholder="输入关键词，回车确认" [attr.tags]="tagsJson()" (sn-change)="tags.set($any($event).detail)"></sn-tag-input>
      <span class="sn-help">已添加 {{ tags().length }} / 5 个</span>
    </div>
  `,
})
export class TaginputControlledComponent {
  protected tags = signal(["悬疑", "长镜头"]);
  protected tagsJson = computed(() => JSON.stringify(this.tags()));
}
```

Solid 的写法：

```jsx
import { createSignal } from "solid-js";

// 名字带横线的事件用 ref 挂（Solid 的 onXxx 只认驼峰的事件名）
const on = (type, fn) => (el) => el.addEventListener(type, fn);

export default function KeywordTags() {
  const [tags, setTags] = createSignal(["悬疑", "长镜头"]);
  return (
    <div class="sn-stack sn-gap-8">
      <sn-tag-input max="5" placeholder="输入关键词，回车确认" tags={JSON.stringify(tags())} ref={on("sn-change", (e) => setTags(e.detail))}></sn-tag-input>
      <span class="sn-help">已添加 {tags().length} / 5 个</span>
    </div>
  );
}
```

Preact 的写法：

```jsx
import { useState } from "react";
import { TagInput } from "satin-ui/react";

export default function KeywordTags() {
  const [tags, setTags] = useState(["悬疑", "长镜头"]);
  return (
    <div class="sn-stack sn-gap-8">
      <TagInput max={5} placeholder="输入关键词，回车确认" tags={tags} onChange={setTags} />
      <span class="sn-help">已添加 {tags.length} / 5 个</span>
    </div>
  );
}
```

### 限制个数、换说明

用来搜索时三个就够：max 限个数，hint 写规则。

```html
<sn-tag-input max="3" placeholder="例如：雨夜" hint="按标签找素材，最多 3 个"></sn-tag-input>
```

纯 HTML 的写法：

```jsx
<sn-tag-input max="3" placeholder="例如：雨夜" hint="按标签找素材，最多 3 个"></sn-tag-input>
```

React 的写法：

```jsx
import { TagInput } from "satin-ui/react";

export default function SearchTags() {
  return <TagInput max={3} placeholder="例如：雨夜" hint="按标签找素材，最多 3 个" />;
}
```

Vue 的写法：

```vue
<script setup>
import { TagInput } from "satin-ui/vue";
</script>

<template>
  <TagInput :max="3" placeholder="例如：雨夜" hint="按标签找素材，最多 3 个" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import TagInput from "satin-ui/svelte/TagInput.svelte";
</script>

<TagInput max={3} placeholder="例如：雨夜" hint="按标签找素材，最多 3 个" />
```

Angular 的写法：

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-taginput-hint",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-tag-input>
  template: `<sn-tag-input max="3" placeholder="例如：雨夜" hint="按标签找素材，最多 3 个"></sn-tag-input>`,
})
export class TaginputHintComponent {}
```

Solid 的写法：

```jsx
export default function SearchTags() {
  return <sn-tag-input max="3" placeholder="例如：雨夜" hint="按标签找素材，最多 3 个"></sn-tag-input>;
}
```

Preact 的写法：

```jsx
import { TagInput } from "satin-ui/react";

export default function SearchTags() {
  return <TagInput max={3} placeholder="例如：雨夜" hint="按标签找素材，最多 3 个" />;
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `tags` | `string[]` | [] | 否 | 现在的标签；传进来的值换了，就照它显示。<br>React、Preact：现在的标签，受控：在 `onChange` 里更新；传进来的值换了，就照它显示。<br>Vue：现在的标签：`v-model` 绑定；传进来的值换了，就照它显示。<br>Svelte：现在的标签：`bind:tags` 绑定；传进来的值换了，就照它显示。 | createXxx 选项：`tags`；React：`tags`；Vue：`v-model`；Svelte：`bind:tags`；Preact：`tags`；自定义元素：`tags（JSON）`；标记：`每个标签一个 span.sn-chip.sn-tag（脚本加）`；纯 HTML：`tags（JSON）` |
| `defaultTags` | `string[]` | [] | 否 | 非受控：一开始的标签。<br>Vue：非受控：一开始的标签（不绑 `v-model`、只写 `:tags`）。 | React：`defaultTags`；Preact：`defaultTags`；Vue：`tags` |
| `max` | `number` | 8 | 否 | 最多几个；满了再加，下面的计数抖一下。 | createXxx 选项：`max`；React：`max`；Vue：`max`；Svelte：`max`；Preact：`max`；自定义元素：`max`；标记：`data-max`；纯 HTML：`max` |
| `placeholder` | `string` | "输入标签，回车确认" | 否 | 输入框里的提示（英文界面跟着换）。 | createXxx 选项：`placeholder`；React：`placeholder`；Vue：`placeholder`；Svelte：`placeholder`；Preact：`placeholder`；自定义元素：`placeholder`；标记：`input 的 placeholder`；纯 HTML：`placeholder` |
| `hint` | `string` | "回车或逗号添加 · 退格删除" | 否 | 下面那行左边的说明（右边是计数）。 | createXxx 选项：`hint`；React：`hint`；Vue：`hint`；Svelte：`hint`；Preact：`hint`；自定义元素：`hint`；标记：`.sn-tagin-foot 里第一个 span`；纯 HTML：`hint` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `change` | `string[]` | 加了、删了标签以后，参数是现在所有标签（一开始给的、程序里改 tags 都不触发）。 | createXxx 选项：`onChange`；React：`onChange`；Vue：`@update:modelValue / @change`；Svelte：`onchange`；Preact：`onChange`；Angular：`(sn-change)`；Solid：`sn-change（ref 挂监听）`；自定义元素：`sn-change`；纯 HTML：`sn-change（e.detail）` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `tags` | `readonly tags: string[]` | 现在的标签。 |
| `add` | `add(tag: string): void` | 加一个（重复的、满了的不加，抖一下；会发 change）。 |
| `clear` | `clear(): void` | 全部清掉（会发 change）。 |
| `set` | `set(tags: string[]): void` | 换成这些标签：不在里面的去掉，缺的补上（不发 change）。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-field`（全局令牌） | 输入框的底色 | 白（深色主题是深灰） |
| `--sn-danger`（全局令牌） | 退格选中、马上要删的那个标签 | 红 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-box-in.sn-tagin[data-tagin]` | 输入框（data-max 最多几个） |
| `.sn-tagin .sn-chip.sn-tag` | 一个标签；退格选中时加 .sn-armed |
| `.sn-tagin-foot` | 下面那行：说明 + 计数（紧跟在输入框后面） |

## 导出的类型

`TagInputOptions`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Enter / 逗号 |  | 把输入的字变成标签。 |
| Backspace（输入框空着） |  | 第一次选中最后一个标签，第二次删掉它。 |
| 粘贴 |  | 带逗号、顿号、换行的一串拆成几个标签。 |

## 无障碍

- 输入框 `aria-label="添加标签"`；每个标签的 × 是按钮，`aria-label` 写"移除 雨夜"。
- 点输入框外面的空白处，焦点回到输入框；删完标签焦点留在输入框里。
- 外面放进字段（Field），标签写清楚是什么标签。

## 设计规范

- 这样做：标签用名词短语，两到四个字。
- 这样做：`max` 按用途定：搜索三五个，打标签八个左右。
- 不要：给每个标签配不同的颜色。（规则 `status-color`）
- 不要：标签里放图标、emoji 装饰。（规则 `no-ai-icons`）

文案：

- 提示写怎么加："输入标签，回车确认"。
- 说明写规则："最多 3 个"。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 新标签弹出来（缩放 + 淡入） | `pop` | 260ms |
| 删掉的原地缩小淡出，后面的补位 | `ease.in / 弹簧` | 140ms / 300ms |
| 重复、满了：抖一下 | `spring` | 300ms |

