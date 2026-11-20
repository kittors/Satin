// 重组件：satin-ui/markdown、/chat、/flow、/grid、/canvas-grid、/lightbox、/media（各自单独引入，不拉进主入口）
export function renderMarkdown(el: HTMLElement, md: string, opt?: { codeMax?: number; imgH?: number | "auto"; tableMax?: number; reduced?(): boolean }): { el: HTMLElement; set(next: Record<string, unknown>): void; render(md: string): void };
export function highlightLines(code: string, lang: string): string[];
/** 对话：box 是空容器时按 title / status / placeholder / max 自己填好标记（或用 chatHTML 先填）；respond 返回流式的文字（异步迭代）或一整段 */
export function mountChat(box: HTMLElement, o?: { respond?(text: string): AsyncIterable<string> | Promise<string>; history?: unknown; title?: string; status?: string; placeholder?: string; max?: number; maxLines?: number; attach?: boolean }): { send(text: string): void };
export function chatHTML(o?: { title?: string; status?: string; placeholder?: string; max?: number; maxLines?: number; attach?: boolean }): string;
export function mountFlow(flow: HTMLElement, o?: { nodes?: unknown[]; edges?: [string, string][] }): { nodes: unknown[]; readonly edges: [string, string][] };
export function mountDataGrid(root: HTMLElement, o?: Record<string, unknown>): unknown;
export function mountCanvasGrid(root: HTMLElement, o?: Record<string, unknown>): unknown;
export function openLightbox(items: unknown[], index: number, o?: Record<string, unknown>): { close(): void };
export function closeLightbox(): void;
/** 页面上真正露出来的区域（视口坐标，比如固定顶栏下面那块）：缩略图被挡住的部分不算，图从露出来的那截飞出去；null 恢复整个窗口 */
export function setLightboxBounds(b: { left: number; top: number; right: number; bottom: number } | null): void;
export function playerHTML(o?: { src?: string; poster?: string; label?: string }): string;
export function mountPlayer(el: HTMLElement, o?: { onError?(e: unknown): void }): { play(): void; pause(): void; toggle(): void; video: HTMLVideoElement; destroy(): void };
export function audioHTML(o?: { src?: string; title?: string; sub?: string; wave?: string }): string;
export function mountAudio(el: HTMLElement, o?: { onError?(e: unknown): void }): { toggle(): void; audio: HTMLAudioElement; destroy(): void };
