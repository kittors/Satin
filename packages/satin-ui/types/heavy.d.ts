// 重组件：satin-ui/markdown、/chat、/flow、/grid、/canvas-grid、/lightbox、/media（各自单独引入，不拉进主入口）
import type { SatinFactory } from "./components";

export interface MarkdownOptions { source?: string; codeMax?: number; imgH?: number | "auto"; tableMax?: number; reduced?(): boolean }
export function renderMarkdown(el: HTMLElement, md: string, opt?: Omit<MarkdownOptions, "source">): { el: HTMLElement; set(next: Omit<MarkdownOptions, "source">): void; update(md: string): void; destroy(): void; readonly options: Omit<MarkdownOptions, "source"> };
/** Markdown 文档：update({ source }) 换内容，改 codeMax / imgH / tableMax 只改高度设置；destroy 停掉文档里的播放器、撤掉监听 */
export const createMarkdown: SatinFactory<MarkdownOptions, { readonly source: string }>;
export function highlightLines(code: string, lang: string): string[];
/** 对话：box 是空容器时按 title / status / placeholder / max 自己填好标记（或用 chatHTML 先填）；respond 返回流式的文字（异步迭代）或一整段 */
export interface ChatItem { kind: "day" | "msg"; text?: string; me?: boolean; type?: "text" | "image" | "video" | "audio" | "file"; [k: string]: unknown }
export interface ChatOptions {
  /** 接模型的口子：异步生成器一段段 yield 字符串（或 { text } / { think } / { step } …），或直接返回一整段 */
  respond?(text: string, ctx: { /** 用户点了"停止"以后变成 true（每次读都是现在的值） */ readonly stopped: boolean }): AsyncIterable<unknown> | Promise<string> | string;
  history?: ChatItem[]; title?: string; status?: string; placeholder?: string; max?: number; maxLines?: number; attach?: boolean;
  /** 底部输入框的选项（输入框还没接上时用） */
  composer?: { upload?(file: File, onProgress: (p: number) => void): Promise<unknown>; attachments?: unknown[] };
  hiRes?(bg: string): string;
}
export interface ChatApi { send(text: string): void; receive(item: Partial<ChatItem>): unknown; sendText(text: string, o?: { fail?: boolean }): unknown; scrollToOldest(): void }
export function mountChat(box: HTMLElement, o?: ChatOptions): ChatApi & { destroy(): void };
/** 对话（统一写法）：空容器按选项渲染；update({ status }) 改顶栏状态；destroy 停掉生成中的回答、撤掉监听、清空容器 */
export const createChat: SatinFactory<ChatOptions, ChatApi>;
export function chatHTML(o?: { title?: string; status?: string; placeholder?: string; max?: number; maxLines?: number; attach?: boolean }): string;
export interface FlowNode { id: string; x: number; y: number; t: string; ic?: string; d?: string; k?: "text" | "board" | "image" | "audio" | "video" | "out"; bg?: string }
export interface FlowOptions { nodes?: FlowNode[]; edges?: [string, string][]; label?: string }
export function mountFlow(flow: HTMLElement, o?: FlowOptions): { nodes: Map<string, unknown>; readonly edges: unknown[]; destroy(): void };
export function flowHTML(o?: { label?: string }): string;
/** 流程图（统一写法）：节点、连线只在创建时给；destroy 停掉"运行"、撤掉监听、清空容器 */
export const createFlow: SatinFactory<FlowOptions, { readonly nodes: Map<string, unknown>; readonly edges: unknown[] }>;
/** 十万行（DOM）/ 一百万行（Canvas）的数据表格：列和数据目前是演示用的项目表，rows 行数、seed 生成数据的种子 */
export interface GridOptions { rows?: number; seed?: number; label?: string }
export function mountDataGrid(root: HTMLElement, o?: GridOptions): { destroy(): void; [k: string]: unknown };
export function mountCanvasGrid(root: HTMLElement, o?: GridOptions): { destroy(): void; [k: string]: unknown };
export function dataGridHTML(o?: { label?: string }): string;
export function canvasGridHTML(o?: { label?: string }): string;
/** 数据表格（统一写法）：destroy 撤掉监听、观察器、后台线程，拿掉放进 <head> 的样式，清空容器 */
export const createDataGrid: SatinFactory<GridOptions>;
export const createCanvasGrid: SatinFactory<GridOptions>;
export function openLightbox(items: unknown[], index: number, o?: Record<string, unknown>): { close(): void };
export function closeLightbox(): void;
/** 页面上真正露出来的区域（视口坐标，比如固定顶栏下面那块）：缩略图被挡住的部分不算，图从露出来的那截飞出去；null 恢复整个窗口 */
export function setLightboxBounds(b: { left: number; top: number; right: number; bottom: number } | null): void;
export function playerHTML(o?: { src?: string; poster?: string; label?: string }): string;
export function mountPlayer(el: HTMLElement, o?: { onError?(e: unknown): void }): { play(): Promise<void>; pause(): void; toggle(): Promise<void> | void; video: HTMLVideoElement; destroy(): void };
export function audioHTML(o?: { src?: string; title?: string; sub?: string; wave?: string }): string;
export function mountAudio(el: HTMLElement, o?: { onError?(e: unknown): void }): { toggle(): void; audio: HTMLAudioElement; destroy(): void };
