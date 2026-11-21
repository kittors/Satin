<script>
  import { toast } from "satin-ui";

  let menu;
  // 选了一项：菜单上冒泡 menuselect，e.detail.item 是那一行
  $effect(() => {
    const pick = (e) => toast({ text: "选了：" + e.detail.item.textContent });
    menu.addEventListener("menuselect", pick);
    return () => menu.removeEventListener("menuselect", pick);
  });
</script>

<!-- <sn-enhance> 接上触发器（右键、长按、Shift+F10）、键盘导航、子菜单 -->
<sn-enhance>
  <div class="sn-ctx-zone" data-ctx="mn-ctx" tabindex="0" aria-label="镜头卡片，按 Shift+F10 打开菜单">在这里点右键</div>
  <div class="sn-menu sn-float" id="mn-ctx" bind:this={menu} role="menu" tabindex="-1" aria-label="镜头">
    <div class="sn-item" role="menuitem" data-key="open" data-i="external-link:before">打开</div>
    <div class="sn-item" role="menuitem" data-key="copy" data-i="copy:before">复制一份<span class="sn-key">⌘D</span></div>
    <div class="sn-sep"></div>
    <div class="sn-item sn-danger-item" role="menuitem" data-key="trash" data-i="trash-2:before">移到回收站</div>
  </div>
</sn-enhance>
