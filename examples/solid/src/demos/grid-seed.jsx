import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import { createDataGrid } from "satin-ui/grid";

export default function GridSeed() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root, (root) => {
      createDataGrid(root.querySelector('[data-ex="grid2"]'), { rows: 2000, seed: 7, label: "镜头清单，2000 行" });
    });
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div data-ex="grid2"></div>
    </div>
  );
}
