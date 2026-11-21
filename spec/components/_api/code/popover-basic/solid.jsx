// 标记照设计稿写，<sn-enhance> 接上 data-pop 触发按钮：点开、再点或 Esc、点外面关上，焦点回到按钮
export default function SharePopover() {
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-pop="pop-share" aria-haspopup="dialog" aria-expanded="false"><span data-i="share:before"></span>分享</button>
      <div class="sn-pop sn-popover" id="pop-share" role="dialog" aria-label="分享给协作者">
        <h4>分享给协作者</h4>
        <p>拿到链接的人可以查看，不能修改。</p>
        <div class="sn-pop-row"><label class="sn-switch"><input type="checkbox" checked /><span class="sn-track"><span class="sn-knob"></span></span>允许下载原片</label></div>
      </div>
    </sn-enhance>
  );
}
