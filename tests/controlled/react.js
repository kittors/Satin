// 受控 / 非受控的运行时测试（React，StrictMode）：父组件重新渲染时，非受控的组件不被打回初始值；
// 受控的标签输入、折叠面板跟着父组件的值变；只读（给 value 不给 onChange）的点了会退回去。scripts/test/controlled.mjs 打包后在浏览器里跑
import { createElement as h, StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Segmented, Stepper, TagInput, Collapse, CountInput, Composer } from "../../packages/satin-ui/react/index.js";

const log = (window.__log = []);
const FAQ = [{ title: "第一项", content: "一" }, { title: "第二项", content: "二" }, { title: "第三项", content: "三" }];

function Kit() {
  const [n, setN] = useState(0), [tags, setTags] = useState(["雨夜", "车站"]), [open, setOpen] = useState([0]), [role, setRole] = useState("林夏");
  return h("div", { id: "kit", style: { display: "grid", gap: 16, padding: 16, width: 480 } },
    h("button", { id: "rerender", onClick: () => setN(n + 1) }, `重新渲染 ${n}`),
    // 每次渲染都是新的 items 数组：换了引用、值没变，不能动选中
    h("div", { id: "seg" }, h(Segmented, { items: ["网格", "列表"], defaultValue: "网格", label: "视图" })),
    h("div", { id: "seg-ro" }, h(Segmented, { items: ["网格", "列表"], value: "网格", label: "只读视图" })),
    h("div", { id: "step" }, h(Stepper, { defaultValue: 4, min: 1, max: 60, label: "时长" })),
    h("div", { id: "tags" }, h(TagInput, { tags, max: 5, onChange: (t) => { setTags(t); log.push("tags:" + t.join("|")); } })),
    h("button", { id: "tags-clear", onClick: () => setTags([]) }, "清空标签"),
    h("button", { id: "tags-set", onClick: () => setTags(["悬疑", "长镜头"]) }, "换一组标签"),
    h("div", { id: "acc" }, h(Collapse, { items: FAQ, open, onChange: (o) => { setOpen(o); log.push("open:" + o.join(",")); } })),
    h("button", { id: "acc-third", onClick: () => setOpen([...open, 2]) }, "展开第三项"),
    h("div", { id: "count" }, h(CountInput, { max: 8, value: role, onChange: (v) => { setRole(v); log.push("role:" + v); }, id: "role-name" })),
    h("button", { id: "count-set", onClick: () => setRole("林夏和周屿") }, "换角色名"),
    // onSend 返回 Promise：发送后进入"生成中"，Promise 结束回到可发送
    h("div", { id: "cm" }, h(Composer, { placeholder: "描述画面", onSend: ({ text }) => { log.push("send:" + text); return new Promise((r) => setTimeout(r, 600)); } })),
    h("output", { id: "state" }, JSON.stringify({ tags, open, role })));
}
createRoot(document.getElementById("app")).render(h(StrictMode, null, h(Kit)));
window.__ready = true;
