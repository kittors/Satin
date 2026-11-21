// 标记照设计稿写，<sn-enhance> 接上 data-drawer 触发按钮、Esc、点外面关；底栏的 data-x 点了也关上
export default function ShotSettings() {
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-drawer="drw-more">镜头设置</button>
      <aside class="sn-drawer" id="drw-more" role="dialog" aria-modal="true" aria-labelledby="drw-more-t" tabindex="-1">
        <div class="sn-hd"><h3 id="drw-more-t">镜头设置</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc" data-i="x"></button></div>
        <div class="sn-bd">
          <div class="sn-field" /><label class="sn-lbl" for="drw-more-note" />备注</label><textarea class="sn-input" id="drw-more-note" rows="3" />雨要下得再大一点</textarea></div>
        </div>
        <div class="sn-ft"><button type="button" class="sn-btn sn-danger-soft" data-x>删除镜头</button></div>
      </aside>
    </sn-enhance>
  );
}
