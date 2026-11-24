// 乐观更新的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "乐观更新",
  lead: "几乎一定成功、能撤回的操作（收藏、开关、重命名、排序）先显示结果再保存；保存失败时这一行左右抖两下、恢复原样，并弹出带\"重试\"的提示。付款、永久删除、发给别人的操作不用乐观更新。",
  whenToUse: ["收藏、点赞、开关设置、重命名、排序这类几乎一定成功、能撤回的操作。"],
  whenNotToUse: [
    { text: "付款、永久删除、发给别人的消息：等服务器确认，按钮转圈。", use: "button" },
    { text: "要先确认的不能撤销的操作：先问一句。", use: "popconfirm" },
  ],
  related: [
    { id: "toast", diff: "保存失败的提示就是轻提示，带\"重试\"。" },
    { id: "button", diff: "不乐观的操作用按钮的等待状态（loading / busy）。" },
    { id: "reorder", diff: "排序放下就保存，也是乐观更新。" },
  ],
  import: {
    html: 'import { optimistic } from "satin-ui";',
    react: 'import { optimistic } from "satin-ui";',
    vue: 'import { optimistic } from "satin-ui";',
    svelte: 'import { optimistic } from "satin-ui";',
    angular: 'import { optimistic } from "satin-ui";',
    solid: 'import { optimistic } from "satin-ui";',
    preact: 'import { optimistic } from "satin-ui";',
  },
  importNote: {
    react: "`apply` / `revert` 里用 setState 的函数式写法（失败后点\"重试\"会再调一次 apply，照样对）；`shake` 给这一行的 ref。",
    preact: "和 React 一样：`apply` / `revert` 里改状态，`shake` 给这一行的 ref。",
    vue: "`apply` / `revert` 里改 ref / reactive；`shake` 给模板 ref 拿到的元素。",
    svelte: "`apply` / `revert` 里改 `$state`；`shake` 给 `bind:this` 拿到的元素。",
    angular: "`apply` / `revert` 里 `signal.set` / `update`；`shake` 给 `viewChild` 拿到的元素。",
    solid: "`apply` / `revert` 里调 setter；`shake` 给 ref 拿到的元素。",
    html: "`optimistic({ apply, revert, save, shake })`：apply 马上改界面，save 返回 Promise；失败时库调 revert、抖 shake、弹提示，点\"重试\"整个再来一遍。",
  },
  dts: { options: "OptimisticOptions", functions: ["optimistic"] },
  props: [
    { name: "apply", type: "() => void", default: "—", required: true, desc: "马上把界面改成结果（保存之前）；点\"重试\"时会再调一次，写成幂等的。", names: { js: "apply" } },
    { name: "revert", type: "() => void", default: "—", required: true, desc: "保存失败时改回去。", names: { js: "revert" } },
    { name: "save", type: "() => Promise<unknown> | unknown", default: "—", required: true, desc: "真正的保存：返回 Promise，reject 就算失败。", names: { js: "save" } },
    { name: "shake", type: "HTMLElement | null", default: "—", required: false, desc: "失败时左右抖两下的元素（一般是这一行）。", names: { js: "shake" } },
    { name: "failText", type: "string", default: "\"没保存上，已恢复原样\"", required: false, desc: "失败提示的字（提示里自带\"重试\"）。", names: { js: "failText" } },
  ],
  events: [],
  slots: [],
  methods: [],
  functions: [
    { name: "optimistic", signature: "optimistic(options: OptimisticOptions): Promise<unknown>", returns: "Promise<unknown>", from: "satin-ui", desc: "先 apply 再 save；返回 save 的 Promise（失败时 reject，提示和恢复库已经做了）。" },
  ],
  cssVars: [{ name: "--sn-danger", desc: "失败提示的图标", default: "红", token: true }],
  classes: [{ name: ".sn-shake2", desc: "失败时加在 shake 元素上：左右抖两下（播完自己拿掉）" }, { name: ".sn-opt-row", desc: "设计稿里的一行（名字 + 操作）" }],
  types: ["OptimisticOptions"],
  keyboard: [{ keys: "Tab / Enter", does: "失败提示里的\"重试\"是按钮，能用键盘点。" }],
  a11y: {
    roles: ["失败提示用 `role=\"alert\"` 读出来；收藏这类开关按钮写 `aria-pressed`，apply / revert 时一起改。"],
    focus: ["失败恢复时焦点不动，留在原来的按钮上。"],
    notes: ["减少动态效果时不抖动，只恢复和提示。"],
  },
  design: {
    do: ["只用在几乎一定成功、能撤回的操作上。", "失败时说清楚已经恢复：\"没保存上，已恢复原样\"，给\"重试\"。"],
    dont: [
      { text: "对支付、永久删除、对外发送等不可逆操作使用乐观更新。" },
      { text: "在乐观更新期间为每一行展示加载转圈（违背即时反馈原则）。" },
    ],
    copy: ["失败回滚提示明确说明状态与补救操作，例如「保存失败，已恢复原状」+「重试」。"],
    motion: [{ what: "提交失败回滚时，对应行水平轻微抖动提示", easing: "ease.out", duration: "360ms" }],
  },
  examples: [
    { slug: "optimistic-basic", title: "最简单的用法：收藏", why: "点了马上变成已收藏、数字加一；保存失败时改回去、这一行抖两下、给\"重试\"（示例每第二次保存失败）。", html: `<div class="sn-opt-row" id="optimistic-basic"><span class="sn-nm">雨夜车站</span><button type="button" class="sn-star" aria-pressed="false" aria-label="收藏"><span data-i="star"></span><span class="sn-n">24</span></button></div>`, code: code("optimistic-basic") },
    { slug: "optimistic-switch", title: "开关设置", why: "开关已经拨过去了，失败时拨回去。", html: `<div class="sn-opt-row" id="optimistic-switch"><label class="sn-switch"><input type="checkbox" role="switch"><span class="sn-track"><span class="sn-knob"></span></span>自动保存草稿</label></div>`, code: code("optimistic-switch") },
    { slug: "optimistic-pending", title: "不该乐观的：付款", why: "付款等服务器确认：按钮转圈、不能连点，成功后打勾。", html: `<button type="button" class="sn-btn sn-primary" id="optimistic-pending"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg><span class="sn-txt">支付 ¥68</span></span></button>`, code: code("optimistic-pending") },
  ],
};
