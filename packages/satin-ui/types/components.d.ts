// satin-ui/components：不依赖框架的组件 API
export interface SatinInstance<O = Record<string, unknown>> {
  /** 组件根元素 */
  readonly el: HTMLElement;
  /** 渲染进去的宿主（el 是空容器时）；在已有标记上接交互时为 null */
  readonly host: HTMLElement | null;
  readonly name: string;
  readonly alive: boolean;
  /** 合并新选项；组件自己判断哪些变了（值变了会带动画过去） */
  update(options: Partial<O>): this;
  /** 撤掉挂载时加的监听、观察器、定时器；宿主里渲染的标记也清掉 */
  destroy(): void;
  on(type: string, fn: (detail: any) => void): () => void;
  off(type: string, fn: (detail: any) => void): void;
}
export interface SatinFactory<O, I = {}> {
  (el: HTMLElement, options?: O): SatinInstance<O> & I;
  /** 纯字符串：生成和浏览器第一帧一样的标记（Node / SSR 里也能调） */
  html(options?: O): string;
  readonly componentName: string;
}
export type Item = string | { value: string | number; label?: string; disabled?: boolean };

export interface SegmentedOptions { items?: Item[]; value?: string; size?: "sm" | "md"; label?: string; onChange?(value: string): void }
export const createSegmented: SatinFactory<SegmentedOptions, { readonly value: string; select(value: string): void }>;
export interface SliderOptions { value?: number; max?: number; label?: string; onChange?(value: number): void }
export const createSlider: SatinFactory<SliderOptions, { readonly value: number }>;
export interface SelectOptions { items?: Item[]; value?: string; placeholder?: string; label?: string; onChange?(value: string): void }
export const createSelect: SatinFactory<SelectOptions, { readonly value: string | null; open(): void; close(refocus?: boolean): void }>;
export interface OtpOptions { length?: number; onComplete?(code: string): void }
export const createOtp: SatinFactory<OtpOptions, { readonly value: string; clear(): void }>;
export interface TabsOptions { tabs?: { label: string; badge?: string | number; content?: string; html?: string }[]; value?: number; onChange?(index: number): void }
export const createTabs: SatinFactory<TabsOptions, { readonly value: number; select(index: number): void }>;
export interface PagerOptions { total?: number; page?: number; count?: number; onChange?(page: number): void }
/** 分页：update({ total }) 总页数可以变（筛选以后），当前页超出就停在最后一页；update({ page }) 改页码不触发 onChange */
export const createPager: SatinFactory<PagerOptions, { readonly page: number; readonly total: number; go(page: number, silent?: boolean): void }>;
export interface CollapseOptions { items?: { title: string; content?: string; html?: string }[]; single?: boolean; open?: number[]; onToggle?(e: { index: number; open: boolean }): void }
export const createCollapse: SatinFactory<CollapseOptions, { open(i: number): void; close(i: number): void }>;
export interface TagInputOptions { tags?: string[]; max?: number; placeholder?: string; hint?: string; onChange?(tags: string[]): void }
export const createTagInput: SatinFactory<TagInputOptions, { readonly tags: string[]; add(tag: string): void; clear(): void }>;
export interface StepperOptions { value?: number; min?: number; max?: number; unit?: string; label?: string; onChange?(value: number): void }
export const createStepper: SatinFactory<StepperOptions, { readonly value: number; set(value: number): void }>;
export interface NumberFlowOptions { value?: number; style?: "roll" | "blur" | "push" | "fade"; format?(v: number): string; reduced?(): boolean }
export const createNumberFlow: SatinFactory<NumberFlowOptions, { readonly value: number; set(value: number): void; get(): number; setStyle(style: "roll" | "blur" | "push" | "fade"): void }>;
export interface ScrollAreaOptions { fade?: "y" | "x" | "both" | "none" | string; size?: number; bar?: "auto" | "hover" | "always" | "none" | "gutter"; wheel?: "x" | "y"; overscroll?: "contain" | "auto"; inner?: boolean }
export const createScrollArea: SatinFactory<ScrollAreaOptions>;
interface InputBoxOptions { id?: string; name?: string; label?: string; help?: string; placeholder?: string; size?: "sm" | "lg" | "xl"; autocomplete?: string }
/** 密码框：显示 / 隐藏按钮、大写锁定提示；meter: true 加强度条（注册、改密码用） */
export const createPassword: SatinFactory<InputBoxOptions & { meter?: boolean; value?: string; onChange?(value: string): void }, { readonly value: string; focus(): void }>;
export function passwordHTML(o?: InputBoxOptions & { meter?: boolean }): string;
export function emailHTML(o?: InputBoxOptions): string;
export function searchHTML(o?: { id?: string; name?: string; label?: string; placeholder?: string; size?: "sm" | "lg"; kbd?: string | false }): string;
export function countHTML(o?: { id?: string; name?: string; placeholder?: string; max?: number; value?: string; size?: "sm" | "lg" | "xl" }): string;
/** 邮箱框：停止输入 400ms 后格式对了出现对勾 */
export const createEmail: SatinFactory<InputBoxOptions & { value?: string; onChange?(value: string): void }, { readonly value: string; focus(): void }>;
/** 搜索框：防抖、转圈（300ms 内回来不转）、结果数、清除按钮、按 / 聚焦。search(q) 返回结果数 */
export const createSearch: SatinFactory<{ search?(q: string): number; debounce?: number; onSearch?(q: string): void; placeholder?: string; label?: string; kbd?: string | false; id?: string; name?: string }>;
/** 带字数的输入框（max 默认 20） */
export const createCount: SatinFactory<{ id?: string; name?: string; placeholder?: string; max?: number; value?: string; size?: "sm" | "lg" | "xl" }>;
export const createLongText: SatinFactory<{ onSubmit?(value: string): void }>;
/** 提示词输入框的标记（空容器交给 createComposer 时就用它渲染） */
export function composerHTML(o?: { placeholder?: string; max?: number; maxLines?: number; attach?: boolean; send?: string; external?: boolean }): string;
export const createComposer: SatinFactory<{ onSend?(message: { text: string; files: File[] }): void; onStop?(): void; upload?(file: File, progress: (p: number) => void): Promise<unknown> }>;
export const createProgressCard: SatinFactory<{ onCancel?(): void; onOpen?(): void }>;
export const createPicker: SatinFactory<{ today?: Date; now?: Date; onChange?(detail: unknown): void }>;
export const createUpload: SatinFactory<{ list?: HTMLElement; accept?: RegExp; maxSize?: number; upload?(file: File, progress: (p: number) => void): Promise<unknown> }>;
export const createReorder: SatinFactory<{ row?: string; onReorder?(e: { from: number; to: number; row: HTMLElement }): void }>;
/** 侧栏布局（.sn-app）：选中切换、收起 / 展开（⌘\\）。collapseBelow：布局窄于这个宽度时自动收成图标栏（手机上用，比如 720） */
export const createSidebar: SatinFactory<{ onNavigate?(link: HTMLElement): void; collapseBelow?: number }, { toggle(): void; select(link: HTMLElement): void; setFx(fx: "slide" | "bar" | "fade" | "text"): void }>;
export const createInfiniteList: SatinFactory<{ loadPage(offset: number, size: number): Promise<unknown[]>; /** 把一行画出来：row 是行元素（会复用，子元素可以缓存在 row._d 上），item 是这一行的数据 */ renderRow(row: HTMLElement, item: any, index: number): void; rowHeight?: number; total?: number; pageSize?: number; onCount?(n: number): void }>;
export const createPlayer: SatinFactory<{ src?: string; poster?: string; label?: string; onError?(e: unknown): void }>;
export const createAudio: SatinFactory<{ src?: string; title?: string; sub?: string; wave?: string; onError?(e: unknown): void }>;

