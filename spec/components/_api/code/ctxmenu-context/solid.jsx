import { toast } from "satin-ui";

// 名字不是驼峰的事件用 ref 挂
const on = (type, fn) => (el) => el.addEventListener(type, fn);

// 标记照设计稿写，<sn-enhance> 接上触发器、键盘导航、子菜单；选了一项：菜单上冒泡 menuselect
export default function ShotCard() {
  return (
    <sn-enhance>
      <div class="sn-ctx-zone" data-ctx="mn-ctx" tabindex="0" aria-label="镜头卡片，按 Shift+F10 打开菜单">在这里点右键</div>
      <div class="sn-menu sn-float" id="mn-ctx" ref={on("menuselect", (e) => toast({ text: "选了：" + e.detail.item.textContent }))} role="menu" tabindex="-1" aria-label="镜头">
        <div class="sn-item" role="menuitem" data-key="open" data-i="external-link:before">打开</div>
        <div class="sn-item" role="menuitem" data-key="copy" data-i="copy:before">复制一份<span class="sn-key">⌘D</span></div>
        <div class="sn-sep"></div>
        <div class="sn-item sn-danger-item" role="menuitem" data-key="trash" data-i="trash-2:before">移到回收站</div>
      </div>
    </sn-enhance>
  );
}
