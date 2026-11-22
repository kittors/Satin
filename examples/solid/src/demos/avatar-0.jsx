import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import { defineElements } from "satin-ui/elements";
import "./avatar-0.css";

defineElements();

export default function AvatarDemo0() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div class="row" style="gap:14px">
        <sn-avatar seed="u4" name="周屿" size="16"></sn-avatar>
        <sn-avatar seed="u4" name="周屿" size="20"></sn-avatar>
        <sn-avatar seed="u4" name="周屿" size="24"></sn-avatar>
        <sn-avatar seed="u4" name="周屿"></sn-avatar>
        <sn-avatar seed="u4" name="周屿" size="40"></sn-avatar>
        <sn-avatar seed="u4" name="周屿" size="64"></sn-avatar>
      </div>
    </div>
  );
}
