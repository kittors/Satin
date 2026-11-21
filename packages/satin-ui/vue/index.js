// satin-ui/vue：Vue 3.3+ 的薄封装（渲染函数写的，不需要编译 .vue 文件）。
// · v-model：modelValue + update:modelValue（分段控件、滑块、下拉、标签页、分页、步进器、标签输入……）
// · 模板 ref 拿到 Satin 实例（expose 出 instance）
// · SSR 安全：服务端输出和浏览器第一帧一样的标记（createXxx.html），水合以后再接交互；导入时不碰 document
// · 第一次挂载任何组件时自动调 setup()（Tooltip、浮层栈这些页面级行为），最后一个组件卸载时撤掉
import * as Vue from "vue";
import { defineComponent, h, ref, onMounted, onBeforeUnmount, watch, cloneVNode, mergeProps } from "vue";
import * as S from "../src/components.js";
import { setup } from "../src/setup.js";
import { openDialog, closeDialog, wireDialog, openDrawer } from "../src/overlay.js";
import { ICONS } from "../src/icons.js";
import { CHECK, removeChip, shakeInput } from "../src/form.js";
import { scoped } from "../src/i18n.js";
import I18N_COMPONENTS from "../src/locales/zh-CN/components.js";
import { wrap, cx } from "./wrap.js";
import * as X from "./extra.js";
const tt = /* @__PURE__ */ scoped(I18N_COMPONENTS);

// 自己包：重组件（对话、Markdown、流程图、数据表格……，各自单独引入）或别的 createXxx 也能变成 Vue 组件。props 列出要传给组件的选项名
//   import { createChat } from "satin-ui/chat";  const SnChat = wrapSatin(createChat, { name: "SnChat", props: ["title", "respond", "placeholder"], events: [] });
//   数据表格已经包好了：import { DataGrid } from "satin-ui/vue/grid"
export const wrapSatin = (create, opts) => wrap(create, opts);

