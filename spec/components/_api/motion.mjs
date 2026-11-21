// 动效曲线（基础规范）的契约（手写）：说明、令牌、该这样做 / 不要这样做、相关。格式见 spec/components/_api/README.md

export default {
  title: "动效曲线",
  lead: "全系统只有这几条曲线：先看动效类型再选——进入先快后慢，离开先慢后快，换位两端慢中间快，按下回弹用弹簧。只动 transform、opacity、filter。",
  related: [{ id: "segmented", diff: "分段控件的滑块是\"换位\"的例子。" }, { id: "dialog", diff: "对话框的开合是\"进入 / 离开\"的例子。" }],
  dts: {}, // 基础规范：没有组件和函数，只有令牌
  types: [],
  cssVars: [
    { name: "--sn-ease-out", desc: "进入：先快后慢", default: "cubic-bezier(0, 0, .58, 1)", token: true },
    { name: "--sn-ease-out-strong", desc: "进入、落定（更干脆）", default: "cubic-bezier(.22, 1, .36, 1)", token: true },
    { name: "--sn-ease-in", desc: "离开：先慢后快", default: "cubic-bezier(.42, 0, 1, 1)", token: true },
    { name: "--sn-ease-in-out", desc: "换位、展开收起：两端慢中间快", default: "cubic-bezier(.42, 0, .58, 1)", token: true },
    { name: "--sn-ease-spring / --sn-ease-overshoot", desc: "回弹、轻微过冲（补位、抖一下）", default: "linear(…) / cubic-bezier(.34, 1.56, .64, 1)", token: true },
    { name: "--sn-ease-open", desc: "抽屉、面板拉开", default: "cubic-bezier(.32, .72, 0, 1)", token: true },
    { name: "--sn-press", desc: "按下时缩小到", default: ".97", token: true },
  ],
  design: {
    do: ["进入 150～300ms，离开比进入短一点。", "减少动态效果打开时只留透明度变化，或者直接换。"],
    dont: [
      { text: "动 width、height、top、left 这些会重新排版的属性。", rule: "motion-props" },
      { text: "自己写 cubic-bezier、随手定时长。", rule: "easing-token" },
    ],
  },
};
