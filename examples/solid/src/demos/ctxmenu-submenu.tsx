import { toast } from "satin-ui";

const DONE: Record<string, string> = { ep1: "已移到第一集", ep2: "已移到第二集", ep3: "已移到第三集", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

// 名字不是驼峰的事件用 ref 挂
const on = (type: string, fn: (e: CustomEvent<any>) => void) => (el: HTMLElement) => el.addEventListener(type, fn as EventListener);

// 标记照设计稿写，<sn-enhance> 接上触发器、键盘导航、子菜单；选了一项：菜单上冒泡 menuselect
export default function OrganizeMenu() {
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-fmenu="mn-move" aria-haspopup="menu" aria-expanded="false" data-i="chevron-down:caret">整理</button>
      <div class="sn-menu sn-float" id="mn-move" ref={on("menuselect", (e) => toast({ text: DONE[e.detail.item.dataset.key] }))} role="menu" tabindex="-1" aria-label="整理">
        <div class="sn-item" role="menuitem" data-key="移动到" data-sub="mn-move-1" aria-haspopup="menu" data-i="folder:before">移动到<span data-i="chevron-right:more"></span></div>
        <div class="sn-sep"></div>
        <div class="sn-item sn-danger-item" role="menuitem" data-key="trash" data-i="trash-2:before">移到回收站</div>
      </div>
      <div class="sn-menu sn-float sn-sub" id="mn-move-1" role="menu" tabindex="-1" aria-label="移动到">
        <div class="sn-item sn-back" role="menuitem"><span data-i="chevron-left"></span><span></span></div>
        <div class="sn-item" role="menuitem" data-key="ep1">第一集</div>
        <div class="sn-item" role="menuitem" data-key="ep2">第二集</div>
        <div class="sn-item" role="menuitem" data-key="ep3">第三集</div>
      </div>
    </sn-enhance>
  );
}
