import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";

export default function ButtonIcons() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
        <button type="button" class="sn-btn sn-secondary" data-i="arrow-right:after">下一步</button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
        <button type="button" class="sn-btn sn-ghost sn-ibtn sn-selected" data-i="layout-grid" data-tip="网格视图" aria-label="网格视图"></button>
      </div>
    </div>
  );
}
