import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import { createCommandPalette, toast } from "satin-ui/components";
import "./cmdk-0.css";

export default function CmdkDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current, (root) => {
      // 命令面板：⌘K（Windows 上 Ctrl K）打开；输入就筛，↑↓ 选、回车执行、Esc 关；分组、图标、副标题、快捷键
      const cmdk = createCommandPalette([
        { name: "项目", items: [
          { icon: "folder", name: "雨夜车站", sub: "第三集", run: () => toast({ text: '打开"雨夜车站"' }) },
          { icon: "folder", name: "旧城往事", sub: "第一集", run: () => toast({ text: '打开"旧城往事"' }) },
        ] },
        { name: "命令", items: [
          { icon: "plus", name: "新建项目", keys: "⌘N", run: () => toast({ text: "新建项目" }) },
          { icon: "download", name: "导出当前一集", run: () => toast({ text: "开始导出" }) },
        ] },
      ], { placeholder: "搜索项目、命令", onRun: (item) => item.run() });
      root.querySelector("[data-cmdk]")?.addEventListener("click", () => cmdk.open()); // 按钮也能打开
    });
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="row">
        <button class="sn-btn sn-secondary" data-cmdk-open="" data-i="search:before">
          <span class="sn-txt">搜索或执行命令</span>
          <span class="sn-kbd-hint">⌘K</span>
        </button>
        <span class="sn-note">也可以直接按 ⌘K</span>
      </div>
    </div>
  );
}