// 纯样式组件的标记
export interface ButtonHTMLOptions { text?: string; variant?: "primary" | "secondary" | "tertiary" | "ghost" | "danger" | "danger-soft"; size?: "sm" | "md" | "lg"; icon?: string; iconAfter?: string; round?: boolean; selected?: boolean; disabled?: boolean; busy?: boolean; type?: "button" | "submit" | "reset"; tip?: string; attrs?: Record<string, string> }
export function buttonHTML(o?: ButtonHTMLOptions): string;
export function checkHTML(o?: { label?: string; checked?: boolean; indeterminate?: boolean; disabled?: boolean; name?: string; value?: string }): string;
export function switchHTML(o?: { label?: string; checked?: boolean; disabled?: boolean; name?: string }): string;
export function inputHTML(o?: { value?: string; placeholder?: string; size?: "sm" | "md" | "lg" | "xl"; type?: string; id?: string; name?: string; disabled?: boolean; invalid?: boolean }): string;
/** 字段：标签 + 控件 + 说明 + 错误。error 不传就没有错误区；传字符串就有（空字符串 = 先占好位置，之后 setFieldError 展开）；name 写成 data-f，给 validateForm 找规则 */
export function fieldHTML(o?: { label?: string; control?: string; help?: string; error?: string; id?: string; name?: string }): string;
export function chipHTML(o?: { text?: string; on?: boolean; removable?: boolean }): string;
export function progressHTML(o?: { value?: number; ring?: boolean; size?: "lg" }): string;
export function spinnerHTML(o?: { size?: "lg" }): string;
export function stepsHTML(o?: { steps?: string[]; current?: number }): string;
export function setStep(steps: HTMLElement, index: number): number;
export function esc(s: unknown): string;
export function icon(name: string, size?: number): string;