export const Segmented = /* @__PURE__ */ wrap(S.createSegmented, { name: "SnSegmented", props: ["items", "value", "size", "label"] });
export const Slider = /* @__PURE__ */ wrap(S.createSlider, { name: "SnSlider", props: ["value", "max", "label"] });
export const Select = /* @__PURE__ */ wrap(S.createSelect, { name: "SnSelect", props: ["items", "value", "placeholder", "label"] });
export const Otp = /* @__PURE__ */ wrap(S.createOtp, { name: "SnOtp", props: ["length"], events: ["complete"] });
export const Tabs = /* @__PURE__ */ wrap(S.createTabs, { name: "SnTabs", props: ["tabs", "value"] });
export const Pager = /* @__PURE__ */ wrap(S.createPager, { name: "SnPager", props: ["total", "page", "count"], valueKey: "page" });
export const Collapse = /* @__PURE__ */ wrap(S.createCollapse, { name: "SnCollapse", props: ["items", "single", "open"], valueKey: "open", events: ["toggle", "change"] });
export const TagInput = /* @__PURE__ */ wrap(S.createTagInput, { name: "SnTagInput", props: ["tags", "max", "placeholder", "hint"], valueKey: "tags" });
// 密码框、邮箱框：v-model 绑值；label、help、name、placeholder（密码框 meter 出强度条）
export const Password = /* @__PURE__ */ wrap(S.createPassword, { name: "SnPassword", props: ["value", "label", "help", "name", "id", "placeholder", "meter", "size", "autocomplete"] });
export const Email = /* @__PURE__ */ wrap(S.createEmail, { name: "SnEmail", props: ["value", "label", "help", "name", "id", "placeholder", "size", "autocomplete"] });
// 表格：v-model 绑勾选的行键（selected）；@sort、@rowclick
export const Table = /* @__PURE__ */ wrap(S.createTable, { name: "SnTable", props: ["columns", "rows", "rowKey", "sort", "sortLocal", "selectable", "selected", "empty", "loading", "skeleton", "label", "striped", "compact", "plain", "lines", "maxHeight"], valueKey: "selected", events: ["select", "sort", "rowClick"], modelEvent: "select" });
export const Search = /* @__PURE__ */ wrap(S.createSearch, { name: "SnSearch", props: ["search", "debounce", "placeholder", "label", "kbd", "id", "name", "size"], events: ["search"], modelEvent: null });
export const CountInput = /* @__PURE__ */ wrap(S.createCount, { name: "SnCountInput", props: ["value", "max", "placeholder", "size", "id", "name"] });
export const LongText = /* @__PURE__ */ wrap(S.createLongText, { name: "SnLongText", props: ["value", "max", "maxLines", "rows", "placeholder", "hint", "label", "id", "name"], events: ["change", "submit"] });
// 提示词输入框：@send 返回 Promise 时发送后进入"生成中"，Promise 结束回到可发送（所以 send 不走 emit，直接调 @send 拿返回值）
export const Composer = /* @__PURE__ */ wrap(S.createComposer, { name: "SnComposer", props: ["placeholder", "max", "maxLines", "attach", "send", "upload"], events: ["send", "stop"], returns: ["send"], modelEvent: null });
export const Stepper = /* @__PURE__ */ wrap(S.createStepper, { name: "SnStepper", props: ["value", "min", "max", "unit", "label"] });
export const NumberFlow = /* @__PURE__ */ wrap(S.createNumberFlow, { name: "SnNumberFlow", props: ["value", "effect", "format"], events: [] });
// 日期、时间、地址选择器：kind（date | range | time | datetime | region）、placeholder、label；@change 拿到 { text }（触发框里显示的文字）。
// 没有 v-model：选择器现在只能读出选中的结果，不能从外面设值。today / now 固定"今天""现在"；kind、placeholder、label 只在创建时用（要换就换 :key）
export const DatePicker = /* @__PURE__ */ wrap(S.createPicker, { name: "SnDatePicker", props: ["kind", "placeholder", "label", "today", "now"], modelEvent: null });

