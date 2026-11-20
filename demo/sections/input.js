// 展示页接线：从 kit-input.js 拆出来的 initInputs 和演示数据。
// UI 库设计稿：输入框加强。字数统计、长文本、密码强度、大写锁定、邮箱校验、搜索、标签输入、数字步进、提示词输入框。
// 原则：动效只用 transform / opacity；数字变化用滚动；等待遵守 300 / 500ms；中文输入法正在拼字时不响应回车和逗号。
// 用法：每种输入框一个 mountXxx(元素, 选项)；bindInputs(root) 按标记一次接上（data-count / data-ta / data-pw / data-email / data-tagin / data-stepper / data-composer）。
import { mountSearch, mountLongText, mountTagInput, mountComposer, bindInputs } from "../../packages/satin-ui/src/input.js";
import { SCENES } from "../data.js";
import { toast } from "../../packages/satin-ui/src/feedback.js";
import { $, $$ } from "../dom.js";
// ———— 展示页：演示数据和反馈 ————
// 附件菜单里的演示文件（参考图、空镜素材、旁白试音、文档、会失败的、超大的）：c.n 是输入框自己的文件计数
const ATT_DOCS = [["第三集分镜脚本（终版）.docx", "DOCX"], ["雨夜车站 · 人物小传.pdf", "PDF"], ["镜头时长统计表.xlsx", "XLSX"], ["配乐参考.zip", "ZIP"]];
const DEMO_ATTACHMENTS = {
  img: (c) => ({ kind: "img", name: `参考图 ${++c.n}.jpg`, size: 1.2e6 + Math.random() * 2e6, g: SCENES[c.n % SCENES.length] }),
  vid: (c) => ({ kind: "vid", name: `空镜素材 ${++c.n}.mp4`, size: 1.8e7 + Math.random() * 3e7, g: SCENES[(c.n + 3) % SCENES.length], dur: `0:${String(6 + ((c.n * 7) % 40)).padStart(2, "0")}` }),
  aud: (c) => ({ kind: "aud", name: `旁白试音 ${++c.n}.mp3`, size: 8e5 + Math.random() * 2e6, dur: `0:${String(20 + ((c.n * 11) % 39)).padStart(2, "0")}`, seed: c.n }),
  doc: (c) => { const d = ATT_DOCS[c.n++ % ATT_DOCS.length]; return { kind: "doc", name: d[0], ext: d[1], size: 2e5 + Math.random() * 4e6 }; },
  fail: (c) => ({ ...DEMO_ATTACHMENTS.doc(c), failAt: .55 }),
  big: (c) => ({ kind: "vid", name: "整集原片（未压缩）.mov", size: 2.6e9, g: SCENES[2], dur: "24:10", bad: "超过 2 GB" }),
};

export function initInputs() {
  const DATA = ["车站外，雨刚停", "林夏走进候车厅", "站台上的最后一班车", "车窗里的倒影", "雨夜里的公交站", "林夏", "周屿", "陈默", "雨中的站台"];
  // 搜索：假装去服务器搜（120~1000ms），演示等待规则
  for (const ib of $$("[data-search]")) mountSearch(ib, { search: (q) => new Promise((r) => setTimeout(() => r(DATA.filter((s) => s.includes(q)).length), 120 + Math.random() * 900)) });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.metaKey || e.ctrlKey || e.target.closest?.("input, textarea, [contenteditable], dialog")) return;
    const s = $("[data-search] input"); if (s) { e.preventDefault(); s.focus(); }
  });
  for (const box of $$("[data-ta]")) mountLongText(box, { onSubmit: () => toast({ text: "画面描述已保存" }) });
  for (const box of $$("[data-tagin]")) mountTagInput(box, { initial: ["雨夜", "车站", "悬疑"] });
  // 提示词输入框（对话里那个写了 data-external，交给对话组件）：发送以后假装生成 2.6 秒
  for (const box of $$("[data-composer]:not([data-external])")) mountComposer(box, { attachments: DEMO_ATTACHMENTS, onSend: () => new Promise((r) => setTimeout(r, 2600)).then(() => toast({ text: "已生成 3 个镜头" })), onStop: () => toast({ icon: "info", tone: "info", text: "已停止生成" }) });
  bindInputs(document, { composer: { attachments: DEMO_ATTACHMENTS } });
}
