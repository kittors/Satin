"use client"; // Next.js 等 React 服务端组件环境：这些封装用到状态和副作用，是客户端组件
// satin-ui/react：React 18+ 的薄封装。不用 JSX（不需要构建），每个组件都是普通的 React 组件。
// · 受控 / 非受控：给 value 就是受控（onChange 里不改 value，组件会退回去）；只给 defaultValue 就是非受控
// · ref 拿到 Satin 实例（update / destroy / 各组件的方法）
// · SSR 安全：服务端输出和浏览器第一帧一样的标记（createXxx.html），水合以后再接交互；导入时不碰 document
// · StrictMode 下挂两次、卸载一次也不漏：每次挂载都配对一次 destroy
// · 第一次挂载任何组件时自动调 setup()（Tooltip、浮层栈这些页面级行为），最后一个组件卸载时撤掉
import { createElement as h, forwardRef, useEffect, useLayoutEffect, useRef, useState, useImperativeHandle, useCallback, cloneElement, isValidElement, Children } from "react";
import * as S from "../src/components.js";
import { setup } from "../src/setup.js";
import { openDialog, closeDialog, wireDialog, openDrawer } from "../src/overlay.js";
import { initSeg } from "../src/core.js";
import { ICONS } from "../src/icons.js";
import { CHECK } from "../src/form.js";
import { scoped } from "../src/i18n.js";
import I18N_COMPONENTS from "../src/locales/zh-CN/components.js";
const t = /* @__PURE__ */ scoped(I18N_COMPONENTS);

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;
const cx = (...a) => a.filter(Boolean).join(" ");
const cap = (s) => s[0].toUpperCase() + s.slice(1);

// 把 createXxx 包成 React 组件。valueKey：受控的那个属性（value / page / tags……）；events：组件会发的事件名
function wrap(create, { valueKey = "value", events = ["change"], displayName } = {}) {
  const C = forwardRef(function SatinComponent(props, ref) {
    const { className, style, id, ...rest } = props;
    const host = useRef(null), inst = useRef(null), latest = useRef(props);
    latest.current = props;
    const defKey = "default" + cap(valueKey), controlled = props[valueKey] !== undefined;
    // 传给 Satin 的选项：去掉回调（回调走下面固定的转发函数，props 换了也不用重新挂）和 defaultValue
    const optsOf = (p) => { const o = {}; for (const [k, v] of Object.entries(p)) if (!/^on[A-Z]/.test(k) && k !== defKey && k !== "className" && k !== "style" && k !== "id" && k !== "children") o[k] = v; if (p[valueKey] === undefined && p[defKey] !== undefined) o[valueKey] = p[defKey]; return o; };
    const [html] = useState(() => create.html({ ...optsOf(props) }));
    useIso(() => {
      const unsetup = setup();
      const handlers = {};
      for (const ev of events) handlers["on" + cap(ev)] = (v) => {
        latest.current["on" + cap(ev)]?.(v);
        // 受控：父组件没把新值传回来，就退回到父组件给的值
        if (ev === "change" && latest.current[valueKey] !== undefined) setTimeout(() => { const want = latest.current[valueKey]; if (inst.current && want !== undefined && JSON.stringify(inst.current[valueKey]) !== JSON.stringify(want)) inst.current.update({ [valueKey]: want }); });
      };
      inst.current = create(host.current.firstElementChild, { ...optsOf(latest.current), ...handlers });
      return () => { inst.current?.destroy(); inst.current = null; unsetup(); };
    }, []);
    // 每次渲染把最新的选项交给实例（实例自己判断有没有变化、要不要动画）
    useIso(() => { inst.current?.update(optsOf(props)); });
    useImperativeHandle(ref, () => inst.current, []);
    void controlled;
    return h("div", { ref: host, id, className: cx("sn-host", className), style: { display: "contents", ...style }, dangerouslySetInnerHTML: { __html: html }, suppressHydrationWarning: true });
  });
  C.displayName = displayName || create.componentName;
  return C;
}

