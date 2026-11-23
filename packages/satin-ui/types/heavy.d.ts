// 重组件：satin-ui/markdown、/chat、/flow、/grid、/canvas-grid、/lightbox、/media（各自单独引入，不拉进主入口）
import type { SatinFactory, LightboxItem, LightboxOptions, LightboxHandle, ComposerParts, ComposerPartEvents, ComposerAttachment } from "./components";
export type { LightboxItem, LightboxOptions, LightboxHandle } from "./components";

export interface MarkdownOptions { source?: string; codeMax?: number; imgH?: number | "auto"; tableMax?: number; reduced?(): boolean }
export function renderMarkdown(el: HTMLElement, md: string, opt?: Omit<MarkdownOptions, "source">): { el: HTMLElement; set(next: Omit<MarkdownOptions, "source">): void; update(md: string): void; destroy(): void; readonly options: Omit<MarkdownOptions, "source"> };
/** Markdown 文档：update({ source }) 换内容，改 codeMax / imgH / tableMax 只改高度设置；destroy 停掉文档里的播放器、撤掉监听 */
export const createMarkdown: SatinFactory<MarkdownOptions, { readonly source: string }>;
export function highlightLines(code: string, lang: string): string[];
/** 对话：box 是空容器时按 title / status / placeholder / max 自己填好标记（或用 chatHTML 先填）；respond 返回流式的文字（异步迭代）或一整段 */
/** 一条：kind "day" 日期分隔（text 是日期）；"msg" 消息——me 是不是自己发的，type 决定画成什么：文字 text；图片、视频 g（CSS 背景，比如 "url(…) center / cover"）、cap 说明、dur 时长文字，视频再给 src、poster 才能点开播放；音频 dur；文件 name、ext、size（字节）。status 是自己发的消息的状态 */
export interface ChatItem { kind: "day" | "msg"; text?: string; me?: boolean; type?: "text" | "image" | "video" | "audio" | "file"; g?: string; cap?: string; dur?: string; src?: string; poster?: string; name?: string; ext?: string; size?: number; status?: "sending" | "sent" | "fail"; [k: string]: unknown }
/** 历史消息：initial() 一开始的条目（从旧到新）；往上翻到顶时 older() 要更早的一页（可以是 Promise），hasMore() 说还有没有更早的 */
export interface ChatHistory { initial(): ChatItem[]; older?(): ChatItem[] | Promise<ChatItem[]>; hasMore?(): boolean }
/** 对话的选项（不含事件回调；Vue 组件的属性就是这些） */
export interface ChatProps extends ComposerParts {
  /** 接模型的口子：异步生成器一段段 yield 字符串（或 { text } / { think } / { step } …），或直接返回一整段 */
  respond?(text: string, ctx: { /** 用户点了"停止"以后变成 true（每次读都是现在的值） */ readonly stopped: boolean }): AsyncIterable<unknown> | Promise<string> | string;
  history?: ChatHistory; title?: string; status?: string; placeholder?: string; max?: number; maxLines?: number; attach?: boolean;
  /** 新对话：还没有消息时消息区正中的样子。不写有一个默认的（对话图标 + "有什么可以帮你？"）；true 只留空容器（自己画进 emptyEl）；false 不要 */
  empty?: ChatEmpty | boolean;
  /** 底部输入框的选项（输入框还没接上时用）：upload 上传函数；attachments 附件菜单每一项（img / vid / aud / doc）点了以后给出的附件 */
  composer?: { upload?(file: File, onProgress: (p: number) => void): Promise<unknown>; attachments?: Partial<Record<"img" | "vid" | "aud" | "doc", (counter: { n: number }) => ComposerAttachment>> };
  hiRes?(bg: string): string;
  /** 顶栏左边放"会话列表"按钮（单色图标），点了发 menu */
  menu?: boolean;
  /** 顶栏右边放"新对话"按钮（单色图标），点了发 newChat */
  newChat?: boolean;
}
/** createChat 的选项：上面那些 + 输入框部件的事件回调 + 顶栏按钮的回调 */
export interface ChatOptions extends ChatProps, ComposerPartEvents {
  /** 点了顶栏左边的"会话列表"（menu: true 时才有） */
  onMenu?(): void;
  /** 点了顶栏右边的"新对话"（newChat: true 时才有） */
  onNewChat?(): void;
}
/** 新对话的样子：图标（单色，图标名）、标题、说明、2～4 个建议（点了填进输入框） */
export interface ChatEmpty { icon?: string; title?: string; subtitle?: string; suggestions?: string[] }
export interface ChatApi { send(text: string): void; receive(item: Partial<ChatItem>): unknown; sendText(text: string, o?: { fail?: boolean }): unknown; scrollToOldest(): void;
  /** 填一段字进底部输入框（字淡入、光标在最后），不发 */
  fill(text: string): void;
  /** 新对话那一块（empty 给 true 时自己往里画）；没有空状态时是 null */
  readonly emptyEl: HTMLElement | null }
