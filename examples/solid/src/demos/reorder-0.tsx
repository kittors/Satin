import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import { createReorder, toast } from "satin-ui/components";

export default function ReorderDemo0() {
  let root!: HTMLDivElement;
  let off = () => {};
  onSettled(() => {
    if (!root) return;
    const unsetup = setup();
    const done = enhance(root, (root: any) => {
      // 按住 .sn-grip 拖（先动 4px 才算拿起）；其他行让位、落点画线；拿出列表 40px 外松手就取消；
      // 键盘：空格拿起、↑↓ 移动、空格放下、Esc 取消（读屏会播报位置）
      const list = root.querySelector(".sn-drag-list");
      createReorder(list, {
        onReorder: ({ from, to }: any) => toast({ text: `已从第 ${from + 1} 位移到第 ${to + 1} 位` }), // 换成你的保存
      });
    });
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el: HTMLDivElement) => (root = el)}>
      <div class="sn-drag-list">
        <div class="sn-drag-row">
          <button class="sn-grip" aria-label="拖动排序：镜头 07" data-i="grip-vertical"></button>
          <b>镜头 07 · 车站外</b>
        </div>
        <div class="sn-drag-row">
          <button class="sn-grip" aria-label="拖动排序：镜头 08" data-i="grip-vertical"></button>
          <b>镜头 08 · 候车厅</b>
        </div>
      </div>
    </div>
  );
}
