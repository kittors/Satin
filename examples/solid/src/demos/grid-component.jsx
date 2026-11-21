import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import { createDataGrid } from "satin-ui/grid";

export default function GridComponent() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root, (root) => {
      createDataGrid(root.querySelector('[data-ex="grid3"]'), { rows: 100000, seed: 11 });
    });
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div data-ex="grid3"></div>
    </div>
  );
}
