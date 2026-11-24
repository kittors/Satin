import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import { openPopover, toast } from "satin-ui/components";

export default function PopconfirmDemo0() {
  let root!: HTMLDivElement;
  let off = () => {};
  onSettled(() => {
    if (!root) return;
    const unsetup = setup();
    const done = enhance(root, (root: any) => {
      // 气泡确认就是一个弹出面板：打开时焦点先落在"取消"上（防止回车误删）
      const btn = root.querySelector("#purge"), pc = root.querySelector("#pc");
      btn.addEventListener("click", () => {
        const confirm = openPopover(pc, btn, { align: "end" });
        pc.querySelector("[data-no]").focus();
        pc.querySelector("[data-no]").onclick = () => confirm.close(true);
        pc.querySelector("[data-yes]").onclick = () => { confirm.close(); toast({ text: "镜头已永久删除" }); }; // 换成你的删除
      });
    });
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el: HTMLDivElement) => (root = el)}>
      <button class="sn-btn sn-danger-soft sn-sm" id="purge">永久删除</button>
      <div class="sn-pop sn-popconfirm" id="pc" role="alertdialog" aria-labelledby="pc-q">
        <div class="sn-q">
          <span data-i="triangle-alert"></span>
          <div>
            <div id="pc-q">永久删除这个镜头？</div>
            <div class="sn-d">删除后无法恢复。</div>
          </div>
        </div>
        <div class="sn-acts">
          <button class="sn-btn sn-ghost sn-sm" data-no="">取消</button>
          <button class="sn-btn sn-danger sn-sm" data-yes="">永久删除</button>
        </div>
      </div>
    </div>
  );
}
