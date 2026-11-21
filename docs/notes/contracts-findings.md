# 组件契约：这一轮查出来的库问题（只记录，没改实现）

2026-11-21，填 5 个样板契约（button、select、dialog、picker、grid）和补类型时对着实现核出来的。实现没动，类型已经按实现改了（见最后一节）。

## 实现里的问题

1. **轻提示的图标颜色丢了**：`src/feedback.js` 的 `setIcon` 把 tone 原样加成类名（`ok`、`danger`、`info`），样式里是 `.sn-glyph.sn-ok / .sn-danger / .sn-info`——加 `sn-` 前缀时漏了，成功的绿色对勾、失败的红色都不显示。
2. **下拉选择的无障碍**：条目没有 `role="option"` 和 `aria-selected`；触发器没有 `aria-haspopup`、`aria-expanded`。读屏读不出"展开 / 收起"和当前高亮项。
3. **弹窗没有名字**：React、Vue 的 `Dialog` 组件没给 `<dialog>` 写 `aria-labelledby`，读屏读不出弹窗名字（手写标记的示例里自己写了）。
4. **选择器按钮套按钮**：清除（×）是写在触发框 `<button>` 里面的 `role="button"`。
5. **数据表格**：
   - 没有 `aria-rowcount`、`aria-rowindex`，读屏不知道一共多少行、现在第几行；
   - 拖表头时的"影子"动画改的是 `left`（`src/grid.js` 204 行），不是 transform；改完格子的"闪一下"动的是 `background-color`——都不符合"只动 transform、opacity、filter"；
   - `createDataGrid` 的实例上带着一串内部方法（`src`、`model`、`setActive`、`startEdit`、`toggleTree`、`expandAll`、`poolSize`……，`defineComponent` 照抄了 `mountDataGrid` 返回值的所有属性），类型里没有。要么挑几个公开、写进类型，要么不往实例上抄。
6. **提示词输入框**：`onSend` 收到的 `message.files` 是附件行元素（元素上的 `_file` 才是 File），不是 File 数组。
7. **无限列表**：`createInfiniteList` 把 `onCount` 换成了只转第一个参数的发事件函数，用户拿不到 `total`（`mountInfiniteList` 本身给两个参数）。
8. **按钮等待时没有 `aria-busy`**，读屏不知道在等。
9. **选择器只给显示文字**：`pick` / `onChange` 的 detail 只有 `{ text }`（比如"11 月 19 日 星期四"），拿不到日期对象或标准格式的值，交给接口要自己解析文字。
10. **库里留着展示页的事件**：`closeDialog` 关完会在弹窗上发 `reset-demo`（`src/overlay.js`），是设计稿演示用的。

## 不在我范围里、要别人改的

- `skills/satin/SKILL.md` 164 行写 `notify({ title, text })`，实现读的是 `body`（`text` 不起作用）。
- `node scripts/test/sync.mjs` 报 `skills/satin/scripts/lib/classes.snapshot.json` 和源头不一致（库源码最近改过），`pnpm test:node` 卡在这一步；跑 `node scripts/test/sync.mjs --write` 重新生成。

## 这一轮改的类型（packages/satin-ui/types）

- `components.d.ts`
  - 滚动区域：`ScrollAreaOptions` 补全（`bar` 五种、`barSize`、`barInset`、`overscroll` 四种、`wheel`），实例加 `box`、`vp`、`refresh()`、`set()`、`options`。
  - 搜索框的 `search` 可以返回数量、结果数组或它们的 Promise。
  - 提示词输入框：`onSend` 的 `files` 是 `HTMLElement[]`、可以返回 Promise；实例加 `setBusy`、`clear`、`files`。
  - 进度卡片：新类型 `ProgressCardApi`（`start`、`set`、`finish`、`cancel`），`createProgressCard`、`mountProgress` 用它。
  - 日期选择：新类型 `PickDetail`、`PickerOptions`，`createPicker`、`bindPickers` 用它们。
  - 上传：选项加 `badType`、`tooBig`，实例加 `add(files)`。
  - 无限列表：实例加 `reload`、`scrollTop`、`count`；`onCount(loaded, total?)`。
  - 播放器、音频条：实例加 `play / pause / toggle / video`、`toggle / audio`。
  - `busy(btn, work: number | PromiseLike<unknown>): Promise<void>`（原来写成收函数、返回 T）。
  - 轻提示：`kind` 是 `status | action | progress`（原来写了实现里没有的 `undo`），`tone` 是 `ok | danger | info`（和样式对应）；`ToastHandle` 加 `el`、`pause`。
  - 通知：新类型 `NotifyHandle`；`NotifyOptions` 的正文是 `body`、`tone` 是 `ok | bad | warn`、按钮的 `run(card)` 收到卡片本身。
  - 弹出面板：新类型 `PopoverHandle`，`openPopover`、`openPopoverAt`、`popoverOf` 的返回值用它。
  - 命令面板：新类型 `CommandItem`（`name`、`icon`、`sub`、`key`、`keys`，可以带自己的字段），`createCommandPalette` 按实现补全选项（`empty`、`onEmpty`）和返回值（`input`、`list`）。
  - `mountSelect` 的返回值补全（`open`、`close`、`set`），`onChange(value, item)`。
  - `enhance` 上面重复的两段说明合成一段。
- `heavy.d.ts`：对话 `respond` 的 `ctx.stopped` 是只读属性（实现里是 getter）；`mountPlayer` 的 `play` 返回 Promise。
- `react.d.ts`：新类型 `ButtonProps`、`SelectProps`、`DialogProps`；`notify` 返回 `NotifyHandle`。
- `vue.d.ts`：`notify` 返回 `NotifyHandle`。
