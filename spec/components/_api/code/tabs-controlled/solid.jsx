import { createSignal } from "solid-js";

const LIST = [
  { label: "概览", content: "项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。" },
  { label: "镜头", badge: 48, content: "镜头列表：按集分组，可以拖动排序。" },
  { label: "配音", content: "配音：林夏、周屿两个角色，6 段。" },
];
// 自定义元素的属性只认字符串：数组写成 JSON
const TABS = JSON.stringify(LIST);
// 名字带横线的事件用 ref 挂（Solid 的 onXxx 只认驼峰的事件名）
const on = (type, fn) => (el) => el.addEventListener(type, fn);

export default function ProjectTabsControlled() {
  const [tab, setTab] = createSignal(1);
  return (
    <div class="sn-stack sn-gap-8">
      <sn-tabs tabs={TABS} value={tab()} ref={on("sn-change", (e) => setTab(e.detail))}></sn-tabs>
      <div class="sn-row">
        <span class="sn-help">现在看的是：{LIST[tab()].label}</span>
        <button type="button" class="sn-btn sn-secondary sn-sm" onClick={() => setTab(2)}>去配音</button>
      </div>
    </div>
  );
}
