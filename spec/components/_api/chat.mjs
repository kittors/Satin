// 聊天与 AI 对话的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "聊天与 AI 对话",
  lead: "超多消息也流畅：只渲染视口上下各一屏多，往上翻快到顶时自动要更早的一页，插进来后视口不跳；已经载入的消息滚得再快都直接显示真内容，不换骨架。发送时输入框里的字原地变成气泡，飞进它在列表里的位置，原来的消息同时往上让位。AI 回复先思考（灰字流出，想完自动收起），再列步骤，再逐词流出正文、镜头卡片和生成的画面；生成中发送键变成\"停止\"。",
  whenToUse: ["AI 助手、客服、协作者之间的对话。", "要流式显示模型回答（思考、步骤、正文、生成的画面）的地方。"],
  whenNotToUse: [{ text: "只是渲染一段 AI 回答：用 Markdown 文档。", use: "md" }, { text: "单独一个提问框：用提示词输入框。", use: "prompt" }],
  related: [
    { id: "md", diff: "Markdown 只渲染一段文档；对话管整个会话（发送、流式、历史）。" },
    { id: "prompt", diff: "对话底部的输入框就是提示词输入框。" },
    { id: "image", diff: "消息里的图片、视频点开用看图。" },
  ],
  import: {
    html: 'import { createChat } from "satin-ui/chat";',
    react: 'import { Chat } from "satin-ui/react/chat";',
    vue: 'import { Chat } from "satin-ui/vue/chat";',
    svelte: 'import { createChat } from "satin-ui/chat";',
    angular: 'import { createChat } from "satin-ui/chat";',
    solid: 'import { createChat } from "satin-ui/chat";',
    preact: 'import { Chat } from "satin-ui/react/chat"; // 经 preact/compat',
  },
  importNote: {
    react: "`<Chat title respond history />`：respond 接模型（每次都用最新的，换了不用重挂）；status 变了更新顶栏；history、title、placeholder、max、maxLines、attach 只在创建时用（换一段对话就换 key）。ref 拿到 `send`、`receive`……",
    preact: "经 preact/compat 用 `satin-ui/react/chat` 的 `Chat`。",
    vue: "`<Chat title :respond :history />`；模板 ref 的 `.instance` 是实例；换一段对话就换 `:key`。",
    svelte: "没有专门的 Svelte 组件：`$effect` 里 `createChat(元素, 选项)`（从 satin-ui/chat 引），返回的函数里 `destroy()`。",
    angular: "没有专门的组件：`afterNextRender` 里 `createChat(元素, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。",
    solid: "没有专门的组件：`onSettled` 里 `createChat(元素, 选项)`，返回的函数里 `destroy()`。",
    html: "给空容器 `createChat(容器, { title, respond, history })`：顶栏、消息区、底部输入框自己画好；`update({ status })` 改顶栏状态。老写法 `mountChat` 照样能用。",
  },
  dts: { factory: "createChat", react: "Chat", vue: "Chat" },
  props: [
    { name: "respond", type: "(text: string, ctx: { readonly stopped: boolean }) => AsyncIterable<unknown> | Promise<string> | string", default: "—", required: false, desc: "接模型：异步生成器一段段 yield——字符串是正文；`{ think }` 思考；`{ step: { t, s, n } }` / `{ stepUpdate: { index, s, n } }` 步骤；`{ card: [编号, 副信息, 说明, 背景] }` 镜头卡片；`{ image: { g } }`、`{ imageProgress }`、`{ imageDone }` 生成的画面。也能直接返回 Promise<字符串>。用户点\"停止\"后 `ctx.stopped` 变成 true（每次读都是现在的值），要尽快结束。不给就只发不回。", names: { js: "respond", react: "respond", preact: "respond", vue: "respond" } },
    { name: "history", type: "ChatHistory", default: "—", required: false, desc: "历史：`initial()` 一开始的条目（从旧到新），往上翻到顶时 `older()` 要更早的一页（可以是 Promise），`hasMore()` 还有没有。只在创建时用。", names: { js: "history", react: "history", preact: "history", vue: "history" } },
    { name: "title", type: "string", default: "\"\"", required: false, desc: "顶栏的名字（空容器时用）。", names: { js: "title", react: "title", preact: "title", vue: "title" } },
    { name: "status", type: "string", default: "\"在线\"", required: false, desc: "顶栏的状态；变了就更新。", names: { js: "status", react: "status", preact: "status", vue: "status" } },
    { name: "placeholder", type: "string", default: "\"\"", required: false, desc: "底部输入框的占位提示。", names: { js: "placeholder", react: "placeholder", preact: "placeholder", vue: "placeholder" } },
    { name: "max", type: "number", default: "500", required: false, desc: "输入框最多几个字。", names: { js: "max", react: "max", preact: "max", vue: "max" } },
    { name: "maxLines", type: "number", default: "5", required: false, desc: "输入框最多长到几行，再多在框里滚。", names: { js: "maxLines", react: "maxLines", preact: "maxLines", vue: "maxLines（模板里写 max-lines）" } },
    { name: "attach", type: "boolean", default: "true", required: false, desc: "输入框带不带附件按钮。", names: { js: "attach", react: "attach", preact: "attach", vue: "attach" } },
    { name: "composer", type: "{ upload?(file: File, onProgress: (p: number) => void): Promise<unknown>; attachments?: unknown[] }", default: "—", required: false, desc: "底部输入框的选项：upload 真上传（不给是演示用的假进度）、attachments 预置附件。", names: { js: "composer", react: "composer", preact: "composer", vue: "composer" } },
    { name: "hiRes", type: "(bg: string) => string", default: "原样", required: false, desc: "点开看大图时用的高清背景（缩略图的 g 换成大图）。", names: { js: "hiRes", react: "hiRes", preact: "hiRes", vue: "hiRes（模板里写 hi-res）" } },
    { name: "className / style / id", type: "string / CSSProperties / string", default: "—", required: false, desc: "加在对话框容器上（默认高 680、最宽 840）。", names: { react: "className / style / id", preact: "class / style / id" } },
  ],
  events: [],
  slots: [],
  methods: [
    { name: "send", kind: "method", signature: "send(text: string): void", returns: "void", desc: "程序里发一条，和在输入框里发送一样（会触发 respond）。" },
    { name: "receive", kind: "method", signature: "receive(item: Partial<ChatItem>): unknown", returns: "ChatItem", desc: "收到一条对方的消息（比如别的协作者，从服务器推过来的）；不贴底时\"跳到最新\"上加未读数。" },
    { name: "sendText", kind: "method", signature: "sendText(text: string, o?: { fail?: boolean }): unknown", returns: "unknown", desc: "发一条（不走 respond）。注意：\"发送中 → 已送达\"现在是库里定时器做的，没有接真实发送结果；fail: true 显示发送失败、点感叹号重发。" },
    { name: "scrollToOldest", kind: "method", signature: "scrollToOldest(): void", returns: "void", desc: "平滑滚到最早一条。" },
  ],
  functions: [],
  cssVars: [
    { name: "--sn-raised", desc: "对话框底色", default: "白（深色主题 #1c1c1e）", token: true },
    { name: "--sn-r-xl", desc: "对话框圆角", default: "16px", token: true },
  ],
  classes: [
    { name: ".sn-chat / .sn-chat-hd / .sn-chat-body / .sn-chat-foot", desc: "对话框 / 顶栏 / 消息区 / 底部输入框" },
    { name: ".sn-msg.sn-me / .sn-msg.sn-ai", desc: "自己发的（靠右浅灰气泡）/ 对方、AI（靠左直接是正文）" },
  ],
  types: ["ChatOptions", "ChatHistory", "ChatItem", "ChatApi"],
  keyboard: [
    { keys: "⌘ / Ctrl + 回车", does: "发送；生成中点\"停止\"。" },
    { keys: "Enter / 空格（图片、视频气泡上）", does: "点开看图。" },
  ],
  a11y: {
    roles: ["图片、视频气泡是 `role=\"button\"`、写了\"查看图片 / 播放视频\"；发送失败的感叹号是按钮，读作\"发送失败，点一下重发\"。"],
    focus: ["发送以后焦点留在输入框。"],
    notes: ["减少动态效果时气泡不飞、直接出现，回答照样流式出来。", "回答里的文字、卡片、步骤都当纯文本写进去（模型给的 HTML 不会被执行）。"],
  },
  design: {
    do: ["respond 里经常检查 ctx.stopped，点\"停止\"马上停。", "长回答流式给，不要等全部生成完。"],
    dont: [{ text: "给助手配彩色渐变头像、光晕。", rule: "no-gradient" }, { text: "每条消息都加时间、头像、气泡尾巴。", rule: "real-content" }],
    copy: ["失败写\"没有发出去，点感叹号重发\"。"],
    motion: [{ what: "发送：字原地变成气泡飞进列表", easing: "spring", duration: "约 500ms" }, { what: "思考结束收起", easing: "ease.out", duration: "240ms" }],
  },
  examples: [
    { slug: "chat-basic", title: "最简单的用法：接一个模型", why: "respond 是异步生成器，一段段 yield 文字；点\"停止\"时 ctx.stopped 变成 true。", html: `<div id="chat-basic"></div>`, code: code("chat-basic") },
    { slug: "chat-history", title: "带历史消息", why: "history 给一开始的消息和\"更早的一页\"：往上翻到顶自动加载，视口不跳；图片、文件消息照样画。", html: `<div id="chat-history"></div>`, code: code("chat-history") },
    { slug: "chat-rich", title: "思考、步骤、卡片、生成的画面", why: "respond 除了文字还能 yield { think }、{ step }、{ card }、{ image }：照设计稿一段段出来。", html: `<div id="chat-rich"></div>`, code: code("chat-rich") },
  ],
};