// ———— 有交互的组件 ————
export const Segmented = /* @__PURE__ */ wrap(S.createSegmented, { displayName: "Segmented" });
export const Slider = /* @__PURE__ */ wrap(S.createSlider, { displayName: "Slider" });
export const Select = /* @__PURE__ */ wrap(S.createSelect, { displayName: "Select" });
export const Otp = /* @__PURE__ */ wrap(S.createOtp, { valueKey: "code", events: ["complete"], displayName: "Otp" });
export const Tabs = /* @__PURE__ */ wrap(S.createTabs, { displayName: "Tabs" });
export const Pager = /* @__PURE__ */ wrap(S.createPager, { valueKey: "page", displayName: "Pager" });
export const Collapse = /* @__PURE__ */ wrap(S.createCollapse, { valueKey: "open", events: ["toggle"], displayName: "Collapse" });
export const TagInput = /* @__PURE__ */ wrap(S.createTagInput, { valueKey: "tags", displayName: "TagInput" });
export const Stepper = /* @__PURE__ */ wrap(S.createStepper, { displayName: "Stepper" });
export const NumberFlow = /* @__PURE__ */ wrap(S.createNumberFlow, { events: [], displayName: "NumberFlow" });
// 密码框（显示 / 隐藏、大写提示，meter 出强度条）、邮箱框（格式对了出对勾）：value + onChange(值) 当受控组件用；label、help、name、placeholder
export const Password = /* @__PURE__ */ wrap(S.createPassword, { displayName: "Password" });
export const Email = /* @__PURE__ */ wrap(S.createEmail, { displayName: "Email" });
// 表格：columns + rows；selected 受控（onSelect 里更新）；onSort、onRowClick
export const Table = /* @__PURE__ */ wrap(S.createTable, { valueKey: "selected", events: ["sort", "select", "rowClick"], displayName: "Table" });

// ———— 纯样式组件：直接渲染元素（子节点、事件都是 React 自己的） ————
export const Button = forwardRef(function Button({ variant = "secondary", size, icon, round, selected, busy, disabled, tip, className, children, onClick, type = "button", ...rest }, ref) {
  const iconOnly = !children && icon;
  return h("button", {
    ref, type, ...rest, className: cx("sn-btn", `sn-${variant}`, size && size !== "md" && `sn-${size}`, iconOnly && "sn-ibtn", round && "sn-round", selected && "sn-selected", disabled && "sn-is-disabled", busy && "sn-busy", className),
    "aria-disabled": disabled ? "true" : undefined, "data-tip": tip, "aria-label": iconOnly ? rest["aria-label"] ?? tip : rest["aria-label"],
    onClick: disabled ? undefined : onClick,
  }, icon ? h(Icon, { name: icon, size: iconOnly ? (size === "sm" ? 16 : 20) : 16 }) : null, children);
});
// 图标：satin-ui/icons 里的名字。直接渲染 <svg class="sn-ic">（和 icon() 生成的一模一样，按钮里 .sn-btn > .sn-ic 这类选择器照样命中）
export function Icon({ name, size = 16, className }) {
  return h("svg", { className: cx("sn-ic", className), "data-icon": name, width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: ICONS[name] || "" } });
}
export const Input = forwardRef(function Input({ size, invalid, className, ...rest }, ref) {
  return h("input", { ref, ...rest, className: cx("sn-input", size && size !== "md" && `sn-${size}`, className), "aria-invalid": invalid ? "true" : undefined });
});
export const Textarea = forwardRef(function Textarea({ className, ...rest }, ref) { return h("textarea", { ref, ...rest, className: cx("sn-input", className) }); });
export function Field({ label, help, error, htmlFor, className, children }) {
  // 错误区：error 传了（空字符串也算）就一直在，有字时展开、清空时收起（有动画）；不传就没有
  return h("div", { className: cx("sn-field", error && "sn-bad", className) }, label ? h("label", { className: "sn-lbl", htmlFor }, label) : null, children, help ? h("div", { className: "sn-help" }, help) : null, error != null ? h("div", { className: "sn-err" }, h("span", null, error)) : null);
}
// 复选框的方框（和 form.js 的 BOX 同一份路径和线宽）：input 后面紧跟着它，样式靠 input:checked + .sn-box
const Box = () => h("span", { className: "sn-box" }, h("svg", { viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: CHECK.stroke, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: CHECK.path })), h("span", { className: "sn-bar" }));
export const Checkbox = forwardRef(function Checkbox({ label, children, className, indeterminate, ...rest }, ref) {
  const own = useRef(null);
  useIso(() => { if (own.current) own.current.indeterminate = !!indeterminate; });
  return h("label", { className: cx("sn-check", className) }, h("input", { ref: (n) => { own.current = n; if (typeof ref === "function") ref(n); else if (ref) ref.current = n; }, type: "checkbox", ...rest }), h(Box), label ?? children);
});
export const Switch = forwardRef(function Switch({ label, children, className, ...rest }, ref) {
  return h("label", { className: cx("sn-switch", className) }, h("input", { ref, type: "checkbox", role: "switch", ...rest }), h("span", { className: "sn-track" }, h("span", { className: "sn-knob" })), label ?? children);
});
export function Chip({ on, removable, onRemove, className, children, ...rest }) {
  return h("span", { ...rest, className: cx("sn-chip", removable && "sn-tag", on && "sn-on", className) }, children, removable ? h("button", { className: "sn-x", "aria-label": t("components.remove"), onClick: onRemove }, h(Icon, { name: "x", size: 10 })) : null);
}
export function Progress({ value, ring, size, className }) {
  const v = value == null ? undefined : String(+value).replace(/^0\./, ".");
  return ring ? h("span", { className: cx("sn-pring", size === "lg" && "sn-lg", className), style: { "--sn-p": v ?? "0" } })
    : h("div", { className: cx("sn-pbar", value == null && "sn-indet", className), style: v != null ? { "--sn-p": v } : undefined }, h("i"));
}
export function Spinner({ size, className }) { return h("span", { className: cx("sn-spinner", size === "lg" && "sn-lg", className) }); }
export function Steps({ steps = [], current = 0, className }) {
  const out = [];
  steps.forEach((s, i) => { if (i) out.push(h("span", { key: "l" + i, className: cx("sn-ln", i <= current && "sn-done") }, h("i"))); out.push(h("span", { key: "s" + i, className: cx("sn-st", i < current && "sn-done", i === current && "sn-cur") }, h("span", { className: "sn-n" }, i + 1), s)); });
  return h("div", { className: cx("sn-steps", className) }, out);
}
// 文字层级 × 色调：<Text level="title1">、<Text tone="tertiary">
export function Text({ as = "span", level = "body", tone, num, truncate, className, children, ...rest }) {
  return h(as, { ...rest, className: cx(`sn-t-${level === "bodyStrong" ? "body-strong" : level}`, tone && `sn-c-${tone}`, num && "sn-num", truncate && "sn-truncate", className) }, children);
}
// Tooltip：给子元素加 data-tip（悬停 500ms 出现、键盘聚焦也出现；文字要短）
export function Tooltip({ text, kbd, children }) {
  const child = Children.only(children);
  return isValidElement(child) ? cloneElement(child, { "data-tip": text, "data-kbd": kbd }) : child;
}