// ———— 纯样式组件 ————
export const Icon = /* @__PURE__ */ defineComponent({
  name: "SnIcon", props: { name: String, size: { type: Number, default: 16 } },
  setup: (p) => () => h("svg", { class: "sn-ic", "data-icon": p.name, width: p.size, height: p.size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", innerHTML: ICONS[p.name] || "" }),
});
// 按钮：loading、done 写了（true 或 false）才套等待要用的结构（.sn-label > .sn-spin + .sn-tick + .sn-txt），宽度全程不跳；没写就和手写的 <button class="sn-btn"> 一样。
// loading 变成 true 以后过了 300ms 还没结束才转圈，转圈出现后至少留 500ms（和 busy() 函数同一条规矩）；done 为 true 时原地打勾（等转圈收起以后）。等待中、打勾时点了不触发 click
const TICK = () => h("svg", { class: "sn-tick", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, [h("path", { d: "M3.5 8.5l3 3 6-7" })]);
export const Button = /* @__PURE__ */ defineComponent({
  name: "SnButton",
  props: { variant: { type: String, default: "secondary" }, size: String, icon: String, iconAfter: String, caret: Boolean, round: Boolean, selected: Boolean, badge: { type: [Boolean, Number, String], default: undefined }, loading: { type: Boolean, default: undefined }, done: { type: Boolean, default: undefined }, disabled: Boolean, tip: String, type: { type: String, default: "button" } },
  setup(p, { slots, attrs }) {
    // 一挂上就在等：直接转圈（300ms 是防"从不等待变成等待"时闪一下的），服务端输出也带 sn-busy
    const spin = ref(!!p.loading); let at = 0, timer = 0;
    // 只在浏览器里跑（服务端渲染不起定时器）
    onMounted(() => watch(() => !!p.loading, (on) => {
      clearTimeout(timer);
      if (on) { if (!spin.value) timer = setTimeout(() => { at = performance.now(); spin.value = true; }, 300); }
      else if (spin.value) timer = setTimeout(() => (spin.value = false), Math.max(0, 500 - (performance.now() - at)));
    }, { immediate: true }));
    onBeforeUnmount(() => clearTimeout(timer));
    return () => {
      const kids = slots.default?.(), iconOnly = !kids && p.icon && !p.iconAfter, ok = !!p.done && !spin.value, blocked = p.disabled || p.loading || ok;
      const lead = p.icon ? h(Icon, { name: p.icon }) : null, tail = p.iconAfter ? h(Icon, { name: p.iconAfter, class: "sn-after" }) : p.caret ? h(Icon, { name: "chevron-down", class: "sn-caret" }) : null; // caret：菜单按钮后面的小箭头
      return h("button", {
        ...attrs, type: p.type,
        class: cx("sn-btn", `sn-${p.variant}`, p.size && p.size !== "md" && `sn-${p.size}`, iconOnly && "sn-ibtn", p.round && "sn-round", p.selected && "sn-selected", p.disabled && "sn-is-disabled", spin.value && "sn-busy", ok && "sn-ok"),
        "aria-disabled": p.disabled ? "true" : undefined, "data-tip": p.tip, "aria-label": iconOnly ? attrs["aria-label"] ?? p.tip : attrs["aria-label"],
        onClick: blocked ? undefined : attrs.onClick,
      }, [...(p.loading !== undefined || p.done !== undefined
        ? [h("span", { class: "sn-sheen" }), h("span", { class: "sn-label" }, [h("span", { class: "sn-spin" }), TICK(), h("span", { class: "sn-txt" }, [lead, kids, tail])])]
        : [lead, kids, tail]),
        // 徽标：数字 → 右上角的计数（.sn-count），true → 小红点（.sn-dot）
        p.badge === true ? h("span", { class: "sn-dot" }) : (typeof p.badge === "number" && p.badge > 0) || (typeof p.badge === "string" && p.badge) ? h("span", { class: "sn-count" }, p.badge) : null]);
    };
  },
});
export const Input = /* @__PURE__ */ defineComponent({
  name: "SnInput", inheritAttrs: false, props: { modelValue: null, size: String, invalid: Boolean }, emits: ["update:modelValue"],
  // mergeProps：写在组件上的 @input、class 和这里的合在一起（不会被盖掉）
  setup: (p, { attrs, emit }) => () => h("input", mergeProps(attrs, { class: cx("sn-input", p.size && p.size !== "md" && `sn-${p.size}`), value: p.modelValue, "aria-invalid": p.invalid ? "true" : undefined, onInput: (e) => emit("update:modelValue", e.target.value) })),
});
export const Field = /* @__PURE__ */ defineComponent({
  name: "SnField", props: { label: String, help: String, error: { type: String, default: undefined }, for: String },
  setup(p, { slots }) {
    // 错误出现的那一下（从没有变成有）输入框左右抖两下，和 setFieldError 一样
    const el = ref(null);
    watch(() => !!p.error, (bad, was) => { if (bad && !was) shakeInput(el.value); });
    return () => h("div", { ref: el, class: cx("sn-field", p.error && "sn-bad") }, [p.label ? h("label", { class: "sn-lbl", for: p.for }, p.label) : null, slots.default?.(), p.help ? h("div", { class: "sn-help" }, p.help) : null, p.error != null ? h("div", { class: "sn-err" }, [h("span", p.error)]) : null]);
  },
});
const Box = () => h("span", { class: "sn-box" }, [h("svg", { viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", "stroke-width": CHECK.stroke, "stroke-linecap": "round", "stroke-linejoin": "round" }, [h("path", { d: CHECK.path })]), h("span", { class: "sn-bar" })]);
export const Checkbox = /* @__PURE__ */ defineComponent({
  name: "SnCheckbox", props: { modelValue: Boolean, label: String, indeterminate: Boolean, disabled: Boolean }, emits: ["update:modelValue"],
  setup(p, { slots, emit }) {
    // 半选只能用 DOM 属性设：没有对应的 HTML 属性，服务端渲染也不该写进标记
    const input = ref(null);
    onMounted(() => watch(() => p.indeterminate, (v) => { if (input.value) input.value.indeterminate = !!v; }, { immediate: true }));
    return () => h("label", { class: "sn-check" }, [h("input", { ref: input, type: "checkbox", checked: p.modelValue, disabled: p.disabled, onChange: (e) => emit("update:modelValue", e.target.checked) }), h(Box), p.label ?? slots.default?.()]);
  },
});
// 单选：v-model 绑这一组选中的值，value 是这一项的值；同一组写同一个 name
export const Radio = /* @__PURE__ */ defineComponent({
  name: "SnRadio", props: { modelValue: null, value: null, name: String, label: String, disabled: Boolean }, emits: ["update:modelValue"],
  setup: (p, { slots, emit }) => () => h("label", { class: "sn-radio" }, [h("input", { type: "radio", name: p.name, value: p.value, checked: p.modelValue === undefined ? undefined : p.modelValue === p.value, disabled: p.disabled, onChange: () => emit("update:modelValue", p.value) }), h("span", { class: "sn-box" }), p.label ?? slots.default?.()]),
});
export const Switch = /* @__PURE__ */ defineComponent({
  name: "SnSwitch", props: { modelValue: Boolean, label: String, disabled: Boolean }, emits: ["update:modelValue"],
  setup: (p, { slots, emit }) => () => h("label", { class: "sn-switch" }, [h("input", { type: "checkbox", role: "switch", checked: p.modelValue, disabled: p.disabled, onChange: (e) => emit("update:modelValue", e.target.checked) }), h("span", { class: "sn-track" }, [h("span", { class: "sn-knob" })]), p.label ?? slots.default?.()]),
});
// 芯片三种：v-model（或 selected）给了是能切换的筛选芯片（<button aria-pressed>）；removable 是能移除的标签（点 × 先收起，动画放完发 remove，父组件这时再删）；都没给只显示
export const Chip = /* @__PURE__ */ defineComponent({
  name: "SnChip", props: { modelValue: { type: Boolean, default: undefined }, selected: { type: Boolean, default: undefined }, removable: Boolean, removeLabel: String }, emits: ["update:modelValue", "change", "remove"],
  setup(p, { slots, emit }) {
    const el = ref(null);
    return () => {
      const on = p.modelValue ?? p.selected ?? false;
      if (p.removable) return h("span", { ref: el, class: cx("sn-chip", "sn-tag", on && "sn-on") }, [slots.default?.(), h("button", { type: "button", class: "sn-x", "aria-label": p.removeLabel ?? tt("components.remove"), onClick: () => removeChip(el.value, { keep: true, onRemoved: () => emit("remove") }) }, [h(Icon, { name: "x" })])]);
      if (p.modelValue !== undefined) return h("button", { type: "button", class: cx("sn-chip", on && "sn-on"), "aria-pressed": String(on), onClick: () => { emit("update:modelValue", !on); emit("change", !on); } }, [h(Icon, { name: "check" }), slots.default?.()]);
      return h("span", { class: cx("sn-chip", on && "sn-on") }, slots.default?.());
    };
  },
});
// 读屏：role="progressbar"、aria-valuenow（百分数），label 是读出来的名字
const progressAria = (value, label) => ({ role: "progressbar", "aria-label": label, ...(value == null ? {} : { "aria-valuenow": Math.round(value * 100), "aria-valuemin": 0, "aria-valuemax": 100 }) });
export const Progress = /* @__PURE__ */ defineComponent({
  name: "SnProgress", props: { value: Number, ring: Boolean, size: String, label: String },
  setup(p) { return () => { const v = p.value == null ? undefined : String(+p.value).replace(/^0\./, "."); return p.ring ? h("span", { class: cx("sn-pring", p.size === "lg" && "sn-lg"), style: { "--sn-p": v ?? "0" }, ...progressAria(p.value ?? 0, p.label) }) : h("div", { class: cx("sn-pbar", p.value == null && "sn-indet"), ...progressAria(p.value, p.label), style: v != null ? { "--sn-p": v } : undefined }, [h("i")]); }; },
});
export const Spinner = /* @__PURE__ */ defineComponent({ name: "SnSpinner", props: { size: String, label: String }, setup: (p) => () => h("span", { class: cx("sn-spinner", p.size === "lg" && "sn-lg"), role: "status", "aria-label": p.label ?? tt("components.loading") }) });
export const Steps = /* @__PURE__ */ defineComponent({
  name: "SnSteps", props: { steps: { type: Array, default: () => [] }, current: { type: Number, default: 0 } },
  setup: (p) => () => h("div", { class: "sn-steps" }, p.steps.flatMap((s, i) => [i ? h("span", { class: cx("sn-ln", i <= p.current && "sn-done") }, [h("i")]) : null, h("span", { class: cx("sn-st", i < p.current && "sn-done", i === p.current && "sn-cur") }, [h("span", { class: "sn-n" }, String(i + 1)), s])]).filter(Boolean)),
});
export const Text = /* @__PURE__ */ defineComponent({
  name: "SnText", props: { as: { type: String, default: "span" }, level: { type: String, default: "body" }, tone: String, num: Boolean, truncate: Boolean },
  setup: (p, { slots }) => () => h(p.as, { class: cx(`sn-t-${p.level === "bodyStrong" ? "body-strong" : p.level}`, p.tone && `sn-c-${p.tone}`, p.num && "sn-num", p.truncate && "sn-truncate") }, slots.default?.()),
});
// Tooltip：给默认插槽里的第一个元素加 data-tip
export const Tooltip = /* @__PURE__ */ defineComponent({ name: "SnTooltip", props: { text: String, kbd: String }, setup: (p, { slots }) => () => { const [v] = slots.default?.() || []; return v ? cloneVNode(v, { "data-tip": p.text, "data-kbd": p.kbd }) : null; } });

// 弹窗：v-model:open 控制开关；关完（Esc、取消、程序关）发 close。取消按钮写 data-cancel、关闭按钮写 data-x：和 Esc 一样先走 guard 再关。
// @submit 接住表单提交（主按钮写 type="submit"，输入框里按回车也算），弹窗不会因为提交自己关。icon：标题左边的图标；footer-class 加在底栏上
let dlgN = 0;
export const Dialog = /* @__PURE__ */ defineComponent({
  name: "SnDialog", props: { open: Boolean, title: String, description: String, icon: String, guard: Function, footerClass: null }, emits: ["close", "update:open", "submit"],
  setup(p, { slots, emit }) {
    const el = ref(null), tid = Vue.useId?.() ?? "sn-dlg-" + ++dlgN;
    onMounted(() => {
      const d = el.value; wireDialog(d);
      d.guard = () => (p.guard ? p.guard(() => closeDialog(d)) : closeDialog(d));
      d.addEventListener("close", () => { emit("close"); emit("update:open", false); });
      if (p.open) openDialog(d, document.activeElement);
    });
    watch(() => p.open, (o) => { const d = el.value; if (!d) return; if (o && !d.open) openDialog(d, document.activeElement); else if (!o && d.open) closeDialog(d); });
    return () => h("dialog", { ref: el, class: "sn-dlg", "aria-labelledby": p.title ? tid : undefined }, [h("form", { method: "dialog", onSubmit: (e) => emit("submit", e) }, [
      p.title || p.description || p.icon ? h("div", { class: "sn-hd" }, [p.icon ? h("span", { class: "sn-dlg-icon" }, [h(Icon, { name: p.icon })]) : null, h("div", { style: "flex:1" }, [p.title ? h("h3", { id: tid }, p.title) : null, p.description ? h("div", { class: "sn-sub" }, p.description) : null])]) : null,
      slots.default ? h("div", { class: "sn-bd" }, slots.default()) : null,
      slots.footer ? h("div", { class: ["sn-ft", p.footerClass] }, slots.footer()) : null,
    ])]);
  },
});
export const Drawer = /* @__PURE__ */ defineComponent({
  name: "SnDrawer", props: { open: Boolean, title: String }, emits: ["close", "update:open"],
  setup(p, { slots, emit }) {
    const el = ref(null), tid = Vue.useId?.() ?? "sn-drw-" + ++dlgN; let layer = null; // 标题的 id：抽屉 aria-labelledby 指向它
    watch(() => p.open, (o) => { if (o && !layer) layer = openDrawer(el.value, { trigger: document.activeElement, onClose: () => { layer = null; emit("close"); emit("update:open", false); } }); else if (!o && layer) { layer.close(true); layer = null; } });
    return () => h("aside", { ref: el, class: "sn-drawer", role: "dialog", "aria-modal": "true", "aria-labelledby": p.title ? tid : undefined, tabindex: "-1" }, [
      h("div", { class: "sn-hd" }, [h("h3", { id: tid }, p.title), h("button", { type: "button", class: "sn-btn sn-ghost sn-sm sn-ibtn", "data-x": "", "aria-label": tt("components.close"), "data-tip": tt("components.close"), "data-kbd": "Esc" }, [h(Icon, { name: "x", size: 16 })])]),
      h("div", { class: "sn-bd" }, slots.default?.()), slots.footer ? h("div", { class: "sn-ft" }, slots.footer()) : null,
    ]);
  },
});

// v-enhance：照设计稿写好的一段标记（菜单按钮、浮层触发器、折叠面板……）放进这个元素，挂上时接上交互、卸载时撤掉（和 <sn-enhance> 一样，不用配置自定义元素）
//   <script setup> import { vEnhance } from "satin-ui/vue"; </script>   <div v-enhance>…标记…</div>
export const vEnhance = {
  mounted(el) { const unsetup = setup(), off = S.enhance(el); el._snEnhance = () => { off(); unsetup(); }; },
  beforeUnmount(el) { const f = el._snEnhance; el._snEnhance = null; f?.(); },
};

export const toast = (o) => (setup(), S.toast(o));
export const notify = (o) => (setup(), S.notify(o));
// 全局注册：app.use(Satin) 以后模板里直接写 <SnButton>、<SnSegmented v-model="x" />、<SnDatePicker>……、v-enhance，同时装好页面级行为（Tooltip、浮层栈、Esc 关闭，和 setup() 一样；应用卸载时撤掉）。
// 数据表格这类重组件不在这里注册：import { DataGrid } from "satin-ui/vue/grid"
export default {
  install(app) {
    for (const [k, c] of Object.entries({ ...X, Table, Password, Email, Segmented, Slider, Select, Otp, Tabs, Pager, Collapse, TagInput, Stepper, Search, CountInput, LongText, Composer, NumberFlow, DatePicker, Icon, Button, Input, Field, Checkbox, Radio, Switch, Chip, Progress, Spinner, Steps, Text, Tooltip, Dialog, Drawer })) app.component("Sn" + k, c);
    app.directive("enhance", vEnhance);
    const off = setup(); app.onUnmount?.(off); // setup() 在服务端直接返回，什么都不做
  },
};
// 菜单、右键菜单、Popover、命令面板、看图、上传、侧栏、无限列表、滚动区域、视频、音频（vue/extra.js）
export * from "./extra.js";
