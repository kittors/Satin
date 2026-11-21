import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";

export default function ButtonBasic() {
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
        <button type="button" class="sn-btn sn-secondary">取消</button>
        <button type="button" class="sn-btn sn-primary">保存修改</button>
      </div>
    </div>
  );
}
