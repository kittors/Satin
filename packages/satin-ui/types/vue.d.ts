// satin-ui/vue
import type { DefineComponent, Plugin } from "vue";
import type { Item, ToastOptions, ToastHandle, NotifyOptions, PickerOptions, TableOptions } from "./components";
type C<P> = DefineComponent<P & { modelValue?: any }>;
export const Password: C<{ value?: string; label?: string; help?: string; name?: string; id?: string; placeholder?: string; meter?: boolean; size?: "sm" | "lg" | "xl"; autocomplete?: string }>;
export const Search: DefineComponent<{ search?(q: string): number | unknown[] | Promise<number | unknown[]>; debounce?: number; placeholder?: string; label?: string; kbd?: string | false; id?: string; name?: string; size?: "sm" | "lg" | "xl" }>;
export const CountInput: C<{ value?: string; max?: number; placeholder?: string; size?: "sm" | "lg" | "xl"; id?: string; name?: string }>;
export const LongText: C<{ value?: string; max?: number; maxLines?: number; rows?: number; placeholder?: string; hint?: string; label?: string; id?: string; name?: string }>;
/** 提示词输入框：@send 返回 Promise 时发送后进入"生成中"，结束回到可发送；send 是发送按钮的名字 */
export const Composer: DefineComponent<{ placeholder?: string; max?: number; maxLines?: number; attach?: boolean; send?: string; upload?(file: File, progress: (p: number) => void): Promise<unknown> }>;
export const Email: C<{ value?: string; label?: string; help?: string; name?: string; id?: string; placeholder?: string; size?: "sm" | "lg" | "xl"; autocomplete?: string }>;
export const Table: C<Omit<TableOptions, "onSort" | "onSelect" | "onRowClick">>;
export const Segmented: C<{ items: Item[]; value?: string; size?: "sm" | "md"; label?: string }>;
export const Slider: C<{ value?: number; max?: number; label?: string }>;
export const Select: C<{ items: Item[]; value?: string; placeholder?: string; label?: string }>;
/** 验证码：不用 v-model（填满时发 complete，参数是整串数字） */
export const Otp: DefineComponent<{ length?: number }>;
export const Tabs: C<{ tabs: { label: string; badge?: string | number; content?: string; html?: string }[]; value?: number }>;
export const Pager: C<{ total: number; page?: number; count?: number }>;
export const Collapse: C<{ items: { title: string; content?: string; html?: string }[]; single?: boolean; open?: number[] }>;
export const TagInput: C<{ tags?: string[]; max?: number; placeholder?: string; hint?: string }>;
export const Stepper: C<{ value?: number; min?: number; max?: number; unit?: string; label?: string }>;
export const NumberFlow: DefineComponent<{ value: number; /** 变化的样子 */ effect?: "roll" | "blur" | "push" | "fade"; format?(v: number): string }>; // 只显示，没有 v-model
/** 日期、时间、地址选择器：@change 拿到 { text }（触发框里显示的文字）；没有 v-model（现在只能读出选中的结果） */
export const DatePicker: DefineComponent<Omit<PickerOptions, "onChange">>;
export const Icon: DefineComponent<{ name: string; size?: number }>;
export const Button: DefineComponent<{ variant?: "primary" | "secondary" | "tertiary" | "ghost" | "danger" | "danger-soft"; size?: "sm" | "md" | "lg"; icon?: string; iconAfter?: string; caret?: boolean; round?: boolean; selected?: boolean; loading?: boolean; done?: boolean; disabled?: boolean; tip?: string; badge?: number | string | boolean; type?: string }>;
export const Input: C<{ size?: "sm" | "md" | "lg" | "xl"; invalid?: boolean }>;
export const Field: DefineComponent<{ label?: string; help?: string; error?: string; for?: string }>;
export const Checkbox: C<{ label?: string; indeterminate?: boolean; disabled?: boolean }>;
/** 单选：v-model 绑这一组选中的值，value 是这一项的值 */
export const Radio: C<{ value?: string | number; name?: string; label?: string; disabled?: boolean }>;
export const Switch: C<{ label?: string; disabled?: boolean }>;
/** 芯片：v-model（布尔）给了是能切换的筛选芯片；removable 是能移除的标签（@remove 在收起动画放完以后发）；selected 只显示选中的样子 */
export const Chip: DefineComponent<{ modelValue?: boolean; selected?: boolean; removable?: boolean; removeLabel?: string }>;
export const Progress: DefineComponent<{ value?: number; ring?: boolean; size?: "lg"; label?: string }>;
export const Spinner: DefineComponent<{ size?: "lg"; label?: string }>;
export const Steps: DefineComponent<{ steps: string[]; current?: number }>;
export const Text: DefineComponent<{ as?: string; level?: string; tone?: string; num?: boolean; truncate?: boolean }>;
export const Tooltip: DefineComponent<{ text: string; kbd?: string }>;
/** 弹窗：v-model:open；@close 关完以后、@submit 表单提交；guard 拦下关闭；footerClass 加在底栏上；#footer 插槽放按钮 */
export const Dialog: DefineComponent<{ open: boolean; title?: string; description?: string; icon?: string; guard?(close: () => void): void; footerClass?: string }>;
export const Drawer: DefineComponent<{ open: boolean; title?: string }>;
/** v-enhance：照设计稿写好的一段标记放进这个元素，挂上时接上交互、卸载时撤掉（和 <sn-enhance> 一样） */
export const vEnhance: import("vue").ObjectDirective<HTMLElement>;
export function toast(o: ToastOptions): ToastHandle;
export function notify(o: NotifyOptions): import("./components").NotifyHandle;
declare const plugin: Plugin;
export default plugin;

/** 把任意 createXxx（包括重组件）包成 Vue 组件：props 列出要传给组件的选项名 */
export function wrapSatin(create: import("./components").SatinFactory<any, any>, opts: { name: string; props?: string[]; valueKey?: string; events?: string[]; modelEvent?: string }): import("vue").DefineComponent<Record<string, unknown>>;
export * from "./vue-extra";
