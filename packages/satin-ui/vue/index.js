// satin-ui/vue：Vue 3.3+ 的薄封装（渲染函数写的，不需要编译 .vue 文件）。
// · v-model：modelValue + update:modelValue（分段控件、滑块、下拉、标签页、分页、步进器、标签输入……）
// · 模板 ref 拿到 Satin 实例（expose 出 instance）
// · SSR 安全：服务端输出和浏览器第一帧一样的标记（createXxx.html），水合以后再接交互；导入时不碰 document
// · 第一次挂载任何组件时自动调 setup()（Tooltip、浮层栈这些页面级行为），最后一个组件卸载时撤掉
import { defineComponent, h, ref, onMounted, onBeforeUnmount, watch, shallowRef, cloneVNode } from "vue";
import * as S from "../src/components.js";
import { setup } from "../src/setup.js";
import { openDialog, closeDialog, wireDialog, openDrawer } from "../src/overlay.js";
import { ICONS } from "../src/icons.js";
import { CHECK } from "../src/form.js";
import { scoped } from "../src/i18n.js";
import I18N_COMPONENTS from "../src/locales/zh-CN/components.js";
const tt = /* @__PURE__ */ scoped(I18N_COMPONENTS);

const cx = (...a) => a.filter(Boolean).join(" ");
// 把 createXxx 包成 Vue 组件。props：组件的选项名；valueKey：v-model 绑定的那一项
function wrap(create, { name, props = [], valueKey = "value", events = ["change"], modelEvent = "change" }) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: Object.fromEntries([...props, "modelValue"].map((p) => [p, { type: null, default: undefined }])),
    emits: [...events, "update:modelValue"],
    setup(p, { emit, expose, attrs }) {
      const host = ref(null), inst = shallowRef(null);
      const opts = () => { const o = {}; for (const k of props) if (p[k] !== undefined) o[k] = p[k]; if (p.modelValue !== undefined) o[valueKey] = p.modelValue; return o; };
      const html = create.html(opts());
      let unsetup = null;
      onMounted(() => {
        unsetup = setup();
        const handlers = {};
        for (const ev of events) handlers["on" + ev[0].toUpperCase() + ev.slice(1)] = (v) => { emit(ev, v); if (ev === modelEvent) emit("update:modelValue", v); };
        inst.value = create(host.value.firstElementChild, { ...opts(), ...handlers });
      });
      watch(opts, (o) => inst.value?.update(o), { deep: true });
      onBeforeUnmount(() => { inst.value?.destroy(); inst.value = null; unsetup?.(); });
      expose({ instance: inst });
      return () => h("div", { ...attrs, ref: host, class: cx("sn-host", attrs.class), style: ["display: contents", attrs.style], innerHTML: html });
    },
  });
}

// 自己包：重组件（对话、Markdown、流程图、数据表格……，各自单独引入）或别的 createXxx 也能变成 Vue 组件。props 列出要传给组件的选项名
//   import { createChat } from "satin-ui/chat";  const SnChat = wrapSatin(createChat, { name: "SnChat", props: ["title", "respond", "placeholder"], events: [] });
export const wrapSatin = (create, opts) => wrap(create, opts);

export const Segmented = /* @__PURE__ */ wrap(S.createSegmented, { name: "SnSegmented", props: ["items", "value", "size", "label"] });
export const Slider = /* @__PURE__ */ wrap(S.createSlider, { name: "SnSlider", props: ["value", "max", "label"] });
export const Select = /* @__PURE__ */ wrap(S.createSelect, { name: "SnSelect", props: ["items", "value", "placeholder", "label"] });
export const Otp = /* @__PURE__ */ wrap(S.createOtp, { name: "SnOtp", props: ["length"], events: ["complete"] });
export const Tabs = /* @__PURE__ */ wrap(S.createTabs, { name: "SnTabs", props: ["tabs", "value"] });
export const Pager = /* @__PURE__ */ wrap(S.createPager, { name: "SnPager", props: ["total", "page", "count"], valueKey: "page" });
export const Collapse = /* @__PURE__ */ wrap(S.createCollapse, { name: "SnCollapse", props: ["items", "single", "open"], events: ["toggle"] });
export const TagInput = /* @__PURE__ */ wrap(S.createTagInput, { name: "SnTagInput", props: ["tags", "max", "placeholder", "hint"], valueKey: "tags" });
// 密码框、邮箱框：v-model 绑值；label、help、name、placeholder（密码框 meter 出强度条）
export const Password = /* @__PURE__ */ wrap(S.createPassword, { name: "SnPassword", props: ["value", "label", "help", "name", "id", "placeholder", "meter", "size", "autocomplete"] });
export const Email = /* @__PURE__ */ wrap(S.createEmail, { name: "SnEmail", props: ["value", "label", "help", "name", "id", "placeholder", "size", "autocomplete"] });
// 表格：v-model 绑勾选的行键（selected）；@sort、@rowclick
export const Table = /* @__PURE__ */ wrap(S.createTable, { name: "SnTable", props: ["columns", "rows", "rowKey", "sort", "sortLocal", "selectable", "selected", "empty", "loading", "skeleton", "label", "striped", "compact", "plain", "lines", "maxHeight"], valueKey: "selected", events: ["select", "sort", "rowClick"], modelEvent: "select" });
export const Stepper = /* @__PURE__ */ wrap(S.createStepper, { name: "SnStepper", props: ["value", "min", "max", "unit", "label"] });
export const NumberFlow = /* @__PURE__ */ wrap(S.createNumberFlow, { name: "SnNumberFlow", props: ["value", "style", "format"], events: [] });

