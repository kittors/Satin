# 按钮 · Button

> 组件 id：`button`　分组：按钮

扁平：纯色面或 1px 细边，不用渐变和投影。悬停加深一档，按下再加深一档并轻轻缩一下。6 种变体由强到弱，每个区域只放一个主按钮。顶栏"评审"可以切换圆角来比较。

**点了马上在这里做一件事：保存、新建、导出、删除。**

## 什么时候用

- 点了就执行的动作：保存修改、新建项目、导出成片。
- 一个区域里最重要的那一个动作用主按钮（primary），其余用次按钮、浅底按钮或幽灵按钮。
- 要等结果的动作（发请求）：用 `busy()` 显示等待，完成后用 `succeed()` 原地打勾。

## 什么时候别用

- 去别的页面、打开一个地址：用链接（`<a>`），不要用按钮。（换成 `link`）
- 工具栏里只有图标的操作：用纯图标按钮，并且写上名称。（换成 `iconbutton`）
- 在几个选项里选一个并保持选中：用分段控件或切换芯片。（换成 `segmented`）

## 相近的组件

- `link`：链接是去别处（换页、打开地址），按钮是在这里做一件事。句子里的跳转用链接。
- `iconbutton`：没有文字、只有图标的按钮；名称写在 Tooltip 和 `aria-label` 里。
- `compound`：几个相关操作连成一组、主操作带几个备选（分裂按钮）、复制按钮。
- `chip`：芯片是能选中、能取消的筛选条件，不是一次性的动作。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { setup, enhance, busy, succeed } from "satin-ui";` |
| React | `import { Button } from "satin-ui/react";` |
| Vue | `import { Button as SnButton } from "satin-ui/vue";` |
| Svelte | `import { setup, enhance, busy, succeed } from "satin-ui";` |
| Angular | `import { setup, enhance, busy, succeed } from "satin-ui";` |
| Solid | `import { setup, enhance, busy, succeed } from "satin-ui";` |
| Preact | `import { setup, enhance, busy, succeed } from "satin-ui";` |

React、Vue 用组件；其余框架和纯 HTML 直接写 `<button class="sn-btn">`，样式在 page.css 里，图标和 Tooltip 由 `setup()` + `enhance()` 接上，等待、成功用 `busy()`、`succeed()`。

## 示例（由浅入深）

### 基础用法

一个区域只放一个主按钮，次要的动作用 secondary。手写标记时写上 `type="button"`，放进表单也不会意外提交。

```html
<div class="sn-row">
  <button type="button" class="sn-btn sn-secondary">取消</button>
  <button type="button" class="sn-btn sn-primary">保存修改</button>
</div>
```

### 变体

由强到弱：一屏只有一个 primary；danger 只给删除这类不能撤销的动作，danger-soft 给危险但不是主操作的地方，比如列表里的"移出团队"。

```html
<div class="sn-row">
  <button type="button" class="sn-btn sn-primary">新建项目</button>
  <button type="button" class="sn-btn sn-secondary">导入原文</button>
  <button type="button" class="sn-btn sn-tertiary">预览</button>
  <button type="button" class="sn-btn sn-ghost">跳过</button>
  <button type="button" class="sn-btn sn-danger">删除项目</button>
  <button type="button" class="sn-btn sn-danger-soft">移出团队</button>
</div>
```

### 尺寸

sm（28）用在表格行和工具条；默认 32；lg（40）用在登录页和手机上的主操作，再加上外边距，点击区够 44。

```html
<div class="sn-row">
  <button type="button" class="sn-btn sn-primary sn-sm">保存修改</button>
  <button type="button" class="sn-btn sn-primary">保存修改</button>
  <button type="button" class="sn-btn sn-primary sn-lg">保存修改</button>
</div>
```

### 带图标

图标在前说明动作，在后表示"往前走"（悬停时箭头右移）。只有图标的按钮必须写 `data-tip` 和 `aria-label`，悬停和读屏都靠它。

```html
<div class="sn-row">
  <button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
  <button type="button" class="sn-btn sn-secondary" data-i="arrow-right:after">下一步</button>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
  <button type="button" class="sn-btn sn-ghost sn-ibtn sn-selected" data-i="layout-grid" data-tip="网格视图" aria-label="网格视图"></button>