// ———— 对话框：open 控制开关；标题、说明、内容、底部按钮都是 React 节点 ————
export function Dialog({ open, onClose, title, description, footer, children, className, guard }) {
  const ref = useRef(null), was = useRef(false);
  useIso(() => { const d = ref.current; wireDialog(d); const off = () => onCloseRef.current?.(); d.addEventListener("close", off); return () => d.removeEventListener("close", off); }, []);
  const onCloseRef = useRef(onClose); onCloseRef.current = onClose;
  useIso(() => { const d = ref.current; d.guard = guard ? () => guard(() => closeDialog(d)) : undefined; });
  useIso(() => { const d = ref.current; if (open && !d.open) { was.current = document.activeElement; openDialog(d, was.current); } else if (!open && d.open) closeDialog(d); }, [open]);
  return h("dialog", { ref, className: cx("sn-dlg", className) },
    h("form", { method: "dialog" },
      title || description ? h("div", { className: "sn-hd" }, h("div", { style: { flex: 1 } }, title ? h("h3", null, title) : null, description ? h("div", { className: "sn-sub" }, description) : null)) : null,
      h("div", { className: "sn-bd" }, children),
      footer ? h("div", { className: "sn-ft" }, footer) : null));
}
// 抽屉：从右边滑进来
export function Drawer({ open, onClose, title, children, footer, className }) {
  const ref = useRef(null), layer = useRef(null);
  useIso(() => { if (open && !layer.current) layer.current = openDrawer(ref.current, { trigger: document.activeElement, onClose: () => { layer.current = null; onClose?.(); } }); else if (!open && layer.current) { layer.current.close(true); layer.current = null; } }, [open]);
  return h("aside", { ref, className: cx("sn-drawer", className), role: "dialog", "aria-modal": "true", tabIndex: -1 },
    h("div", { className: "sn-hd" }, h("h3", null, title), h("button", { className: "sn-btn sn-ghost sn-sm sn-ibtn", "data-x": "", "aria-label": t("components.close"), "data-tip": t("components.close"), "data-kbd": "Esc" }, h(Icon, { name: "x", size: 16 }))),
    h("div", { className: "sn-bd" }, children), footer ? h("div", { className: "sn-ft" }, footer) : null);
}

// ———— 命令式：Toast、通知 ————
export const toast = (o) => (setup(), S.toast(o));
export const notify = (o) => (setup(), S.notify(o));
// 拿到 Satin 实例的小工具：const ref = useSatin(); <Slider ref={ref} />; ref.current.update(...)
export const useSatin = () => useRef(null);
export { initSeg };
export const useToast = () => useCallback((o) => toast(o), []);