export function mountChat(box: HTMLElement, o?: ChatOptions): ChatApi & { destroy(): void };
/** 对话（统一写法）：空容器按选项渲染；update({ status }) 改顶栏状态；destroy 停掉生成中的回答、撤掉监听、清空容器 */
export const createChat: SatinFactory<ChatOptions, ChatApi>;
export function chatHTML(o?: { title?: string; status?: string; placeholder?: string; max?: number; maxLines?: number; attach?: boolean; menu?: boolean; newChat?: boolean }): string;
export interface FlowNode {
  id: string; x: number; y: number;
  /** 标题（短名 t） */ title?: string; t?: string;
  /** 图标名（短名 ic） */ icon?: string; ic?: string;
  /** 一行说明（短名 d） */ detail?: string; d?: string;
  /** 类型：决定颜色和能连到哪（短名 k） */ kind?: "text" | "board" | "image" | "audio" | "video" | "out"; k?: "text" | "board" | "image" | "audio" | "video" | "out";
  /** 缩略图（CSS 背景） */ bg?: string;
}
export interface FlowOptions { nodes?: FlowNode[]; edges?: [string, string][]; label?: string }
export function mountFlow(flow: HTMLElement, o?: FlowOptions): { nodes: Map<string, unknown>; readonly edges: unknown[]; destroy(): void };
export function flowHTML(o?: { label?: string }): string;
/** 流程图（统一写法）：节点、连线只在创建时给；destroy 停掉"运行"、撤掉监听、清空容器 */
export const createFlow: SatinFactory<FlowOptions, { readonly nodes: Map<string, unknown>; readonly edges: unknown[] }>;
/** 数据表格（DOM 版十万行、Canvas 版一百万行也流畅）：columns 列定义 + data 数组（或 dataSource 按块从服务端要） */
/** 选项列的一个选项：字符串，或者 { value, label, tone }（tone：status 列色点的色调 0～4，不写按第几个） */
export type GridOption = string | { value: unknown; label?: string; tone?: number };
/** 列定义 */
export interface GridColumn<Row = any> {
  /** 取数据里的哪个字段（唯一） */ key: string;
  /** 表头文字 */ title?: string;
  /** 列宽 / 拖边改宽时最窄多少（默认 160 / 64） */ width?: number; minWidth?: number;
  align?: "left" | "right";
  /** 点表头排序 */ sortable?: boolean;
  /** 列头筛选："enum" 选项多选、"range" 数值范围 */ filter?: "enum" | "range";
  /** 能不能拖右边缘改宽（默认能） */ resizable?: boolean;
  /** 固定在左边 / 右边（固定列不能拖着换位置） */ pinned?: "left" | "right";
  /** 能不能拖着换位置（默认：没固定的都能） */ fixed?: boolean;
  /** 内置的显示：text（默认）| int | dur（秒 → 分:秒）| status | owner | tag | prog（0～100）| time | money | sel（勾选 + 拖行把手）| act（行末的操作按钮） */
  type?: "text" | "int" | "dur" | "status" | "owner" | "tag" | "prog" | "time" | "money" | "sel" | "act";
  /** 选项列（status / owner / tag、enum 编辑和筛选）的选项 */ options?: GridOption[];
  /** 显示的文字 */ format?(value: any, row: Row): string;
  /** 自己画格子（DOM 版）：返回 HTML 字符串或节点；返回 undefined 表示已经自己改好了 cell */ render?(value: any, row: Row, ctx: { cell: HTMLElement; key: string; index: number }): string | Node | void;
  /** 能编辑（edit 写编辑器类型；不写按 type 猜） */ editable?: boolean; edit?: "text" | "int" | "enum" | "dur" | "money";
  /** 编辑框里的文字 → 存的值；不合法返回 { error }（红框加这句话，不提交） */ parse?(text: string, col: GridColumn<Row>): { value: unknown } | { error: string };
  /** 编辑框里显示的文字 */ editText?(value: any): string;
  /** 编辑的范围（int / dur / money） */ min?: number; max?: number;
  /** 主列：树形的缩进、展开箭头、详情箭头放在这一列（不写是第一列普通列） */ primary?: boolean;
  /** 数组数据时，排序按这个取值 */ sortValue?(row: Row): unknown;
}
/** 每行唯一的字段名，或者从行里取唯一值的函数 */
export type GridRowKey<Row = any> = string | ((row: Row) => unknown);
/** 行详情（展开在行下面）：DOM 版给函数 (el, row, index) 或 { init(el), fill(el, row, index) }，往详情容器里填；Canvas 版给 { draw(ctx) } 画（ctx 有 g、row、r、y、w、h、C 颜色、F 字体、text、trunc、width） */
export type GridDetail<Row = any> = ((el: HTMLElement, row: Row, index: number) => void) | { init?(el: HTMLElement): void; fill?(el: HTMLElement, row: Row, index: number): void; draw?(ctx: Record<string, unknown>): void };
/** 排序 */ export interface GridSort { key: string; dir: 1 | -1 }
/** 筛选：搜索词 + 每一列的筛选（选项列是选项的下标、范围列是 { min, max }） */ export interface GridFilter { q: string; filters: Record<string, number[] | { min?: number | null; max?: number | null } | null> }
/** 服务端数据：按块加载（排序、筛选也交给服务端；filter 里选项列给的是选项的值） */
export interface GridDataSource<Row = any> { total?: number; load(q: { start: number; end: number; sort: GridSort | null; filter: { q: string; [key: string]: unknown } }): Promise<Row[] | { rows: Row[]; total?: number }>; edit?(e: { row: number; key: string; value: unknown }): void; move?(e: { from: number; to: number }): void }
export interface GridEvents<Row = any> {
  onRowClick?(e: { row: Row; rowKey: unknown; key: string; index: number }): void;
  onSortChange?(sort: GridSort | null): void;
  onFilterChange?(filter: GridFilter): void;
  /** 勾选变了：keys 是勾上的行的 rowKey；点了全选时 all 为 true、except 是全选以后又去掉的（数组数据 keys 照样列全；dataSource 按块加载时不知道全部的行，keys 是 null） */
  onSelectionChange?(e: { keys: unknown[] | null; all: boolean; except: unknown[] }): void;
  onColumnResize?(e: { key: string; width: number }): void;
  onColumnReorder?(e: { keys: string[] }): void;
  /** 改了一个值（表格先在本地生效；row 是改之前的行） */ onCellEdit?(e: { row: Row; rowKey: unknown; key: string; value: unknown; oldValue: unknown }): void;
  /** 滚到底 */ onScrollEnd?(): void;
  /** 操作列的按钮（"more" 更多）；"detail" 展开详情、"edit" 编辑主列是表格自己处理的 */ onRowAction?(e: { action: string; row: Row; rowKey: unknown; index: number }): void;
  /** 出错状态里点了"重试" */ onRetry?(): void;
}
export interface GridOptions<Row = any> extends GridEvents<Row> {
  columns: GridColumn<Row>[];
  /** 数组数据（几万行以内：筛选、排序在页面里算；行里带 children 数组可以切树形） */ data?: Row[];
  /** 服务端数据（按块加载），或者自己实现的整套后端（见 table-backends.js） */ dataSource?: GridDataSource<Row> | Record<string, unknown>;
  /** 每行唯一的字段名或取值函数（默认 "id"） */ rowKey?: GridRowKey<Row>;
  /** 勾选：多选 / 单选 / 不能选（写了 sel 列时默认多选；要勾选又没写 sel 列会自动加一列） */ selection?: "multiple" | "single" | "none";
  /** 受控的勾选（rowKey 数组） */ selectedKeys?: unknown[]; defaultSelectedKeys?: unknown[];
  /** 受控的排序 */ sort?: GridSort | null; defaultSort?: GridSort | null;
  /** 能拖行换位置（没筛选、没排序时） */ rowDraggable?: boolean;
  /** 一开始就合并的格子：第 rows[0]～rows[1] 行 × keys 这几列 */ merges?: { rows: [number, number]; keys: string[] }[];
  /** 行详情：给了才有详情箭头 */ detail?: GridDetail<Row>;
  /** 树形：主列名字后面的下级数量文字（"4 集"）；level 是 -1 时是工具条上第一级的个数（"12 个项目"）。返回空字符串不显示 */ treeCount?(count: number, level: number): string;
  /** 三种状态 */ loading?: boolean; error?: string | null; emptyText?: string; noMatchText?: string; errorText?: string; loadingText?: string;
  /** 行线 / 网格（默认网格；合并单元格只在网格下出现） */ lines?: "row" | "grid";
  /** 表格框的高度（表头 + 行，不含工具条）：数字是 px，也可以写 "60vh"；默认 480 */ height?: number | string;
  /** 读屏用的表格名字 */ label?: string;
  /** 空容器时是否带工具条（搜索、筛选标签、行数），controls 再加设计稿演示的几个开关 */ toolbar?: boolean; controls?: boolean;
}
export interface GridApi { readonly sort: GridSort | null; readonly filter: GridFilter; readonly selectedKeys: unknown[] | null; merge(p0: number, p1: number, keys: string[]): void; reload(): void; readonly ready: Promise<unknown> }
export function mountDataGrid(root: HTMLElement, o?: GridOptions): GridApi & { update(o: Partial<GridOptions>, prev?: Partial<GridOptions>): void; destroy(): void; [k: string]: unknown };
export function mountCanvasGrid(root: HTMLElement, o?: GridOptions): GridApi & { update(o: Partial<GridOptions>, prev?: Partial<GridOptions>): void; destroy(): void; [k: string]: unknown };
export function dataGridHTML(o?: { label?: string; toolbar?: boolean; controls?: boolean; columns?: GridColumn[]; height?: number | string }): string;
export function canvasGridHTML(o?: { label?: string; toolbar?: boolean; controls?: boolean; columns?: GridColumn[]; height?: number | string }): string;
/** 数据表格（统一写法）：destroy 撤掉监听、观察器、后台线程，拿掉放进 <head> 的样式，清空容器 */
export const createDataGrid: SatinFactory<GridOptions, GridApi>;
export const createCanvasGrid: SatinFactory<GridOptions, GridApi>;
export function openLightbox(items: LightboxItem[], index: number, o?: LightboxOptions): LightboxHandle;
export function closeLightbox(): void;
/** 页面上真正露出来的区域（视口坐标，比如固定顶栏下面那块）：缩略图被挡住的部分不算，图从露出来的那截飞出去；null 恢复整个窗口 */
export function setLightboxBounds(b: { left: number; top: number; right: number; bottom: number } | null): void;
export function playerHTML(o?: { src?: string; poster?: string; label?: string }): string;
export function mountPlayer(el: HTMLElement, o?: { onError?(e: MediaError | null): void }): { play(): Promise<void>; pause(): void; toggle(): Promise<void> | void; video: HTMLVideoElement; destroy(): void };
export function audioHTML(o?: { src?: string; title?: string; sub?: string; wave?: string }): string;
export function mountAudio(el: HTMLElement, o?: { onError?(e: MediaError | null): void }): { toggle(): void; audio: HTMLAudioElement; destroy(): void };