</div>
```

### 状态：禁用、等待、成功

禁用不用原生 disabled：还能聚焦，悬停时 tip 说出原因。等待和成功一般由 `busy()`、`succeed()` 自动加上，这里把样子静态摆出来。

```html
<div class="sn-row">
  <button type="button" class="sn-btn sn-danger sn-is-disabled" aria-disabled="true" data-tip="输入项目名称后才能删除">删除项目</button>
  <button type="button" class="sn-btn sn-primary sn-busy"><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">正在保存</span></span></button>
  <button type="button" class="sn-btn sn-primary sn-ok"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">保存修改</span></span></button>
</div>
```

### 等待 → 成功（发请求）

`busy()` 等请求：300ms 内回来就不闪转圈，转圈出现后至少留 500ms；成功后 `succeed()` 原地打勾 1.5 秒。按钮里先写好 `.sn-label` 结构，宽度全程不变。

```html
<button type="button" class="sn-btn sn-primary" data-act="save"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">保存修改</span></span></button>
```

```js
import { busy, succeed } from "satin-ui";

const save = document.querySelector('[data-act="save"]');
// 换成真实的请求，比如 fetch("/api/projects/42", { method: "PUT" })
const request = () => new Promise((done) => setTimeout(done, 1200));
save.addEventListener("click", async () => {
  await busy(save, request());
  succeed(save);
});
```

### 组合：底部操作区

主按钮在最右，取消紧挨着它；"不保存"这类第三个出口放到最左，和前两个隔开，免得误点。

```html
<div class="sn-row sn-between">
  <button type="button" class="sn-btn sn-ghost">不保存</button>
  <div class="sn-row sn-gap-8">
    <button type="button" class="sn-btn sn-secondary">取消</button>
    <button type="button" class="sn-btn sn-primary">保存</button>
  </div>
</div>
```

### 手机上：底部操作栏

手机上主操作放在底部贴边的操作栏里，用 sn-lg；操作栏自己会避开 iPhone 底部横条和弹起的软键盘。

```html
<div class="sn-bottom-bar">
  <span class="sn-grow sn-num">合计 ¥ 1,280</span>
  <button type="button" class="sn-btn sn-primary sn-lg">提交订单</button>
