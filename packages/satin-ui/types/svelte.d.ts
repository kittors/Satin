// satin-ui/svelte/<名字>.svelte 的类型（Svelte 5 组件，直接发 .svelte 源码，项目里的 @sveltejs/vite-plugin-svelte 编译）
// 一个一个引：import Select from "satin-ui/svelte/Select.svelte"——导出表 "./svelte/*.svelte" 的类型指到 svelte-<名字>.d.ts，它们从这里转出
import type { Component, Snippet } from "svelte";
import type { SatinFactory, SatinInstance, Item, PickerKind, PickDetail } from "./components";
type Attrs = { class?: string; style?: string; id?: string; [attr: `data-${string}`]: unknown; [attr: `aria-${string}`]: unknown };
type Inst = { /** bind:instance 拿到 Satin 实例（update / destroy / 各组件的方法） */ instance?: SatinInstance | null };
type SelectProps = Attrs & Inst & { items: Item[]; /** bind:value 双向绑定 */ value?: string; placeholder?: string; label?: string; onchange?(value: string): void };
type DatePickerProps = Attrs & Inst & { kind?: PickerKind; placeholder?: string; label?: string; today?: Date; now?: Date; /** 选好、清除时；text 是触发框里显示的文字 */ onchange?(detail: PickDetail): void };
type DialogProps = Attrs & {
  /** bind:open 双向绑定 */ open?: boolean; title?: string; description?: string; icon?: string;
  /** 拦下关闭（Esc、取消、×）：确认要关时调 close() */ guard?(close: () => void): void;
  /** 关完以后（open 同时改回 false） */ onclose?(): void; onsubmit?(e: SubmitEvent): void; footerClass?: string; children?: Snippet; footer?: Snippet;
};
type IconProps = { name: string; size?: number; class?: string };
type SatinProps = Attrs & Inst & { create: SatinFactory<any, any>; options?: Record<string, unknown> };
/** 下拉选择：<Select items={…} bind:value label="…" /> */
export const Select: Component<SelectProps, {}, "value" | "instance">;
/** 日期、时间、地址选择器：<DatePicker kind="range" onchange={(d) => …} />；没有 bind:value（现在只能读出选中的结果） */
export const DatePicker: Component<DatePickerProps, {}, "instance">;
/** 弹窗：<Dialog bind:open title="…">内容{#snippet footer()}按钮{/snippet}</Dialog> */
export const Dialog: Component<DialogProps, {}, "open">;
/** 图标：<Icon name="plus" /> */
export const Icon: Component<IconProps>;
/** 把任意 createXxx 包成组件：<Satin create={createChat} options={{ … }} bind:instance /> */
export const Satin: Component<SatinProps, {}, "instance">;
