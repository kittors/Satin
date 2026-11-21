import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";

export default function ButtonVariants() {
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
        <button type="button" class="sn-btn sn-primary">新建项目</button>
        <button type="button" class="sn-btn sn-secondary">导入原文</button>
        <button type="button" class="sn-btn sn-tertiary">预览</button>
        <button type="button" class="sn-btn sn-ghost">跳过</button>
        <button type="button" class="sn-btn sn-danger">删除项目</button>
        <button type="button" class="sn-btn sn-danger-soft">移出团队</button>
      </div>
    </div>
  );
}