</div>
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `variant` | `"primary" \| "secondary" \| "tertiary" \| "ghost" \| "danger" \| "danger-soft"` | "secondary" | 否 | 外观，由强到弱：primary 主按钮（一个区域只放一个）、secondary 次按钮、tertiary 浅底、ghost 只有文字（悬停才有底色）、danger 删除这类不能撤销的动作、danger-soft 危险但不是这一屏的主操作。（例：`variant="primary"`） | createXxx 选项：`variant`；React：`variant`；Vue：`variant`；标记：`类名 sn-primary / sn-secondary / sn-tertiary / sn-ghost / sn-danger / sn-danger-soft` |
| `size` | `"sm" \| "md" \| "lg"` | "md" | 否 | 高度 28 / 32 / 40。sm 用在表格行和工具条；lg 用在登录页和手机上的主操作。 | createXxx 选项：`size`；React：`size`；Vue：`size`；标记：`类名 sn-sm / sn-lg（md 不用写）` |
| `icon` | `string` | — | 否 | 图标名（satin-ui/icons 里的名字），放在文字前面；没有文字时就是纯图标按钮，这时一定要写 tip。（例：`icon="plus"`） | createXxx 选项：`icon`；React：`icon`；Vue：`icon`；标记：`data-i="plus:before"（enhance() 换成图标）` |
| `iconAfter` | `string` | — | 否 | 放在文字后面的图标，比如"下一步 →"；悬停时往右挪 2px。React、Vue 里把 `<Icon class="sn-after">` 写进子元素。 | createXxx 选项：`iconAfter`；标记：`data-i="arrow-right:after"` |
| `round` | `boolean` | false | 否 | 圆形，配合纯图标按钮用。 | createXxx 选项：`round`；React：`round`；Vue：`round`；标记：`类名 sn-round` |
| `selected` | `boolean` | false | 否 | 选中态，给切换型的纯图标按钮用（比如"显示网格"）。 | createXxx 选项：`selected`；React：`selected`；Vue：`selected`；标记：`类名 sn-selected` |
| `disabled` | `boolean` | false | 否 | 不能点。用 `aria-disabled` 实现：还能聚焦，悬停时 tip 说明为什么不能点，点了不触发 click。不要只写原生的 disabled——读屏会跳过它，原因也看不到。 | createXxx 选项：`disabled`；React：`disabled`；Vue：`disabled`；标记：`aria-disabled="true" + 类名 sn-is-disabled` |
| `busy` | `boolean` | false | 否 | 等待态（转圈）。发请求时用 `busy()` 函数更好：300ms 内完成就不闪转圈，出现后至少留 500ms。 | createXxx 选项：`busy`；React：`busy`；Vue：`busy`；标记：`类名 sn-busy（按钮里要有 .sn-label 结构，见"等待 → 成功"示例）` |
| `tip` | `string` | — | 否 | 悬停 500ms 后显示的 Tooltip；纯图标按钮同时写成 `aria-label`；禁用时写不能点的原因。（例：`tip="输入项目名称后才能删除"`） | createXxx 选项：`tip`；React：`tip`；Vue：`tip`；标记：`data-tip` |
| `type` | `"button" \| "submit" \| "reset"` | "button" | 否 | 表单里的提交按钮写 submit。组件默认 button，放进表单也不会意外提交；手写标记时原生 `<button>` 默认是 submit，记得写 `type="button"`。 | createXxx 选项：`type`；React：`type`；Vue：`type`；标记：`type` |
| `text` | `string` | "" | 否 | 按钮文字（buttonHTML 用；React、Vue 写在子元素 / 默认插槽里）。 | createXxx 选项：`text` |
| `attrs` | `Record<string, string>` | {} | 否 | 其余要写到 `<button>` 上的属性（buttonHTML 用），比如 { "`data-act`": "save" }。 | createXxx 选项：`attrs` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `click` | `MouseEvent` | 点按钮，或者聚焦时按回车、空格；禁用（`aria-disabled`）和等待中（sn-busy）时不触发。 | React：`onClick`；Vue：`@click`；Angular：`(click)`；Svelte：`onclick`；Solid：`onClick`；Preact：`onClick`；纯 HTML：`addEventListener("click")` |

## 插槽 / 子元素

| 名称 | 说明 | 各写法 |
|---|---|---|
| `default` | 按钮文字，可以放图标。 | React：`children`；Vue：`默认插槽`；标记：`<button> 里的内容` |

## 函数

| 签名 | 从哪引 | 说明 |
|---|---|---|
| `buttonHTML(o?: ButtonHTMLOptions): string` | `satin-ui` | 生成按钮的标记（纯字符串，服务端渲染也能用），和手写的一模一样。 |
| `busy(btn: HTMLElement, work: number \| PromiseLike<unknown>): Promise<void>` | `satin-ui` | 等待：work 是请求的 Promise（或毫秒数）。300ms 内完成不显示转圈；转圈出现后至少留 500ms；期间点不了。 |
| `succeed(btn: HTMLElement, back?: number): void` | `satin-ui` | 原地换成对勾、扫一道光，back 毫秒后（默认 1500）换回文字。只在"完成"的时刻用。 |
| `prepBusy(button: HTMLElement): HTMLElement` | `satin-ui` | 把按钮内容包成等待需要的结构（`.sn-label` > `.sn-spin` + `.sn-tick` + `.sn-txt`），第一次转圈时宽度不跳。标记里已经写好这个结构就不用调。 |

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-h` | 高度（sm 28、md 32、lg 40） | 32px |
| `--sn-px` | 左右内边距 | 12px |
| `--sn-r` | 圆角 | var(--sn-btn-r) |
| `--sn-fs` | 字号 | 13px |
| `--sn-icon` | 图标大小 | 16px |
| `--sn-bg` | 底色；各变体、悬停、按下时换的都是这个变量 | transparent |
| `--sn-fg` | 文字颜色 | var(--sn-label) |
| `--sn-line` | 1px 内描边的颜色（secondary 有，其余透明） | transparent |
| `--sn-btn-r`（全局令牌） | 全局按钮圆角，跟着圆角档变（根元素 `data-radius`：6 / 8 / 10 / pill） | 999px（默认胶囊） |
| `--sn-press`（全局令牌） | 按下时缩放到多少 | .97 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-btn` | 按钮 |
| `.sn-primary / .sn-secondary / .sn-tertiary / .sn-ghost / .sn-danger / .sn-danger-soft` | 变体 |
| `.sn-sm / .sn-lg` | 尺寸（md 不用写） |
| `.sn-ibtn` | 纯图标按钮（宽 = 高） |
| `.sn-round` | 圆形（配合 `.sn-ibtn`） |
| `.sn-selected` | 选中态（配合 `.sn-ibtn`） |
| `.sn-busy / .sn-ok` | 等待（转圈）/ 成功（对勾），一般由 `busy()`、`succeed()` 加上 |
| `.sn-is-disabled + aria-disabled="true"` | 禁用 |
| `.sn-sheen、.sn-label > .sn-spin + .sn-tick + .sn-txt` | 等待、成功要用的结构（`prepBusy()` 会补） |
| `data-i="名字:before" / "名字:after"` | 图标在文字前 / 后 |
| `data-tip、data-kbd` | Tooltip 的文字和快捷键 |