// 按钮状态、复制、芯片
export function busy<T>(btn: HTMLElement, work: () => Promise<T> | T): Promise<T>;
export function succeed(btn: HTMLElement, back?: number): void;
export function copied(btn: HTMLElement): void;
export function removeChip(chip: HTMLElement, o?: { onRemoved?(): void }): void;

// 反馈
export interface ToastOptions { text: string; kind?: "status" | "progress" | "undo"; tone?: "danger" | "success" | "warning"; icon?: string; duration?: number; action?: { label: string; run(t: ToastHandle): void }; progress?: number; alert?: boolean; done?: boolean }
export interface ToastHandle { update(o: Partial<ToastOptions>): void; close(): void }
export function toast(o: ToastOptions): ToastHandle;
export interface NotifyOptions { title: string; text?: string; icon?: string; tone?: string; time?: string; actions?: { label: string; run(): void }[] }
export function notify(o: NotifyOptions): { close(): void };

// 浮层
export function openDialog(dialog: HTMLDialogElement, trigger?: HTMLElement | null): void;
export function closeDialog(dialog: HTMLDialogElement, refocus?: boolean): Promise<void>;
export function wireDialog(dialog: HTMLDialogElement): void;
export function openDrawer(drawer: HTMLElement, o?: { trigger?: HTMLElement | null; scrim?: HTMLElement; focus?: HTMLElement; onClose?(): void }): { close(refocus?: boolean): void };
export function closeDrawer(refocus?: boolean): void;
export function openPopoverAt(pop: HTMLElement, trigger: HTMLElement, o?: { align?: "start" | "center" | "end"; onClose?(): void }): unknown;
export function popoverOf(pop: HTMLElement): unknown;
export function openMenu(menu: HTMLElement, o?: { trigger?: HTMLElement; x?: number; y?: number; anchor?: HTMLElement; keyboard?: boolean; align?: string; bound?: HTMLElement | "window"; onSelect?(item: HTMLElement): void }): void;
export function closeMenu(refocus?: boolean): void;
export function createCommandPalette(groups: { name: string; items: { label: string; icon?: string; hint?: string; keys?: string; run?(): void }[] }[], o?: { onRun?(item: unknown): void; placeholder?: string; hotkey?: boolean; enterLabel?: string }): { open(): void; close(): void; toggle(): void };
export function openLightbox(items: { src?: string; bg?: string; ratio?: number; video?: string; caption?: string }[], index: number, o?: { thumbOf?(i: number): HTMLElement | null; enabled?(i: number): boolean; onClose?(): void }): { close(): void };
export function closeLightbox(): void;

// ———— 其余公开函数 ————
/** 表单校验：表单里每个 .sn-field[data-f="名字"] 按 rules[名字](值, 输入框) 查，返回错误文字就标红并写到字段下面；第一个错的获得焦点。全部通过返回 true */
export function validateForm(form: HTMLElement, rules: Record<string, (value: string, input: HTMLInputElement) => string | null | undefined | false>): boolean;
/** 给一个 .sn-field 标错（红框 + 下面一行错误文字 + aria-invalid） */
export function setFieldError(field: HTMLElement, message: string): void;
export function clearFieldError(field: HTMLElement): void;
/** 提前把按钮内容包成 busy() 需要的结构（避免第一次等待时排版跳一下） */
export function prepBusy(button: HTMLElement): HTMLElement;
/** 在已有的 .sn-slider 标记上接交互（一般用 createSlider） */
export function initSlider(el: HTMLElement): void;
/** 在已有的 .sn-select 标记上接交互（一般用 createSelect） */
export function mountSelect(el: HTMLElement, options?: { onChange?(value: string): void }): { readonly value: string | null };
/** 把 root 里所有 .sn-select 都接上 */
export function bindSelects(root?: ParentNode): void;
/** 插入一行：其余行平滑让位（FLIP） */
export function insertWithFlip(container: HTMLElement, el: HTMLElement, before?: Element | null): void;
/** 删掉一行：先淡出收起，其余行平滑补位 */
export function removeWithFlip(el: HTMLElement): void;
/** 乐观更新：先 apply() 显示结果，再 save()；失败时 revert()、抖一下 shake 元素、弹出带"重试"的 Toast */
export function optimistic(options: { apply(): void; revert(): void; save(): Promise<unknown> | unknown; shake?: HTMLElement; failText?: string }): Promise<unknown>;
/** load() 超过一小会儿还没回来才显示骨架屏 skeleton；回来以后换成 render(数据) 的内容（逐行错开淡入）。shown：骨架屏有没有出现过，waited：等了多少毫秒 */
export function loadWithSkeleton<T>(el: HTMLElement, options: { load(): Promise<T> | T; skeleton?: string; render?(data: T): string; stagger?: number }): Promise<{ shown: boolean; waited: number }>;
/** Toast 出现的位置：顶部居中（默认）或底部居中；记在 localStorage，刷新后保持 */
export function setToastPos(pos: "top" | "bottom"): void;
/** 在已有的生成进度卡片标记上接交互（一般用 createProgressCard） */
export function mountProgress(el: HTMLElement, options?: { onCancel?(): void; onOpen?(): void }): unknown;
/** 在 trigger 旁边打开一个浮层（.sn-pop），点外面、Esc 关；onClose 在关掉时调 */
export function openPopover(pop: HTMLElement, trigger: HTMLElement, options?: { align?: "start" | "center" | "end"; onClose?(): void }): void;
/** 把 root 里浮层的触发器（data-pop、data-dialog、data-drawer、data-menu……）都接上 */
export function bindOverlays(root?: ParentNode): void;
/** 把 root 里的折叠面板（.sn-acc）都接上 */
export function bindCollapses(root?: ParentNode): void;
/** 把 root 里的输入框（密码、邮箱、搜索、计数、长文本、提示词输入框）都接上 */
export function bindInputs(root?: ParentNode, options?: { composer?: Record<string, unknown> }): void;
/** 把 root 里的日期 / 时间选择器都接上 */
export function bindPickers(root?: ParentNode, options?: { today?: Date; now?: Date }): void;

