import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import "./elevation-0.css";

export default function ElevationDemo0() {
  let root!: HTMLDivElement;
  let off = () => {};
  onSettled(() => {
    if (!root) return;
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el: HTMLDivElement) => (root = el)}>
      <div class="elev e0">
        <b>卡片</b>
        <span class="sn-t-caption sn-c-tertiary">raised + 1px 描边</span>
      </div>
      <div class="elev e1">
        <b>浮层</b>
        <span class="sn-t-caption sn-c-tertiary">菜单、Popover、通知</span>
      </div>
      <div class="elev e2">
        <b>对话框</b>
        <span class="sn-t-caption sn-c-tertiary">对话框、抽屉</span>
      </div>
    </div>
  );
}
