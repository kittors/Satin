import { createSignal } from "solid-js";

// 名字带横线的事件用 ref 挂（Solid 的 onXxx 只认驼峰的事件名）
const on = (type: string, fn: (e: CustomEvent<any>) => void) => (el: HTMLElement) => el.addEventListener(type, fn as EventListener);

export default function ShotPager() {
  const [page, setPage] = createSignal(1);
  return (
    <div class="sn-stack sn-gap-8">
      <sn-pager total="13" count="128" page={page()} ref={on("sn-change", (e) => setPage(e.detail))}></sn-pager>
      <span class="sn-help">第 {page()} 页</span>
    </div>
  );
}
