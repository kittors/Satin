// 阴影与层级（基础规范）的契约（手写）：说明、令牌、该这样做 / 不要这样做、相关。格式见 spec/components/_api/README.md

export default {
  title: "阴影与层级",
  lead: "三层：卡片（只靠描边和明度差）、浮层（菜单、弹出面板、通知）、对话框。卡片悬停时不上浮、不加阴影，只叠一层悬停填充；文字提示和轻提示用反色底，一眼能和页面内容分开。",
  related: [
    { id: "space", diff: "圆角与线管描边、圆角。" },
    { id: "popover", diff: "弹出面板是浮层那一层的典型。" },
    { id: "dialog", diff: "对话框是最上面那一层。" },
  ],
  dts: {}, // 基础规范：没有组件和函数，只有令牌
  types: [],
  cssVars: [
    { name: "--sn-e1", desc: "浮层：菜单、弹出面板、通知", default: "0 8px 24px 黑 10% + 1px 描边", token: true },
    { name: "--sn-e2", desc: "对话框", default: "0 24px 64px 黑 16% + 1px 描边", token: true },
    { name: "--sn-menu-shadow", desc: "菜单（再加一道内侧高光）", default: "同 e1 一档", token: true },
    { name: "--sn-tip-bg / --sn-tip-fg", desc: "文字提示、轻提示的反色底和字", default: "#1d1d1f / 白", token: true },
    { name: "--sn-scrim", desc: "对话框、抽屉后面的遮罩", default: "黑 30%", token: true },
  ],
  design: {
    do: ["卡片只用描边和明度差；能单独操作的对象才用卡片。", "浮在内容上面的东西（菜单、浮层）才用阴影、毛玻璃。"],
    dont: [
      { text: "彩色投影、发光。", rule: "no-colored-shadow" },
      { text: "页面里的卡片、侧栏用毛玻璃。", rule: "glass-only-floating" },
      { text: "卡片悬停时上浮、加大阴影。", rule: "motion-props" },
    ],
  },
};
