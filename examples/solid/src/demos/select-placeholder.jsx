import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import { defineElements } from "satin-ui/elements";

defineElements();

export default function SelectPlaceholder() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <sn-select items='["16:9 · 横屏","9:16 · 竖屏","1:1 · 方形"]' placeholder="选择画面比例" label="画面比例"></sn-select>
    </div>
  );
}
