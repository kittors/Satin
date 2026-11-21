<script>
  let name = $state("站台 · 远景");
</script>

<!-- <sn-enhance> 接上 data-drawer 触发按钮、Esc、点外面关；抽屉不做确认：边改边反映到背后的页面 -->
<sn-enhance>
  <div class="sn-row">
    <b>{name || "未命名镜头"}</b>
    <button type="button" class="sn-btn sn-secondary sn-sm" data-drawer="drw-live">编辑</button>
  </div>
  <aside class="sn-drawer" id="drw-live" role="dialog" aria-modal="true" aria-labelledby="drw-live-t" tabindex="-1">
    <div class="sn-hd"><h3 id="drw-live-t">编辑镜头</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc" data-i="x"></button></div>
    <div class="sn-bd">
      <div class="sn-field"><label class="sn-lbl" for="drw-live-name">镜头名称</label><input class="sn-input" id="drw-live-name" bind:value={name} /></div>
    </div>
  </aside>
</sn-enhance>
