import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";

export default function FlowstressDemo0() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>

    </div>
  );
}
