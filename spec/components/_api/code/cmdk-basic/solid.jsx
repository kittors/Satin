import { onSettled } from "solid-js";
import { createCommandPalette, toast } from "satin-ui";

const GROUPS = [
  { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
  { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
];

export default function Commands() {
  // 面板只有一个，渲染在 <body> 末尾；⌘K 随时打开，onRun 是选中的那一条
  let cmdk;
  onSettled(() => {
    cmdk = createCommandPalette(GROUPS, { onRun: (it) => toast({ text: "执行：" + it.name }) });
    return () => cmdk.destroy(); // 卸载时撤掉这次加的命令和 ⌘K 监听
  });
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" onClick={() => cmdk?.open()}><span data-i="search:before"></span>搜索或执行命令<span class="sn-key">⌘K</span></button>
    </sn-enhance>
  );
}
