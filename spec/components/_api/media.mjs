// 视频与音频的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "视频与音频",
  lead: "控制条叠在画面上，用玻璃材质；播放时指针停 2 秒不动，控制条和指针一起淡出，一动就回来（指针停在控制条上、拖动时不淡出）。进度每帧连续往前走；点进度条跳过去有 150ms 的过渡，拖动时跟手。悬停喇叭展开音量条；全屏、画中画都是真的。音频：波形从音频本身算出来，点波形跳过去。",
  whenToUse: ["成片、样片的预览。", "旁白、配乐的试听。"],
  whenNotToUse: [{ text: "一组图片、视频翻着看：用看图。", use: "image" }],
  related: [
    { id: "image", diff: "看图层也能播视频，适合一组里翻着看；单独放一个播放器用这个。" },
    { id: "chat", diff: "对话里的语音、视频消息也是这套播放器。" },
  ],
  import: {
    html: 'import { createPlayer, createAudio } from "satin-ui"; // 给一个空容器',
    react: 'import { Player, AudioPlayer } from "satin-ui/react";',
    vue: 'import { Player, AudioPlayer } from "satin-ui/vue";',
    svelte: 'import { createPlayer, createAudio } from "satin-ui";',
    angular: 'import { createPlayer, createAudio } from "satin-ui";',
    solid: 'import { createPlayer, createAudio } from "satin-ui";',
    preact: 'import { Player, AudioPlayer } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`<Player src poster label onError>`；音频 `<AudioPlayer src title sub wave>`。`src` 变了换一个新的播放器；ref 拿到 `play()`、`pause()`、`toggle()`、`video`（音频是 `toggle()`、`audio`）。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Player`、`AudioPlayer`。",
    vue: "`<Player :src :poster label @error>`、`<AudioPlayer :src title sub>`；模板 ref 的 `.instance` 是实例。",
    svelte: "没有专门的 Svelte 组件：`$effect` 里 `createPlayer(元素, 选项)`，返回的函数里 `destroy()`。",
    angular: "没有专门的组件：`afterNextRender` 里 `createPlayer(元素, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。",
    solid: "没有专门的组件：`onSettled` 里 `createPlayer(元素, 选项)`，返回的函数里 `destroy()`。",
    html: "给空容器 `createPlayer(容器, { src, poster, label })`、`createAudio(容器, { src, title, sub, wave })`；照设计稿写好的 `.sn-player` 标记也能直接接上。",
  },
  dts: { factory: "createPlayer", react: "Player", vue: "Player" },
  props: [
    { name: "src", type: "string", default: "—", required: false, desc: "视频地址。", names: { js: "src", react: "src", preact: "src", vue: "src" } },
    { name: "poster", type: "string", default: "—", required: false, desc: "封面（还没播的时候显示）。", names: { js: "poster", react: "poster", preact: "poster", vue: "poster" } },
    { name: "label", type: "string", default: "\"视频\"", required: false, desc: "读屏读出来的名字：\"雨夜样片\"。", names: { js: "label", react: "label", preact: "label", vue: "label" } },
  ],
  events: [{ name: "error", payload: "MediaError | null", when: "地址打不开、格式不支持。播放器画面上不显示错误，要在这里告诉用户（设计稿用轻提示：\"视频没能加载，检查网络后再试\"）。", names: { js: "onError", react: "onError", preact: "onError", vue: "@error" } }],
  slots: [],
  methods: [
    { name: "play", kind: "method", signature: "play(): Promise<void>", returns: "Promise<void>", desc: "播放（浏览器不让自动播放时 reject）。" },
    { name: "pause", kind: "method", signature: "pause(): void", returns: "void", desc: "暂停。" },
    { name: "toggle", kind: "method", signature: "toggle(): Promise<void> | void", returns: "Promise<void> | void", desc: "播放 / 暂停。" },
    { name: "video", kind: "property", signature: "readonly video: HTMLVideoElement", returns: "HTMLVideoElement", desc: "里面的 <video>（跳到某一秒 `video.currentTime = 0` 这类原生能力）。" },
  ],
  functions: [],
  cssVars: [{ name: "--sn-r-lg", desc: "播放器的圆角", default: "12px", token: true }, { name: "--sn-focus", desc: "键盘聚焦时的描边", default: "黑 40%（深色主题白 50%）", token: true }],
  classes: [
    { name: ".sn-player / .sn-player.sn-idle", desc: "视频播放器 / 指针不动、控制条淡出" },
    { name: ".sn-audio-row / .sn-wave", desc: "音频条 / 波形" },
  ],
  types: ["PlayerOptions"],
  keyboard: [
    { keys: "空格 / K", does: "播放、暂停。" },
    { keys: "← / →", does: "后退 / 前进 5 秒。" },
    { keys: "↑ / ↓", does: "调音量。" },
    { keys: "M / F / P", does: "静音 / 全屏 / 画中画。" },
  ],
  a11y: {
    roles: ["播放器能聚焦（`tabindex=\"0\"`、`aria-label` 是 label），快捷键在它聚焦时生效；控制条的按钮都写了 `aria-label`；进度条、音量条是 `role=\"slider\"`。"],
    focus: ["键盘调音量、快进快退时画面中间出一个小提示（`aria-live`）。"],
    notes: ["减少动态效果时点进度条直接跳过去（不缓动）。"],
  },
  design: {
    do: ["给封面：没播的时候不黑屏。", "试听音频写清楚是什么、多长：\"旁白试音 · 0:32\"。"],
    dont: [{ text: "在未经用户交互时自动播放带声音的视频。" }, { text: "控制条用彩色。", rule: "status-color" }],
    copy: ["打不开时写原因和下一步：\"视频没能加载，检查网络后再试\"。"],
    motion: [{ what: "播放控制条静止自动隐去与重新显现", easing: "ease.out", duration: "300ms" }, { what: "点击进度条时平滑跳转至目标时间点", easing: "easeOutCubic", duration: "150ms" }],
  },
  examples: [
    { slug: "media-basic", title: "最简单的用法：视频", why: "给地址和封面：控制条叠在画面上，指针不动 2 秒后淡出。", html: `<div id="media-basic"></div>`, code: code("media-basic") },
    { slug: "media-audio", title: "音频", why: "波形从音频本身算出来，点波形跳过去。", html: `<div id="media-audio"></div>`, code: code("media-audio") },
    { slug: "media-methods", title: "用方法控制：自己的按钮", why: "实例上有 play()、pause()、toggle()，video 是里面的 <video>。", html: `<div id="media-methods"><div></div><div class="sn-row" style="margin-top:12px"><button type="button" class="sn-btn sn-secondary sn-sm" data-act="restart">从头播放</button><button type="button" class="sn-btn sn-secondary sn-sm" data-act="pause">暂停</button></div></div>`, code: code("media-methods") },
  ],
};