// ———— 纯样式组件 ————
export const Icon = defineComponent({
  name: "SnIcon", props: { name: String, size: { type: Number, default: 16 } },
  setup: (p) => () => h("svg", { class: "sn-ic", "data-icon": p.name, width: p.size, height: p.size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", innerHTML: ICONS[p.name] || "" }),
});
export const Button = defineComponent({
  name: "SnButton",
  props: { variant: { type: String, default: "secondary" }, size: String, icon: String, round: Boolean, selected: Boolean, busy: Boolean, disabled: Boolean, tip: String, type: { type: String, default: "button" } },
  setup(p, { slots, attrs }) {
    return () => {
      const kids = slots.default?.(), iconOnly = !kids && p.icon;
      return h("button", { ...attrs, type: p.type, class: cx("sn-btn", `sn-${p.variant}`, p.size && p.size !== "md" && `sn-${p.size}`, iconOnly && "sn-ibtn", p.round && "sn-round", p.selected && "sn-selected", p.disabled && "sn-is-disabled", p.busy && "sn-busy"), "aria-disabled": p.disabled ? "true" : undefined, "data-tip": p.tip, "aria-label": iconOnly ? attrs["aria-label"] ?? p.tip : attrs["aria-label"], onClick: p.disabled ? undefined : attrs.onClick },
        [p.icon ? h(Icon, { name: p.icon, size: iconOnly ? (p.size === "sm" ? 16 : 20) : 16 }) : null, kids]);
    };
  },
});
export const Input = defineComponent({
  name: "SnInput", inheritAttrs: false, props: { modelValue: null, size: String, invalid: Boolean }, emits: ["update:modelValue"],
  setup: (p, { attrs, emit }) => () => h("input", { ...attrs, class: cx("sn-input", p.size && p.size !== "md" && `sn-${p.size}`, attrs.class), value: p.modelValue, "aria-invalid": p.invalid ? "true" : undefined, onInput: (e) => emit("update:modelValue", e.target.value) }),
});
export const Field = defineComponent({
  name: "SnField", props: { label: String, help: String, error: { type: String, default: undefined }, for: String },
  setup: (p, { slots }) => () => h("div", { class: cx("sn-field", p.error && "sn-bad") }, [p.label ? h("label", { class: "sn-lbl", for: p.for }, p.label) : null, slots.default?.(), p.help ? h("div", { class: "sn-help" }, p.help) : null, p.error != null ? h("div", { class: "sn-err" }, [h("span", p.error)]) : null]),
});
const Box = () => h("span", { class: "sn-box" }, [h("svg", { viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", "stroke-width": CHECK.stroke, "stroke-linecap": "round", "stroke-linejoin": "round" }, [h("path", { d: CHECK.path })]), h("span", { class: "sn-bar" })]);
export const Checkbox = defineComponent({
  name: "SnCheckbox", props: { modelValue: Boolean, label: String, indeterminate: Boolean, disabled: Boolean }, emits: ["update:modelValue"],
  setup: (p, { slots, emit }) => () => h("label", { class: "sn-check" }, [h("input", { type: "checkbox", checked: p.modelValue, indeterminate: p.indeterminate, disabled: p.disabled, onChange: (e) => emit("update:modelValue", e.target.checked) }), h(Box), p.label ?? slots.default?.()]),
});
export const Switch = defineComponent({
  name: "SnSwitch", props: { modelValue: Boolean, label: String, disabled: Boolean }, emits: ["update:modelValue"],
  setup: (p, { slots, emit }) => () => h("label", { class: "sn-switch" }, [h("input", { type: "checkbox", role: "switch", checked: p.modelValue, disabled: p.disabled, onChange: (e) => emit("update:modelValue", e.target.checked) }), h("span", { class: "sn-track" }, [h("span", { class: "sn-knob" })]), p.label ?? slots.default?.()]),
});
export const Chip = defineComponent({
  name: "SnChip", props: { on: Boolean, removable: Boolean }, emits: ["remove"],
  setup: (p, { slots, emit }) => () => h("span", { class: cx("sn-chip", p.removable && "sn-tag", p.on && "sn-on") }, [slots.default?.(), p.removable ? h("button", { class: "sn-x", "aria-label": tt("components.remove"), onClick: () => emit("remove") }, [h(Icon, { name: "x", size: 10 })]) : null]),
});
export const Progress = defineComponent({
  name: "SnProgress", props: { value: Number, ring: Boolean, size: String },
  setup(p) { return () => { const v = p.value == null ? undefined : String(+p.value).replace(/^0\./, "."); return p.ring ? h("span", { class: cx("sn-pring", p.size === "lg" && "sn-lg"), style: { "--sn-p": v ?? "0" } }) : h("div", { class: cx("sn-pbar", p.value == null && "sn-indet"), style: v != null ? { "--sn-p": v } : undefined }, [h("i")]); }; },
});
export const Spinner = defineComponent({ name: "SnSpinner", props: { size: String }, setup: (p) => () => h("span", { class: cx("sn-spinner", p.size === "lg" && "sn-lg") }) });
export const Steps = defineComponent({
  name: "SnSteps", props: { steps: { type: Array, default: () => [] }, current: { type: Number, default: 0 } },
  setup: (p) => () => h("div", { class: "sn-steps" }, p.steps.flatMap((s, i) => [i ? h("span", { class: cx("sn-ln", i <= p.current && "sn-done") }, [h("i")]) : null, h("span", { class: cx("sn-st", i < p.current && "sn-done", i === p.current && "sn-cur") }, [h("span", { class: "sn-n" }, String(i + 1)), s])]).filter(Boolean)),
});
export const Text = defineComponent({
  name: "SnText", props: { as: { type: String, default: "span" }, level: { type: String, default: "body" }, tone: String, num: Boolean, truncate: Boolean },
  setup: (p, { slots }) => () => h(p.as, { class: cx(`sn-t-${p.level === "bodyStrong" ? "body-strong" : p.level}`, p.tone && `sn-c-${p.tone}`, p.num && "sn-num", p.truncate && "sn-truncate") }, slots.default?.()),
});
// Tooltip：给默认插槽里的第一个元素加 data-tip
export const Tooltip = defineComponent({ name: "SnTooltip", props: { text: String, kbd: String }, setup: (p, { slots }) => () => { const [v] = slots.default?.() || []; return v ? cloneVNode(v, { "data-tip": p.text, "data-kbd": p.kbd }) : null; } });

export const Dialog = defineComponent({
  name: "SnDialog", props: { open: Boolean, title: String, description: String }, emits: ["close", "update:open"],
  setup(p, { slots, emit }) {
    const el = ref(null);
    onMounted(() => { const d = el.value; wireDialog(d); d.addEventListener("close", () => { emit("close"); emit("update:open", false); }); if (p.open) openDialog(d, document.activeElement); });
    watch(() => p.open, (o) => { const d = el.value; if (!d) return; if (o && !d.open) openDialog(d, document.activeElement); else if (!o && d.open) closeDialog(d); });
    return () => h("dialog", { ref: el, class: "sn-dlg" }, [h("form", { method: "dialog" }, [
      p.title || p.description ? h("div", { class: "sn-hd" }, [h("div", { style: "flex:1" }, [p.title ? h("h3", p.title) : null, p.description ? h("div", { class: "sn-sub" }, p.description) : null])]) : null,
      h("div", { class: "sn-bd" }, slots.default?.()),
      slots.footer ? h("div", { class: "sn-ft" }, slots.footer()) : null,
    ])]);
  },
});
export const Drawer = defineComponent({
  name: "SnDrawer", props: { open: Boolean, title: String }, emits: ["close", "update:open"],
  setup(p, { slots, emit }) {
    const el = ref(null); let layer = null;
    watch(() => p.open, (o) => { if (o && !layer) layer = openDrawer(el.value, { trigger: document.activeElement, onClose: () => { layer = null; emit("close"); emit("update:open", false); } }); else if (!o && layer) { layer.close(true); layer = null; } });
    return () => h("aside", { ref: el, class: "sn-drawer", role: "dialog", "aria-modal": "true", tabindex: "-1" }, [
      h("div", { class: "sn-hd" }, [h("h3", p.title), h("button", { class: "sn-btn sn-ghost sn-sm sn-ibtn", "data-x": "", "aria-label": tt("components.close"), "data-tip": tt("components.close"), "data-kbd": "Esc" }, [h(Icon, { name: "x", size: 16 })])]),
      h("div", { class: "sn-bd" }, slots.default?.()), slots.footer ? h("div", { class: "sn-ft" }, slots.footer()) : null,
    ]);
  },
});

export const toast = (o) => (setup(), S.toast(o));
export const notify = (o) => (setup(), S.notify(o));
// 全局注册：app.use(Satin) 以后模板里直接写 <SnButton>、<SnSegmented v-model="x" />……
export default { install(app) { for (const [k, c] of Object.entries({ Table, Password, Email, Segmented, Slider, Select, Otp, Tabs, Pager, Collapse, TagInput, Stepper, NumberFlow, Icon, Button, Input, Field, Checkbox, Switch, Chip, Progress, Spinner, Steps, Text, Tooltip, Dialog, Drawer })) app.component("Sn" + k, c); } };
