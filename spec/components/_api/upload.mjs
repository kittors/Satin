// 上传的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "上传",
  lead: "拖进来时整块高亮，图标往上抬一点；松手后文件进列表，各自显示进度，可以单独取消或重试。支持的格式和大小写在框里，不等用户拖错了才说；格式不对、太大的当场标红。",
  whenToUse: ["导入原文、上传素材、换封面。", "一次传好几个文件，要看到各自的进度。"],
  whenNotToUse: [
    { text: "给生成加参考图：提示词输入框里的 + 和拖放就够了。", use: "prompt" },
  ],
  related: [
    { id: "prompt", diff: "提示词输入框的附件在缩略图上显示进度；上传组件是一整块拖放区加文件列表。" },
    { id: "progress", diff: "每个文件的进度就是进度条。" },
  ],
  import: {
    html: 'import { createUpload } from "satin-ui"; // 照设计稿写拖放区标记',
    react: 'import { Upload } from "satin-ui/react";',
    vue: 'import { Upload } from "satin-ui/vue";',
    svelte: 'import { createUpload } from "satin-ui";',
    angular: 'import { createUpload } from "satin-ui";',
    solid: 'import { createUpload } from "satin-ui";',
    preact: 'import { Upload } from "satin-ui/react"; // 经 preact/compat',
  },
  importNote: {
    react: "`<Upload accept maxSize upload>`：`accept` 写 \".txt,.docx\"（或正则），`maxSize` 字节；`upload(file, progress)` 真上传、返回 Promise；ref 拿到 `add(files)`。",
    preact: "经 preact/compat 用 `satin-ui/react` 的 `Upload`。",
    vue: "`<Upload accept :max-size :upload>`。",
    svelte: "没有专门的 Svelte 组件：`$effect` 里 `createUpload(元素, 选项)`，返回的函数里 `destroy()`。",
    angular: "没有专门的组件：`afterNextRender` 里 `createUpload(元素, 选项)`，`DestroyRef.onDestroy` 里 `destroy()`。",
    solid: "没有专门的组件：`onSettled` 里 `createUpload(元素, 选项)`，返回的函数里 `destroy()`。",
    html: "照设计稿写 `.sn-drop`（图标、`<b>` 说明、`.sn-hint`、`<input type=\"file\" hidden>`）和后面的 `.sn-files`，`createUpload(拖放区, { accept, maxSize, upload })` 接上（`accept` 是正则）。",
  },
  dts: { react: "Upload", vue: "Upload" },
  props: [
    { name: "accept", type: "string | RegExp", default: "什么都收", required: false, desc: "允许的格式：\".txt,.docx\" 或正则；不对的当场标红、不上传。", names: { react: "accept", preact: "accept", vue: "accept", html: "input 的 accept + createUpload 的 accept（正则）" } },
    { name: "maxSize", type: "number", default: "不限", required: false, desc: "单个文件最大多少字节。", names: { react: "maxSize", preact: "maxSize", vue: "maxSize（模板里写 max-size）", html: "createUpload 的 maxSize" } },
    { name: "upload", type: "(file: File, progress: (p: number) => void) => Promise<unknown>", default: "演示用的假进度", required: false, desc: "真上传：`progress(0～1)` 更新这一行的进度，返回 Promise（reject 时这一行变成\"重试\"）。", names: { react: "upload", preact: "upload", vue: "upload", html: "createUpload 的 upload" } },
    { name: "title / pick", type: "string", default: "\"把文件拖到这里，或者\" / \"选择文件\"", required: false, desc: "框里的说明和能点的那几个字。", names: { react: "title / pick", preact: "title / pick", vue: "title / pick", html: ".sn-drop b / u" } },
    { name: "hint", type: "string", default: "—", required: false, desc: "支持的格式和大小：\"支持 txt、docx，单个不超过 5 MB\"。", names: { react: "hint", preact: "hint", vue: "hint", html: ".sn-hint" } },
    { name: "label", type: "string", default: "title + pick", required: false, desc: "读屏读出来的名字。", names: { react: "label", preact: "label", vue: "label", html: ".sn-drop 的 aria-label" } },
    { name: "multiple", type: "boolean", default: "true", required: false, desc: "一次能选几个。", names: { react: "multiple", preact: "multiple", vue: "multiple", html: "input 的 multiple" } },
    { name: "badType / tooBig", type: "string", default: "\"格式不支持\" / \"文件太大\"", required: false, desc: "格式不对、太大时那一行的提示。", names: { react: "badType / tooBig", preact: "badType / tooBig", vue: "badType / tooBig" } },
  ],
  events: [],
  slots: [],
  methods: [],
  functions: [],
  cssVars: [
    { name: "--sn-line-control", desc: "拖放区的虚线框", default: "黑 14%", token: true },
    { name: "--sn-fill-hover", desc: "拖进来时整块高亮", default: "黑 4%", token: true },
    { name: "--sn-danger", desc: "格式不对、太大的那一行", default: "红", token: true },
  ],
  classes: [
    { name: ".sn-drop / .sn-drop.sn-over", desc: "拖放区 / 拖进来时" },
    { name: ".sn-files > .sn-file", desc: "文件列表 / 一个文件（进度、取消、重试）" },
  ],
  types: ["UploadProps"],
  keyboard: [{ keys: "Enter / 空格（拖放区上）", does: "打开选择文件。" }],
  a11y: {
    roles: ["拖放区 `role=\"button\"`、`tabindex=\"0\"`、写 `aria-label`；里面是原生 `<input type=\"file\">`。"],
    focus: ["键盘聚焦时整块一圈焦点环。"],
    notes: ["格式、大小写在框里，不只靠出错以后的红字。"],
  },
  design: {
    do: ["支持的格式和大小写在框里。", "每个文件各自显示进度，能单独取消、重试。"],
    dont: [
      { text: "拖进来时整块变成彩色。", rule: "status-color" },
      { text: "等传完才告诉用户格式不对。", rule: "real-content" },
    ],
    copy: ["\"把文件拖到这里，或者 选择文件\"；失败写原因：\"文件太大（超过 5 MB）\"。"],
    motion: [{ what: "拖进来：整块高亮、图标往上抬一点", easing: "ease.outStrong", duration: "200ms" }, { what: "文件进列表：从上面淡入", easing: "ease.out", duration: "240ms" }],
  },
  examples: [
    { slug: "upload-basic", title: "最简单的用法", why: "写清楚支持的格式和大小；不对的当场标红。", html: `<div class="sn-drop" tabindex="0" role="button" aria-label="把文件拖到这里，或者选择文件"><span class="sn-art" data-i="cloud-upload"></span><b>把文件拖到这里，或者 <u>选择文件</u></b><span class="sn-hint">支持 txt、docx，单个不超过 5 MB</span><input type="file" multiple accept=".txt,.docx" hidden></div><div class="sn-files"></div>`, code: code("upload-basic") },
    { slug: "upload-real", title: "真上传", why: "upload(file, progress)：每个文件各自显示进度，可以单独取消或重试。", html: `<div class="sn-drop" tabindex="0" role="button" aria-label="把文件拖到这里，或者选择文件"><span class="sn-art" data-i="cloud-upload"></span><b>把文件拖到这里，或者 <u>选择文件</u></b><span class="sn-hint">支持 txt、docx，单个不超过 5 MB</span><input type="file" multiple accept=".txt,.docx" hidden></div><div class="sn-files"></div>`, code: code("upload-real") },
    { slug: "upload-single", title: "一次一个", why: "multiple 关掉；title、pick 换掉框里的字。", html: `<div class="sn-drop" tabindex="0" role="button" aria-label="把封面拖到这里，或者选择图片"><span class="sn-art" data-i="cloud-upload"></span><b>把封面拖到这里，或者 <u>选择图片</u></b><span class="sn-hint">一次一张，JPG 或 PNG</span><input type="file" accept=".jpg,.png" hidden></div><div class="sn-files"></div>`, code: code("upload-single") },
  ],
};