// ———— 表格（真数据） ————
export interface TableColumn<R = any> {
  key: string; title: string;
  /** 数字列 "right"：右对齐 + 等宽数字 */
  align?: "left" | "right"; width?: number | string; sortable?: boolean;
  /** 显示的文字（会转义） */ format?(value: any, row: R): string | number;
  /** 显示的 HTML（标签、头像这类标记；自己保证安全） */ html?(value: any, row: R): string;
  /** 自定义排序（升序时 a 在 b 前面返回负数） */ sort?(a: R, b: R): number;
  num?: boolean; className?: string;
}
export interface TableOptions<R = any> {
  columns: TableColumn<R>[]; rows: R[];
  /** 行的唯一键：字段名或函数，默认 "id" */ rowKey?: string | ((row: R, index: number) => string | number);
  sort?: { key: string; dir: "asc" | "desc" } | null;
  /** 默认在表格里排；false：只发 onSort，由外面排好再 update({ rows }) */ sortLocal?: boolean;
  selectable?: boolean; selected?: (string | number)[];
  /** 没有数据时那一行的文字 */ empty?: string;
  loading?: boolean; skeleton?: number; label?: string;
  striped?: boolean; compact?: boolean; plain?: boolean; lines?: "row" | "grid"; maxHeight?: number | string;
  onSort?(sort: { key: string; dir: "asc" | "desc" }): void; onSelect?(keys: string[]): void; onRowClick?(row: R): void;
}
export const createTable: SatinFactory<TableOptions, { readonly selected: string[]; readonly sort: { key: string; dir: "asc" | "desc" } | null }>;
export function tableHTML(o: TableOptions): string;
export function sortRows<R>(rows: R[], columns: TableColumn<R>[], sort: { key: string; dir: "asc" | "desc" } | null): R[];

/** 照设计稿写好的标记，在 root 里一次接上交互（下拉、复制、芯片、清除、显示密码、自动长高、滑块、验证码、输入框、折叠面板、日期选择器、浮层触发器、横幅），并把 data-i 换成图标 */
/** 把 root 里写在标记上的交互一次接上；返回撤销函数（撤掉监听、观察器、包上去的滚动区域和"已接过"标记，同一段标记可以再接一次）。wire：同一个作用域里跑的自己的接线，撤销时一起撤 */
export function enhance(root?: ParentNode | null, wire?: (root: ParentNode) => void): () => void;
/** 表单类的标记一次接上（enhance 里已经包含） */
export function bindForms(root?: ParentNode): void;
export function bindBanners(root?: ParentNode): void;
/** 收起横幅（传 .sn-banner-wrap，高度平滑收起） */
export function closeBanner(wrap: HTMLElement): void;
/** 输入框随内容长高（传包着 textarea 的容器，data-max-lines 限最多几行） */
export function autoGrow(box: HTMLElement): void;
/** 长文本的用量环（传包着 textarea 和 .sn-ta-count 的容器，data-max 是上限） */
export function longCount(box: HTMLElement, o?: { showFrom?: number }): void;
