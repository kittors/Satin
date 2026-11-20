// 各框架示例渲染的"同一批组件"：每个示例按这份清单、这个顺序、这些参数渲染，截图和纯 HTML 版逐像素比。
// 状态都是固定的（不需要交互就能截到同一画面）
export const SINK = {
  title: "镜头设置",
  buttons: [["primary", "保存修改"], ["secondary", "导入原文"], ["tertiary", "跳过"], ["ghost", "取消"], ["danger", "删除项目"]],
  iconButton: { icon: "settings", tip: "设置" },
  field: { label: "镜头标题", placeholder: "一句话说清这个镜头", help: "写清楚人物、动作和光线，生成会更准。" },
  check: { label: "自动保存草稿", checked: true },
  switch: { label: "生成完成后提醒我", checked: true },
  segmented: { items: ["网格", "列表", "时间线"], value: "网格" },
  slider: { value: 52, max: 100, label: "画面强度" },
  select: { items: ["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"], value: "16:9 · 横屏", label: "画面比例" },
  tabs: { tabs: [{ label: "概览", content: "项目概览：48 个镜头，12 分 36 秒。" }, { label: "镜头", content: "镜头列表" }, { label: "配音", content: "配音" }], value: 0 },
  progress: 0.62,
  steps: { steps: ["导入原文", "拆分章节", "生成分镜", "导出成片"], current: 1 },
  collapse: { items: [{ title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里，以项目名建一个子文件夹。" }, { title: "能多人一起编辑吗？", content: "可以，在设置里邀请协作者。" }], open: [0] },
  stepper: { value: 4, min: 1, max: 60, unit: "秒", label: "镜头时长" },
  chips: ["雨夜", "车站", "第三集"],
};
