// 排版（基础规范）的契约（手写）：说明、令牌、该这样做 / 不要这样做、相关。格式见 spec/components/_api/README.md

export default {
  title: "排版",
  lead: "Text 组件 = 层级 × 色调：页面不直接写字号、字重，只选层级和色调。一页最多四级字号，字重只用 400、500、600；数字一律等宽，变化时不左右跳。",
  related: [{ id: "color", diff: "文字的四级色调来自颜色令牌。" }, { id: "spacing", diff: "标题和内容之间的距离见间距。" }],
  dts: {}, // 基础规范：没有组件和函数，只有令牌
  types: [],
  cssVars: [
    { name: "--sn-sans", desc: "正文字体（系统字体：苹方、SF）", default: "-apple-system, \"PingFang SC\"…", token: true },
    { name: "--sn-mono", desc: "代码、等宽数字", default: "\"SF Mono\", ui-monospace…", token: true },
    { name: "--sn-serif", desc: "长文阅读（可选）", default: "\"Songti SC\"…", token: true },
    { name: "--sn-font-scale", desc: "整体字号倍数（设置里的\"字号\"）", default: "1", token: true },
  ],
  design: {
    do: ["标题、正文、说明各选一级，色调用 label 四级灰。", "计数、价格、时间、表格里的数字用等宽数字。", "文字被截断时悬停显示全文；没被截断就不显示提示。"],
    dont: [
      { text: "随手写 font-size、font-weight: 700。", rule: "font-weight" },
      { text: "标题上方加英文小眉题。", rule: "no-eyebrow" },
      { text: "写\"极致\"\"赋能\"这类营销词。", rule: "marketing-copy" },
    ],
  },
};