export interface ChartSeries { name: string; values: number[]; color?: string; unit?: string; dashed?: boolean }
export interface AreaChartOptions { labels: string[]; series: ChartSeries[]; height?: number | string; unit?: string; legend?: boolean; area?: boolean; tipNote?(index: number, cfg: AreaChartOptions): string }
export interface BarChartOptions { labels: string[]; series: ChartSeries[]; height?: number | string; unit?: string; legend?: boolean; activeIndex?: number; onSelect?(label: string | null, index: number): void }
export interface DonutItem { label: string; value: number; color?: string }
export interface DonutChartOptions { items: DonutItem[]; totalLabel?: string; unit?: string; activeIndex?: number; onSelect?(item: DonutItem | null, index: number): void }
export interface Chart3DOptions { rows: string[]; cols: string[]; values: number[][]; height?: number | string; unit?: string; metricLabel?: string; rowColors?: string[]; interactive?: boolean }
export interface SparklineOptions { values: number[]; color?: string; height?: number | string }
export interface Icon3DOptions { name?: string; tone?: "obsidian" | "ceramic" | "cobalt" | "emerald" | "amber" | "crimson"; size?: "sm" | "md" | "lg"; label?: string }
export const createAreaChart: SatinFactory<AreaChartOptions, { replay(): void }>;
export const createBarChart: SatinFactory<BarChartOptions, { replay(): void }>;
export const createDonutChart: SatinFactory<DonutChartOptions, { replay(): void }>;
export const createChart3D: SatinFactory<Chart3DOptions, { setView(name: "iso" | "top" | "front"): void; replay(): void }>;
export const createSparkline: SatinFactory<SparklineOptions, Record<string, never>>;
export const createIcon3D: SatinFactory<Icon3DOptions, Record<string, never>>;
export function icon3DHTML(o?: Icon3DOptions): string;
export function bindIcons3D(scope?: Document | HTMLElement): () => void;
