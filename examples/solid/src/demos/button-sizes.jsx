import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";

export default function ButtonSizes() {
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
        <button type="button" class="sn-btn sn-primary sn-sm">保存修改</button>
        <button type="button" class="sn-btn sn-primary">保存修改</button>
        <button type="button" class="sn-btn sn-primary sn-lg">保存修改</button>
      </div>
    </div>
  );
}
