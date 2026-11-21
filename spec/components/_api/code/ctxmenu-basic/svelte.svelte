<script>
  import { toast } from "satin-ui";
  const DONE = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）

  let menu;
  // 选了一项：菜单上冒泡 menuselect，e.detail.item 是那一行
  $effect(() => {
    const pick = (e) => toast({ text: DONE[e.detail.item.dataset.key] });
    menu.addEventListener("menuselect", pick);
    return () => menu.removeEventListener("menuselect", pick);
  });
</script>

<!-- <sn-enhance> 接上触发器（点开、↓ 键）、键盘导航、子菜单 -->
<sn-enhance>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-fmenu="mn-more" aria-haspopup="menu" aria-expanded="false" data-tip="更多操作" aria-label="更多操作" data-i="ellipsis"></button>
  <div class="sn-menu sn-float" id="mn-more" bind:this={menu} role="menu" tabindex="-1" aria-label="更多操作">
    <div class="sn-item" role="menuitem" data-key="open" data-i="external-link:before">打开</div>
    <div class="sn-item" role="menuitem" data-key="copy" data-i="copy:before">复制一份<span class="sn-key">⌘D</span></div>
    <div class="sn-sep"></div>
    <div class="sn-item sn-danger-item" role="menuitem" data-key="trash" data-i="trash-2:before">移到回收站</div>
  </div>
</sn-enhance>
