import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import { defineElements } from "satin-ui/elements";

defineElements();

export default function SelectOptions() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <sn-select items='[{"value":"draft","label":"草稿"},{"value":"review","label":"待审核"},{"value":"done","label":"已完成","disabled":true}]' value="draft" label="状态"></sn-select>
    </div>
  );
}
