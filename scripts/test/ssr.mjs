// 服务端渲染：React（react-dom/server）和 Vue（@vue/server-renderer）在 Node 里把组件渲染成字符串，不能报错，
// 而且输出的标记和浏览器第一帧一样（createXxx.html）
import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire(path.resolve(import.meta.dirname, "../../packages/satin-ui/package.json"));
const React = require("react"), { renderToString } = require("react-dom/server");
const R = await import("../../packages/satin-ui/react/index.js");
const V = await import("../../packages/satin-ui/vue/index.js");
const { createSSRApp, h } = await import(require.resolve("vue"));
const { renderToString: vueToString } = await import(require.resolve("vue/server-renderer"));
let bad = 0;
const check = (name, html, must) => { const ok = must.every((m) => html.includes(m)); if (!ok) bad++; console.log(`${ok ? "✓" : "✗"} ${name}（${html.length} 字）${ok ? "" : "：缺 " + must.filter((m) => !html.includes(m)).join(", ")}`); };
const e = React.createElement;
check("React 页面", renderToString(e("div", null,
  e(R.Button, { variant: "primary" }, "保存修改"), e(R.Segmented, { items: ["网格", "列表"], defaultValue: "网格" }), e(R.Slider, { value: 40 }),
  e(R.Select, { items: ["16:9 · 横屏", "9:16 · 竖屏"], value: "16:9 · 横屏" }), e(R.Tabs, { tabs: [{ label: "概览", content: "项目概览" }], value: 0 }),
  e(R.Checkbox, { label: "自动保存", defaultChecked: true }), e(R.Switch, { label: "提醒" }), e(R.Field, { label: "标题" }, e(R.Input, { placeholder: "一句话说清这个镜头" })),
  e(R.Progress, { value: 0.62 }), e(R.Steps, { steps: ["导入", "拆分", "分镜"], current: 1 }), e(R.Dialog, { open: false, title: "新建项目" }, "内容"),
  e(R.Collapse, { items: [{ title: "导出的成片放在哪里？", content: "下载文件夹" }] }), e(R.Table, { columns: [{ key: "name", title: "项目", sortable: true }], rows: [{ id: 1, name: "雨夜车站" }], selectable: true }),
)), ['class="sn-acc"', 'class="sn-tbl-wrap"', '雨夜车站', 'class="sn-btn sn-primary"', 'class="sn-seg"', 'class="sn-slider"', 'class="sn-select"', 'class="sn-tabs"', 'class="sn-check"', 'class="sn-switch"', 'class="sn-field"', 'class="sn-pbar"', 'class="sn-steps"', 'class="sn-dlg"']);
const app = createSSRApp({ render: () => h("div", [h(V.Button, { variant: "primary" }, () => "保存修改"), h(V.Segmented, { items: ["网格", "列表"], modelValue: "网格" }), h(V.Slider, { modelValue: 40 }), h(V.Checkbox, { modelValue: true, label: "自动保存" }), h(V.Steps, { steps: ["导入", "拆分"], current: 1 }), h(V.Dialog, { open: false, title: "新建项目" }, () => "内容")]) });
check("Vue 页面", await vueToString(app), ['class="sn-btn sn-primary"', 'class="sn-seg"', 'class="sn-slider"', 'class="sn-check"', 'class="sn-steps"', 'class="sn-dlg"']);
console.log(bad ? `服务端渲染：${bad} 项有问题` : "服务端渲染：React、Vue 都通过");
process.exitCode = bad ? 1 : 0;
