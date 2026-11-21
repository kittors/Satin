// satin-ui/react
import type * as React from "react";
import type { SatinInstance, Item, ToastOptions, ToastHandle, NotifyOptions } from "./components";
type Base = { className?: string; style?: React.CSSProperties; id?: string };
type Controlled<T, K extends string = "value"> = { [P in K]?: T } & { [P in `default${Capitalize<K>}`]?: T };
type Ref = React.Ref<SatinInstance | null>;
export const Segmented: React.ForwardRefExoticComponent<Base & Controlled<string> & { items: Item[]; size?: "sm" | "md"; label?: string; onChange?(value: string): void } & React.RefAttributes<SatinInstance>>;
export const Slider: React.ForwardRefExoticComponent<Base & Controlled<number> & { max?: number; label?: string; onChange?(value: number): void } & React.RefAttributes<SatinInstance>>;
/** 下拉选择的属性：value 受控、defaultValue 非受控 */
export type SelectProps = Base & Controlled<string> & { items: Item[]; placeholder?: string; label?: string; onChange?(value: string): void };
export const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<SatinInstance>>;
export const Otp: React.ForwardRefExoticComponent<Base & { length?: number; onComplete?(code: string): void } & React.RefAttributes<SatinInstance>>;
export const Tabs: React.ForwardRefExoticComponent<Base & Controlled<number> & { tabs: { label: string; badge?: string | number; content?: string; html?: string }[]; onChange?(index: number): void } & React.RefAttributes<SatinInstance>>;
export const Pager: React.ForwardRefExoticComponent<Base & Controlled<number, "page"> & { total: number; count?: number; onChange?(page: number): void } & React.RefAttributes<SatinInstance>>;
export const Collapse: React.ForwardRefExoticComponent<Base & { items: { title: string; content?: string; html?: string }[]; single?: boolean; open?: number[]; onToggle?(e: { index: number; open: boolean }): void } & React.RefAttributes<SatinInstance>>;
export const TagInput: React.ForwardRefExoticComponent<Base & Controlled<string[], "tags"> & { max?: number; placeholder?: string; hint?: string; onChange?(tags: string[]): void } & React.RefAttributes<SatinInstance>>;
export const Stepper: React.ForwardRefExoticComponent<Base & Controlled<number> & { min?: number; max?: number; unit?: string; label?: string; onChange?(value: number): void } & React.RefAttributes<SatinInstance>>;
export const Table: React.ForwardRefExoticComponent<Base & import("./components").TableOptions & { selected?: (string | number)[]; defaultSelected?: (string | number)[] } & React.RefAttributes<SatinInstance>>;
export const Password: React.ForwardRefExoticComponent<Base & Controlled<string> & { label?: string; help?: string; name?: string; placeholder?: string; meter?: boolean; size?: "sm" | "lg" | "xl"; autocomplete?: string; onChange?(value: string): void } & React.RefAttributes<SatinInstance>>;
export const Email: React.ForwardRefExoticComponent<Base & Controlled<string> & { label?: string; help?: string; name?: string; placeholder?: string; size?: "sm" | "lg" | "xl"; autocomplete?: string; onChange?(value: string): void } & React.RefAttributes<SatinInstance>>;
export const NumberFlow: React.ForwardRefExoticComponent<Base & { value: number; style?: string; format?(v: number): string } & React.RefAttributes<SatinInstance>>;
export type Variant = "primary" | "secondary" | "tertiary" | "ghost" | "danger" | "danger-soft";
/** 按钮的属性：原生 <button> 的属性照常能写（onClick、type、aria-label……）；disabled 用 aria-disabled 实现，点了不触发 onClick */
export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> & { variant?: Variant; size?: "sm" | "md" | "lg"; icon?: string; round?: boolean; selected?: boolean; busy?: boolean; disabled?: boolean; tip?: string };
export const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export function Icon(p: { name: string; size?: number; className?: string }): React.ReactElement;
export const Input: React.ForwardRefExoticComponent<Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & { size?: "sm" | "md" | "lg" | "xl"; invalid?: boolean } & React.RefAttributes<HTMLInputElement>>;
export const Textarea: React.ForwardRefExoticComponent<React.TextareaHTMLAttributes<HTMLTextAreaElement> & React.RefAttributes<HTMLTextAreaElement>>;
export function Field(p: { label?: React.ReactNode; help?: React.ReactNode; error?: React.ReactNode; htmlFor?: string; className?: string; children?: React.ReactNode }): React.ReactElement;
export const Checkbox: React.ForwardRefExoticComponent<Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & { label?: React.ReactNode; indeterminate?: boolean } & React.RefAttributes<HTMLInputElement>>;
export const Switch: React.ForwardRefExoticComponent<Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & { label?: React.ReactNode } & React.RefAttributes<HTMLInputElement>>;
export function Chip(p: React.HTMLAttributes<HTMLSpanElement> & { on?: boolean; removable?: boolean; onRemove?(): void }): React.ReactElement;
export function Progress(p: { value?: number; ring?: boolean; size?: "lg"; className?: string }): React.ReactElement;
export function Spinner(p: { size?: "lg"; className?: string }): React.ReactElement;
export function Steps(p: { steps: React.ReactNode[]; current?: number; className?: string }): React.ReactElement;
export function Text(p: React.HTMLAttributes<HTMLElement> & { as?: keyof React.JSX.IntrinsicElements; level?: "display" | "title1" | "title2" | "title3" | "body" | "bodyStrong" | "callout" | "caption" | "micro" | "code"; tone?: "primary" | "secondary" | "tertiary" | "off" | "danger" | "success" | "warning"; num?: boolean; truncate?: boolean }): React.ReactElement;
export function Tooltip(p: { text: string; kbd?: string; children: React.ReactElement }): React.ReactElement;
/** 弹窗的属性：open 控制开关；关完（Esc、取消、程序关）调 onClose；guard 拦下关闭（比如有填写内容先问一句），确认要关时调它给的 close */
export interface DialogProps { open: boolean; onClose?(): void; title?: React.ReactNode; description?: React.ReactNode; footer?: React.ReactNode; children?: React.ReactNode; className?: string; guard?(close: () => void): void }
export function Dialog(p: DialogProps): React.ReactElement;
export function Drawer(p: { open: boolean; onClose?(): void; title?: React.ReactNode; footer?: React.ReactNode; children?: React.ReactNode; className?: string }): React.ReactElement;
export function toast(o: ToastOptions): ToastHandle;
export function notify(o: NotifyOptions): import("./components").NotifyHandle;
export function useSatin(): React.MutableRefObject<SatinInstance | null>;
export function useToast(): (o: ToastOptions) => ToastHandle;

/** 把任意 createXxx（包括重组件 createChat、createMarkdown、createFlow……）包成 React 组件：props 就是组件的选项，ref 拿到实例 */
export function wrapSatin<O>(create: import("./components").SatinFactory<O, any>, opts?: { valueKey?: string; events?: string[]; displayName?: string }): import("react").ForwardRefExoticComponent<O & { className?: string; style?: import("react").CSSProperties; id?: string; [k: string]: unknown } & import("react").RefAttributes<unknown>>;
