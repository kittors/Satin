import { openPopover, popoverOf, toast } from "satin-ui";

// 不是删除、但同样不能撤销：danger 关掉，确认按钮用主按钮；<sn-enhance> 把 data-i 换成图标
export default function SubmitReview() {
  let btn, panel;
  // 打开：锚在按钮上，焦点先落在"取消"（data-no）上；Esc、点外面关上
  const ask = () => { const l = popoverOf(panel); l ? l.close(false) : openPopover(panel, btn, { align: "end" }); };
  const yes = () => { popoverOf(panel)?.close(false); toast({ text: "已提交审核" }); };
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-primary" ref={(el) => (btn = el)} onClick={ask} aria-haspopup="dialog" aria-expanded="false">提交审核</button>
      <div class="sn-pop sn-popconfirm" ref={(el) => (panel = el)} role="alertdialog" aria-labelledby="popconfirm-submit-q" aria-describedby="popconfirm-submit-d">
        <div class="sn-q"><span data-i="triangle-alert"></span><div><div id="popconfirm-submit-q">提交审核？</div><div class="sn-d" id="popconfirm-submit-d">提交以后这一集就不能再改了。</div></div></div>
        <div class="sn-acts"><button type="button" class="sn-btn sn-ghost sn-sm" data-no onClick={() => popoverOf(panel)?.close(true)}>取消</button><button type="button" class="sn-btn sn-primary sn-sm" data-yes onClick={yes}>提交</button></div>
      </div>
    </sn-enhance>
  );
}
