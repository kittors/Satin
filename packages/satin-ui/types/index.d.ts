// satin-ui 主入口
import type { SatinInstance } from "./components";
export * from "./components";
/** 整页调一次：Tooltip、表单、浮层栈、看图键盘、主题这些页面级行为。重复调用没影响；返回撤销函数（引用计数） */
export function setup(): () => void;
export function defineComponent<O, I = {}>(def: { name: string; defaults?: Partial<O>; html?(o: O): string; mount(el: HTMLElement, o: O, api: { emit(type: string, detail?: unknown): void; readonly options: O }): (I & { update?(next: O, prev: O): void; destroy?(): void }) | void }): ((el: HTMLElement, options?: O) => SatinInstance<O> & I) & { html?(o?: O): string; componentName: string };
export function track<T>(fn: () => T): [T, () => void];
export function useShared(key: string, install: () => void): () => void;
export function reduced(): boolean;
export function injectIcons(scope?: ParentNode): void;
export function initSeg(seg: HTMLElement, onChange?: (value: string, index: number, anim: Animation | null) => void, start?: number): { go(index: number, focus?: boolean, instant?: boolean): void };
export function showTip(el: HTMLElement, text: string): void;
export function hideTip(): void;
export function fitScroll(el: HTMLElement, o?: { bar?: "none" | "hover" | "always" }): () => void;
export function fitStack(el: HTMLElement): () => void;
export function edgeFrames(from: [number, number], to: [number, number], toTransform: (edges: [number, number], squash: number) => string, k?: number): { frames: Keyframe[]; duration: number };
export const TICK: string;
export function $(sel: string, root?: ParentNode): HTMLElement | null;
export function $$(sel: string, root?: ParentNode): HTMLElement[];
