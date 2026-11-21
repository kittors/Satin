<script>
  import { createCommandPalette, toast } from "satin-ui";

  const GROUPS = [
    { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
    { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
  ];
  let cmdk;
  $effect(() => {
    cmdk = createCommandPalette(GROUPS, {
      onRun: (it) => toast({ text: "执行：" + it.name }),
      // 没有结果时说清楚搜了什么，再给一个出口：带 data-empty-act 的按钮点了（或直接回车）调 onEmpty
      empty: (q) => `<p>没找到“${q}”</p><button type="button" class="sn-btn sn-secondary sn-sm" data-empty-act>在素材库里搜“${q}”</button>`,
      onEmpty: (q) => toast({ text: "去素材库搜：" + q }),
    });
    return () => cmdk.destroy(); // 卸载时撤掉这次加的命令和 ⌘K 监听
  });
</script>

<!-- <sn-enhance> 把按钮里的 data-i 换成图标 -->
<sn-enhance>
  <button type="button" class="sn-btn sn-secondary" onclick={() => cmdk.open()}><span data-i="search:before"></span>搜索或执行命令<span class="sn-key">⌘K</span></button>
</sn-enhance>
