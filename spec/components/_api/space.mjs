// 圆角与线（基础规范）的契约（手写）：说明、令牌、该这样做 / 不要这样做、相关。格式见 spec/components/_api/README.md

export default {
  title: "圆角与线",
  lead: "圆角 6 档，从小控件到大面板逐级变大；线只有 1px，焦点环 2px；默认不画分割线，靠留白和明度差分组。",
  related: [{ id: "elevation", diff: "阴影与层级管浮层的投影；这里管圆角和描边。" }, { id: "spacing", diff: "分组先靠间距。" }],
  dts: {}, // 基础规范：没有组件和函数，只有令牌
  types: [],
  cssVars: [
    { name: "--sn-r-xs / --sn-r-sm / --sn-r-md", desc: "小标记 / 小控件 / 按钮、输入框", default: "4 / 6 / 8", token: true },
    { name: "--sn-r-lg / --sn-r-xl / --sn-r-full", desc: "卡片、菜单 / 对话框、大面板 / 胶囊、圆", default: "12 / 16 / 9999", token: true },
    { name: "--sn-line", desc: "1px 的线", default: "黑 8%", token: true },
    { name: "--sn-focus", desc: "2px 的焦点环", default: "黑 40%", token: true },
  ],
  design: { do: ["外面的圆角比里面的大：卡片 12、卡片里的按钮 8。", "要分组时先加留白，不够再用明度差，最后才画线。"], dont: [{ text: "到处画分割线、左侧竖条。", rule: "no-decorative-divider" }, { text: "卡片里再套带边框的卡片。", rule: "card-nesting" }] },
};
