import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import "./space-1.css";

export default function SpaceDemo1() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div class="row" style="gap:32px">
        <div class="nest" style="--R:16px;--sn-p:8px">
          <div></div>
          <span class="sn-cap">外 16，内边距 8 → 内 8</span>
        </div>
        <div class="nest" style="--R:12px;--sn-p:4px">
          <div></div>
          <span class="sn-cap">外 12，内边距 4 → 内 8（菜单与菜单项）</span>
        </div>
        <div class="nest bad-nest" style="--R:16px;--sn-p:8px">
          <div></div>
          <span class="sn-cap sn-c-danger">错误：内外同为 16，四周间距不均</span>
        </div>
      </div>
    </div>
  );
}
