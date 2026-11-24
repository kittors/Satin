import { openPopover, popoverOf, toast } from "satin-ui";

// 只给单条、属于自己、不能撤销的操作；确认按钮写清楚做什么；<sn-enhance> 把 data-i 换成图标
export default function PurgeShot() {
  let btn!: HTMLButtonElement, panel!: HTMLDivElement;
  // 打开：锚在按钮上，焦点先落在"取消"（data-no）上；Esc、点外面关上
  const ask = () => { const l = popoverOf(panel); l ? l.close(false) : openPopover(panel, btn, { align: "end" }); };
  const yes = () => { popoverOf(panel)?.close(false); toast({ text: "已永久删除镜头" }); };
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-danger-soft" ref={(el) => (btn = el)} onClick={ask} aria-haspopup="dialog" aria-expanded="false">永久删除</button>
      <div class="sn-pop sn-popconfirm" ref={(el) => (panel = el)} role="alertdialog" aria-labelledby="popconfirm-basic-q" aria-describedby="popconfirm-basic-d">
        <div class="sn-q"><span data-i="triangle-alert"></span><div><div id="popconfirm-basic-q">永久删除这个镜头？</div><div class="sn-d" id="popconfirm-basic-d">删除后无法恢复。</div></div></div>
        <div class="sn-acts"><button type="button" class="sn-btn sn-ghost sn-sm" data-no onClick={() => popoverOf(panel)?.close(true)}>取消</button><button type="button" class="sn-btn sn-danger sn-sm" data-yes onClick={yes}>永久删除</button></div>
      </div>
    </sn-enhance>
  );
}
