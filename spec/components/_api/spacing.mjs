// 间距（基础规范）的契约（手写）：说明、令牌、该这样做 / 不要这样做、相关。格式见 spec/components/_api/README.md

export default {
  title: "间距",
  lead: "16 以下每 2px 一档，只在控件内部用；再往上逐级放大，用在组件之间、区块之间。越相关越近：组和组之间至少是组内的两倍。页面和组件只写语义令牌，换密度时它们一起换档。",
  related: [{ id: "layout", diff: "间距管元素之间多远；布局管整页怎么排、怎么随宽度变。" }, { id: "space", diff: "圆角与线管边框和圆角。" }],
  dts: {}, // 基础规范：没有组件和函数，只有令牌
  types: [],
  cssVars: [
    { name: "--sn-sp-2 … --sn-sp-80", desc: "刻度：2、4、6、8、10、12、14、16、20、24、28、32、40、48、64、80", default: "同名像素", token: true },
    { name: "--sn-gap-tight / --sn-gap-inline / --sn-gap-stack", desc: "紧挨着 / 同一行并排 / 上下堆叠", default: "4 / 8 / 12", token: true },
    { name: "--sn-gap-group / --sn-gap-section", desc: "组和组 / 区块和区块", default: "16 / 32", token: true },
    { name: "--sn-pad-card / --sn-pad-panel / --sn-pad-page", desc: "卡片 / 面板 / 页面的内边距", default: "16 / 24 / 32", token: true },
  ],
  design: {
    do: ["组件之间写语义令牌（--sn-gap-*、--sn-pad-*），不写数字。", "组和组之间至少是组内的两倍（8 和 16、12 和 24）。", "标题离下面的内容比离上面的近。"],
    dont: [
      { text: "写刻度外的值（13px、18px）又不写原因（/* sp-ok: … */）。", rule: "spacing-scale" },
      { text: "到处画分隔线代替留白。", rule: "no-decorative-divider" },
    ],
  },
};
