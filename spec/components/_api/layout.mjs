// 布局与响应式（基础规范）的契约（手写）：说明、令牌、该这样做 / 不要这样做、相关。格式见 spec/components/_api/README.md

export default {
  title: "布局与响应式",
  lead: "断点按容器宽度划分，不按窗口宽度：compact 小于 720、regular 720～1199、wide 1200 及以上。页面级布局跟着主区宽度变，组件用容器查询跟着自己所在的容器变：同一个组件放在侧栏里、主区里各自合适。",
  related: [{ id: "sidebar", diff: "侧栏与布局是现成的应用外框，按这里的断点收起、展开。" }, { id: "spacing", diff: "区块之间、页面内边距的数值见间距。" }],
  dts: {}, // 基础规范：没有组件和函数，只有令牌
  types: [],
  cssVars: [
    { name: "container: sn-page", desc: "主区的容器名：页面级布局用 @container sn-page (…) 判断宽度", default: "主区" },
    { name: "--sn-pad-page", desc: "页面内边距", default: "32px（compact 16px）", token: true },
    { name: "--sn-gap-section", desc: "区块之间", default: "32px", token: true },
  ],
  design: {
    do: ["阅读型页面最大宽 960 居中；表单最大宽 640，720 起标签在左、更窄时在上。", "卡片网格不写死列数：最小卡宽加 auto-fill。", "检查器 320 宽，1280 起和主区并排，更窄时变成盖在上面的抽屉。"],
    dont: [
      { text: "按钮文字挤得换行、页面横向滚动。", rule: "button-wrap" },
      { text: "窄屏时浮层、工具条盖住内容。", rule: "no-overlap" },
      { text: "跨断点时加过渡动画。", rule: "motion-props" },
    ],
  },
};