## 导出的类型

`ButtonHTMLOptions`、`ButtonProps`、`Variant`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| Tab |  | 聚焦按钮；禁用的按钮也能聚焦，好让人看到原因。 |
| Enter / 空格 |  | 按下按钮（原生 `<button>` 的行为）。 |

## 无障碍

- 用原生 `<button>`，角色就是 button；不要用 div 模拟按钮。
- 键盘聚焦时显示 2px 的焦点环（:focus-visible），鼠标点击时不显示。
- 只有图标的按钮必须有名称：写 tip（组件会同时写成 `aria-label`），或者直接写 `aria-label`。
- 禁用用 `aria-disabled` 而不是 disabled：读屏能读到，悬停能看到原因；`setup()` 会拦下它的点击。
- 等待中按钮点不了。现在没有自动加 `aria-busy`，需要读屏播报结果时，用轻提示（toast）写出来。

## 设计规范

- 这样做：一个区域只放一个主按钮；底部操作区主按钮放最右，取消紧挨在它左边。
- 这样做：文字写动作："删除项目""导出成片"，不写"确定""提交"。
- 这样做：删除这类不能撤销的动作用 danger，在弹窗里写清影响范围再确认。
- 不要：渐变底色、彩色投影、发光描边。（规则 `no-gradient`）
- 不要：按钮下面压一层彩色阴影来"突出"主操作。（规则 `no-colored-shadow`）
- 不要：按钮文字换行，或者长文字把按钮撑成两行。（规则 `button-wrap`）
- 不要：去掉焦点环（outline: none 又不给别的焦点样式）。（规则 `focus-visible`）
- 不要：手机上用 sm 按钮做主操作，点不中。（规则 `touch-target`）

文案：

- 动词 + 对象："新建项目""导入原文"。
- 禁用时 tip 写原因："输入项目名称后才能删除"。
- 危险按钮写清后果："删除项目"，不写"删除"两个字了事。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 悬停、按下时的底色 | `--sn-ease-out` | 120ms |
| 按下时缩到 0.97 | `--sn-ease-out` | 100ms |
| 文字后的箭头悬停时右移 2px | `--sn-ease-out` | 150ms |
| 转圈出现 | `--sn-ease-out` | 180ms |
| 成功时光泽扫过一次 | `--sn-ease-in-out` | 700ms |

## 验收要点

- **等待**：转圈贴在文字左边，文字和按钮宽度都不动；300ms 内完成就不显示转圈，出现后至少留 500ms。
- **成功**：对勾弹出，光泽扫过一次，只在"完成"的时刻用。
- **禁用**：整体降到 45%，悬停时用 Tooltip 说明原因，不在旁边另加一行灰字。
- **文字**：写明动作（"删除项目"），不写"确定"；按钮文字不换行。

## 规则

- **等待**：转圈贴在文字左边，文字和按钮宽度都不动；300ms 内完成就不显示转圈，出现后至少留 500ms。
- **成功**：对勾弹出，光泽扫过一次，只在"完成"的时刻用。
- **禁用**：整体降到 45%，悬停时用 Tooltip 说明原因，不在旁边另加一行灰字。
- **文字**：写明动作（"删除项目"），不写"确定"；按钮文字不换行。

