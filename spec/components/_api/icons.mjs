// 图标（基础规范）的契约（手写）：说明、令牌、该这样做 / 不要这样做、相关。格式见 spec/components/_api/README.md

export default {
  title: "图标",
  lead: "统一的线性图标，线宽 1.5，颜色跟随文字：16 放在正文旁，20 用在工具栏，24 用在空状态。不用 emoji，不用彩色图标。",
  related: [{ id: "iconbutton", diff: "只有图标的按钮见图标按钮。" }, { id: "button", diff: "按钮里的图标放在字前或字后。" }],
  dts: {}, // 基础规范：没有组件和函数，只有令牌
  types: [],
  cssVars: [
    { name: "currentColor", desc: "图标颜色跟着所在文字（次要图标放在 --sn-label3 的文字里）", default: "正文色" },
    { name: "--sn-label3", desc: "次要图标、说明里的图标", default: "#6e6e73", token: true },
  ],
  design: {
    do: ["一个按钮最多一个图标；只有图标的按钮要写 aria-label 和文字提示。", "同一处的图标同一个尺寸：正文 16，工具栏 20，空状态 24。"],
    dont: [{ text: "用 emoji、星星火箭这类 AI 套路图标。", rule: "no-ai-icons" }, { text: "给图标上彩色、加底色圆圈。", rule: "status-color" }],
  },
};
