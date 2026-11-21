import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";

export default function ButtonMobile() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div class="sn-bottom-bar">
        <span class="sn-grow sn-num">合计 ¥ 1,280</span>
        <button type="button" class="sn-btn sn-primary sn-lg">提交订单</button>
      </div>
    </div>
  );
}
