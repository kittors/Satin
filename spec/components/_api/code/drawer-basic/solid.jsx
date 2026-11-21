// 标记照设计稿写，<sn-enhance> 接上 data-drawer 触发按钮、Esc、点外面关、关闭按钮（data-x）
export default function EditShot() {
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-drawer="drw-shot">编辑镜头</button>
      <aside class="sn-drawer" id="drw-shot" role="dialog" aria-modal="true" aria-labelledby="drw-shot-t" tabindex="-1">
        <div class="sn-hd"><h3 id="drw-shot-t">编辑镜头</h3><button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-tip="关闭" data-kbd="Esc" data-i="x"></button></div>
        <div class="sn-bd">
          <div class="sn-field"><label class="sn-lbl" for="drw-shot-name">镜头名称</label><input class="sn-input" id="drw-shot-name" value="站台 · 远景" /></div>
        </div>
      </aside>
    </sn-enhance>
  );
}
